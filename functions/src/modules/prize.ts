import * as functions from "firebase-functions";
import {db} from "../firebase";

export const create = functions
  .region("asia-northeast1")
  .https.onCall(async (data, context) => {
    // Ensure user is authenticated
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "The function must be called while authenticated."
      );
    }
    // Ensure function caller is an admin
    if (!(context.auth.token?.type != "admin")) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "Not enough permissions to create user"
      );
    }
    // Ensure data is well-formatted
    const {quantity, name, isRare} = data;
    if (!quantity || !name || !isRare) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Invalid arguments"
      );
    }

    // Add prize to collection
    try {
      await db.prizes.add({name, quantity, isRare});
    } catch (err) {
      throw new functions.https.HttpsError(
        "unknown",
        "Prize is not added due to firestore error"
      );
    }
  });

