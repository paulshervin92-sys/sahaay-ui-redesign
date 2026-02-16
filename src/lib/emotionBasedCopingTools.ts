/**
 * Emotion-Based Interactive Coping Tools
 *
 * 5 prioritized, engaging mini-game tools for each of the 6 emotions:
 * Happy, Calm, Neutral, Sad, Anxious, Frustrated
 */

import {
  Sparkles,
  Heart,
  Palette,
  Music,
  Trophy,
  Cloud,
  Waves,
  Flower2,
  Timer,
  Target,
  Lightbulb,
  Circle,
  MessageCircle,
  Sunrise,
  Mail,
  Zap,
  Eye,
  Wind,
  Home,
  Puzzle,
  Gauge,
  Snowflake,
  TrendingUp,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Mood } from "@/types";

export interface InteractiveCopingTool {
  id: string;
  title: string;
  description: string;
  emoji: string;
  emotion: Mood;
  priority: 1 | 2 | 3 | 4 | 5; // 1 = highest priority
  durationMinutes: number;
  icon: LucideIcon;
  color: string;
  type: "interactive" | "game" | "creative" | "reflective" | "guided";
  gamification: {
    hasProgress: boolean;
    hasRewards: boolean;
    hasLevels: boolean;
  };
  instructions: string[];
  benefits: string[];
}

// ===================================
// HAPPY EMOTION TOOLS (Amplify and Maintain Joy)
// ===================================
export const HAPPY_TOOLS: InteractiveCopingTool[] = [
  {
    id: "joy-jar",
    title: "Joy Jar Collector",
    description: "Collect and save happy moments like treasures in a jar",
    emoji: ":)",
    emotion: "happy",
    priority: 1,
    durationMinutes: 3,
    icon: Sparkles,
    color: "bg-yellow-100 text-yellow-900",
    type: "interactive",
    gamification: {
      hasProgress: true,
      hasRewards: true,
      hasLevels: true,
    },
    instructions: [
      "Think of something that made you smile today",
      "Write it down (1 to 2 sentences)",
      "Watch it get added to your Joy Jar",
      "Collect 10 to unlock a streak badge",
    ],
    benefits: [
      "Amplifies positive emotions",
      "Creates a happiness archive",
      "Trains your brain to notice joy",
    ],
  },
  {
    id: "gratitude-bingo",
    title: "Gratitude Bingo",
    description: "Complete a bingo card of things you are grateful for",
    emoji: "bingo",
    emotion: "happy",
    priority: 2,
    durationMinutes: 5,
    icon: Target,
    color: "bg-pink-100 text-pink-900",
    type: "game",
    gamification: {
      hasProgress: true,
      hasRewards: true,
      hasLevels: false,
    },
    instructions: [
      "Get a 5x5 bingo card with prompts",
      "Mark off things you are grateful for",
      "Try to get 3 in a row",
      "Save your winning line",
    ],
    benefits: [
      "Makes gratitude fun",
      "Broadens perspective",
      "Boosts happiness",
    ],
  },
  {
    id: "energy-color-mixer",
    title: "Energy Color Mixer",
    description: "Mix colors that match your happy energy level",
    emoji: "color",
    emotion: "happy",
    priority: 3,
    durationMinutes: 4,
    icon: Palette,
    color: "bg-purple-100 text-purple-900",
    type: "creative",
    gamification: {
      hasProgress: false,
      hasRewards: true,
      hasLevels: false,
    },
    instructions: [
      "Pick colors that match your mood",
      "Mix and blend them together",
      "Create your unique energy palette",
      "Save it to your happiness gallery",
    ],
    benefits: [
      "Expresses emotions creatively",
      "Engages right brain",
      "Creates visual mood tracking",
    ],
  },
  {
    id: "smile-chain",
    title: "Smile Chain Challenge",
    description: "Track consecutive days of finding reasons to smile",
    emoji: ":D",
    emotion: "happy",
    priority: 4,
    durationMinutes: 2,
    icon: Trophy,
    color: "bg-orange-100 text-orange-900",
    type: "game",
    gamification: {
      hasProgress: true,
      hasRewards: true,
      hasLevels: true,
    },
    instructions: [
      "Find one reason to smile today",
      "Add it to your chain",
      "See your streak grow day by day",
      "Reach 7 days for a badge",
    ],
    benefits: [
      "Builds positive habits",
      "Gamifies daily joy",
      "Motivates consistency",
    ],
  },
  {
    id: "victory-dance",
    title: "Victory Dance Creator",
    description: "Create a personal dance to celebrate your wins",
    emoji: "dance",
    emotion: "happy",
    priority: 5,
    durationMinutes: 3,
    icon: Music,
    color: "bg-green-100 text-green-900",
    type: "interactive",
    gamification: {
      hasProgress: false,
      hasRewards: false,
      hasLevels: false,
    },
    instructions: [
      "Pick a happy song or beat",
      "Create 3 simple dance moves",
      "Do your victory dance",
      "Save it for future celebrations",
    ],
    benefits: [
      "Physical mood boost",
      "Anchors positive emotions",
      "Fun and energizing",
    ],
  },
];

// ===================================
// CALM EMOTION TOOLS (Deepen Relaxation)
// ===================================
export const CALM_TOOLS: InteractiveCopingTool[] = [
  {
    id: "breath-wave-rider",
    title: "Breath Wave Rider",
    description: "Ride visual waves that sync with your breathing rhythm",
    emoji: "wave",
    emotion: "calm",
    priority: 1,
    durationMinutes: 3,
    icon: Waves,
    color: "bg-blue-100 text-blue-900",
    type: "interactive",
    gamification: {
      hasProgress: true,
      hasRewards: false,
      hasLevels: false,
    },
    instructions: [
      "Watch the wave animation",
      "Breathe in as the wave rises (4 counts)",
      "Breathe out as the wave falls (4 counts)",
      "Complete 10 waves",
    ],
    benefits: [
      "Visual breathing guidance",
      "Deepens relaxation",
      "Calms the nervous system",
    ],
  },
  {
    id: "cloud-watching-timer",
    title: "Cloud Watching Timer",
    description: "Watch peaceful clouds drift by for timed relaxation",
    emoji: "cloud",
    emotion: "calm",
    priority: 2,
    durationMinutes: 5,
    icon: Cloud,
    color: "bg-sky-100 text-sky-900",
    type: "guided",
    gamification: {
      hasProgress: true,
      hasRewards: false,
      hasLevels: false,
    },
    instructions: [
      "Set your relaxation timer (1 to 10 minutes)",
      "Watch clouds slowly drift across the screen",
      "Let thoughts float away like clouds",
      "Build your calm time total",
    ],
    benefits: [
      "Promotes mindfulness",
      "Reduces mental clutter",
      "Gentle meditation practice",
    ],
  },
  {
    id: "zen-garden-builder",
    title: "Zen Garden Builder",
    description: "Rake patterns in a virtual zen garden for peace",
    emoji: "garden",
    emotion: "calm",
    priority: 3,
    durationMinutes: 4,
    icon: Flower2,
    color: "bg-green-100 text-green-900",
    type: "creative",
    gamification: {
      hasProgress: false,
      hasRewards: true,
      hasLevels: true,
    },
    instructions: [
      "Drag to rake patterns in sand",
      "Place rocks and plants mindfully",
      "Create your peaceful garden",
      "Unlock new elements as you build",
    ],
    benefits: [
      "Meditative activity",
      "Encourages flow state",
      "Visual calming effect",
    ],
  },
  {
    id: "meditation-streak",
    title: "Meditation Streak Tracker",
    description: "Build a daily meditation habit with visual progress",
    emoji: "streak",
    emotion: "calm",
    priority: 4,
    durationMinutes: 2,
    icon: Timer,
    color: "bg-purple-100 text-purple-900",
    type: "game",
    gamification: {
      hasProgress: true,
      hasRewards: true,
      hasLevels: true,
    },
    instructions: [
      "Set a daily meditation goal (1 to 20 minutes)",
      "Complete a session to mark the day",
      "Watch your calendar fill up",
      "Reach 21 days for a milestone",
    ],
    benefits: [
      "Builds a meditation habit",
      "Visual progress motivation",
      "Celebrates consistency",
    ],
  },
  {
    id: "sound-bath-journey",
    title: "Sound Bath Journey",
    description: "Travel through calming soundscapes with visual guides",
    emoji: "sound",
    emotion: "calm",
    priority: 5,
    durationMinutes: 6,
    icon: Music,
    color: "bg-indigo-100 text-indigo-900",
    type: "guided",
    gamification: {
      hasProgress: true,
      hasRewards: false,
      hasLevels: false,
    },
    instructions: [
      "Choose a soundscape (rain, ocean, forest)",
      "Follow the visual journey",
      "Listen with eyes closed or open",
      "Complete the journey to unlock new sounds",
    ],
    benefits: [
      "Multiple sense relaxation",
      "Stress hormone reduction",
      "Deep calming effect",
    ],
  },
];

// ===================================
// NEUTRAL EMOTION TOOLS (Exploration and Awareness)
// ===================================
export const NEUTRAL_TOOLS: InteractiveCopingTool[] = [
  {
    id: "mood-explorer-wheel",
    title: "Mood Explorer Wheel",
    description: "Spin the wheel to discover and explore different emotions",
    emoji: "wheel",
    emotion: "neutral",
    priority: 1,
    durationMinutes: 3,
    icon: Circle,
    color: "bg-gray-100 text-gray-900",
    type: "interactive",
    gamification: {
      hasProgress: false,
      hasRewards: true,
      hasLevels: false,
    },
    instructions: [
      "Spin the emotion wheel",
      "Reflect on the emotion it lands on",
      "Rate how much you feel it (0 to 10)",
      "Notice any hidden emotions",
    ],
    benefits: [
      "Increases emotional awareness",
      "Fun exploration of feelings",
      "Prevents emotional numbness",
    ],
  },
  {
    id: "daily-discoveries",
    title: "Daily Discoveries Log",
    description: "Notice and collect 3 new things each day",
    emoji: "discover",
    emotion: "neutral",
    priority: 2,
    durationMinutes: 4,
    icon: Eye,
    color: "bg-teal-100 text-teal-900",
    type: "reflective",
    gamification: {
      hasProgress: true,
      hasRewards: true,
      hasLevels: false,
    },
    instructions: [
      "Notice 3 new things today",
      "These can be sounds, sights, or thoughts",
      "Log them in your discovery journal",
      "Build awareness and curiosity",
    ],
    benefits: [
      "Cultivates curiosity",
      "Prevents autopilot mode",
      "Enhances the present moment",
    ],
  },
  {
    id: "mini-goal-setter",
    title: "Mini Goal Setter",
    description: "Set tiny achievable goals for the next hour",
    emoji: "goal",
    emotion: "neutral",
    priority: 3,
    durationMinutes: 2,
    icon: Target,
    color: "bg-amber-100 text-amber-900",
    type: "interactive",
    gamification: {
      hasProgress: true,
      hasRewards: true,
      hasLevels: true,
    },
    instructions: [
      "Pick one small goal for the next hour",
      "Make it specific and achievable",
      "Set a timer and do it",
      "Check it off and feel accomplished",
    ],
    benefits: [
      "Builds momentum",
      "Creates a sense of purpose",
      "Fights boredom productively",
    ],
  },
  {
    id: "energy-check-game",
    title: "Energy Check-In Game",
    description: "Quick interactive scan of your body's energy levels",
    emoji: "energy",
    emotion: "neutral",
    priority: 4,
    durationMinutes: 2,
    icon: Zap,
    color: "bg-yellow-100 text-yellow-900",
    type: "game",
    gamification: {
      hasProgress: true,
      hasRewards: false,
      hasLevels: false,
    },
    instructions: [
      "Tap body parts on the avatar",
      "Rate energy level for each (1 to 10)",
      "See your energy visualization",
      "Get suggestions based on results",
    ],
    benefits: [
      "Body awareness practice",
      "Identifies energy blocks",
      "Guides next action",
    ],
  },
  {
    id: "reflection-cards",
    title: "Reflection Card Deck",
    description: "Draw a random reflection prompt to explore your thoughts",
    emoji: "cards",
    emotion: "neutral",
    priority: 5,
    durationMinutes: 3,
    icon: Lightbulb,
    color: "bg-lime-100 text-lime-900",
    type: "reflective",
    gamification: {
      hasProgress: false,
      hasRewards: true,
      hasLevels: false,
    },
    instructions: [
      "Draw a card from the deck",
      "Read the reflection prompt",
      "Think or write your response",
      "Draw again or save insights",
    ],
    benefits: [
      "Stimulates self-reflection",
      "Breaks monotony",
      "Encourages journaling",
    ],
  },
];

// ===================================
// SAD EMOTION TOOLS (Comfort and Uplift)
// ===================================
export const SAD_TOOLS: InteractiveCopingTool[] = [
  {
    id: "self-compassion-messages",
    title: "Self-Compassion Message Generator",
    description: "Receive kind, personalized messages you need to hear",
    emoji: "care",
    emotion: "sad",
    priority: 1,
    durationMinutes: 2,
    icon: MessageCircle,
    color: "bg-rose-100 text-rose-900",
    type: "interactive",
    gamification: {
      hasProgress: false,
      hasRewards: false,
      hasLevels: false,
    },
    instructions: [
      "Generate a compassion message",
      "Read it slowly and let it sink in",
      "Save favorites to your library",
      "Return whenever you need kindness",
    ],
    benefits: [
      "Counters self-criticism",
      "Provides emotional comfort",
      "Builds self-compassion",
    ],
  },
  {
    id: "hope-timeline",
    title: "Hope Timeline Builder",
    description: "Visual timeline of things to look forward to",
    emoji: "hope",
    emotion: "sad",
    priority: 2,
    durationMinutes: 5,
    icon: Sunrise,
    color: "bg-orange-100 text-orange-900",
    type: "creative",
    gamification: {
      hasProgress: true,
      hasRewards: true,
      hasLevels: false,
    },
    instructions: [
      "Add small things to look forward to",
      "Place them on your timeline",
      "See them visually approaching",
      "Check them off as they happen",
    ],
    benefits: [
      "Restores hope and optimism",
      "Provides future orientation",
      "Combats hopelessness",
    ],
  },
  {
    id: "emotion-release-painter",
    title: "Emotion Release Painter",
    description: "Express and release sadness through abstract painting",
    emoji: "paint",
    emotion: "sad",
    priority: 3,
    durationMinutes: 4,
    icon: Palette,
    color: "bg-blue-100 text-blue-900",
    type: "creative",
    gamification: {
      hasProgress: false,
      hasRewards: true,
      hasLevels: false,
    },
    instructions: [
      "Pick colors that match your sadness",
      "Paint freely with no rules",
      "Watch it transform as you paint",
      "Save it or let it fade away",
    ],
    benefits: [
      "Emotional catharsis",
      "Non-verbal expression",
      "Transforms pain into art",
    ],
  },
  {
    id: "comfort-box-creator",
    title: "Comfort Box Creator",
    description: "Build a digital box of things that comfort you",
    emoji: "box",
    emotion: "sad",
    priority: 4,
    durationMinutes: 3,
    icon: Heart,
    color: "bg-pink-100 text-pink-900",
    type: "interactive",
    gamification: {
      hasProgress: true,
      hasRewards: false,
      hasLevels: false,
    },
    instructions: [
      "Add comforting items to your box",
      "Photos, quotes, songs, memories",
      "Organize them however you like",
      "Open your box when you need comfort",
    ],
    benefits: [
      "Creates an emotional first-aid kit",
      "Easy access to comfort",
      "Prepares for tough moments",
    ],
  },
  {
    id: "future-self-letter",
    title: "Future Self Letter",
    description: "Write a letter to your future self when you feel better",
    emoji: "letter",
    emotion: "sad",
    priority: 5,
    durationMinutes: 6,
    icon: Mail,
    color: "bg-purple-100 text-purple-900",
    type: "reflective",
    gamification: {
      hasProgress: false,
      hasRewards: true,
      hasLevels: false,
    },
    instructions: [
      "Write to yourself one week from now",
      "Describe what you hope will be different",
      "Write what you want to remember",
      "Schedule delivery and receive it later",
    ],
    benefits: [
      "Creates hope for change",
      "Builds temporal perspective",
      "Reminds you that feelings pass",
    ],
  },
];

// ===================================
// ANXIOUS EMOTION TOOLS (Reduce Anxiety)
// ===================================
export const ANXIOUS_TOOLS: InteractiveCopingTool[] = [
  {
    id: "worry-time-box",
    title: "Worry Time Box",
    description: "Schedule your worries for later so you can focus now",
    emoji: "time",
    emotion: "anxious",
    priority: 1,
    durationMinutes: 2,
    icon: Timer,
    color: "bg-amber-100 text-amber-900",
    type: "interactive",
    gamification: {
      hasProgress: true,
      hasRewards: false,
      hasLevels: false,
    },
    instructions: [
      "Write down your current worry",
      "Set time to worry about it later (for example, 6pm)",
      "Box stores it until then",
      "Revisit later (often anxiety fades)",
    ],
    benefits: [
      "Postpones rumination",
      "Creates mental space",
      "CBT-proven technique",
    ],
  },
  {
    id: "anxiety-thermometer",
    title: "Anxiety Thermometer",
    description: "Track and lower your anxiety level in real time",
    emoji: "meter",
    emotion: "anxious",
    priority: 2,
    durationMinutes: 3,
    icon: Gauge,
    color: "bg-red-100 text-red-900",
    type: "game",
    gamification: {
      hasProgress: true,
      hasRewards: true,
      hasLevels: false,
    },
    instructions: [
      "Rate anxiety level (0 to 10) on the meter",
      "Choose a calming technique",
      "Do it for 2 minutes",
      "Re-rate and see the drop",
    ],
    benefits: [
      "Quantifies anxiety",
      "Shows techniques work",
      "Builds a sense of mastery",
    ],
  },
  {
    id: "grounding-54321-game",
    title: "5-4-3-2-1 Grounding Game",
    description: "Interactive game to ground yourself using 5 senses",
    emoji: "senses",
    emotion: "anxious",
    priority: 3,
    durationMinutes: 4,
    icon: Eye,
    color: "bg-green-100 text-green-900",
    type: "game",
    gamification: {
      hasProgress: true,
      hasRewards: true,
      hasLevels: false,
    },
    instructions: [
      "Find 5 things you can see",
      "Find 4 things you can touch",
      "Find 3 things you can hear",
      "Find 2 things you can smell",
      "Find 1 thing you can taste",
    ],
    benefits: [
      "Interrupts panic",
      "Anchors to the present",
      "DBT grounding skill",
    ],
  },
  {
    id: "thought-bubble-pop",
    title: "Anxious Thought Bubble Pop",
    description: "Pop floating anxious thoughts like bubbles to release them",
    emoji: "bubbles",
    emotion: "anxious",
    priority: 4,
    durationMinutes: 3,
    icon: Wind,
    color: "bg-blue-100 text-blue-900",
    type: "game",
    gamification: {
      hasProgress: true,
      hasRewards: true,
      hasLevels: true,
    },
    instructions: [
      "Anxious thoughts float up as bubbles",
      "Tap to pop each thought",
      "Watch them disappear",
      "Clear all bubbles to win calm",
    ],
    benefits: [
      "Cognitive defusion",
      "Visualizes letting go",
      "Fun distraction technique",
    ],
  },
  {
    id: "safe-place-visualizer",
    title: "Safe Place Visualizer",
    description: "Create and visit your personalized safe mental space",
    emoji: "safe",
    emotion: "anxious",
    priority: 5,
    durationMinutes: 5,
    icon: Home,
    color: "bg-teal-100 text-teal-900",
    type: "guided",
    gamification: {
      hasProgress: false,
      hasRewards: false,
      hasLevels: false,
    },
    instructions: [
      "Design your safe place (beach, forest, room)",
      "Add soothing elements",
      "Take a virtual visit with guided audio",
      "Return whenever anxiety spikes",
    ],
    benefits: [
      "Trauma-informed practice",
      "Portable calm anchor",
      "Reduces physiological anxiety",
    ],
  },
];

// ===================================
// FRUSTRATED EMOTION TOOLS (Release Tension)
// ===================================
export const FRUSTRATED_TOOLS: InteractiveCopingTool[] = [
  {
    id: "anger-release-scribble",
    title: "Anger Release Scribble",
    description: "Scribble intensely to release frustration physically",
    emoji: "scribble",
    emotion: "frustrated",
    priority: 1,
    durationMinutes: 2,
    icon: Palette,
    color: "bg-red-100 text-red-900",
    type: "creative",
    gamification: {
      hasProgress: true,
      hasRewards: false,
      hasLevels: false,
    },
    instructions: [
      "Scribble as hard as you want on the screen",
      "Use dark angry colors",
      "Go fast and chaotic",
      "When done, watch it fade away",
    ],
    benefits: [
      "Physical release of tension",
      "Safe anger expression",
      "Cathartic experience",
    ],
  },
  {
    id: "problem-solver-wizard",
    title: "Problem Solver Wizard",
    description: "Turn frustration into action with step-by-step problem solving",
    emoji: "solve",
    emotion: "frustrated",
    priority: 2,
    durationMinutes: 5,
    icon: Puzzle,
    color: "bg-purple-100 text-purple-900",
    type: "interactive",
    gamification: {
      hasProgress: true,
      hasRewards: true,
      hasLevels: false,
    },
    instructions: [
      "Name the problem frustrating you",
      "Wizard guides you through solutions",
      "Brainstorm 3 possible actions",
      "Pick one and create an action plan",
    ],
    benefits: [
      "Transforms frustration to action",
      "Problem-solving practice",
      "Restores a sense of control",
    ],
  },
  {
    id: "tension-tracker",
    title: "Tension Tracker and Release",
    description: "Identify where you hold tension and release it",
    emoji: "release",
    emotion: "frustrated",
    priority: 3,
    durationMinutes: 4,
    icon: Zap,
    color: "bg-orange-100 text-orange-900",
    type: "guided",
    gamification: {
      hasProgress: true,
      hasRewards: false,
      hasLevels: false,
    },
    instructions: [
      "Tap body parts where you feel tense",
      "They light up on the avatar",
      "Guided tension release for each area",
      "Watch tension melt away visually",
    ],
    benefits: [
      "Body-mind connection",
      "Progressive muscle relaxation",
      "Somatic therapy technique",
    ],
  },
  {
    id: "ice-cube-challenge",
    title: "Ice Cube Challenge",
    description: "Hold virtual ice cube to interrupt anger with sensation",
    emoji: "ice",
    emotion: "frustrated",
    priority: 4,
    durationMinutes: 2,
    icon: Snowflake,
    color: "bg-cyan-100 text-cyan-900",
    type: "game",
    gamification: {
      hasProgress: true,
      hasRewards: true,
      hasLevels: false,
    },
    instructions: [
      "Press and hold the ice cube button",
      "Focus on the cold sensation",
      "Hold for 60 seconds",
      "Notice frustration decrease",
    ],
    benefits: [
      "Interrupts anger cycle",
      "DBT distress tolerance",
      "Intense sensation grounding",
    ],
  },
  {
    id: "perspective-shifter",
    title: "Perspective Shifter Game",
    description: "View your frustration from different helpful angles",
    emoji: "shift",
    emotion: "frustrated",
    priority: 5,
    durationMinutes: 3,
    icon: TrendingUp,
    color: "bg-indigo-100 text-indigo-900",
    type: "reflective",
    gamification: {
      hasProgress: false,
      hasRewards: true,
      hasLevels: false,
    },
    instructions: [
      "Describe your frustrating situation",
      "Spin the wheel to get a new perspective",
      "View it from a different angle",
      "Pick the most helpful perspective",
    ],
    benefits: [
      "Cognitive flexibility",
      "Reduces emotional intensity",
      "Builds wisdom",
    ],
  },
];

// ===================================
// MASTER TOOLS COLLECTION
// ===================================
export const ALL_EMOTION_TOOLS: InteractiveCopingTool[] = [
  ...HAPPY_TOOLS,
  ...CALM_TOOLS,
  ...NEUTRAL_TOOLS,
  ...SAD_TOOLS,
  ...ANXIOUS_TOOLS,
  ...FRUSTRATED_TOOLS,
];

// ===================================
// HELPER FUNCTIONS
// ===================================

/**
 * Get tools for a specific emotion, sorted by priority
 */
export const getToolsForEmotion = (emotion: Mood): InteractiveCopingTool[] => {
  return ALL_EMOTION_TOOLS
    .filter((tool) => tool.emotion === emotion)
    .sort((a, b) => a.priority - b.priority);
};

/**
 * Get top priority tool for an emotion
 */
export const getTopToolForEmotion = (emotion: Mood): InteractiveCopingTool | undefined => {
  return getToolsForEmotion(emotion)[0];
};

/**
 * Get random tool for emotion
 */
export const getRandomToolForEmotion = (emotion: Mood): InteractiveCopingTool | undefined => {
  const tools = getToolsForEmotion(emotion);
  return tools[Math.floor(Math.random() * tools.length)];
};

/**
 * Search tools by keyword
 */
export const searchTools = (keyword: string): InteractiveCopingTool[] => {
  const lower = keyword.toLowerCase();
  return ALL_EMOTION_TOOLS.filter(
    (tool) =>
      tool.title.toLowerCase().includes(lower) ||
      tool.description.toLowerCase().includes(lower) ||
      tool.benefits.some((b) => b.toLowerCase().includes(lower)),
  );
};

export const ALL_TOOLS: InteractiveCopingTool[] = [
  ...HAPPY_TOOLS,
  ...CALM_TOOLS,
  ...NEUTRAL_TOOLS,
  ...SAD_TOOLS,
  ...ANXIOUS_TOOLS,
  ...FRUSTRATED_TOOLS,
];
