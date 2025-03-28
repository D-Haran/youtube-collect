import * as admin from "firebase-admin";
import { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from "next/server";


export default async function GET(req, res) {
    
    // const { userId } = req.params;
    const userId = req.query.userId;
    try {
        if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_SERVICE_ACCOUNT_KEY))})
  }
        const docRef = admin.firestore().collection("profile").doc(userId)
        const profileData = await docRef.get()
        const data = profileData.data()
        if (data.investments && data.investments.length > 1) {
            data.investments.reverse()
        }
        function getUTCDateString(date) {
            const d = new Date(date);
            return d.toISOString().split("T")[0];
          }
        const now = new Date(Date.now());
        const lastDate = getUTCDateString(new Date(data.lastRefreshed));
        const currentDate = getUTCDateString(now);
        if (lastDate !== currentDate) {
            docRef.update({lastRefreshed: new Date().toISOString(),
            daily_trades_left: profileData.premium ? 12 : 5})
        }
        res.json({ success: true, data });
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, error: error.message });
    }
}