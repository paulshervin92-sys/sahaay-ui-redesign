import { Router } from "express";
import { getProfile, getSettings, updateProfile, updateSettings, exportUserData, deleteUserData } from "../controllers/userController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { updateProfileSchema, updateSettingsSchema } from "../validators/userSchemas.js";

export const userRoutes = Router();

userRoutes.get("/profile", requireAuth, asyncHandler(getProfile));
userRoutes.put("/profile", requireAuth, validate(updateProfileSchema), asyncHandler(updateProfile));
userRoutes.get("/settings", requireAuth, asyncHandler(getSettings));
userRoutes.put("/settings", requireAuth, validate(updateSettingsSchema), asyncHandler(updateSettings));
userRoutes.get("/export", requireAuth, asyncHandler(exportUserData));
userRoutes.delete("/", requireAuth, asyncHandler(deleteUserData));
