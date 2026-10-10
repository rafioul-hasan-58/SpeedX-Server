import mongoose from "mongoose";
import dns from "dns";
import config from "../config";
import { Product, BikeType, ProductType } from "../modules/Products/product.model";
import { User } from "../modules/Users/user.model";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

export const sampleProducts = [
    {
        name: "Yamaha R15 V4",
        brandName: "Yamaha",
        bikeType: BikeType.BIKE,
        type: ProductType.NEW,
        price: 550000,
        color: "Racing Blue",
        stocks: 6,
        inStock: true,
        images: [
            "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&auto=format&fit=crop"
        ],
        description: "<p>The Yamaha R15 V4 is powered by a 155cc liquid-cooled, 4-stroke, SOHC, 4-valve fuel-injected engine with Variable Valve Actuation (VVA). Features inverted front forks, Assist & Slipper clutch, and dual-channel ABS.</p>"
    },
    {
        name: "Yamaha MT-15 V2",
        brandName: "Yamaha",
        bikeType: BikeType.BIKE,
        type: ProductType.NEW,
        price: 430000,
        color: "Metallic Black",
        stocks: 8,
        inStock: true,
        images: [
            "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&auto=format&fit=crop"
        ],
        description: "<p>The Yamaha MT-15 V2 is a hyper-naked sport bike featuring the iconic MT styling, bi-functional LED headlight, Deltabox frame, and an ultra-agile 155cc VVA engine delivering explosive torque.</p>"
    },
    {
        name: "Honda CBR 150R",
        brandName: "Honda",
        bikeType: BikeType.BIKE,
        type: ProductType.NEW,
        price: 560000,
        color: "Grand Prix Red",
        stocks: 4,
        inStock: true,
        images: [
            "https://images.unsplash.com/photo-1571127236794-81c0bbfe1ce3?w=800&auto=format&fit=crop"
        ],
        description: "<p>Honda CBR 150R offers racing DNA with inverted front suspension, Assist/Slipper clutch, full digital speedometer, and aggressive aerodynamic fairing powered by a DOHC 150cc engine.</p>"
    },
    {
        name: "Honda Activa 6G",
        brandName: "Honda",
        bikeType: BikeType.SCOOTER,
        type: ProductType.NEW,
        price: 160000,
        color: "Pearl Siren Blue",
        stocks: 10,
        inStock: true,
        images: [
            "https://images.unsplash.com/photo-1621252179027-94459d278660?w=800&auto=format&fit=crop"
        ],
        description: "<p>Honda Activa 6G features an enhanced Smart Power (eSP) technology engine, telescopic suspension, external fuel lid, and silent start with ACG for ultimate daily city commuting convenience.</p>"
    },
    {
        name: "Suzuki Gixxer SF Fi Disc",
        brandName: "Suzuki",
        bikeType: BikeType.BIKE,
        type: ProductType.NEW,
        price: 340000,
        color: "Metallic Triton Blue",
        stocks: 7,
        inStock: true,
        images: [
            "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800&auto=format&fit=crop"
        ],
        description: "<p>Suzuki Gixxer SF 155cc features aerodynamic sports fairing, clip-on handlebars, LED headlamp and tail lamp, and Suzuki Eco Performance (SEP) fuel-injected engine.</p>"
    },
    {
        name: "Suzuki Access 125",
        brandName: "Suzuki",
        bikeType: BikeType.SCOOTER,
        type: ProductType.NEW,
        price: 195000,
        color: "Matte Platinum Grey",
        stocks: 5,
        inStock: true,
        images: [
            "https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?w=800&auto=format&fit=crop"
        ],
        description: "<p>Suzuki Access 125 blends classic vintage retro design with modern Bluetooth-enabled digital console, LED headlamp, comfortable long seat, and superior fuel economy.</p>"
    },
    {
        name: "TVS Apache RTR 160 4V",
        brandName: "TVS",
        bikeType: BikeType.BIKE,
        type: ProductType.NEW,
        price: 270000,
        color: "Knight Black",
        stocks: 12,
        inStock: true,
        images: [
            "https://images.unsplash.com/photo-1558980664-769d59546b3d?w=800&auto=format&fit=crop"
        ],
        description: "<p>TVS Apache RTR 160 4V comes with race-tuned Fuel Injection (RT-Fi), 3 riding modes (Urban, Rain, Sport), Glide Through Technology (GTT), and aggressive racing styling.</p>"
    },
    {
        name: "TVS Ntorq 125 Race Edition",
        brandName: "TVS",
        bikeType: BikeType.SCOOTER,
        type: ProductType.NEW,
        price: 205000,
        color: "Yellow & Black",
        stocks: 6,
        inStock: true,
        images: [
            "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&auto=format&fit=crop"
        ],
        description: "<p>TVS Ntorq 125 Race Edition is Bangladesh's favourite sporty scooter with SmartXonnect Bluetooth connectivity, signature LED headlamp, hazard switch, and stealth aircraft-inspired design.</p>"
    },
    {
        name: "Royal Enfield Hunter 350",
        brandName: "Royal Enfield",
        bikeType: BikeType.BIKE,
        type: ProductType.NEW,
        price: 450000,
        color: "Dapper Ash",
        stocks: 3,
        inStock: true,
        images: [
            "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&auto=format&fit=crop"
        ],
        description: "<p>Royal Enfield Hunter 350 is built on the proven 349cc J-series platform with a compact geometry, alloy wheels, tubeless tires, and punchy urban handling.</p>"
    },
    {
        name: "Vespa Elegante 150",
        brandName: "Vespa",
        bikeType: BikeType.SCOOTER,
        type: ProductType.NEW,
        price: 285000,
        color: "Beige Seducente",
        stocks: 4,
        inStock: true,
        images: [
            "https://images.unsplash.com/photo-1621252179027-94459d278660?w=800&auto=format&fit=crop"
        ],
        description: "<p>Vespa Elegante 150 is the pinnacle of Italian scooter elegance, featuring split leather seats, chrome accents, front disc brake with ABS, and an Italian monocoque full steel body.</p>"
    }
];

export const seedProducts = async () => {
    try {
        const adminUser = await User.findOne({ email: "admin@gmail.com" });
        const adminId = adminUser?._id || null;

        let createdCount = 0;
        let existingCount = 0;

        for (const item of sampleProducts) {
            const exists = await Product.findOne({ name: item.name });
            if (!exists) {
                await Product.create({
                    ...item,
                    addedBy: adminId,
                });
                createdCount++;
            } else {
                existingCount++;
            }
        }

        console.log(`✅ Seeded ${createdCount} new products (${existingCount} already existed).`);
    } catch (error) {
        console.error("❌ Error seeding products:", error);
    }
};

const runStandalone = async () => {
    try {
        await mongoose.connect(config.database_url as string);
        await seedProducts();
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
