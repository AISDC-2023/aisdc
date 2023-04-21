import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {db} from "../firebase";
import {StampTypeCount} from "../schema";

/**
 * Create new stamp into stamp collection.
 *
 * @remarks
 * This function is only callable when a user is authenticated, is type admin,
 * and called using Cloud Function SDk.
 *
 * @param {Object} data - Consist of stamp information
 * @param {string} data.name - Name of the stamp
 * @param {string} data.description - Description of the stamp
 * @param {string} data.type - Type of stamp, one of 'booth','workshop','event'
 */
export const create = functions
  .region("asia-southeast1")
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
        "Not enough permissions to create new stamp"
      );
    }
    const {name, description, type} = data;
    if (!name || !description || !type) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Invalid arguments"
      );
    }
    try {
      await db.stamps.add({name, description, type});
    } catch (err) {
      // Throw exception if unknown error
      throw new functions.https.HttpsError(
        "unknown",
        "Unknown error occurred while creating stamp."
      );
    }
  });

/**
 * Assign stamp to user collection
 *
 * @remarks
 * This function is only callable when a user is authenticated,
 * and called using Cloud Function SDk.
 *
 * @param {Object} data - Consist of stamp information
 * @param {string} data.sid - Id of the stamp
 */
export const redeem = functions
  .region("asia-southeast1")
  .https.onCall(async (data, context) => {
    // Ensure user is authenticated
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "The function must be called while authenticated."
      );
    }
    const cid = context.auth.uid;
    const {sid} = data;
    if (!sid) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Invalid arguments"
      );
    }
    try {
      const stampRef = await db.stamps.doc(sid).get();
      const stamp = stampRef.data();
      if (!stamp) {
        throw new functions.https.HttpsError("not-found", "Stamp not found");
      }
      // Check if user already has the stamp
      const userStampRef = await db.userStamps(cid).doc(sid).get();
      if (userStampRef.exists) {
        throw new functions.https.HttpsError(
          "failed-precondition",
          `User already has the stamp ${sid} ${stamp.name}`
        );
      }
      // Assign stamp to user collection
      await db.userStamps(cid).doc(sid).set({
        name: stamp.name,
        received: admin.firestore.FieldValue.serverTimestamp(),
      });
      // Update user's stamp count based on StampTypeCount
      await db.users.doc(cid).update({
        stampCount: admin.firestore.FieldValue.increment(
          StampTypeCount[stamp.type]
        ),
      });
      // Update user transaction history
      await db.userTransactions(cid).add({
        description: `Redeemed stamp ${stamp.name}`,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });
    } catch (err) {
      if (err instanceof functions.https.HttpsError) {
        throw err;
      }
      // Throw exception if unknown error
      throw new functions.https.HttpsError(
        "unknown",
        "Unknown error occurred while redeeming stamp."
      );
    }
  });
