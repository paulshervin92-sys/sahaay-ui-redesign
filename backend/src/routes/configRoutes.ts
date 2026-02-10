import { Router } from "express";
import { getHelplines } from "../controllers/configController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const configRoutes = Router();

configRoutes.get("/helplines", asyncHandler(getHelplines));
