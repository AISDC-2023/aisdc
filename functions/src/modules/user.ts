import * as functions from "firebase-functions";
import {auth, db} from "../firebase";
import {getCid} from "../utils";

/**
 * Gets information about a user to be shown on user dashboard.
 *
 * @remarks
 * This function is only callable when a user is authenticated and called using
 * Cloud Function SDK.
 *
 * @param {Object} data - Empty object
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

/**
 * Create a new user with new unique conference id.
 *
 * @remarks
 * This function is only callable when a user is authenticated, is type admin,
 * and called using Cloud Function SDk.
 *
 * @param {Object} data - Consist of user's name, email and type.
 * @param {string} data.name - Name of the user
 * @param {string} data.email - Email of the user
 * @param {string} data.type - Type of the user, one of 'participant','admin'
 * ,'partner
 *
 * @returns {strin} cid - New conference id of user.
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
    const userRef = await db.users.doc(context.auth.uid).get();
    if (!userRef.exists || userRef.data()?.type != "admin") {
      throw new functions.https.HttpsError(
        "permission-denied",
        "Not enough permissions to create user"
      );
    }
    // Ensure data is well-formatted
    if (
      !data.name ||
      !data.email ||
      !["particpant", "partner", "admin"].includes(data.type)
    ) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Invalid arguments"
      );
    }

    // Create user in firebase auth and update firestore document
    try {
      const cid = getCid();
      await auth.createUser({
        uid: cid,
        email: data.email,
        displayName: data.name,
        emailVerified: true,
        disabled: false,
      });
      await db.users.doc(cid).set({
        name: data.name,
        type: data.type,
      });
      return cid;
    } catch (err: any) {
      let detail;
      functions.logger.error(err);
      // Throw invaid argument error if error was due to firebase error
      if (err.code === "auth/email-already-exists") {
        detail = new Error("Email already added");
      } else if (err.code == "auth/auth/uid-already-exists") {
        detail = new Error("CID already exists, please try again");
      } else {
        detail = new Error("User is not added due to unknown error");
      }
      throw new functions.https.HttpsError("invalid-argument", detail.message);
    }
  });
