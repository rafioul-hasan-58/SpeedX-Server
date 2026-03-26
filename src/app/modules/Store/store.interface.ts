import { Types } from "mongoose";


export interface IStore {
  owner: Types.ObjectId;        // User reference
  storeName: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  isActive: boolean;
  isVerified: boolean;
  address?: string;
  phone?: string;
  createdAt?: Date;
  updatedAt?: Date;
}