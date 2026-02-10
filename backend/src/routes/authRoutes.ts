import { Router } from "express";
import { login, logout, me, register } from "../controllers/authController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { loginSchema, registerSchema } from "../validators/authSchemas.js";

export const authRoutes = Router();

authRoutes.post("/register", validate(registerSchema), asyncHandler(register));
authRoutes.post("/login", validate(loginSchema), asyncHandler(login));
authRoutes.post("/logout", requireAuth, asyncHandler(logout));
authRoutes.get("/me", requireAuth, asyncHandler(me));
