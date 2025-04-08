import * as admin from "firebase-admin";
import { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from "next/server";


export default async  function POST(req, res) {
    // const { userId } = req.params;
    const { balance, userId, investments, userName } = req.body;

    try {
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
            rank: null
        }, {merge: true});
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}