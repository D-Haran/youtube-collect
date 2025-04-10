import { FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  collection,
  getFirestore,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

export const getPremiumStatus = async (app: FirebaseApp) => {
  const auth = getAuth(app);
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error("User not logged in");

  const db = getFirestore(app);
  const subscriptionsRef = collection(db, "profile", userId, "payments");
  const q = query(
    subscriptionsRef,
    where("status", "in", ["succeeded"])
  );

  return new Promise<boolean>((resolve, reject) => {
    try {
      const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        // In this implementation we only expect one active or trialing subscription to exist.
        var res = false;
        
        if (snapshot.docs.length === 1) {
              snapshot.docs.forEach((doc, index) => {
          const docData = doc.data()
          if (docData.trial_expires && (new Date(docData.trial_expires.seconds*1000 || docData.trial_expires || Date.now()) > new Date(Date.now()))) {
            res = true
          }
        })
            } 
        else if (snapshot.docs.length == 0){
              res = false
        }
        else {
              res = true;
            }
        resolve(res)
        unsubscribe();
      },
      reject
    );
    } catch (error) {
      console.log(error.message)
      resolve(false)
    }
    
  });
};