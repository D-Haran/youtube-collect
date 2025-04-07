import * as admin from "firebase-admin";
import { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from "next/server";


export default async function GET(req, res) {
    
    // const { userId } = req.params;
    const userId = await req.query.userId;
    try {
        if (admin.apps.length === 0) {
            console.log("FIREBASE REFRESHING")
            admin.initializeApp({
            credential: admin.credential.cert(JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_SERVICE_ACCOUNT_KEY))})
        }
        const docRef = admin.firestore().collection("profile").doc(userId)
        const profileData = await docRef.get()
        if (profileData.exists) {
            const data = profileData.data()
        if (data.investments && data.investments.length > 1) {
            data.investments.reverse()
        }
        function getUTCDateString(date) {
            const d = new Date(date);
            return d.toISOString().split("T")[0];
          }
        const now = new Date(Date.now());
        const lastDate = getUTCDateString(data?.lastRefreshed.seconds ? new Date(data?.lastRefreshed.seconds*1000) : new Date(data?.lastRefreshed));
        const currentDate = getUTCDateString(now);

        if (lastDate !== currentDate) {
            await docRef.update({lastRefreshed: new Date().toISOString(),
            daily_trades_left: data.premium ? 8 : 5})
            data.daily_trades_left = data.premium ? 8 : 5
        }
        res.json({ success: true, data });
        } else {
            res.status(450).json({ success: false, error: "User Does Not Exist!" });
        }
        
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, error: error.message });
    }
}