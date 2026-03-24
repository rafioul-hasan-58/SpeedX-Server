import { S3Client } from "@aws-sdk/client-s3";
import config from "../../config";

export const s3Client = new S3Client({
    region: config.s3.region,
    // endpoint: config.S3.endpoint, //by default aws
    credentials: {
        accessKeyId: config.s3.accessKeyId as string,
        secretAccessKey: config.s3.secretAccessKey as string,
    },
});