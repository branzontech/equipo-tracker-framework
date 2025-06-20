import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { config } from "../config/config.js";
import routerApi from "../router/router.js";
import { corsOptions } from "../middlewares/cors.js";

dotenv.config();
const app = express();
app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
routerApi(app);

const port = config().port || 3003;

app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Server listening on port ${port}`);
});
