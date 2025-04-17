import * as admin from "firebase-admin";


export default async function GET(req, res) {
    const userId = req.query.userId
    if (admin.apps.length === 0) {
        admin.initializeApp({
          credential: admin.credential.cert(JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_SERVICE_ACCOUNT_KEY))})
      }
    try {
        console.log(userId)
        const historyInvestments = await admin
        .firestore()
        .collection("profile")
        .doc(`${userId}`)
        .collection("investmentHistory")
        .orderBy("dateOfActivity", "desc")
        .limit(30)
        .get();

        const historyInvestmentsData = historyInvestments.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
        res.json({ success: true, data: historyInvestmentsData });
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, error: error.message });
    }
}