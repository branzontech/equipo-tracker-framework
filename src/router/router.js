import express from "express";
import authRoutes from "./routes/auth.routes.js";
import sedesRoutes from "./routes/sedes.routes.js";

const routerApi = (app) => {
  const router = express.Router();
  app.use("/api", router);

  router.use("/auth", authRoutes);
  router.use("/sedes", sedesRoutes);
};

export default routerApi;
