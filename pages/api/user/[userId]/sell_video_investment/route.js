import * as admin from "firebase-admin";
import { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from "next/server";


export default async function POST(req, res) {
    // const { userId } = req.params;
    const { investment_id, userId, profited, viewsAtSell } = req.body;
    function getSellCooldownHours(roiMult, percent_of_balance) {
        if (roiMult <= 1.5 || percent_of_balance <= 0.1) return 0;
        const adjustedMult = roiMult * percent_of_balance; // scale ROI by significance
        const maxCooldown = 12;
        const scaled = Math.log2(adjustedMult - 0.5);
        const cooldown = Math.min(maxCooldown, scaled * 2);
        return Math.ceil(cooldown);
      }

    try {
        const docRef = await (await admin.firestore().collection("profile").doc(userId).get()).data()
        const bestPick = docRef.bestPick
        const cooldown_from_firestore = docRef.sell_cooldown || null
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
        var historyInvestment = sellingInvestment
        historyInvestment.investmentType = "SELL"
        historyInvestment.viewsAtSell = viewsAtSell
        historyInvestment.dateOfActivity = new Date(Date.now())
        const roiMult = 1 + (profited / sellingInvestment.investment_total)
        var on_cooldown = cooldown_from_firestore ? (new Date(cooldown_from_firestore.seconds*1000)) > Date.now() : false
        if (!on_cooldown) {
            percent_of_balance = (sellingInvestment.percent_of_balance / 100) || 0.05
            const cooldownHours = getSellCooldownHours(roiMult, percent_of_balance);
        const cooldownMs = cooldownHours * 60 * 60 * 1000;
            var cooldown = new Date(Date.now() + cooldownMs);
        await admin.firestore().collection("profile").doc(userId).set({
            balance: Number(newBalance),
            investments: new_investments,
            investmentHistory: admin.firestore.FieldValue?.arrayUnion(historyInvestment),
            sell_cooldown: admin.firestore.Timestamp.fromDate(cooldown)
         }, {merge: true});

         if (profited > bestPick.profit) {
            await admin.firestore().collection("profile").doc(userId).update({ 
                bestPick: sellingInvestment
             }, {merge: true});
        }
         res.json({ success: true, data: cooldown });
        } else {
            console.log("You are on a sell cooldown! please wait for the cooldown to finish before selling.")
            res.status(480).json({ success: false, error: "On Sell Cooldown" });
        }
        
        
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, error: error.message });
    }
}