import * as admin from "firebase-admin";
import { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';


export default async  function POST(req, res) {
    // const { userId } = req.params;
    const { balance, userId, investments, userName, referralCode } = req.body;
    if (admin.apps.length === 0) {
        console.log("FIREBASE REFRESHING")
        admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_SERVICE_ACCOUNT_KEY))})
    }
    try {
        const today = new Date();
        const leaderboardId = uuidv4();
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
            referrals: [],
            showBestPick: true,
            leaderboardId: leaderboardId,
            // trial: true,
            // trial_expires: new Date(today.setDate(today.getDate() + 3)),
        }, {merge: true}).then((data) => {
            if (referralCode != "") {
                const myAsync = async () => {
                    if (referralCode && referralCode !== leaderboardId) {
                    const query = await admin.firestore()
                        .collection("profile")
                        .where("leaderboardId", "==", referralCode)
                        .limit(1)
                        .get();
            
                    if (!query.empty) {
                        const referrerDoc = query.docs[0];
                        const referrerRef = referrerDoc.ref;
                        if (referrerDoc.data().referrals.length) {
                            var currentCount = referrerDoc.data().referrals;
                        } else {
                            var currentCount = [];
                        }
                        
                        currentCount.push(leaderboardId)
            
                        await referrerRef.set({
                            referrals: currentCount
                        }, { merge: true });
                    }
                    }
                }
                myAsync()
            }
        }
        )

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