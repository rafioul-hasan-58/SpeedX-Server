

export interface IUser {
    name: string;
    email:string;
    password: string;
    address: string;
    contactNo: number;
    role: 'admin' | 'user'
    image: string,
    isBlocked: boolean;
}