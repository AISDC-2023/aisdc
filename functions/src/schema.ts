import {Timestamp} from "firebase-admin/firestore";

export interface UserSchema {
  name: string;
  type: "admin" | "partner" | "participant";
}

export interface UserPrizeSchema {
  name: string;
  redeemed: boolean;
  timestamp: Timestamp;
}

export interface UserTransactionSchema {
  description: string;
  timestamp: Timestamp;
}

export interface UserStampSchema {
  name: string;
  received: Timestamp;
  redeemed: boolean;
}

export interface PrizeSchema {
  name: string;
  quantity: number;
  isRare: boolean;
}

export interface StampSchema {
  name: string;
  description: string;
  type: "booth" | "workshop" | "event" ;
}
