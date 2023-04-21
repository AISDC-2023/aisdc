import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {db} from "../firebase";

/**
 * Create new prize document on Prizes collection
 *
 * @remarks
 * This function is only callable when a user is authenticated, is type admin,
 * and called using Cloud Function SDk.
 *
 * @param {Object} data - Consist of prize's name, quantity and isRare
 * @param {string} data.name - Name of the prize
 * @param {number} data.quantity - Initial Quantity of the prize
 * @param {boolean} data.isRare - Is the prize considered rare?
 */
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

/**
 * Get a list of all the prize in the collection
 *
 * @remarks
 * This function is only callable when a user is authenticated, is type admin,
 * and called using Cloud Function SDk.
 *
 * @param {Object} data - Empty object
 *
 * @returns The object containing object for each prize.
 */
export const get = functions
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

    try {
      const prizes: {[key: string]: any} = {};
      const prizeSnaps = await db.prizes.get();
      prizeSnaps.forEach((doc) => {
        prizes[doc.id] = doc.data();
      });
      return {
        prizes,
      };
    } catch (err) {
      // Throw exception if unknown error
      throw new functions.https.HttpsError(
        "unknown",
        "Unknown error occurred while listing prizes."
      );
    }
  });

/**
 * Delete prizes from collection given its ids.
 *
 * @remarks
 * This function is only callable when a user is authenticated, is type admin,
 * and called using Cloud Function SDk.
 *
 * @param {Object} data - Consist of array of ids to be deleted.
 * @param {string[]} data.ids - Array of data ids to be deleted.
 */
export const deletePrize = functions
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
    const {ids} = data;
    if (!ids) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Invalid arguments"
      );
    }

    // Delete prizes from collection
    try {
      await Promise.all(
        ids.map((id: string) => {
          return db.prizes.doc(id).delete();
        })
      );
    } catch (err) {
      throw new functions.https.HttpsError(
        "unknown",
        "Prize is not deleted due to firestore error"
      );
    }
  });

/**
 * Redeem a prize from collection given its user.cid and prize.id.
 * This function will also update the user's prize redeemed status and
 * prize's quantity.
 *
 * @remarks
 * This function is only callable when a user is authenticated, is type admin,
 * and called using Cloud Function SDk.
 *
 * @param {Object} data - Consist of user.cid and prize.id
 * @param {string} data.cid - User's cid
 * @param {string} data.pid - Prize's id
 */
export const redeem = functions
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
    const {cid, pid} = data;
    if (!cid || !pid) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Invalid arguments"
      );
    }

    // Redeem prize from collection
    try {
      const prizeSnap = await db.prizes.doc(pid).get();
      const userPrizeSnap = await db.userPrizes(cid).doc(pid).get();
      const prize = prizeSnap.data();
      const userPrize = userPrizeSnap.data();
      // Checking pre-conditions
      if (!prize) {
        throw new functions.https.HttpsError("not-found", "Prize is not found");
      }
      if (!userPrize) {
        throw new functions.https.HttpsError(
          "not-found",
          "Prize is not found under user's prize collection"
        );
      }
      const prizeQuantity = prize.quantity;
      if (prizeQuantity <= 0) {
        throw new functions.https.HttpsError(
          "failed-precondition",
          "Prize is out of stock"
        );
      }
      if (userPrize.redeemed) {
        throw new functions.https.HttpsError(
          "failed-precondition",
          "Prize is already redeemed by user"
        );
      }

      // Executing prize redeem transaction
      await db.prizes.doc(pid).update({
        quantity: prizeQuantity - 1,
      });
      await db.userPrizes(cid).doc(pid).update({redeemed: true});
      await db
        .userTransactions(cid)
        .add({
          description: `Redeemed ${prize.name}`,
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
        });
    } catch (err) {
      throw new functions.https.HttpsError(
        "unknown",
        "Prize is not redeemed due to firestore error"
      );
    }
  });
