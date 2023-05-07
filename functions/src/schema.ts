import {Timestamp} from "firebase-admin/firestore";

export interface UserSchema {
  name: string;
  type: "admin" | "partner" | "participant";
  stampCount: number
}

export interface UserPrizeSchema {
  pid: string;
  name: string;
  redeemed: boolean;
  timestamp: Timestamp;
}

export interface UserTransactionSchema {
  description: string;
  type: "prize" | "stamp";
  timestamp: Timestamp;
}

export interface UserStampSchema {
  name: string;
  received: Timestamp;
}

export interface PrizeSchema {
  name: string;
  quantity: number;
  isRare: boolean;
}

export interface WorkshopSchema {
  name: string;
  venue: string;
  time: string;
  description: string;
  registeredUserIds: string[];
}

export interface StampSchema {
  name: string;
  description: string;
  type: "booth" | "workshop" | "event" ;
}

export enum StampTypeCount {
  booth = 1,
  event = 2,
  workshop = 5,
}
