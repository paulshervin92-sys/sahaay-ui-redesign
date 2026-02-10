import { Router } from "express";
import { listPosts, createPost, reportPost, likePost } from "../controllers/communityController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createPostSchema, reportPostSchema, likePostSchema } from "../validators/communitySchemas.js";

export const communityRoutes = Router();

communityRoutes.get("/", requireAuth, asyncHandler(listPosts));
communityRoutes.post("/", requireAuth, validate(createPostSchema), asyncHandler(createPost));
communityRoutes.post("/report", requireAuth, validate(reportPostSchema), asyncHandler(reportPost));
communityRoutes.post("/like", requireAuth, validate(likePostSchema), asyncHandler(likePost));
