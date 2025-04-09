import * as admin from "firebase-admin";
import { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from "next/server";


export default async  function POST(req, res) {
    // const { userId } = req.params;
    const { userId, show } = req.body;
console.log(show)
    try {
        await admin.firestore().collection("profile").doc(userId).set({
            showBestPick: show || false
        }, {merge: true});
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}