"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = exports.getImageUrl = void 0;
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const config_1 = __importDefault(require("../../config"));
const s3_1 = require("./s3");
const s3Storage = (0, multer_s3_1.default)({
    s3: s3_1.s3Client,
    bucket: config_1.default.s3.bucketName || "", // Replace with your bucket name
    acl: "public-read", // Ensure files are publicly accessible
    contentType: multer_s3_1.default.AUTO_CONTENT_TYPE, // Automatically detect content type
    key: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName); // File name in Spaces
    },
});
// Upload image configurations
const upload = (0, multer_1.default)({
    storage: s3Storage,
});
const getImageUrl = (file) => __awaiter(void 0, void 0, void 0, function* () {
    let image = file === null || file === void 0 ? void 0 : file.location;
    if (!image || !image.startsWith("http")) {
        image = `https://mamamoko.s3.us-east-2.amazonaws.com/${file === null || file === void 0 ? void 0 : file.key}`;
    }
    return image;
});
exports.getImageUrl = getImageUrl;
const uploadProfileImage = upload.single("profileImage");
const uploadProductImage = upload.fields([
    { name: "images", maxCount: 5 }
]);
const uploadDocuments = upload.fields([
    { name: "documents", maxCount: 5 }
]);
exports.uploadFile = {
    uploadProductImage,
    uploadProfileImage,
};
