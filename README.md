# IoT Smart Safe Dashboard

This is a web-based dashboard for the IoT Smart Safe project, created for Doikham Strawberry Flavor. It provides real-time monitoring of the safe's sensors, password-protected lock control, and a log of critical security events.

The dashboard is built with Next.js and Material-UI, and it fetches data from a Supabase backend.

## Features

- **Real-time Sensor Monitoring**: Displays the latest data from various sensors, including Hit, PIR, LDR, Reed switch, and Temperature.
- **Auto-Refresh**: The dashboard automatically fetches the latest sensor data every 5 seconds.
- **MPU6050 Status**: A clear visual indicator shows whether the safe is in a "Safe" or "Unsafe" state based on accelerometer data.
- **Critical Alerts**: The system raises alerts for critical events, such as a hit being detected, the LDR sensor exceeding a certain threshold, or unexpected movement.
- **Warning Log**: A persistent log records all critical alerts with a timestamp and a description of the event.
- **Password-Protected Lock Control**: The dashboard provides Lock/Unlock buttons that are only enabled after entering the correct password (`iloveiot`). The lock/unlock actions are sent to a configurable API endpoint.

## Technical Overview

- **Framework**: [Next.js](https://nextjs.org/)
- **UI Library**: [Material-UI](https://mui.com/)
- **Data Source**: [Supabase](https://supabase.io/)
- **Deployment**: Ready for deployment on [Vercel](https://vercel.com/).

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v16 or later)
- npm or yarn

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-repo-url/smart-safe-dashboard.git
    cd smart-safe-dashboard
    ```

2.  **Install NPM packages:**
    ```sh
    npm install
    ```

3.  **Set up environment variables:**

    For production and security, it's highly recommended to use environment variables. Create a `.env.local` file in the root of your project and add the following variables. You can use `.env.local.example` as a template.

    **Supabase Credentials:**
    ```env
    NEXT_PUBLIC_SUPABASE_URL=https://rxcpcrvvatwwoeeehvqp.supabase.co
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

    **Pi Servo Credentials:**
    These variables are used to connect to the API that controls the physical lock.
    ```env
    PI_SERVO_URL=https://your-ngrok-url.ngrok-free.app/
    PI_SERVO_SECRET=your_secret_for_signing_requests
    ```
    **Note:** The `PI_SERVO_URL` is likely from a service like ngrok and may be temporary. You will need to update it if the URL changes.


### Running the Application

To run the application in development mode, use the following command:

```sh
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

This application is optimized for deployment on [Vercel](https://vercel.com/), the platform from the creators of Next.js.

To deploy, simply push your code to a Git repository (e.g., GitHub, GitLab) and connect your repository to Vercel. Vercel will automatically detect that you are using Next.js and configure the build settings for you.

Remember to set up all the environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `PI_SERVO_URL`, `PI_SERVO_SECRET`) in the Vercel project settings.
