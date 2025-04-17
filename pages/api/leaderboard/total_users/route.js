import * as admin from "firebase-admin";


export default async function GET(req, res) {
    if (admin.apps.length === 0) {
        admin.initializeApp({
          credential: admin.credential.cert(JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_SERVICE_ACCOUNT_KEY))})
      }
    try {
        const docRef = admin.firestore().collection("leaderboard").doc("meta")
        var docRefData = (await docRef.get()).data()
        res.json({ success: true, total: docRefData.total });
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, error: error.message });
    }
}