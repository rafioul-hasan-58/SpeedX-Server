import { model, Schema, Document, Types } from "mongoose";
import { IProduct } from "./product.interface";

export enum BikeType {
    SCOOTER = "scooter",
    BIKE = "bike",
}

export enum ProductType {
    NEW = "new",
    USED = "used",
    REFURBISHED = "refurbished",
}

const productSchema = new Schema<IProduct>(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            index: true,
        },
        images: {
            type: [String],
            default: [],
            validate: {
                validator: (imgs: string[]) => imgs.length <= 10,
                message: "Cannot have more than 10 images",
            },
        },
        color: {
            type: String,
            required: [true, "Color is required"],
            trim: true,
        },
        brandName: {
            type: String,
            required: [true, "Brand name is required"],
            trim: true,
            index: true,
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
            min: [0, "Price cannot be negative"],
        },
        description: {
            type: String,  // store as HTML string — simplest approach
            required: [true, "Description is required"],
            maxlength: [50000, "Description too long"], // bump the limit, rich text is verbose
        },
        type: {
            type: String,
            enum: Object.values(ProductType),
            default: ProductType.NEW,
        },
        bikeType: {
            type: String,
            enum: {
                values: Object.values(BikeType),
                message: "{VALUE} is not a valid bike type",
            },
            required: [true, "Bike type is required"],
            index: true,
        },
        stocks: {
            type: Number,
            required: [true, "Stock count is required"],
            min: [0, "Stock cannot be negative"],
            default: 0,
        },
        inStock: {
            type: Boolean,
            default: true,
        },
        addedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",          
            default: null,
        },
    },
    {
        timestamps: true,        // adds createdAt & updatedAt automatically
        versionKey: false,       // removes __v field
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// ── Indexes ──────────────────────────────────────────────────────────────────
productSchema.index({ price: 1 });
productSchema.index({ brandName: 1, bikeType: 1 });  // compound for common queries
productSchema.index({ name: "text", description: "text" }); // full-text search

// ── Virtual ───────────────────────────────────────────────────────────────────
productSchema.virtual("isAvailable").get(function () {
    return this.inStock && this.stocks > 0;
});

// ── Pre-save hook ─────────────────────────────────────────────────────────────
productSchema.pre("save", function (next) {
    // keep inStock in sync with stocks automatically
    this.inStock = this.stocks > 0;
    next();
});

export const Product = model<IProduct>("Product", productSchema);