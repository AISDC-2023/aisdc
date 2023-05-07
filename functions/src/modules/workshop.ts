import * as functions from "firebase-functions";
import {FieldValue} from "firebase-admin/firestore";
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

/**
 * Register user to a workshop
 *
 * @remarks
 * This function is only callable when a user is authenticated and called using
 * Cloud Function SDk.
 *
 * @param {Object} data - Consist of workshop id
 * @param {string} data.wid - Id of the workshop
 */
export const register = functions
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

    const {wid} = data;
    if (!wid) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Workshop id is required"
      );
    }

    try {
      const workshopRef = await db.workshops.doc(wid).get();
      const workshop = workshopRef.data();
      if (!workshop) {
        throw new functions.https.HttpsError(
          "not-found",
          `Workshop ${wid} not found`
        );
      }
      if (workshop.registeredUserIds.includes(cid)) {
        throw new functions.https.HttpsError(
          "already-exists",
          "User already registered to workshop"
        );
      }
      if (workshop.registeredUserIds.length >= 45) {
        throw new functions.https.HttpsError(
          "resource-exhausted",
          "Workshop is full"
        );
      }
      await workshopRef.ref.update({
        registeredUserIds: [...workshop.registeredUserIds, cid],
      });
      await db.userTransactions(cid).add({
        type: "workshop",
        timestamp: FieldValue.serverTimestamp(),
        description: `Registered to workshop ${workshop.name}`,
      });
    } catch (err) {
      if (err instanceof functions.https.HttpsError) {
        throw err;
      }

      functions.logger.error(err);
      // Throw exception if unknown error
      throw new functions.https.HttpsError(
        "unknown",
        "Unknown error occurred while registering to workshop."
      );
    }
  });

/**
 * Unregister user from a workshop
 *
 * @remarks
 * This function is only callable when a user is authenticated and called using
 * Cloud Function SDk.
 *
 * @param {Object} data - Consist of workshop id
 * @param {string} data.wid - Id of the workshop
 */
export const unregister = functions
  .region("asia-southeast1")
  .https.onCall(async (data, context) => {
    // // Ensure user is authenticated
    // if (!context.auth) {
    //   throw new functions.https.HttpsError(
    //     "unauthenticated",
    //     "The function must be called while authenticated."
    //   );
    // }
    // const cid = context.auth.uid;
    const cid = "rctNVZ48mQ";
    const {wid} = data;
    if (!wid) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Workshop id is required"
      );
    }
    try {
      const workshopRef = await db.workshops.doc(wid).get();
      const workshop = workshopRef.data();
      if (!workshop) {
        throw new functions.https.HttpsError(
          "not-found",
          `Workshop ${wid} not found`
        );
      }
      if (!workshop.registeredUserIds.includes(cid)) {
        throw new functions.https.HttpsError(
          "already-exists",
          "User not registered to workshop"
        );
      }
      await workshopRef.ref.update({
        registeredUserIds: workshop.registeredUserIds.filter((id) => id != cid),
      });
      await db.userTransactions(cid).add({
        type: "workshop",
        timestamp: FieldValue.serverTimestamp(),
        description: `Unregistered from workshop ${workshop.name}`,
      });
    } catch (err) {
      if (err instanceof functions.https.HttpsError) {
        throw err;
      }

      functions.logger.error(err);
      // Throw exception if unknown error
      throw new functions.https.HttpsError(
        "unknown",
        "Unknown error occurred while unregistering from workshop."
      );
    }
  });
