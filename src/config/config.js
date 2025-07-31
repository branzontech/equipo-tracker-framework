import dotenv from 'dotenv';

// Load environment variables from .env file
const envFile = process.env.NODE_ENV === 'qa' ? './.env.qa' : './.env';
dotenv.config({ path: envFile });

// Define the environment variables
const { 
    ENV_HOST, 
    ENV_PORT, 
    ENV_ROOT, 
    ENV_PASS, 
    ENV_DB,
    ALLOWED_ORIGINS, 
} = process.env;

// Define the configuration object
export const config = () => {
    return {
        host: ENV_HOST,
        port: ENV_PORT,
        root: ENV_ROOT,
        pass: ENV_PASS,
        db: ENV_DB,
        allowedOrigins: ALLOWED_ORIGINS ? ALLOWED_ORIGINS.split(',') : [],
    }
}