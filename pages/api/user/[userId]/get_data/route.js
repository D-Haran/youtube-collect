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
        res.json({ success: true, data });
        } else {
            res.status(450).json({ success: false, error: "User Does Not Exist!" });
        }
        
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, error: error.message });
    }
}