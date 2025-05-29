import express from "express";
import authRoutes from "./routes/auth.routes.js";
import sedesRoutes from "./routes/sedes.routes.js";
const router = express.Router();

router.use("/api", authRoutes);
router.use("/api", sedesRoutes);

export default router;