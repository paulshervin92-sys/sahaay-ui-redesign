import { getFirestore } from "../config/firebase.js";
import { DEFAULT_COPING_TOOLS } from "../services/coping/defaultTools.js";

const communitySeed = [
  {
    id: "post-1",
    author: "Anonymous Sunflower",
    text: "Today I went outside for the first time in a week. Small wins matter.",
    likes: 24,
    replies: 5,
    time: "2h ago",
    liked: false,
    category: "wins",
    isModerator: false,
  },
  {
    id: "post-2",
    author: "Anonymous Cloud",
    text: "The breathing exercise actually helped me through a panic attack last night. Thank you for this app.",
    likes: 41,
    replies: 8,
    time: "4h ago",
    liked: false,
    category: "support",
    isModerator: true,
  },
  {
    id: "post-3",
    author: "Anonymous River",
    text: "Does anyone else feel like weekends are harder than weekdays? I feel more alone when everything slows down.",
    likes: 18,
    replies: 12,
    time: "6h ago",
    liked: false,
    category: "questions",
    isModerator: false,
  },
  {
    id: "post-4",
    author: "Anonymous Star",
    text: "Day 30 of journaling. I can actually see patterns in my emotions now. Growth is slow but real.",
    likes: 56,
    replies: 15,
    time: "1d ago",
    liked: false,
    category: "venting",
    isModerator: false,
  },
];

const seedCopingTools = async () => {
  const db = getFirestore();
  const batch = db.batch();
  const collection = db.collection("copingTools");

  DEFAULT_COPING_TOOLS.forEach((tool) => {
    const docRef = collection.doc(tool.id);
    batch.set(docRef, tool, { merge: true });
  });

  await batch.commit();
};

const seedCommunityPosts = async () => {
  const db = getFirestore();
  const batch = db.batch();
  const collection = db.collection("communityPosts");
  const createdAt = new Date().toISOString();

  communitySeed.forEach((post) => {
    const docRef = collection.doc(post.id);
    batch.set(
      docRef,
      {
        ...post,
        createdAt,
      },
      { merge: true },
    );
  });

  await batch.commit();
};

const run = async () => {
  await seedCopingTools();
  await seedCommunityPosts();
  const db = getFirestore();
  await db.collection("appConfig").doc("helplines").set({
    helplines: [
      { name: "AASRA", number: "9820466726" },
      { name: "Vandrevala Foundation", number: "1860-2662-345" },
    ],
  });
  console.log("Seed completed");
};

run().catch((err) => {
  console.error("Seed failed", err);
  process.exit(1);
});
