import { model, Schema } from "mongoose";
import { IUser, UserModel } from "./user.interface";
import bcrypt from 'bcrypt';
import config from "../../config";
const userSchema = new Schema<IUser, UserModel>(
    {
        name: {
            type: String,
            required: [true, 'name is required']
        },
        image: {
            type: String,
            default: 'https://i.ibb.co.com/7NZkW9fV/Head.jpg'
        },
        email: {
            type: String,
            required: [true, 'email is required'],
            unique: true
        },
        password: {
            type: String,
            required: [true, 'password is required']
        },
        role: {
            type: String,
            enum: ['admin', 'customer'],
            default: 'customer'
        },
        isBlocked: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
)

userSchema.pre('save', async function (next) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const user = this; // doc
    user.password = await bcrypt.hash(
        user.password,
        Number(config.bcrypt_salt_rounds),
    );
    next();
});
userSchema.statics.isUserExistsByEmail = async function (email: string) {
    return await User.findOne({ email: email })
}
userSchema.statics.isPasswordMatched = async function (plainTextPassword: string, hashedPassword: string) {
    return await bcrypt.compare(plainTextPassword, hashedPassword)
}
export const User = model<IUser, UserModel>('User', userSchema);