import * as admin from "firebase-admin";


export default async function POST(req, res) {
    const userId = req.query.userId;
    const {curr_premium} = req.body
        try {
            if (admin.apps.length === 0) {
        const firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_SERVICE_ACCOUNT_KEY))})
    }

    const q = admin.firestore().collection("profile").doc(userId).collection("payments").where("status", "in", ["succeeded"])
    const is_trial = await (admin.firestore().collection("profile").doc(userId).collection("payments").doc("trial")).get()

    if (new Date(is_trial.data().trial_expires.seconds*1000 || is_trial.data().trial_expires || Date.now()) > new Date(Date.now())) {
      console.log(is_trial.data(), is_trial.data().trial_expires)
      res.json({ success: true, data: {premium: true, trial: true, expires_in: is_trial.data().trial_expires}});
      try {
        if (curr_premium == false) {
            const docRef = admin.firestore().collection("profile").doc(userId)
            docRef.update({premium: true})
          }
      } catch {

      }
    } else {
      const isPremium = q.get().then(querySnapshot => {
      if (querySnapshot.docs.length === 0) {
            res.json({ success: true, data: {premium: false}});
            if (curr_premium == true) {
              const docRef = admin.firestore().collection("profile").doc(userId)
              docRef.update({premium: false})
            }
          } else {
            res.json({ success: true, data: {premium: true}});
            try {
              if (curr_premium == false) {
                  const docRef = admin.firestore().collection("profile").doc(userId)
                  docRef.update({premium: true})
                }
            } catch {

            }
          }
    })
    }

    

    } catch (error) {
      console.log(error.message)
        res.status(500).json({ success: false, error: error.message });
    }
}