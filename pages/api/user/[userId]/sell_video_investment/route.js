import * as admin from "firebase-admin";
import { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from "next/server";


export default async function POST(req, res) {
    if (admin.apps.length === 0) {
        console.log("FIREBASE REFRESHING")
        admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_SERVICE_ACCOUNT_KEY))})
    }
    // const { userId } = req.params;
    const { investment_id, userId, profited, viewsAtSell } = req.body;
    function getSellCooldownHours(roiMult, percent_of_balance) {
        if (percent_of_balance <= 0.1) return 0;
        const adjustedMult = roiMult * percent_of_balance; // scale ROI by significance
        const maxCooldown = 12;
        const scaled = Math.log2(adjustedMult);
        const cooldown = Math.min(maxCooldown, scaled * 2);
        return Math.ceil(cooldown);
      }
      const get_collect_ratio_video = async (video_id) => {
        try {
          const t0 = performance.now();
          const response = await fetch(`https://youtube-collect-api.vercel.app/collect_ratio/${video_id}`);
          const json = await response.json();
          console.log(`Call to get_collect_ratio_video took ${performance.now() - t0} milliseconds.`);
      
          if (json.error === "Not Found") {
            console.warn(`Video ${video_id} was removed.`);
            return null;
          }
      
          return json;
        } catch (error) {
          console.log(error.message);
          return null;
        }
      };
      

    try {
        const docRef = await (await admin.firestore().collection("profile").doc(userId).get()).data()
        const historyInvestmentsRef = admin.firestore().collection("profile").doc(userId).collection("investmentHistory")
        // const videoDataRef = admin.firestore().collection("videos").doc(inv.video_metadata.id)
        // const videoData = (await videoDataRef.get()).data()
        const bestPick = docRef.bestPick
        const cooldown_from_firestore = docRef.sell_cooldown || null
        const all_investments = docRef.investments
        const new_investments = []
        var sellingInvestment = null
        for (let i = 0; i < all_investments.length; i++) {
            const inv = all_investments[i]
            if (inv.id != investment_id) {
                new_investments.push(inv)
            } else {
                sellingInvestment = inv
            }
        }
        if (sellingInvestment) {
            const new_collect_ratio = await get_collect_ratio_video(sellingInvestment?.video_metadata?.id)
            if (new_collect_ratio) {
                const initialRatio = sellingInvestment.initial_ratio || 1;
            const currentRatio = new_collect_ratio[2];

            const roiMultiplier = currentRatio / initialRatio;
            const profit_from_investment = (sellingInvestment.investment_total * roiMultiplier) - (sellingInvestment.investment_total_before_crash || sellingInvestment.investment_total);

            sellingInvestment.profit = profit_from_investment
            const newBalance = docRef.balance + profit_from_investment
            console.log(newBalance)
        var historyInvestment = sellingInvestment
        historyInvestment.investmentType = "SELL"
        historyInvestment.viewsAtSell = new_collect_ratio[0]
        historyInvestment.dateOfActivity = new Date(Date.now())
        const roiMult = 1 + (profit_from_investment / sellingInvestment.investment_total_before_crash)
        let on_cooldown = false;

        if (cooldown_from_firestore) {
            console.log(typeof cooldown_from_firestore.seconds)
          try {
            const cooldown_date = cooldown_from_firestore.toDate(); // Converts Timestamp to JS Date
            console.log(cooldown_date)
            on_cooldown = cooldown_date > new Date();
          } catch (e) {
            console.error("Failed to parse Firestore timestamp:", e);
          }
        }
        console.log(on_cooldown)
        
        if ((!on_cooldown)) {
            const percent_of_balance = (sellingInvestment.percent_of_balance / 100) || 0.05
            const cooldownHours = getSellCooldownHours(roiMult, percent_of_balance);
        const cooldownMs = cooldownHours * 60 * 60 * 1000;
            var cooldown = new Date(Date.now() + cooldownMs);
            console.log(cooldown)
        await admin.firestore().collection("profile").doc(userId).set({
            balance: Number(newBalance),
            investments: new_investments,
            sell_cooldown: admin.firestore.Timestamp.fromDate(new Date(cooldown)),
            lastInvestmentProfit: profit_from_investment,
         }, {merge: true});
         await historyInvestmentsRef.add({
            ...historyInvestment
        });

         if (profit_from_investment > bestPick.profit || bestPick.profit == 0) {
            await admin.firestore().collection("profile").doc(userId).update({ 
                bestPick: sellingInvestment
             }, {merge: true});
        }
         res.json({ success: true, data: cooldown });
        } else {
            console.log("You are on a sell cooldown! please wait for the cooldown to finish before selling.")
            res.status(sellingInvestment ? 480 : 500).json({ success: false, error: "On Sell Cooldown" });
        }
            }else {
                // Treat removed video as total loss
    const initialRatio = sellingInvestment.initial_ratio || 1;
    const currentRatio = 0;
    const roiMultiplier = currentRatio / initialRatio;
    const profit_from_investment = -1 * (sellingInvestment.investment_total_before_crash || sellingInvestment.investment_total);
    
    sellingInvestment.profit = profit_from_investment;
    const newBalance = docRef.balance + profit_from_investment;
    console.log("💀 Video removed. New balance:", newBalance);

    var historyInvestment = sellingInvestment;
    historyInvestment.investmentType = "SELL";
    historyInvestment.viewsAtSell = 0;
    historyInvestment.dateOfActivity = new Date(Date.now());
    historyInvestment.crashType = "removed";
    try{
        // historyInvestment.video_metadata?.snippet?.thumbnails?.default?.url = "https://i.ytimg.com/vi/jaLkGh2CqO4/default.jpg"
    } catch {

    }
    const roiMult = 1 + (profit_from_investment / (sellingInvestment.investment_total_before_crash || sellingInvestment.investment_total));
    const percent_of_balance = (sellingInvestment.percent_of_balance / 100) || 0.05;
    const cooldownHours = getSellCooldownHours(roiMult, percent_of_balance);
    const cooldownMs = cooldownHours * 60 * 60 * 1000;
    const cooldown = new Date(Date.now() + cooldownMs);

    await admin.firestore().collection("profile").doc(userId).set({
        balance: Number(newBalance),
        investments: new_investments,
        sell_cooldown: admin.firestore.Timestamp.fromDate(cooldown),
        lastInvestmentProfit: profit_from_investment,
    }, { merge: true });

    await historyInvestmentsRef.add({ ...historyInvestment });

    if (profit_from_investment > bestPick.profit) {
        await admin.firestore().collection("profile").doc(userId).update({
            bestPick: sellingInvestment
        }, { merge: true });
    }

    res.json({ success: true, data: cooldown });
            }
            
        } else {
            res.status(500).json({ success: false, error: "Investment Not Found" });
        }
        
        
        
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, error: error.message });
    }
}