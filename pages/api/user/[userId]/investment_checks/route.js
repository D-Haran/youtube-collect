import * as admin from "firebase-admin";
import { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from "next/server";


export default async function GET(req, res) {
    // const { userId } = req.params;
    const userId = req.query.userId;
    if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_SERVICE_ACCOUNT_KEY))})
  }
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
    function getCrashChanceForMilestone(pnl) {
        if (pnl >= 2000) return 0.70;
        if (pnl >= 1000) return 0.60;
        if (pnl >= 500) return 0.45; 
        if (pnl >= 400) return 0.33; 
        if (pnl >= 300) return 0.28; 
        if (pnl >= 200) return 0.20; 
        if (pnl >= 100) return 0.17; 
        return 0;
      }
    try {
        const docRef = admin.firestore().collection("profile").doc(userId)
        const profileData = await docRef.get()
        const data = profileData.data()
        if (data.investments && data.investments.length >= 1) {
            const newInvestments = data.investments
            for (let i = 0; i < newInvestments.length; i++) {
                const inv = newInvestments[i]
                const new_collect_ratio = await get_collect_ratio_video(inv.video_metadata.id)
                if (new_collect_ratio) {
                  const profits = (((new_collect_ratio[2] - inv.initial_ratio)/inv.initial_ratio)*100).toFixed(2) || 1
                    const PnL = Math.ceil(profits)
                    console.log(PnL)
                    const milestone = Math.floor(PnL / 100) * 100;
                    data.investments[i].curr_ratio = new_collect_ratio[2]
                    data.investments[i].video_metadata.statistics.viewCount = new_collect_ratio[0]
                    const milestones_passed = milestone - inv.lastMilestone || 0
                    if (milestones_passed>0) {
                        for (let s = 0; s < (milestones_passed/100); s++) {
                          if (milestone >= 100) {
                              data.investments[i].lastMilestone = milestone; // store to prevent re-crashing at the same level
                              const crashChance = getCrashChanceForMilestone(s*100);
                              const whatAreTheChances = Math.random()
                              console.log(whatAreTheChances)
                              if (whatAreTheChances < crashChance) {
                                console.log(`💥 CRASH! Investment crashed at ${s*100}% return!`);
                          
                                // Apply the crash (e.g., halve the current ratio)
                                if (data.investments[i].investment_total * 0.10 > 0) {
                                  data.investments[i].investment_total *= 0.10
                                } else {
                                  data.investments[i].investment_total = 1
                                }
                                ;
                          
                                // Optionally flag that it happened
                                data.investments[i].crashed = true;
                                data.investments[i].crashAt = milestone;
                                data.investments[i].lastMilestone = milestone;
                                
                              }
                            }
                            
                    }
                    const openingChance = Math.random()
                    if (openingChance < 0.05) {
                      console.log(`💥 CRASH! Investment crashed at ${profits}% return!`);
                
                      // Apply the crash (e.g., halve the current ratio)
                      if (data.investments[i].investment_total * 0.50 > 0) {
                        data.investments[i].investment_total *= 0.50
                      } else {
                        data.investments[i].investment_total = 1
                      }
                      ;
                
                      // Optionally flag that it happened
                      data.investments[i].crashed = true;
                      data.investments[i].crashAt = profits;
                      data.investments[i].lastMilestone = milestone;
                      
                    }
                    await docRef.set({ 
                                investments: data.investments
                            }, {merge: true});
                        }
                }
              }
            data.investments.reverse()
        }
        res.json({ success: true, data });
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ success: false, error: error.message });
    }
}