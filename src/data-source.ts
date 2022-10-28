import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
require('dotenv').config();

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    // synchronize: true,
    logging: false,
    entities: [User],
    migrations: [__dirname + '/src/migrations/'],
    subscribers: [],
    
})
