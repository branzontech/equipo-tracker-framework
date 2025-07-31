import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { config } from "../config/config.js";
import routerApi from "../router/router.js";
import { corsOptions } from "../middlewares/cors.js";

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use(express.static(path.join(__dirname, "../../dist")));

routerApi(app);

app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../../dist/index.html"));
});

const port = config().port || 3003;

app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Server listening on port ${port}`);
});