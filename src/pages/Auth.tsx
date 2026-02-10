import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && !name)) {
      toast({ title: "Please fill in all fields." });
      return;
    }
    setLoading(true);
    const action = isLogin ? signIn(email, password) : signUp(email, password, name);
    action
      .then(() => {
        // App routing decides onboarding vs dashboard based on local state.
      })
      .catch((error) => {
        toast({ title: "Authentication failed", description: error.message });
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="calm-gradient-strong flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md animate-scale-in">
        <div className="glass-card rounded-3xl p-8 md:p-10">
          {/* Logo */}
          <div className="mb-8 flex flex-col items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
              <Sparkles className="h-7 w-7" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Sahaay
            </h1>
            <p className="text-center text-sm text-muted-foreground">
              You're safe here. Let's take care of your mind. 🌿
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2 animate-fade-in">
                <Label htmlFor="name" className="text-sm font-medium text-foreground">
                  Your name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="What should we call you?"
                  className="rounded-xl border-border/60 bg-background/60 h-12"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="rounded-xl border-border/60 bg-background/60 h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="rounded-xl border-border/60 bg-background/60 h-12 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-medium text-base shadow-md hover:shadow-lg transition-all"
            >
              {loading ? "Please wait..." : isLogin ? "Welcome back" : "Start your journey"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {isLogin
                ? "New here? Create an account"
                : "Already have an account? Sign in"}
            </button>
            <p className="mt-3 text-xs text-muted-foreground">
              We keep your space private and gentle.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
