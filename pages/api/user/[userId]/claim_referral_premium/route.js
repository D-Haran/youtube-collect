import * as admin from "firebase-admin";
import { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';


export default async  function POST(req, res) {
    // const { userId } = req.params;
    const { userId } = req.body;
    if (admin.apps.length === 0) {
        console.log("FIREBASE REFRESHING")
        admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_SERVICE_ACCOUNT_KEY))})
    }
    try {
        const docRef = admin.firestore().collection("profile").doc(userId)
        const profileData = await docRef.get()
        if (profileData.exists) {
            const data = profileData.data()
            if (data.referrals && data.referrals.length >= 5 || data.referrals >= 5) {
                const now = new Date();
                const oneMonthFromNow = new Date(now);
                const formattedDate = now.toISOString().split('T')[0]; // "2025-04-18"
                oneMonthFromNow.setMonth(now.getMonth() + 1);
                await admin.firestore().collection("profile").doc(userId).collection("payments").doc(`monthly_referral_premium_${formattedDate}`).set({
                    status: "succeeded",
                    trail_started: now,
                    trial_expires: oneMonthFromNow
                }, {merge: true})
                await admin.firestore().collection("profile").doc(userId).update({
                    premium: true,
                    referral_trial_expires: oneMonthFromNow,
                    referrals: []
                }, {merge: true})
            }
            else {
                res.status(308).json({ success: false, error: "Not Enough Referrals!" });
            }
        
        } else {
            res.status(450).json({ success: false, error: "User Does Not Exist!" });
        }

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