import * as admin from "firebase-admin";
import { orderBy, query, where, limit, collection } from "firebase/firestore";

export default async function GET(req, res) {
    if (admin.apps.length === 0) {
        admin.initializeApp({
          credential: admin.credential.cert(JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_SERVICE_ACCOUNT_KEY))})
      }
      try {
        const allUsers = await admin.firestore().collection("profile")
    .where("balance", ">", 0)
    .orderBy("balance", "desc")
    .get();

    const batch = admin.firestore().batch();
    allUsers.docs.forEach((doc, index) => {
    batch.update(doc.ref, { rank: index + 1 });
    });

    await batch.commit();

    // Also store top 100 in one doc
    const top100 = allUsers.docs.slice(0, 100).map((doc, i) => ({
    userName: doc.data().userName || "Anonymous",
    id: doc.id,
    balance: doc.data().balance || 0,
    bestPick: doc.data().bestPick || null,
    premium: doc.data().premium || false,
    rank: i + 1,
    }));

    await admin.firestore().collection("leaderboard").doc("top_100").set({ data: top100 });
    await admin.firestore().collection("leaderboard").doc("meta").set({ total: allUsers.size });
    res.status(200).json({ success: true, data: "YES!" });
      }catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, error: error.message });
    }
    
}