import * as functions from "firebase-functions";
import {db} from "../firebase";

export const getUser = functions
  .region("asia-southeast1")
  .https.onRequest(async (request, response) => {
    const user = await db.collection("Users").doc("abcd1234").get();
    response.send(user.data());
  });
