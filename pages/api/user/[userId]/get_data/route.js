import * as admin from "firebase-admin";
import { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from "next/server";


export default async function GET(req, res) {
    // const { userId } = req.params;
    const userId = req.query.userId;
    try {
        const docRef = admin.firestore().collection("profile").doc(userId)
        const profileData = await docRef.get()
        const data = profileData.data()
        if (data.investments && data.investments.length > 1) {
            data.investments.reverse()
        }
        const diffTime = Math.abs(new Date(data.lastRefreshed) - (Date.now()));
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 
        if (diffDays != 0) {
            docRef.update({lastRefreshed: Date(Date.now()),
            daily_trades_left: profileData.premium ? 12 : 5})
        }
        res.json({ success: true, data });
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, error: error.message });
    }
}