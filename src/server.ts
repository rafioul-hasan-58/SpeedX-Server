import app from "./app";
import mongoose from "mongoose";
import { Server } from 'http'
import config from "./app/config";

let server: Server;

async function main() {

    try {
        await mongoose.connect(config.database_url as string);
        server = app.listen(config.port, () => {
            console.log(`Assignment Server is Running on port ${config.port}`)
        })
    }
    catch (err) {
        console.log(err);
    }
}

main()

process.on('unhandledRejection', () => {
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }
})

process.on('uncaughtException', () => {
    process.exit(1)
})