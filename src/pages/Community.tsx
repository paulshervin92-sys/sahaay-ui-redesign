import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Shield } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Post {
  id: number;
  author: string;
  text: string;
  likes: number;
  replies: number;
  time: string;
  liked: boolean;
}

const initialPosts: Post[] = [
  { id: 1, author: "Anonymous Sunflower 🌻", text: "Today I went outside for the first time in a week. Small wins matter.", likes: 24, replies: 5, time: "2h ago", liked: false },
  { id: 2, author: "Anonymous Cloud ☁️", text: "The breathing exercise actually helped me through a panic attack last night. Thank you for this app.", likes: 41, replies: 8, time: "4h ago", liked: false },
  { id: 3, author: "Anonymous River 🌊", text: "Does anyone else feel like weekends are harder than weekdays? I feel more alone when everything slows down.", likes: 18, replies: 12, time: "6h ago", liked: false },
  { id: 4, author: "Anonymous Star ⭐", text: "Day 30 of journaling. I can actually see patterns in my emotions now. Growth is slow but real.", likes: 56, replies: 15, time: "1d ago", liked: false },
];

const Community = () => {
  const [posts, setPosts] = useState(initialPosts);

  const toggleLike = (id: number) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 animate-fade-in">
      <h1 className="font-display text-2xl font-bold text-foreground">Community</h1>

      <Alert className="rounded-2xl border-mint bg-mint/30">
        <Shield className="h-4 w-4 text-mint-foreground" />
        <AlertDescription className="text-sm text-foreground">
          Be kind. Everyone here is healing. 💚 All posts are anonymous.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className="rounded-2xl border-border/50 shadow-sm transition-all hover:shadow-md">
            <CardContent className="p-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">{post.author}</span>
                <span className="text-xs text-muted-foreground">{post.time}</span>
              </div>
              <p className="text-sm text-foreground leading-relaxed mb-4">{post.text}</p>
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`gap-1.5 rounded-xl text-xs ${post.liked ? "text-destructive" : "text-muted-foreground"}`}
                  onClick={() => toggleLike(post.id)}
                >
                  <Heart className={`h-4 w-4 ${post.liked ? "fill-current" : ""}`} />
                  {post.likes}
                </Button>
                <Button variant="ghost" size="sm" className="gap-1.5 rounded-xl text-xs text-muted-foreground">
                  <MessageCircle className="h-4 w-4" />
                  {post.replies}
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
