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
 * @param {string?} data.cid - User's conference id. If not provided, the
 * function will return the information of the user calling the function.
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
    let cid: string;
    if (!(context.auth.token?.type != "admin")) {
      // If user is not admin, get cid from token
      // (i.e. user retrieve its own data)
      cid = context.auth.uid;
    } else {
      // If user is admin, get cid from data if available
      // Else, get admin's own cid
      cid = data.cid ?? context.auth.uid;
    }
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
 * Get list of users from firebase authentication to be shown on admin portal
 *
 * @remarks
 * This function is only callable when a user is authenticated, is type admin,
 * and called using Cloud Function SDk.
 * @param {Object} data - Empty object
 *
 * @returns The user information.
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
    // Ensure function caller is an admin
    if (!(context.auth.token?.type != "admin")) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "Not enough permissions to create user"
      );
    }

    try {
      const userList = await auth.listUsers(1000);
      return {
        users: userList.users.map((userRecord) => {
          return {
            cid: userRecord.uid,
            name: userRecord.displayName,
            email: userRecord.email,
            type: userRecord.customClaims?.type,
          };
        }),
      };
    } catch (err) {
      // Throw exception if unknown error
      throw new functions.https.HttpsError(
        "unknown",
        "Unknown error occurred while listing users."
      );
    }
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
 * @returns {string} cid - New conference id of user.
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
        "Not enough permissions to create user"
      );
    }
    // Ensure data is well-formatted
    const {name, email, type} = data;
    if (!name || !email || !["particpant", "partner", "admin"].includes(type)) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Invalid arguments"
      );
    }

    // Create user in firebase auth and update firestore document
    try {
      const cid = getCid();
      // Create new user in firebase auth
      await auth.createUser({
        uid: cid,
        email: email,
        displayName: name,
        emailVerified: true,
        disabled: false,
      });
      // Set user type into firebase auth claim
      await auth.setCustomUserClaims(cid, {type});
      // Create new firestore document
      await db.users.doc(cid).set({
        name: name,
        type: type,
        stampCount: 0,
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

/**
 * Delete a user from the database.
 *
 * @remarks
 * This function is only callable when a user is authenticated, is type admin,
 * and called using Cloud Function SDk.
 *
 * @param {Object} data - Consist of user's cid, email and type.
 * @param {string} data.cid - Conference id of user
 */
export const deleteUser = functions
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
        "Not enough permissions to create user"
      );
    }
    // Ensure data is well-formatted
    const {cid} = data;
    if (!cid) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Invalid arguments"
      );
    }

    // Delete user from firebase auth and delete firestore document
    try {
      await auth.deleteUser(cid);
      await db.users.doc(cid).delete();
    } catch (err: any) {
      functions.logger.error(err);
      if (err.code == "auth/user-not-found") {
        throw new functions.https.HttpsError("not-found", "User not found");
      }

      throw new functions.https.HttpsError(
        "unknown",
        "User is not added due to unknown error"
      );
    }
  });
