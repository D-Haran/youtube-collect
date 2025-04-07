import * as admin from "firebase-admin";
import { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from "next/server";


export default async  function POST(req, res) {
    // const { userId } = req.params;
    const { userId, userName } = req.body;

    try {
        var numDaysBetween = function(d1, d2) {
            var diff = Math.abs(d1.getTime() - d2.getTime());
            return diff / (1000 * 60 * 60 * 24);
          };
          if (!(String(userName).length > 15)) {
        const docRef = admin.firestore().collection("profile").doc(userId)
                const profileData = await docRef.get()
                if (profileData.exists) {
                    const data = profileData.data()
                    if (data.userNameChangeDate) {
                        if (numDaysBetween(new Date(Date.now()), new Date(data.userNameChangeDate)) >= 30) {
                            await admin.firestore().collection("profile").doc(userId).set({
                            userName: userName,
                            userNameChangeDate: admin.firestore.Timestamp.fromDate(new Date(Date.now()))
                        }, {merge: true});
                        res.status(200).json({ success: true });
                        } else {
                            res.status(200).json({ success: false, error: "30 Days" });
                            console.log('30 Days')
                        }
                        
                    } else {
                        await admin.firestore().collection("profile").doc(userId).set({
                            userName: userName,
                            userNameChangeDate: admin.firestore.Timestamp.fromDate(new Date(Date.now()))
                        }, {merge: true});
                        res.status(200).json({ success: true });
                    }
                    
                
                }
          }
          else {
            res.status(400).json({ success: false, error: "Username Exceeds Character Limit" });
          }
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, error: error.message });
    }
}