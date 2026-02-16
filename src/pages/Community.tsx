import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Shield, Flag, LifeBuoy, BadgeCheck } from "lucide-react";
import { FlagIcon, BanIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/api";


// --- Poll types and helpers ---
type PollOption = { text: string; votes: number; voters: string[] };
interface PollPost extends Post {
  type: 'poll';
  question: string;
  options: PollOption[];
  userVote?: number;
  supports?: number;
}
type CommunityPost = Post | PollPost;

function isPollPost(post: CommunityPost): post is PollPost {
  return (post as PollPost).type === 'poll';
}

interface PollDialogBodyProps {
  onBack: () => void;
  onClose: () => void;
  onPostPoll: (data: { question: string; options: string[] }) => void;
}

function PollDialogBody({ onBack, onClose, onPostPoll }: PollDialogBodyProps) {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [loading, setLoading] = useState(false);

  const handleOptionChange = (idx: number, value: string) => {
    setOptions(opts => opts.map((opt, i) => i === idx ? value : opt));
  };
  const addOption = () => setOptions(opts => [...opts, ""]);
  const removeOption = (idx: number) => setOptions(opts => opts.length > 2 ? opts.filter((_, i) => i !== idx) : opts);

  const generateOptions = async () => {
    setLoading(true);
    try {
      const res = await apiFetch<{ options: string[] }>("/api/community/generate-poll-options", {
        method: "POST",
        body: JSON.stringify({ question }),
      });
      setOptions(res.options.length ? res.options : ["", ""]);
    } catch {
      setOptions(["Option 1", "Option 2", "Option 3"]);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-5 p-1">
      <div className="mb-2">
        <label className="block text-lg font-semibold mb-2 text-foreground">Poll question</label>
        <input
          className="w-full rounded-xl border border-border px-4 py-3 bg-surface text-foreground text-base focus:outline-none focus:ring-2 focus:ring-primary/60 transition"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder="Ask a question for the poll..."
        />
      </div>
      <div className="flex flex-wrap gap-3 mb-2">
        <Button size="sm" variant="outline" onClick={generateOptions} disabled={loading} className="font-medium px-4 py-2">
          {loading ? "Generating..." : "Generate options"}
        </Button>
        <Button size="sm" variant="ghost" onClick={onBack} className="font-medium px-4 py-2">Back to suggestion</Button>
      </div>
      <div className="space-y-3">
        {options.map((opt, idx) => (
          <div key={idx} className="flex items-center gap-2 group">
            <input
              className="flex-1 rounded-xl border border-border px-4 py-2 bg-background text-foreground text-base focus:outline-none focus:ring-2 focus:ring-primary/60 transition"
              value={opt}
              onChange={e => handleOptionChange(idx, e.target.value)}
              placeholder={`Option ${idx + 1}`}
              maxLength={60}
            />
            {options.length > 2 && (
              <Button size="icon" variant="ghost" onClick={() => removeOption(idx)} aria-label="Remove option"
                className="opacity-60 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition">
                ✕
              </Button>
            )}
          </div>
        ))}
        <Button size="sm" variant="outline" onClick={addOption} className="mt-1 w-fit px-4 py-2">+ Add option</Button>
      </div>
      <div className="flex justify-end mt-6">
        <Button
          className="rounded-xl px-6 py-2 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition"
          onClick={() => onPostPoll?.({ question, options })}
          disabled={!question.trim() || options.some(opt => !opt.trim())}
        >
          Post poll
        </Button>
      </div>
    </div>
  );
}


interface Post {
  id: string;
  author: string;
  text: string;
  likes: number;
  replies: number;
  time: string;
  liked: boolean;
  category: "support" | "wins" | "questions" | "venting" | "suggestions";
  isModerator?: boolean;
  supports?: number;
}

const Community = () => {
  // (Poll types moved to top-level)
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [blockedIds, setBlockedIds] = useState<string[]>([]);
  const [suggestion, setSuggestion] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'post'|'poll'>("post");
  const { user } = useAuth();
  const { settings } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    apiFetch<{ posts: Post[] }>("/api/community")
      .then((result) => setPosts(result.posts))
      .catch(() => setPosts([]));
  }, []);

  const toggleLike = (id: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p,
      ),
    );
    const post = posts.find((p) => p.id === id);
    apiFetch<{ likes: number }>("/api/community/like", {
      method: "POST",
      body: JSON.stringify({ postId: id, liked: !post?.liked }),
    }).catch(() => null);
  };

  const toggleSupport = (id: string) => {
    setPosts(prev => prev.map(p =>
      p.id === id ? { ...p, supports: (p.supports || 0) + 1 } : p
    ));
    // Optionally sync to backend
  };

  const reportPost = async (post: Post) => {
    if (!user) return;
    await apiFetch("/api/community/report", {
      method: "POST",
      body: JSON.stringify({ postId: post.id, category: post.category, anonymous: settings.privateMode }),
    });
    toast({ title: "Report submitted" });
  };

  const blockPost = (post: Post) => {
    setBlockedIds((prev) => [...prev, post.id]);
    toast({ title: "Post hidden", description: "You will not see posts from this author." });
  };

  const submitSuggestion = async () => {
    if (!suggestion.trim()) {
      toast({ title: "Please add a suggestion." });
      return;
    }
    const createdAt = new Date().toISOString();
    try {
      const result = await apiFetch<{ id: string }>("/api/community", {
        method: "POST",
        body: JSON.stringify({ text: suggestion.trim(), category: "suggestions" }),
      });
      const nextPost: Post = {
        id: result.id,
        author: user?.displayName ? `${user.displayName} (You)` : "You",
        text: suggestion.trim(),
        likes: 0,
        replies: 0,
        time: new Date(createdAt).toLocaleString(),
        liked: false,
        category: "suggestions",
      };
      setPosts((prev) => [nextPost, ...prev]);
      setSuggestion("");
      toast({ title: "Suggestion posted" });
    } catch (error) {
      toast({ title: "Unable to post suggestion", description: "Please try again." });
    }
  };


  // --- Poll post logic ---
  const submitPoll = async ({ question, options }: { question: string; options: string[] }) => {
    if (!question.trim() || options.some(opt => !opt.trim())) return;
    const createdAt = new Date().toISOString();
    try {
      const result = await apiFetch<{ id: string }>("/api/community", {
        method: "POST",
        body: JSON.stringify({
          text: question,
          category: "suggestions",
          type: "poll",
          question,
          options,
        }),
      });
      const pollPost: PollPost = {
        id: result.id,
        author: user?.displayName ? `${user.displayName} (You)` : "You",
        text: question,
        likes: 0,
        replies: 0,
        time: new Date(createdAt).toLocaleString(),
        liked: false,
        category: "suggestions",
        type: 'poll',
        question,
        options: options.map(opt => ({ text: opt, votes: 0, voters: [] })),
        userVote: undefined,
        supports: 0,
      };
      setPosts(prev => [pollPost, ...prev]);
      setDialogOpen(false);
      toast({ title: "Poll posted" });
    } catch (error) {
      toast({ title: "Unable to post poll", description: "Please try again." });
    }
  };

  // --- Poll voting logic ---
  const handleVote = async (postId: string, optionIdx: number) => {
    try {
      const result = await apiFetch<{ options: PollOption[] }>("/api/community/vote", {
        method: "POST",
        body: JSON.stringify({ postId, optionIdx }),
      });
      setPosts(prev => prev.map(post => {
        if (isPollPost(post) && post.id === postId) {
          return { ...post, options: result.options, userVote: optionIdx };
        }
        return post;
      }));
    } catch {
      toast({ title: "Unable to vote. Please try again." });
    }
  };
  // --- Support logic ---
  const handleSupport = (id: string) => {
    setPosts(prev => prev.map(p =>
      p.id === id ? { ...p, supports: (p.supports || 0) + 1 } : p
    ));
    // Optionally sync to backend
  };
  // --- Report logic ---
  const handleReport = async (post: CommunityPost) => {
    try {
      await apiFetch("/api/community/report", {
        method: "POST",
        body: JSON.stringify({ postId: post.id, category: post.category, anonymous: settings.privateMode }),
      });
      setPosts(prev => prev.filter(p => p.id !== post.id));
      toast({ title: "Reported and removed temporarily", description: "This post has been sent to admin for review." });
    } catch {
      toast({ title: "Unable to report post", description: "Please try again." });
    }
  };
  // --- Block logic ---
  const handleBlock = (post: CommunityPost) => {
    setBlockedIds(prev => [...prev, post.id]);
    toast({ title: "User and post blocked", description: "You will not see posts from this author." });
  };
  return (
    <div className="mx-auto max-w-3xl space-y-6 animate-fade-in">
      <div className="flex items-center justify-between mt-2 mb-4">
        <h1 className="font-display text-2xl font-bold text-foreground">Community</h1>
        <Button
          className="rounded-xl px-5 py-2 font-semibold text-base shadow-md bg-primary text-primary-foreground hover:bg-primary/90 transition"
          onClick={() => { setDialogMode('post'); setDialogOpen(true); }}
        >
          New Post
        </Button>
      </div>

      <Alert className="rounded-2xl border-mint bg-mint/30">
        <Shield className="h-4 w-4 text-mint-foreground" />
        <AlertDescription className="text-sm text-foreground">
          Be kind. Everyone here is healing. 💚 All posts are anonymous.
        </AlertDescription>
      </Alert>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl w-full min-h-[340px]">
          <DialogHeader>
            <DialogTitle>{dialogMode === 'post' ? 'Share a suggestion' : 'Create a poll'}</DialogTitle>
          </DialogHeader>
          {dialogMode === 'post' ? (
            <>
              <textarea
                value={suggestion}
                onChange={e => setSuggestion(e.target.value)}
                placeholder="Your suggestion..."
                className="mt-3 min-h-[110px] w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
              />
              <div className="flex flex-col sm:flex-row sm:justify-between items-end mt-4 gap-2">
                <Button variant="outline" onClick={() => { setDialogMode('poll'); }}>Get an advice via poll</Button>
                <Button className="rounded-xl" onClick={submitSuggestion}>Post suggestion</Button>
              </div>
            </>
          ) : (
            <PollDialogBody
              onBack={() => setDialogMode('post')}
              onClose={() => setDialogOpen(false)}
              onPostPoll={submitPoll}
            />
          )}
          <DialogClose asChild>
            <button className="absolute top-4 right-4 text-muted-foreground">&times;</button>
          </DialogClose>
        </DialogContent>
      </Dialog>



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
              {isPollPost(post) ? (
                <div className="mb-4">
                  <div className="font-semibold mb-2">{post.question}</div>
                  <div className="space-y-2">
                    {post.options.map((opt, idx) => {
                      const totalVotes = post.options.reduce((sum, o) => sum + o.votes, 0) || 1;
                      const percent = Math.round((opt.votes / totalVotes) * 100);
                      return (
                        <div key={idx} className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant={post.userVote === idx ? "default" : "outline"}
                            className="flex-1 justify-between relative overflow-hidden"
                            onClick={() => handleVote(post.id, idx)}
                            style={{
                              background: percent > 0 ? `linear-gradient(90deg, var(--color-primary) ${percent}%, transparent ${percent}%)` : undefined,
                              color: percent > 0 ? 'var(--color-primary-foreground)' : undefined,
                            }}
                          >
                            <span>{opt.text}</span>
                            <span className="ml-2 text-xs text-muted-foreground">{percent}%</span>
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-foreground leading-relaxed mb-4">{post.text}</p>
              )}
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
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 rounded-xl text-xs text-muted-foreground"
                  onClick={() => toggleSupport(post.id)}
                  aria-label={`Send support to ${post.author}`}
                >
                  <LifeBuoy className="h-4 w-4" />
                  {post.supports || 0}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleReport(post)}
                  title="Report post"
                >
                  <Flag className="w-5 h-5 text-red-500" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleBlock(post)}
                  title="Block user"
                >
                  <BanIcon className="w-5 h-5 text-yellow-500" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Community;
