import * as admin from "firebase-admin";
import { orderBy, query, where, limit, collection } from "firebase/firestore";
import firebaseApp from "../../../firebase/clientApp";


export default async function GET(req, res) {
    if (admin.apps.length === 0) {
        admin.initializeApp({
          credential: admin.credential.cert(JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_SERVICE_ACCOUNT_KEY))})
      }
    try {
        const docRef = admin.firestore().collection("profile")
        // const data = query(docRef, where("balance", ">", 100), orderBy("balance"), limit(3))
        const data = (docRef.where("balance", ">=", 100).orderBy("balance").limit(50))
        const leaderboardList = []
        const leaderboard = await data.get().then(querySnapshot => {
            let docs = querySnapshot.docs;
            for (let doc of docs) {
              const profile = doc.data()
              profile.id = doc.id
                leaderboardList.push(profile)
            }
          });
        leaderboardList.reverse()
        res.json({ success: true, data: leaderboardList });
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, error: error.message });
    }
}