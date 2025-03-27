import React from 'react'

const PrivacyPolicy = () => {
  return (
    <div>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>YouTube Collect - Privacy Policy</title>
</head>
<body>
  <h1>YouTube Collect – Privacy Policy</h1>
  <p><strong>Last Updated:</strong> March 26, 2025</p>

  <h2>1. Information We Collect</h2>
  <p>
    YouTube Collect may collect the following types of data to provide core functionality:
    <ul>
      <li>Google account ID token (used for user login and leaderboard tracking)</li>
      <li>User nickname or display name</li>
      <li>YouCoin balance, trade history, and in-game stats</li>
      <li>Local storage usage (for extension settings and session data)</li>
    </ul>
    We do <strong>not</strong> collect any personally identifiable information (PII) such as email, real name, or YouTube credentials unless explicitly provided during sign-in.
  </p>

  <h2>2. How We Use Your Data</h2>
  <p>
    We collect data strictly for these purposes:
    <ul>
      <li>To authenticate users and personalize their experience</li>
      <li>To track in-game performance (e.g. leaderboard position, YouCoin balance)</li>
      <li>To enhance gameplay features (e.g. restore your session, sync profile across devices)</li>
    </ul>
    We do <strong>not</strong> use your data for advertising or profiling.
  </p>

  <h2>3. Data Sharing</h2>
  <p>
    We <strong>do not share, sell, or disclose</strong> your data with third parties.
    The only external service that may process your login token is <strong>Firebase Authentication (by Google)</strong>, which is used solely to verify your identity.
  </p>

  <h2>4. Cookies and Storage</h2>
  <p>
    We use local storage and cookies to:
    <ul>
      <li>Keep users logged in</li>
      <li>Store in-game preferences</li>
      <li>Persist trading data across sessions</li>
    </ul>
  </p>

  <h2>5. Security</h2>
  <p>
    We take appropriate steps to protect your data using secure protocols (e.g., HTTPS, token-based authentication, encrypted Firebase storage).
    No sensitive data is stored on your device or shared servers beyond what is required for gameplay.
  </p>

  <h2>6. Your Rights</h2>
  <p>
    You can request to delete your account and data at any time by contacting us at:<br />
    📧 <a href="mailto:derrick.ratnah@gmail.com">derrick.ratnah@gmail.com</a>
  </p>

  <h2>7. Contact Us</h2>
  <p>
    If you have any questions or concerns about this Privacy Policy, please contact us at:<br />
    📧 <a href="mailto:derrick.ratnah@gmail.com">derrick.ratnah@gmail.com</a>
  </p>

  <footer>
    &copy; 2025 YouTube Collect. All rights reserved.
  </footer>
</body>
<style jsx global>{`
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
            background: #f9f9f9;
            color: #333;
          }
          h1, h2 {
            color: #111;
          }
          p {
            line-height: 1.6;
          }
          footer {
            margin-top: 4rem;
            font-size: 0.9rem;
            color: #666;
          }
      `}</style>

    </div>
    
  )
}

export default PrivacyPolicy