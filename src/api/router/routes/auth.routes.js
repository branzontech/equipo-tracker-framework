import { Router } from "express";
import login from "../../../pages/auth/controllers/auth.controller.js";
const router = Router();

// Importing login route
// POST route for user login
router.post("/login", login);

export default router;     
