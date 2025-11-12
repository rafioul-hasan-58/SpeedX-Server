import { Model } from "mongoose";


export interface IUser {
    image?: string
    name: string;
    email: string;
    password: string;
    roles: string[]
    activeRole: 'admin' | 'customer' | "seller",
    isBlocked: boolean;
    isVerified: boolean;
}

export interface UserModel extends Model<IUser> {
    // myStaticMethod(): number;
    isUserExistsByEmail(email: string): Promise<IUser>
    isPasswordMatched(plainTextPassword: string, hashedPassword: string): Promise<boolean>


}