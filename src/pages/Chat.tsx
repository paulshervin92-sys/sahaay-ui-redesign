import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizonal, Phone } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
  isCrisis?: boolean;
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
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const detectCrisis = (text: string) => {
    const keywords = ["suicide", "kill myself", "end it all", "self harm", "don't want to live"];
    return keywords.some((k) => text.toLowerCase().includes(k));
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now(), text: input.trim(), sender: "user" };
    const isCrisis = detectCrisis(input);
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const aiText = isCrisis
        ? "I'm really glad you told me. You're not alone, and there are people who want to help."
        : mockResponses[Math.floor(Math.random() * mockResponses.length)];
      const aiMsg: Message = {
        id: Date.now() + 1,
        text: aiText,
        sender: "ai",
        isCrisis,
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 1500);
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-3xl flex-col animate-fade-in">
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
                  <Phone className="h-4 w-4 text-peach-foreground" />
                  <AlertDescription className="text-sm text-foreground">
                    If you're in crisis, please reach out to a helpline.
                    <br />
                    <strong>AASRA: 9820466726</strong> •{" "}
                    <strong>Vandrevala Foundation: 1860-2662-345</strong>
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
      <div className="border-t border-border bg-background/80 backdrop-blur-sm pt-4">
        <div className="flex gap-3">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Share what's on your mind…"
            className="min-h-[48px] max-h-32 resize-none rounded-2xl border-border/60 bg-card text-sm"
            rows={1}
          />
          <Button
            onClick={handleSend}
            size="icon"
            className="h-12 w-12 shrink-0 rounded-2xl bg-primary text-primary-foreground shadow-md hover:shadow-lg transition-all"
          >
            <SendHorizonal className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
