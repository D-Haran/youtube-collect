import * as admin from "firebase-admin";
import { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from "next/server";


export default async  function POST(req, res) {
    // const { userId } = req.params;
    const { investment, userId, percent_of_balance } = req.body;

    try {
        if (investment.investment_total > 0) {
            const get_collect_ratio_video = async (video_id) => {
                try {
                var res = 0
                await fetch(`https://youtube-collect-api.vercel.app/collect_ratio/${video_id}`)
                .then(res => {return res.json()})
                .then(json => {res = (json)});
                return res
                }catch (error) {
                console.log(error.message)
                res.status(500).json({ success: false, error: error.message });
                }
            }
            const docRef = admin.firestore().collection("profile").doc(userId)
            const historyInvestmentsRef = admin.firestore().collection("profile").doc(userId).collection("investmentHistory")
            const videoDataRef = admin.firestore().collection("videos").doc(investment.video_metadata.id)
            var docRefData = (await docRef.get()).data()
            const q = admin.firestore().collection("profile").doc(userId).collection("payments").where("status", "in", ["succeeded"])
            const isPremium = await q.get().then(querySnapshot => {
                if (querySnapshot.docs.length === 0) {
                    return false
                    } else {
                    return true
                    }
            })
            const new_collect_ratio = await get_collect_ratio_video(investment?.video_metadata?.id)
            investment.initial_view_count = new_collect_ratio[0]
            investment.initial_ratio = new_collect_ratio[2]
            investment.investment_total_before_crash = investment.investment_total
            const all_investments = docRefData.investments
            let already_invested = false
            for (let i = 0; i < all_investments.length; i++) {
                const inv = all_investments[i]
                const id = inv?.video_metadata?.id
                if (investment?.video_metadata?.id == id) {
                    already_invested = true
                }
            }
            if (!already_invested) {
                const cooldown_from_firestore = docRefData.cooldown
                const daily_trades_left = docRefData.daily_trades_left
                const holding_limit = isPremium ? 5 : 3
                const percent_of_balance_limit = 11
                const percent_of_balance_investment_limit = isPremium ? 75 : 65
                const num_investments = docRefData.investments.length
                if (investment.initial_ratio <= 0) {
                    investment.initial_ratio = 0.134
                }
                var on_cooldown = cooldown_from_firestore ? (new Date(cooldown_from_firestore.seconds*1000)) > Date.now(): true
                if ((cooldown_from_firestore == null || 
                    !on_cooldown || 
                    percent_of_balance <= percent_of_balance_limit) 
                    && daily_trades_left > 0 
                    && num_investments < holding_limit 
                    && percent_of_balance <= percent_of_balance_investment_limit
                    ) {
                    if (percent_of_balance <= percent_of_balance_limit) {
                        if (cooldown_from_firestore != null) {
                            var cooldown = (new Date(cooldown_from_firestore.seconds*1000 + 120000))
                        } else {
                            var cooldown = (new Date(Date.now() + 120000))
                        }
                    } else {
                        var cooldown = isPremium ? new Date(Date.now() + 360000) : new Date(Date.now() + 600000)
                    }
                    if (cooldown_from_firestore == null || !on_cooldown) {
                        investment.crashed = false
                        investment.lastMilestone = 0
                        investment.percent_of_balance = percent_of_balance
                        var historyInvestment = investment
                        historyInvestment.dateOfActivity = new Date(Date.now())
                        historyInvestment.investmentType = "BUY"
                        var arrUnion = docRef.set({
                            investments: admin.firestore.FieldValue.arrayUnion(investment),
                            daily_trades_left: admin.firestore.FieldValue.increment(-1),
                            cooldown: cooldown,
                        }, {merge: true});
                        await historyInvestmentsRef.add({
                            ...historyInvestment
                        });
                        const videoData = (await videoDataRef.get()).data()
                        if (!videoData) {
                            videoDataRef.set({
                                angelInvestor: {
                                    userName: docRefData.userName, 
                                    investmentAmount: investment.investment_total_before_crash
                                }
                            }, {merge:true})
                        }
                    } else {
                        var historyInvestment = investment
                        historyInvestment.investmentType = "BUY"
                        investment.percent_of_balance = percent_of_balance
                        var arrUnion = docRef.set({
                            investments: admin.firestore.FieldValue.arrayUnion(investment),
                            daily_trades_left: admin.firestore.FieldValue.increment(-1),
                            cooldown: cooldown,
                        }, {merge: true});
                        await historyInvestmentsRef.add({
                            ...historyInvestment
                        });
                        const videoData = (await videoDataRef.get()).data()
                        if (!videoData) {
                            videoDataRef.set({
                                angelInvestor: {
                                    userName: docRefData.userName, 
                                    investmentAmount: investment.investment_total_before_crash
                                }
                            }, {merge:true})
                        }
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
            }
            else {
                res.status(500).json({success: false, error: "Already Invested in Video"})
            }
        }else {
            res.status(500).json({success: false, error: "Invalid Investment Amount"})
        }
        
        
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, error: error.message });
    }
}