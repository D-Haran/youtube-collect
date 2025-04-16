import * as admin from "firebase-admin";
import { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from "next/server";

if (admin.apps.length === 0) {
      console.log("INITIALIZING APP")
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_SERVICE_ACCOUNT_KEY))})
  }
  const get_collect_ratio_video = async (video_id) => {
        try {
          const t0 = performance.now();
          var res = 0
          console.log(`https://youtube-collect-api.vercel.app/collect_ratio/${video_id}`)
        await fetch(`https://youtube-collect-api.vercel.app/collect_ratio/${video_id}`)
          .then(res => {return res.json()})
          .then(json => {res = (json)})
          .then(data => {console.log(`Call to get_collect_ratio_video took ${performance.now() - t0} milliseconds.`);})
          
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
export default async function GET(req, res) {
    // const { userId } = req.params;
    const userId = req.query.userId;
    
      
    
    try {
      const t0 = performance.now();
        const docRef = admin.firestore().collection("profile").doc(userId)
        const profileData = await docRef.get()
        const data = profileData.data()
        let totalHoldingValue;
        if (data.investments && data.investments.length >= 1) {
            const newInvestments = data.investments
            for (let i = 0; i < newInvestments.length; i++) {
                const inv = newInvestments[i]
                let holdingProfit;
                let pNL_percent;
                const new_collect_ratio = await get_collect_ratio_video(inv.video_metadata.id)
                if (new_collect_ratio) {
                  data.investments[i].curr_ratio = new_collect_ratio[2]
                    data.investments[i].video_metadata.statistics.viewCount = new_collect_ratio[0]
                    data.investments[i].video_metadata.snippet.hoursSinceUpload = new_collect_ratio[3] || 1
                    const temp_profits = (((new_collect_ratio[2] - inv.initial_ratio)/inv.initial_ratio)*100).toFixed(2) || 1
                    const currentValue = inv.investment_total + ((temp_profits/100) * inv.investment_total);
                    if (!data.investments[i].investment_total_before_crash) {
                      holdingProfit = currentValue - inv.investment_total;
                      pNL_percent = (holdingProfit / inv.investment_total) || 0
                    } else {
                      holdingProfit = currentValue - inv.investment_total_before_crash;
                      pNL_percent = (holdingProfit / inv.investment_total_before_crash) || 0
                    }
                  const profits = (inv.pNL_percent*100) || (((new_collect_ratio[2] - inv.initial_ratio)/inv.initial_ratio)*100).toFixed(2) || 1
                    const PnL = Math.ceil(profits)
                    const milestone = Math.floor(PnL / 100) * 100;
                    
                    const invested = inv.investment_total
                    const milestones_passed = milestone - inv.lastMilestone || 0
                    if (milestones_passed>0) {
                        for (let s = ((inv.lastMilestone/100)+1); s <= ((milestone/100)); s++) {
                          if (milestone >= 100) {
                              data.investments[i].lastMilestone = milestone; // store to prevent re-crashing at the same level
                              const crashChance = getCrashChanceForMilestone(s*100);
                              const whatAreTheChances = Math.random()
                              console.log(whatAreTheChances)
                              if (whatAreTheChances < crashChance) {
                                console.log(`💥 CRASH! Investment crashed at ${s*100}% return!`);
                          
                                // Apply the crash (e.g., halve the current ratio)
                                if (data.investments[i].investment_total * 0.10 > 0) {
                                  const investment_total = Number(data.investments[i].investment_total)
                                  const newInvestmentTotal = Number(data.investments[i].investment_total) * 0.10
                                  data.investments[i].investment_total *= 0.10
                                  const currentValue = newInvestmentTotal + ((profits/100) * newInvestmentTotal);
                                  if (!data.investments[i].investment_total_before_crash) {
                                    data.investments[i].investment_total_before_crash = investment_total
                                    holdingProfit = currentValue - newInvestmentTotal;
                                  } else {
                                    holdingProfit = currentValue - inv.investment_total_before_crash;
                                  }
                                } else {
                                  data.investments[i].investment_total = 1
                                  holdingProfit = -inv.investment_total_before_crash || 0
                                }
                                ;
                          
                                // Optionally flag that it happened
                                data.investments[i].crashed = true;
                                data.investments[i].crashAt = milestone;
                                data.investments[i].lastMilestone = milestone;
                                data.investments[i].crashType = "milestone";
                              }
                            }
                            
                          }
                    await docRef.set({ 
                                investments: data.investments
                            }, {merge: true});
                    }
                    if (data.premium == false || !data.premium) {
                      var diff = Math.abs(new Date(data.last_check ? data.last_check.seconds*1000 : Date.now() - 11*60000) - new Date(Date.now()));
                      var minutes = Math.floor((diff/1000)/60);
                      console.log("minutes: ", minutes)
                      const openingChance = Math.random()
                    if (openingChance < 0.01 && minutes >= 10 && data.balance >= 200) {
                      console.log(`💥 CRASH! Investment crashed at ${profits}% return!`);
                
                      // Apply the crash (e.g., halve the current ratio)
                      if (data.investments[i].investment_total * 0.50 > 0) {
                        const investment_total = Number(data.investments[i].investment_total)
                        const newInvestmentTotal = Number(data.investments[i].investment_total) * 0.50
                        data.investments[i].investment_total *= 0.50
                        const currentValue = newInvestmentTotal + ((profits/100) * newInvestmentTotal);
                        if (!data.investments[i].investment_total_before_crash) {
                          data.investments[i].investment_total_before_crash = investment_total
                          holdingProfit = currentValue - newInvestmentTotal;
                        } else {
                          holdingProfit = currentValue - inv.investment_total_before_crash;
                        }
                      } else {
                        data.investments[i].investment_total = 1
                        holdingProfit = -inv.investment_total_before_crash || 0
                      }
                      ;
                
                      // Optionally flag that it happened
                      data.investments[i].crashed = true;
                      data.investments[i].crashAt = Number(profits).toFixed(0) || profits;
                      data.investments[i].lastMilestone = milestone;
                      if (!data.investments[i].investment_total_before_crash) {
                        data.investments[i].investment_total_before_crash = invested;
                      }
                      data.investments[i].crashType = "check";
                      await docRef.set({ 
                                investments: data.investments,
                                last_check: admin.firestore.Timestamp.fromDate(new Date(Date.now()))
                            }, {merge: true});
                    } else if (minutes >= 10) {
                      await docRef.set({
                        last_check: admin.firestore.Timestamp.fromDate(new Date(Date.now()))
                    }, {merge: true});
                    }
                    }
                    
                    
                }
                data.investments[i].holdingProfit = holdingProfit
                
                if (!data.investments[i].investment_total_before_crash) {
                  pNL_percent = (holdingProfit / inv.investment_total) || 0
                  
                } else {
                  pNL_percent = (holdingProfit / data.investments[i].investment_total_before_crash)
                }
                data.investments[i].profit_percent = pNL_percent || 0
              }
            data.investments.reverse()
        }
        const t1 = performance.now();
        console.log(`Call to doSomething took ${t1 - t0} milliseconds.`);
        res.json({ success: true, data });
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ success: false, error: error.message });
    }
}