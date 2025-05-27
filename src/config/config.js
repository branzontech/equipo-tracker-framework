import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config({ path: './.env' });

// Define the environment variables
const { 
    ENV_HOST, 
    ENV_PORT, 
    ENV_ROOT, 
    ENV_PASS, 
    ENV_DB 
} = process.env;

// Define the configuration object
export const config = () => {
    return {
        host: ENV_HOST,
        port: ENV_PORT,
        root: ENV_ROOT,
        pass: ENV_PASS,
        db: ENV_DB
    }
}