import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizonal, Phone, ShieldAlert, Tag } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useUser } from "@/contexts/UserContext";
import { Link } from "react-router-dom";
import { apiFetch } from "@/lib/api";

interface Helpline {
  name: string;
  number: string;
}

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
  isCrisis?: boolean;
  tags?: string[];
  createdAt?: string;
}

const mockResponses = [
  "Thank you for sharing that with me. It takes courage to talk about how you feel. 💛",
  "I hear you. Let's take a moment to breathe together. What's weighing on you the most right now?",
  "That sounds really tough. Remember, it's okay to not be okay sometimes. You're doing your best.",
  "I'm glad you're here. Would you like to try a grounding exercise, or would you prefer to keep talking?",
  "Your feelings are valid. Let's explore what might help you feel a little lighter today.",
];

const TypingIndicator = () => (
  <div className="flex items-center gap-1.5 px-4 py-3">
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className="h-2 w-2 rounded-full bg-primary/50 animate-typing-dot"
        style={{ animationDelay: `${i * 0.2}s` }}
      />
    ))}
  </div>
);

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      text: "Hi there 🌿 I'm here to listen. How are you feeling right now?",
      sender: "ai",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const { safetyPlan } = useUser();
  const [helplines, setHelplines] = useState<Helpline[]>([]);

  useEffect(() => {
    apiFetch<{ messages: Array<{ id: string; text: string; createdAt: string; tags?: string[]; crisis?: { severity?: string } }> }>(
      "/api/chat",
    )
      .then((result) => {
        const history = result.messages
          .map((msg) => ({
            id: Number(msg.createdAt ? new Date(msg.createdAt).getTime() : Date.now()),
            text: msg.text,
            sender: (msg as { sender?: "user" | "ai" }).sender ?? "user",
            tags: msg.tags || [],
            isCrisis: msg.crisis?.severity === "high",
            createdAt: msg.createdAt,
          }))
          .reverse();
        setMessages((prev) => [...prev, ...history]);
      })
      .catch(() => null);
  }, []);

  useEffect(() => {
    apiFetch<{ helplines: Helpline[] }>("/api/config/helplines")
      .then((result) => setHelplines(result.helplines || []))
      .catch(() => setHelplines([]));
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const planPreview = safetyPlan
    ? {
        coping: safetyPlan.copingSteps.slice(0, 3),
        contacts: safetyPlan.contacts.slice(0, 2),
      }
    : null;

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now(), text: input.trim(), sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    setIsSending(true);

    apiFetch<{ tags: string[]; crisis: { severity: string } }>("/api/chat", {
      method: "POST",
      body: JSON.stringify({ text: userMsg.text }),
    })
      .then((result) => {
        const isCrisis = result.crisis?.severity === "high";
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === userMsg.id ? { ...msg, tags: result.tags, isCrisis } : msg,
          ),
        );

        return apiFetch<{ response: { text: string } }>("/api/chat/respond", {
          method: "POST",
          body: JSON.stringify({ text: userMsg.text }),
        }).then((response) => ({ response, isCrisis }));
      })
      .then(({ response, isCrisis }) => {
        const aiMsg: Message = {
          id: Date.now() + 1,
          text: response.response.text,
          sender: "ai",
          isCrisis,
        };
        setMessages((prev) => [...prev, aiMsg]);
      })
      .catch(() => {
        const aiMsg: Message = {
          id: Date.now() + 1,
          text: mockResponses[Math.floor(Math.random() * mockResponses.length)],
          sender: "ai",
        };
        setMessages((prev) => [...prev, aiMsg]);
      })
      .finally(() => {
        setIsTyping(false);
        setIsSending(false);
      });
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-3xl flex-col animate-fade-in">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Talk to Sahaay</h1>
          <p className="text-sm text-muted-foreground">I am here with you. Want to talk or sit quietly for a bit?</p>
        </div>
        <div className="hidden items-center gap-2 rounded-2xl border border-border bg-surface px-3 py-2 text-xs text-muted-foreground shadow-sm sm:flex">
          <span className="h-2 w-2 rounded-full bg-success animate-pulse-soft" />
          {isTyping ? "Sahaay is replying…" : isFocused ? "Sahaay is listening…" : "You are safe here"}
        </div>
      </div>
      {!!messages.filter((msg) => msg.tags?.length).length && (
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Tag className="h-4 w-4" />
          {messages
            .flatMap((msg) => msg.tags || [])
            .filter(Boolean)
            .slice(0, 3)
            .map((tag) => (
              <span key={tag} className="rounded-full border border-border bg-surface px-2 py-1">
                {tag}
              </span>
            ))}
        </div>
      )}
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4 pr-2">
        {messages.map((msg) => (
          <div key={msg.id}>
            <div
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed shadow-sm ${
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-card border border-border/50 text-card-foreground rounded-bl-md"
                }`}
              >
                {msg.text}
              </div>
            </div>
            {msg.isCrisis && (
              <div className="mt-3 ml-0 max-w-[80%] animate-fade-in">
                <Alert className="rounded-2xl border-peach bg-peach/20">
                  <ShieldAlert className="h-4 w-4 text-peach-foreground" />
                  <AlertDescription className="text-sm text-foreground">
                    If you're in crisis, please reach out to a helpline.
                    <br />
                    {helplines.length > 0 ? (
                      <>
                        {helplines.map((line, index) => (
                          <strong key={line.name}>
                            {line.name}: {line.number}
                            {index < helplines.length - 1 ? " • " : ""}
                          </strong>
                        ))}
                      </>
                    ) : (
                      <strong>Reach out to local support resources.</strong>
                    )}
                    <br />
                    <Link to="/safety" className="mt-2 inline-flex items-center gap-2 text-sm text-primary">
                      <Phone className="h-4 w-4" />
                      Open safety plan
                    </Link>
                    {planPreview && (planPreview.coping.length || planPreview.contacts.length) && (
                      <div className="mt-4 rounded-xl border border-border bg-surface px-3 py-3">
                        <p className="text-xs font-semibold text-foreground">Your quick plan</p>
                        {planPreview.coping.length > 0 && (
                          <div className="mt-2 text-xs text-muted-foreground">
                            Coping steps: {planPreview.coping.join(", ")}
                          </div>
                        )}
                        {planPreview.contacts.length > 0 && (
                          <div className="mt-2 text-xs text-muted-foreground">
                            Reach out: {planPreview.contacts.map((c) => c.name).join(", ")}
                          </div>
                        )}
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="rounded-2xl bg-card border border-border/50 shadow-sm rounded-bl-md">
              <TypingIndicator />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border bg-surface/80 backdrop-blur-sm pt-4">
        <div className="mb-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
          {[
            "I have been feeling anxious lately",
            "Can we do a short breathing exercise?",
            "I just want to vent for a bit",
          ].map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => setInput(suggestion)}
              className="rounded-full border border-border bg-surface px-3 py-1.5 transition-all hover:border-primary/40 hover:text-foreground"
            >
              {suggestion}
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Share what's on your mind…"
            className="min-h-[48px] max-h-32 resize-none rounded-2xl border-border/60 bg-card text-sm"
            rows={1}
            aria-label="Chat message"
          />
          <Button
            onClick={handleSend}
            size="icon"
            className="h-12 w-12 shrink-0 rounded-2xl bg-primary text-primary-foreground shadow-md hover:shadow-lg transition-all"
            aria-label="Send message"
            disabled={isSending}
          >
            {isSending ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground/60 border-t-transparent" />
            ) : (
              <SendHorizonal className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
