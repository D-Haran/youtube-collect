import * as admin from "firebase-admin";
import { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from "next/server";


export default async  function POST(req, res) {
    // const { userId } = req.params;
    const { balance, userId, investments, userName } = req.body;
    if (admin.apps.length === 0) {
        console.log("FIREBASE REFRESHING")
        admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_SERVICE_ACCOUNT_KEY))})
    }
    try {
        const today = new Date();
        await admin.firestore().collection("profile").doc(userId).set({ 
            balance: balance, 
            investments: [], 
            daily_trades_left: 5, 
            lastRefreshed: new Date(Date.now()),
            userName: userName,
            bestPick: {profit: 0},
            premium: false,
            investmentHistory: [],
            sell_cooldown: new Date(Date.now()),
            rank: null,
            showBestPick: true,
            // trial: true,
            // trial_expires: new Date(today.setDate(today.getDate() + 3)),
        }, {merge: true});

        // await admin.firestore().collection("profile").doc(userId).collection("payments").doc("trial").set({
        //     status: "succeeded",
        //     trail_started: new Date(Date.now()),
        //     trial_expires: new Date(today)
        // })

        res.json({ success: true });
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, error: error.message });
    }
}