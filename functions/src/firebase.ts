import {initializeApp} from "firebase-admin/app";
import {getAuth} from "firebase-admin/auth";
import {getFirestore} from "firebase-admin/firestore";
import {getMessaging} from "firebase-admin/messaging";
import * as schema from "./schema";

const app = initializeApp(); // TODO: Ensure that this work in CI/CD
const fdb = getFirestore(app);

const converter = <T>() => ({
  toFirestore: (data: T & {[key: string]: any}) => data,
  fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) =>
    snap.data() as T,
});

const dataPoint = <T extends FirebaseFirestore.DocumentData>(
  collectionPath: string
) => fdb.collection(collectionPath).withConverter(converter<T>());

export const db: {
  users: FirebaseFirestore.CollectionReference<schema.UserSchema>;
  prizes: FirebaseFirestore.CollectionReference<schema.PrizeSchema>;
  stamps: FirebaseFirestore.CollectionReference<schema.StampSchema>;
  workshops: FirebaseFirestore.CollectionReference<schema.WorkshopSchema>;
  userPrizes: (
    cid: string
  ) => FirebaseFirestore.CollectionReference<schema.UserPrizeSchema>;
  userStamps: (
    cid: string
  ) => FirebaseFirestore.CollectionReference<schema.UserStampSchema>;
  userTransactions: (
    cid: string
  ) => FirebaseFirestore.CollectionReference<schema.UserTransactionSchema>;
} = {
  users: dataPoint<schema.UserSchema>("Users"),
  prizes: dataPoint<schema.PrizeSchema>("Prizes"),
  stamps: dataPoint<schema.StampSchema>("Stamps"),
  workshops: dataPoint<schema.WorkshopSchema>("Workshops"),
  userPrizes: (cid: string) =>
    dataPoint<schema.UserPrizeSchema>(`Users/${cid}/Prizes`),
  userStamps: (cid: string) =>
    dataPoint<schema.UserStampSchema>(`Users/${cid}/Stamps`),
  userTransactions: (cid: string) =>
    dataPoint<schema.UserTransactionSchema>(`Users/${cid}/Transactions`),
};
export const auth = getAuth(app);
export const messaging = getMessaging(app);
