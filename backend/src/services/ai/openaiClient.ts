import OpenAI from "openai";
import { env } from "../../config/env.js";

export const openaiClient = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
  organization: env.OPENAI_ORG_ID,
  project: env.OPENAI_PROJECT_ID,
});
