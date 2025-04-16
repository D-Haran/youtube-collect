const admin = require("firebase-admin");
const {onSchedule} = require("firebase-functions/v2/scheduler");
admin.initializeApp();

exports.update_leaderboard = onSchedule("0,30 * * * *", async (event) => {
  try {
    const allUsers = await admin
        .firestore()
        .collection("profile")
        .where("balance", ">", 0)
        .orderBy("balance", "desc")
        .get();

    const batch = admin.firestore().batch();
    allUsers.docs.forEach((doc, index) => {
      batch.update(doc.ref, {rank: index + 1});
    });

    await batch.commit();

    // Also store top 100 in one doc
    const top100 = allUsers.docs.slice(0, 100).map((doc, i) => ({
      userName: doc.data().userName || "Anonymous",
      id: doc.data().leaderboardId || doc.id || "ewfoiubensukhjb231ewfw",
      balance: doc.data().balance || 0,
      bestPick: doc.data().bestPick || null,
      premium: doc.data().premium || false,
      rank: i + 1,
      showBestPick: doc.data().showBestPick || false,
    }));

    await admin
        .firestore()
        .collection("leaderboard")
        .doc("top_100")
        .set({data: top100});
    await admin
        .firestore()
        .collection("leaderboard")
        .doc("meta")
        .set({total: allUsers.size});
  } catch (error) {
    console.log(error.message);
  }
  return console.log("Successful Timer Update");
});

exports.refresh_daily_trades = onSchedule("0 0 * * *", async (event) => {
  try {
    const allUsers = await admin
        .firestore()
        .collection("profile")
        .get();

    const batch = admin.firestore().batch();
    allUsers.docs.forEach((doc, index) => {
      batch.update(doc.ref, {
        lastRefreshed: new Date().toISOString(),
        daily_trades_left: doc.data().premium ? 8 : 5,
      });
    });

    await batch.commit();
  } catch (error) {
    console.log(error.message);
  }
  return console.log("Successful User Update");
});

// exports.check_premium_trials = onSchedule("0 0 * * *", async (event) => {
//   const allUsers = await admin
//       .firestore()
//       .collection("profile")
//       .get();
//   allUsers.docs.forEach((doc) => {
//     console.log("top");
//     if (doc.data().trial == true &&
//     new Date(doc.data().trial_expires.seconds*1000) <
//       new Date(Date.now())) {
//       const userId = doc.ref.path.split("/")[1];
//       console.log(userId);
//       if (doc.data().premium == true) {
//         admin
//             .firestore()
//             .collection("profile")
//             .doc(userId)
//             .collection("payments")
//             .doc("trial")
//             .update({status: "expired"});

//         admin.firestore()
//             .collection("profile")
//             .doc(userId).update({trial: false, premium: false});
//       }
//     }
//   });
// });
