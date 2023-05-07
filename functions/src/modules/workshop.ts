import * as functions from "firebase-functions";
import {db} from "../firebase";

/**
 * List all information related to all workshops
 *
 * @remarks
 * This function is only callable when a user is authenticated and called using
 * Cloud Function SDk.
 *
 * @param {Object} data - Empty object
 *
 * @returns The list of workshops.
 * @throws {functions.https.HttpsError} - If user is not authenticated.
 */

export const list = functions
  .region("asia-southeast1")
  .https.onCall(async (data, context) => {
    // Ensure user is authenticated
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "The function must be called while authenticated."
      );
    }

    // Retrieve all workshop information
    try {
      const workshopsRef = await db.workshops.get();
      return workshopsRef.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          description: data.description,
          slotsLeft: 45 - data.registeredUserIds.length,
          registered: data.registeredUserIds.includes(context.auth?.uid ?? ""),
        };
      });
    } catch (err) {
      functions.logger.error(err);
      // Throw exception if unknown error
      throw new functions.https.HttpsError(
        "unknown",
        "Unknown error occurred while retrieving workshop information."
      );
    }
  });

// export const register = null;
// export const unregister = null;
