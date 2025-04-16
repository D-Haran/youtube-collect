import * as admin from "firebase-admin";
import { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from "next/server";


export default async  function POST(req, res) {
    // const { userId } = req.params;
    const { userId } = req.body;
    if (admin.apps.length === 0) {
        console.log("FIREBASE REFRESHING")
        admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_SERVICE_ACCOUNT_KEY))})
    }
    try {
        await admin.firestore().collection("profile").doc(userId).delete();
        res.json({ success: true });
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, error: error.message });
    }
}