import * as admin from "firebase-admin";
import { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from "next/server";


export default async  function POST(req, res) {
    // const { userId } = req.params;
    const { investment, userId, percent_of_balance } = req.body;

    try {
        const docRef = await admin.firestore().collection("profile").doc(userId)
        var docRefData = (await admin.firestore().collection("profile").doc(userId).get()).data()
        const cooldown_from_firestore = docRefData.cooldown
        const daily_trades_left = docRefData.daily_trades_left
        const holding_limit = docRefData.premium ? 8 : 3
        const percent_of_balance_limit = 11
        const percent_of_balance_investment_limit = docRefData.premium ? 75 : 65
        const num_investments = docRefData.investments.length
        if (investment.initial_ratio <= 0) {
            investment.initial_ratio = 0.134
        }

        console.log(num_investments)
        var on_cooldown = cooldown_from_firestore ? (new Date(cooldown_from_firestore.seconds*1000)) > Date.now(): true
        console.log(percent_of_balance)
        if ((cooldown_from_firestore == null || !on_cooldown || percent_of_balance <= percent_of_balance_limit) && daily_trades_left > 0 && num_investments < holding_limit && percent_of_balance <= percent_of_balance_investment_limit) {
            if (percent_of_balance <= percent_of_balance_limit) {
                if (cooldown_from_firestore != null) {
                    var cooldown = (new Date(cooldown_from_firestore.seconds*1000 + 120000))
                } else {
                    var cooldown = (new Date(Date.now() + 120000))
                }
            } else {
                var cooldown = docRefData.premium ? new Date(Date.now() + 360000) : new Date(Date.now() + 600000)
            }
            if (cooldown_from_firestore == null || !on_cooldown) {
                investment.crashed = false
                investment.lastMilestone = 0
                var historyInvestment = investment
                historyInvestment.investmentType = "BUY"
                var arrUnion = docRef.set({
                    investments: admin.firestore.FieldValue.arrayUnion(investment),
                    daily_trades_left: admin.firestore.FieldValue.increment(-1),
                    cooldown: cooldown,
                    investmentHistory: admin.firestore.FieldValue?.arrayUnion(historyInvestment)
                }, {merge: true});
            } else {
                var historyInvestment = investment
                historyInvestment.investmentType = "BUY"
                var arrUnion = docRef.set({
                    investments: admin.firestore.FieldValue.arrayUnion(investment),
                    daily_trades_left: admin.firestore.FieldValue.increment(-1),
                    cooldown: cooldown,
                    investmentHistory: admin.firestore.FieldValue?.arrayUnion(historyInvestment)
                }, {merge: true});
            }
            res.json({ success: true, data: cooldown });
        } 
        else if (percent_of_balance > percent_of_balance_investment_limit) {
            console.log("Your account plan only allows " + percent_of_balance_investment_limit + "% of your available balance to be invested into one holding")
            res.status(480).json({ success: false, error: "Exceeds Holding Limit" });
        }
        else if (num_investments >= holding_limit) {
            console.log("Holding Limit Reached")
            res.status(450).json({ success: false, error: "Investment Holding Limit Reached" });
        }
        else if (daily_trades_left <= 0) {
            console.log("Already Reached Daily Trade Limit")
            res.status(418).json({ success: false, error: "Already Reached Daily Trade Limit" });
        } else if (on_cooldown) {
            console.log("COOLDOWN")
            res.status(503).json({ success: false, error: "YOU ARE ON COOLDOWN" });
        }
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, error: error.message });
    }
}