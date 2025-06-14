
export interface IProduct {
    name: string;
    color: string;
    brandName: string;
    price: number;
    description: string;
    bikeType: 'scooter' | 'bike';
    type: 'new' | 'used';
    model: string;
    stocks: number;
    images: string[];
    instock?: boolean;
    addedBy: string;
}