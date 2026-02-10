import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Shield, Flag, LifeBuoy, BadgeCheck } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/contexts/UserContext";
import { addReport } from "@/lib/localStore";
import { useToast } from "@/hooks/use-toast";

interface Post {
  id: number;
  author: string;
  text: string;
  likes: number;
  replies: number;
  time: string;
  liked: boolean;
  category: "support" | "wins" | "questions" | "venting" | "suggestions";
  isModerator?: boolean;
}

const initialPosts: Post[] = [
  {
    id: 1,
    author: "Anonymous Sunflower 🌻",
    text: "Today I went outside for the first time in a week. Small wins matter.",
    likes: 24,
    replies: 5,
    time: "2h ago",
    liked: false,
    category: "wins",
  },
  {
    id: 2,
    author: "Anonymous Cloud ☁️",
    text: "The breathing exercise actually helped me through a panic attack last night. Thank you for this app.",
    likes: 41,
    replies: 8,
    time: "4h ago",
    liked: false,
    category: "support",
    isModerator: true,
  },
  {
    id: 3,
    author: "Anonymous River 🌊",
    text: "Does anyone else feel like weekends are harder than weekdays? I feel more alone when everything slows down.",
    likes: 18,
    replies: 12,
    time: "6h ago",
    liked: false,
    category: "questions",
  },
  {
    id: 4,
    author: "Anonymous Star ⭐",
    text: "Day 30 of journaling. I can actually see patterns in my emotions now. Growth is slow but real.",
    likes: 56,
    replies: 15,
    time: "1d ago",
    liked: false,
    category: "venting",
  },
];

const Community = () => {
  const [posts, setPosts] = useState(initialPosts);
  const [blockedIds, setBlockedIds] = useState<number[]>([]);
  const [suggestion, setSuggestion] = useState("");
  const { user } = useAuth();
  const { settings } = useUser();
  const { toast } = useToast();

  const toggleLike = (id: number) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
  };

  const reportPost = async (post: Post) => {
    if (!user) {
      toast({ title: "Report saved locally." });
      return;
    }
    addReport(user.uid, { postId: post.id, category: post.category });
    if (settings.privateMode) {
      toast({ title: "Report saved locally." });
      return;
    }
    toast({ title: "Report saved locally", description: "We will sync once the project is connected." });
  };

  const blockPost = (post: Post) => {
    setBlockedIds((prev) => [...prev, post.id]);
    toast({ title: "Post hidden", description: "You will not see posts from this author." });
  };

  const submitSuggestion = () => {
    if (!suggestion.trim()) {
      toast({ title: "Please add a suggestion." });
      return;
    }
    const nextPost: Post = {
      id: Date.now(),
      author: user?.displayName ? `${user.displayName} (You)` : "You",
      text: suggestion.trim(),
      likes: 0,
      replies: 0,
      time: "Just now",
      liked: false,
      category: "suggestions",
    };
    setPosts((prev) => [nextPost, ...prev]);
    setSuggestion("");
    toast({ title: "Suggestion posted" });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Community</h1>
        <p className="text-sm text-muted-foreground">You are not alone. This is a gentle, anonymous space.</p>
      </div>

      <Alert className="rounded-2xl border-mint bg-mint/30">
        <Shield className="h-4 w-4 text-mint-foreground" />
        <AlertDescription className="text-sm text-foreground">
          Be kind. Everyone here is healing. 💚 All posts are anonymous.
        </AlertDescription>
      </Alert>

      <Card className="card-elevated rounded-2xl">
        <CardContent className="p-5">
          <p className="text-sm font-semibold text-foreground">Share a suggestion</p>
          <p className="mt-1 text-xs text-muted-foreground">What would make this space better for you?</p>
          <textarea
            value={suggestion}
            onChange={(event) => setSuggestion(event.target.value)}
            placeholder="Your suggestion..."
            className="mt-3 min-h-[110px] w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
          />
          <div className="mt-3 flex justify-end">
            <Button onClick={submitSuggestion} className="rounded-xl">
              Post suggestion
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4 divide-y divide-border/60">
        {posts.filter((post) => !blockedIds.includes(post.id)).map((post) => (
          <Card key={post.id} className="card-elevated rounded-2xl">
            <CardContent className="p-5">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">{post.author}</span>
                  {post.isModerator && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold text-secondary-foreground">
                      <BadgeCheck className="h-3 w-3" />
                      Moderator
                    </span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">{post.time}</span>
              </div>
              <div className="mb-3 inline-flex rounded-full border border-border bg-surface px-2 py-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                {post.category}
              </div>
              <p className="text-sm text-foreground leading-relaxed mb-4">{post.text}</p>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`gap-1.5 rounded-xl text-xs ${post.liked ? "text-destructive" : "text-muted-foreground"}`}
                  onClick={() => toggleLike(post.id)}
                  aria-label={`Send support to ${post.author}`}
                >
                  <Heart className={`h-4 w-4 ${post.liked ? "fill-current animate-pulse-soft" : ""}`} />
                  {post.likes}
                </Button>
                <Button variant="ghost" size="sm" className="gap-1.5 rounded-xl text-xs text-muted-foreground">
                  <MessageCircle className="h-4 w-4" />
                  {post.replies}
                </Button>
                <Button variant="ghost" size="sm" className="gap-1.5 rounded-xl text-xs text-muted-foreground">
                  <LifeBuoy className="h-4 w-4" />
                  Support
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 rounded-xl text-xs text-muted-foreground"
                  onClick={() => reportPost(post)}
                >
                  <Flag className="h-4 w-4" />
                  Report
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 rounded-xl text-xs text-muted-foreground"
                  onClick={() => blockPost(post)}
                >
                  Block
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Community;
