import * as admin from "firebase-admin";
import { getApps, initializeApp } from "firebase-admin";


export default async  function POST(req, res) {
  const { token } = req.body;
  if (admin.apps.length === 0) {
  const firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_SERVICE_ACCOUNT_KEY))})
}
  try {
      // Verify token using Firebase Authentication
      // const decoded = await admin.auth().verifyIdToken(token);
      const decoded = await admin.auth().verifySessionCookie(token, true);
      const userId = decoded.uid;
      const userName = decoded.name;

      // Send back the verified user ID
      res.json({ success: true, data: {userId, userName} });
  } catch (error) {
    console.error(error.message)
      res.status(401).json({ success: false, error: "Invalid token" });
  }
  }


