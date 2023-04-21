import * as functions from "firebase-functions";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = functions
  .region("asia-southeast1")
  .https.onRequest((request, response) => {
    functions.logger.info("Hello logs!", {structuredData: true});
    response.send("Hello from Firebase!");
  });

export * as user from "./modules/user";
export * as stamp from "./modules/stamp";
