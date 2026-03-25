import { Types } from "mongoose";


export interface IStore {
  owner: Types.ObjectId;        // User reference
  storeName: string;
  description?: string;
  logo?: string;
  banner?: string;
  isActive: boolean;
  isVerified: boolean;
  address?: string;
  phone?: string;
  createdAt?: Date;
  updatedAt?: Date;
}