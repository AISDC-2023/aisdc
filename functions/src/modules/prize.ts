import * as functions from "firebase-functions";
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
        ids.map(async (id: string) => {
          return db.prizes.doc(id).delete();
        })
      )
    } catch (err) {
      throw new functions.https.HttpsError(
        "unknown",
        "Prize is not deleted due to firestore error"
      );
    }
  });

