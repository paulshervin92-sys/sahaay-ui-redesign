import type { Response } from "express";
import type { AuthRequest } from "../middlewares/authMiddleware.js";
import { getFirestore } from "../config/firebase.js";

const fallbackHelplines = [
  { name: "AASRA", number: "9820466726" },
  { name: "Vandrevala Foundation", number: "1860-2662-345" },
];

export const getHelplines = async (_req: AuthRequest, res: Response) => {
  const doc = await getFirestore().collection("appConfig").doc("helplines").get();
  const data = doc.data() as { helplines?: Array<{ name: string; number: string }> } | undefined;
  return res.json({ helplines: data?.helplines?.length ? data.helplines : fallbackHelplines });
};
