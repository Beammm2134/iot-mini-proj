import crypto from 'crypto-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { PI_SERVO_URL, PI_SERVO_SECRET } = process.env;

  if (!PI_SERVO_URL || !PI_SERVO_SECRET) {
    return res.status(500).json({ message: 'Server configuration error: Missing servo URL or secret.' });
  }

  try {
    const body = JSON.stringify({ action: "off" });
    const signature = crypto.HmacSHA256(body, PI_SERVO_SECRET).toString(crypto.enc.Hex);

    const response = await fetch(`${PI_SERVO_URL}lock`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Signature': signature,
      },
      body: body,
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Request to servo failed with status ${response.status}: ${errorText}`);
    }

    const responseData = await response.json();
    res.status(200).json(responseData);

  } catch (error) {
    console.error('Error in /api/lock:', error);
    res.status(500).json({ message: error.message || 'An internal server error occurred.' });
  }
}
