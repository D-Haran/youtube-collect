import * as admin from "firebase-admin";
import { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from "next/server";
import { orderBy, query, where, limit, collection } from "firebase-admin/firestore";


export default async function GET(req, res) {
    const userId = req.query.userId;
        try {
            if (admin.apps.length === 0) {
        const firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_SERVICE_ACCOUNT_KEY))})
    }
    const q = admin.firestore().collection("customers").doc(userId).collection("subscriptions").where("status", "in", ["trialing", "active"])

    const isPremium = q.get().then(querySnapshot => {
      if (querySnapshot.docs.length === 0) {
            res.json({ success: true, data: {premium: false}});
          } else {
            res.json({ success: true, data: {premium: true}});
          }
    })

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}