import * as admin from "firebase-admin";
import { getApps, initializeApp } from "firebase-admin";
if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(require("../../../firebase-key.json"))})
}

export default async  function POST(req, res) {
  const { token } = req.body;
  console.log("GOTTT")
  res.status
  try {
      // Verify token using Firebase Authentication
      const decoded = await admin.auth().verifyIdToken(token);
      const userId = decoded.uid;
      const userName = decoded.name;
      console.log(decoded)

      // Send back the verified user ID
      res.json({ success: true, data: {userId, userName} });
  } catch (error) {
    
      res.status(401).json({ success: false, error: "Invalid token" });
  }
  }

// export default async function handler(req, res) {
//     if (req.method === 'POST') {
        // const { token } = req.body;
        // console.log("GOTTT")
        // res.status
        // try {
        //     // Verify token using Firebase Authentication
        //     const decoded = await admin.auth().verifyIdToken(token);
        //     const userId = decoded.uid;
    
        //     // Send back the verified user ID
        //     res.json({ success: true, userId });
        // } catch (error) {
        //     res.status(401).json({ success: false, error: "Invalid token" });
        // }
//     } else {
//       // Handle any other HTTP method
//     }
// }

