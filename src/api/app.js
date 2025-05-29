import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { config } from '../config/config.js';
import routerApi from '../router/router.js';

dotenv.config();
const app = express();

// Configuración de CORS
app.use(cors({
  origin: (origin, callback) => {
    const allowedOriginsPattern = /^http:\/\/localhost:(8080|5173|5176|5174|3001)$/;
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
routerApi(app);

const port = config().port || 3003;

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server listening on port ${port}`);
});
