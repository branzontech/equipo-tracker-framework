import express from "express";
import authRoutes from "./routes/auth.routes.js";
const router = express.Router();

router.use("/api", authRoutes);

export default router;