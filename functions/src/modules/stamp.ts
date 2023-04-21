import * as functions from "firebase-functions";
import {db} from "../firebase";

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
