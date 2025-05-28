import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { config } from '../config/config.js';
import router from '../router/router.js';
import pkg from 'pg';

const { Pool } = pkg;

dotenv.config();

const app = express();

app.use(cors({
  origin: (origin, callback) => {
    const allowedOriginsPattern = /^http:\/\/localhost:(5173|5176|5174|3001)$/;
    const allowedIpPattern = /^http:\/\/192\.168\.1\.4:(8080|5173|5176|5174|3306|3002)$/;

    if (allowedOriginsPattern.test(origin) || allowedIpPattern.test(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(express.json());
app.use(router);

const port = config().port || 3003;

export const pool = new Pool({
  host: config().host,
  user: config().root,
  password: config().pass,
  database: config().db,
  port: 5432,
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on port ${port}`);
});