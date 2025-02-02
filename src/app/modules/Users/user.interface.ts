import { Model } from "mongoose";


export interface IUser {
    name: string;
    email:string;
    password: string;
    role: 'admin' | 'customer'
    isBlocked: boolean;
}

export interface UserModel extends Model<IUser> {
    // myStaticMethod(): number;
    isUserExistsByEmail(email: string): Promise<IUser>
    isPasswordMatched(plainTextPassword: string, hashedPassword: string): Promise<boolean>
   
    
}