
//necito cargar estas variables del .env
import dotenv from 'dotenv';
dotenv.config();

export const TOKEN_SECRET: string = process.env.TOKEN_SECRET || "asjknbfdklsgadlkjs" ;

export const SERVER_URL: string = process.env.SERVER_URL || "http://localhost:4000" ;

export const FASTAPI_URL: string = process.env.FASTAPI_URL || "http://localhost:8000" ;

export const BOT_ID: number = Number(process.env.BOT_ID || "637826498");

export const HASH_SECRET: string = process.env.HASH_SECRET || "vjbnaklsjdb;kjasbdlkj";
