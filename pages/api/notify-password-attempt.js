import FormData from "form-data";
import Mailgun from "mailgun.js";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { MAILGUN_API_KEY, MAILGUN_DOMAIN } = process.env;
  const { success, passwordAttempt } = req.body;

  if (!MAILGUN_API_KEY || !MAILGUN_DOMAIN) {
    console.error('Mailgun API Key or Domain is not configured.');
    // We don't want to block the user's login flow, so we'll just return success.
    // In a real production app, this would be logged to a monitoring service.
    return res.status(200).json({ message: 'Notification was not sent due to server misconfiguration.' });
  }

  const mailgun = new Mailgun(FormData);
  const mg = mailgun.client({
    username: "api",
    key: MAILGUN_API_KEY,
  });

  const recipient = 'beamatipat@gmail.com';
  const fromAddress = `Mailgun Sandbox <postmaster@${MAILGUN_DOMAIN}>`;

  let subject = '';
  let text = '';

  if (success) {
    subject = 'Smart Safe: Correct Password Entered';
    text = `A correct password was successfully entered to access the Smart Safe lock controls at ${new Date().toLocaleString()}.`;
  } else {
    subject = 'Smart Safe: WARNING - Incorrect Password Attempt';
    text = `An incorrect password was attempted on the Smart Safe dashboard at ${new Date().toLocaleString()}.\n\nAttempted Password: "${passwordAttempt}"`;
  }

  try {
    await mg.messages.create(MAILGUN_DOMAIN, {
      from: fromAddress,
      to: [recipient],
      subject: subject,
      text: text,
    });
    res.status(200).json({ message: 'Notification sent successfully.' });
  } catch (error) {
    console.error('Error sending email with Mailgun:', error);
    res.status(500).json({ message: 'Failed to send notification.' });
  }
}
