import * as admin from "firebase-admin";
import { orderBy, query, where, limit, collection } from "firebase/firestore";
import firebaseApp from "../../../firebase/clientApp";


export default async function GET(req, res) {
    if (admin.apps.length === 0) {
        admin.initializeApp({
          credential: admin.credential.cert(JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_SERVICE_ACCOUNT_KEY))})
      }
    try {
        const docRef = admin.firestore().collection("leaderboard").doc("top_100")
        const leaderboardList = []
        var docRefData = (await docRef.get()).data()
        const users = docRefData.data
        for (let user of users) {
            if (!user.showBestPick) {
                user.bestPick = {profit: 0}
            }
                leaderboardList.push(user)
            }
        res.json({ success: true, data: leaderboardList });
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, error: error.message });
    }
}