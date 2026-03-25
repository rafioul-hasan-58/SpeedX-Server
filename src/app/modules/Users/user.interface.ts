import { Model } from "mongoose";


export interface IUser {
    fullName: string;
    email: string;
    password: string;
    profileImage?: string
    roles: string[]
    activeRole: "CUSTOMER" | "SELLER" | "ADMIN",
    isBlocked: boolean;
    location?: string;
    bio?: string;
    isVerified: boolean;
}

export interface UserModel extends Model<IUser> {
    // myStaticMethod(): number;
    isUserExistsByEmail(email: string): Promise<IUser>
    isPasswordMatched(plainTextPassword: string, hashedPassword: string): Promise<boolean>


}