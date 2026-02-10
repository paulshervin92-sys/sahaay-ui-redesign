import type { Response } from "express";
import type { AuthRequest } from "../middlewares/authMiddleware.js";
import { getFirestore } from "../config/firebase.js";
import { getRecommendedCopingTools, getMoodIntensity, analyzeChatSentiment } from "../services/coping/recommendationService.js";
import type { CopingTool, RecommendationContext } from "../services/coping/recommendationService.js";
import { DEFAULT_COPING_TOOLS } from "../services/coping/defaultTools.js";

const toolsCollection = () => getFirestore().collection("copingTools");
const messagesCollection = () => getFirestore().collection("chatMessages");
const checkinsCollection = () => getFirestore().collection("checkinsDaily");

export const getRecommendations = async (req: AuthRequest, res: Response) => {
  const userId = req.userId as string;
  const toolsSnap = await toolsCollection().get();
  const tools = toolsSnap.empty ? DEFAULT_COPING_TOOLS : (toolsSnap.docs.map((doc) => doc.data()) as CopingTool[]);

  const checkinsSnap = await checkinsCollection().where("userId", "==", userId).limit(1).get();
  const checkins = checkinsSnap.docs.map((doc) => doc.data());
  checkins.sort((a: any, b: any) => (a.dayKey < b.dayKey ? 1 : -1));
  const latestCheckin = checkins[0];
  const currentMood = latestCheckin?.lastMood ?? null;

  const messagesSnap = await messagesCollection().where("userId", "==", userId).limit(5).get();
  const messages = messagesSnap.docs.map((doc) => doc.data());
  messages.sort((a: any, b: any) => (a.createdAt < b.createdAt ? 1 : -1));
  const recentChatSummary = messages.map((doc: any) => doc.text).join(" ");
  const { keywords } = analyzeChatSentiment(recentChatSummary);

  const context: RecommendationContext = {
    currentMood,
    moodIntensity: getMoodIntensity(currentMood),
    recentChatSummary,
    chatKeywords: keywords,
  };

  const recommendations = getRecommendedCopingTools(tools, context);
  return res.json({ recommendations, context });
};
