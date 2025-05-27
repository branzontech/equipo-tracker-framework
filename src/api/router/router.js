import { pool } from "../app.js";
import express from "express";
import authRoutes from "./routes/auth.routes.js";
const router = express.Router();

// router.get("/api/usuarios", async (req, res) => {
//   try {
//     const result = await pool.query("SELECT * FROM usuarios");
//     res.json(result.rows);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error al obtener datos");
//   }
// });

// router.get("/api/usuarios/:id", async (req, res) => {
//   const { id } = req.params;

//   try {
//     const result = await pool.query("SELECT * FROM usuarios WHERE id_usuario = $1", [id]);
//     res.json(result.rows[0]);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error al obtener datos");
//   }
// });

// Importing auth routes
router.use("/api", authRoutes);

export default router;