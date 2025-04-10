import * as admin from "firebase-admin";

export default async function handler(req, res) {
  const { idToken } = req.body;
  const expiresIn = 60 * 60 * 24 * 14 * 1000; // 14 days

  try {
    if (admin.apps.length === 0) {
      const firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_SERVICE_ACCOUNT_KEY))})
    }
    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });

    res.status(200).json({ success: true, sessionCookie });
  } catch (error) {
    console.log(error)
    res.status(401).json({ error: "Failed to create session cookie" });
  }
}