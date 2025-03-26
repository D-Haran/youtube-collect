import * as admin from "firebase-admin";
import { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from "next/server";


export default async  function POST(req, res) {
    // const { userId } = req.params;
    const { investment_id, userId, profited } = req.body;
    try {
        const docRef = await (await admin.firestore().collection("profile").doc(userId).get()).data()
        const bestPick = docRef.bestPick
        const all_investments = docRef.investments
        const new_investments = []
        var sellingInvestment = {}
        for (let i = 0; i < all_investments.length; i++) {
            const inv = all_investments[i]
            if (inv.id != investment_id) {
                new_investments.push(inv)
            } else {
                sellingInvestment = inv
                sellingInvestment.profit = profited
            }
        }
        const newBalance = docRef.balance + profited
        console.log(newBalance)
        if (profited > bestPick.profit) {
            await admin.firestore().collection("profile").doc(userId).update({ 
                bestPick: sellingInvestment
             }, {merge: true});
        }
        var historyInvestment = sellingInvestment
        historyInvestment.investmentType = "SELL"
        await admin.firestore().collection("profile").doc(userId).set({ 
            
            balance: Number(newBalance),
            investments: new_investments,
            investmentHistory: admin.firestore.FieldValue?.arrayUnion(historyInvestment)
         }, {merge: true});
        res.json({ success: true });
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, error: error.message });
    }
}