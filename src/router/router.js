import express from "express";
import authRoutes from "./routes/auth.routes.js";
import sedesRoutes from "./routes/sedes.routes.js";
import userRoutes from "./routes/user.routes.js";
import sucuRoutes from "./routes/sucursal.routes.js";
import marcasRoutes from "./routes/marcas.routes.js";
import categoriaRoutes from "./routes/categoria.routes.js";
import equipoRoutes from "./routes/equipo.routes.js";
import perifericoRoutes from "./routes/periferico.routes.js";
import impresoraRoutes from "./routes/impresora.routes.js";
import tonerRoutes from "./routes/toner.routes.js";
import tonerImpresoraRoutes from "./routes/toner-impresora.routes.js";

const routerApi = (app) => {
  const router = express.Router();
  app.use("/api", router);

  router.use("/auth", authRoutes);
  router.use("/sedes", sedesRoutes);
  router.use("/users", userRoutes);
  router.use("/sucursales", sucuRoutes);
  router.use("/marcas", marcasRoutes);
  router.use("/categorias", categoriaRoutes);
  router.use("/equipos", equipoRoutes);
  router.use("/perifericos", perifericoRoutes);
  router.use("/impresoras", impresoraRoutes);
  router.use("/toners", tonerRoutes);
  router.use("/toner-impresora", tonerImpresoraRoutes);
};

export default routerApi;
