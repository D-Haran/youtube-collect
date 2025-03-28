import * as admin from "firebase-admin";

export default async function handler(req, res) {
  const { idToken } = req.body;
  const expiresIn = 60 * 60 * 24 * 14 * 1000; // 14 days

  try {
    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });

    // Set cookie
    res.setHeader("Set-Cookie", `session=${sessionCookie}; Path=/; HttpOnly; Secure; Max-Age=${expiresIn / 1000}`);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(401).json({ error: "Failed to create session cookie" });
  }
}