import * as functions from "firebase-functions";
import {db} from "../firebase";

/**
 * Gets information about a user to be shown on user dashboard.
 *
 * @remarks
 * This function is only callable when a user is authenticated and called using
 * Cloud Function SDK.
 *
 * @returns The user information.
 */
export const getInfo = functions
  .region("asia-southeast1")
  .https.onCall(async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "The function must be called while authenticated."
      );
    }
    const cid = context.auth.uid;
    const userRef = await db.users.doc(cid).get();
    if (!userRef.exists) {
      throw new functions.https.HttpsError("not-found", "User not found.");
    }
    const user = userRef.data();
    const transactionsRef = await db.userTransactions(cid).get();
    const stampCountRef = await db
      .userStamps(cid)
      .where("redeemed", "==", false)
      .count()
      .get();
    const prizeCountRef = await db
      .userPrizes(cid)
      .where("redeemed", "==", false)
      .count()
      .get();

    return {
      name: user?.name,
      type: user?.type,
      stampsLeft: stampCountRef.data().count,
      prizeUnredeemed: prizeCountRef.data().count,
      transactions: transactionsRef.docs.map((doc) => doc.data()),
    };
  });
