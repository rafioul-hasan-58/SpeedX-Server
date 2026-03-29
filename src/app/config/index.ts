import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join((process.cwd(), '.env')) });

export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URI,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  reset_pass_ui_link: process.env.RESET_PASS_UI_LINK,
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
  google_client_id: process.env.GOOGLE_CLIENT_ID,
  sp: {
    sp_endpoint: process.env.SP_ENDPOINT,
    sp_username: process.env.SP_USERNAME,
    sp_password: process.env.SP_PASSWORD,
    sp_prefix: process.env.SP_PREFIX,
    sp_return_url: process.env.SP_RETURN_URL,
  },
  s3: {
    accessKeyId: process.env.S3_ACCESS_KEY || "DO002RGDJ947DJHJ9WDT",
    secretAccessKey:
      process.env.S3_SECRET_KEY ||
      "e5+/pko6Ojar51Hb8ojUKfq2HtXy+tnGKOfs3rIcEfo",
    region: process.env.S3_REGION || "nyc3",
    bucketName: process.env.S3_BUCKET_NAME || "smtech-space",
    endpoint: process.env.S3_ENDPOINT,
  },
  ai_api: {
    gemini_api_key: process.env.GEMINI_API_KEY,
    groq_api_key: process.env.GROQ_API_KEY,
  },
  smtp: {
    email: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASS,
    email_from: process.env.SMTP_EMAIL_FROM,
    host: process.env.SMTP_HOST,
    name: process.env.SMTP_NAME,
    port: process.env.SMTP_PORT
  },
};
