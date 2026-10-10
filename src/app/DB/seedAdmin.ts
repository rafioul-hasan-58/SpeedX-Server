import mongoose from "mongoose";
import dns from "dns";
import config from "../config";
import { User } from "../modules/Users/user.model";
import { UserRole } from "../modules/Users/user.constant";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

export const seedAdmin = async () => {
    try {
        const adminEmail = "admin@gmail.com";
        const isSuperAdminExists = await User.findOne({ email: adminEmail });

        if (!isSuperAdminExists) {
            await User.create({
                fullName: "SpeedX Admin",
                email: adminEmail,
                password: "88888888",
                roles: [UserRole.ADMIN, UserRole.CUSTOMER, UserRole.SELLER],
                activeRole: UserRole.ADMIN,
                isVerified: true,
                isBlocked: false,
            });
            console.log("✅ Admin seeded successfully: admin@gmail.com");
        } else {
            console.log("ℹ️ Admin already exists: admin@gmail.com");
        }
    } catch (error) {
        console.error("❌ Error seeding admin:", error);
    }
};

const runStandalone = async () => {
    try {
        await mongoose.connect(config.database_url as string);
        await seedAdmin();
        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error("❌ Failed to connect to DB:", error);
        process.exit(1);
    }
};

if (require.main === module) {
    runStandalone();
}
