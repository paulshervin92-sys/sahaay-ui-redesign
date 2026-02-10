import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  NotebookPen,
  HeartHandshake,
  MessageCircleHeart,
  ShieldCheck,
  Sparkles,
  Users,
  Wand2,
} from "lucide-react";

const features = [
  {
    title: "AI companion chat",
    description: "A calm, always-on space to talk things out, get grounding prompts, and feel heard.",
    icon: MessageCircleHeart,
  },
  {
    title: "Mood analytics",
    description: "See patterns, streaks, and moments that shape your wellbeing with gentle insights.",
    icon: BarChart3,
  },
  {
    title: "Coping toolkit",
    description: "Breathing, grounding, and quick reset tools tailored to your current state.",
    icon: Wand2,
  },
  {
    title: "Safety plan",
    description: "Keep your support plan ready with clear steps and trusted contacts in one place.",
    icon: ShieldCheck,
  },
  {
    title: "Reflective journal",
    description: "Capture your thoughts, victories, and reflections with prompts that feel kind.",
    icon: NotebookPen,
  },
  {
    title: "Community care",
    description: "Feel connected with a supportive community and shared wellbeing challenges.",
    icon: Users,
  },
];

const steps = [
  {
    title: "Start with a gentle check-in",
    description: "Share how you feel and choose a pace that fits your day.",
  },
  {
    title: "Get a personalized plan",
    description: "Sahaay highlights tools and prompts that match your current mood.",
  },
  {
    title: "Grow with real insights",
    description: "Track progress, celebrate streaks, and keep your support close.",
  },
];

const emotionCharacters = [
  {
    name: "Calm Guide",
    tone: "Soft voice, slow breathing cues, and steady pacing.",
    accent: "from-calm-indigo/20 via-transparent to-calm-teal/30",
  },
  {
    name: "Focus Buddy",
    tone: "Gentle nudges to return to the present and finish one step at a time.",
    accent: "from-lavender/30 via-transparent to-mint/20",
  },
  {
    name: "Lift Spark",
    tone: "Tiny encouragements and reminders of the progress you are making.",
    accent: "from-peach/25 via-transparent to-primary/25",
  },
];

const Index = () => {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("dark");
    return () => root.classList.remove("dark");
  }, []);

  return (
    <div className="landing-body min-h-screen bg-surface-muted text-foreground">
      <div className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute left-0 top-0 h-[540px] w-[540px] -translate-x-1/3 -translate-y-1/3 rounded-full bg-[radial-gradient(circle_at_center,rgba(115,103,240,0.35),transparent_65%)] blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute right-0 top-20 h-[420px] w-[420px] translate-x-1/3 rounded-full bg-[radial-gradient(circle_at_center,rgba(61,181,164,0.35),transparent_65%)] blur-3xl"
          aria-hidden="true"
        />

        <header className="relative z-10 px-4 pt-6 md:px-10">
          <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between rounded-3xl border border-border/60 bg-card/70 px-5 py-4 backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 shadow-lg">
                <img src="/logo.png" alt="Sahaay AI logo" className="h-8 w-8 rounded-xl object-cover" />
              </div>
              <span className="landing-display text-lg font-semibold tracking-tight">Sahaay</span>
            </div>
            <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
              <a href="#features" className="transition-colors hover:text-foreground">Features</a>
              <a href="#how" className="transition-colors hover:text-foreground">How it works</a>
              <a href="#characters" className="transition-colors hover:text-foreground">Emotion guides</a>
              <a href="#stories" className="transition-colors hover:text-foreground">Stories</a>
            </nav>
            <div className="flex items-center gap-3">
              <Link
                to="/auth"
                className="hidden rounded-full border border-border/70 px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-primary/60 hover:text-foreground md:inline-flex"
              >
                Sign in
              </Link>
              <Link
                to="/auth"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:-translate-y-0.5"
              >
                Get started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </header>

        <section className="relative z-10 px-4 pb-24 pt-10 md:px-10">
          <div className="mx-auto grid w-full max-w-[1440px] gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-surface/70 px-4 py-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Professional mental wellbeing platform
              </div>
              <div className="space-y-5">
                <h1 className="landing-display text-4xl font-semibold leading-tight text-foreground md:text-5xl">
                  Your AI guided sanctuary for calm, clarity, and consistent care.
                </h1>
                <p className="text-base text-muted-foreground md:text-lg">
                  Sahaay blends compassionate AI, evidence-informed coping tools, and rich analytics to help people feel
                  supported every day. Start with a single check-in and let the platform guide the next best step.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  to="/auth"
                  className="inline-flex items-center justify-center rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition hover:-translate-y-0.5"
                >
                  Begin your journey
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center rounded-2xl border border-border/70 px-6 py-3 text-sm font-semibold text-foreground transition hover:border-primary/60"
                >
                  Explore features
                </a>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="glass-card rounded-2xl p-4">
                  <p className="text-sm text-muted-foreground">Daily check-ins</p>
                  <p className="landing-display text-2xl font-semibold">90 sec</p>
                </div>
                <div className="glass-card rounded-2xl p-4">
                  <p className="text-sm text-muted-foreground">Guided tools</p>
                  <p className="landing-display text-2xl font-semibold">30+ flows</p>
                </div>
                <div className="glass-card rounded-2xl p-4">
                  <p className="text-sm text-muted-foreground">Privacy first</p>
                  <p className="landing-display text-2xl font-semibold">End to end</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-8 rounded-[40px] bg-[conic-gradient(from_120deg,rgba(99,102,241,0.18),rgba(61,181,164,0.15),rgba(99,102,241,0.18))] blur-2xl" />
              <div className="relative space-y-5">
                <div className="glass-card relative rounded-[32px] p-6 shadow-2xl float-slow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Live companion</p>
                      <p className="landing-display text-2xl font-semibold">Sahaay Pulse</p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/20 text-primary">
                      <Sparkles className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="mt-6 flex items-center gap-4">
                    <div className="relative h-20 w-20">
                      <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl glow-pulse" />
                      <svg
                        viewBox="0 0 120 120"
                        className="relative h-20 w-20 rounded-full bg-surface/80 p-2"
                        aria-hidden="true"
                      >
                        <defs>
                          <linearGradient id="face" x1="0" x2="1" y1="0" y2="1">
                            <stop offset="0%" stopColor="#7c6cf2" />
                            <stop offset="100%" stopColor="#33c3b1" />
                          </linearGradient>
                        </defs>
                        <circle cx="60" cy="60" r="48" fill="url(#face)" opacity="0.85" />
                        <circle cx="45" cy="55" r="6" fill="#0b0b15" />
                        <circle cx="75" cy="55" r="6" fill="#0b0b15" />
                        <path d="M40 75c8 10 32 10 40 0" stroke="#0b0b15" strokeWidth="6" strokeLinecap="round" fill="none" />
                      </svg>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Sahaay is listening</p>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                        Calm mode active
                      </div>
                      <div className="flex gap-2">
                        <span className="h-2 w-2 rounded-full bg-primary/40" />
                        <span className="h-2 w-2 rounded-full bg-primary/70" />
                        <span className="h-2 w-2 rounded-full bg-primary" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="glass-card rounded-2xl p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Mood trend</p>
                    <p className="landing-display text-xl font-semibold">Steady lift</p>
                    <div className="mt-4 flex items-end gap-2">
                      {[32, 48, 40, 64, 58].map((value) => (
                        <div
                          key={value}
                          className="h-16 w-3 rounded-full bg-primary/20"
                        >
                          <div
                            className="w-full rounded-full bg-primary"
                            style={{ height: `${value}%` }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="glass-card rounded-2xl p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Weekly support</p>
                    <p className="landing-display text-xl font-semibold">4/5 check-ins</p>
                    <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                      <div className="flex items-center justify-between">
                        <span>Breathing</span>
                        <span>Completed</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Reflection</span>
                        <span>In progress</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Community</span>
                        <span>Scheduled</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="landing-section px-4 pb-20 pt-12 md:px-10" id="features">
        <div className="mx-auto w-full max-w-[1440px]">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Features</p>
              <h2 className="landing-display text-3xl font-semibold">Everything you need to feel supported.</h2>
            </div>
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 rounded-full border border-border/70 px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary/60"
            >
              Build my plan
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="glass-card group rounded-3xl p-6 transition hover:-translate-y-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section px-4 pb-20 pt-12 md:px-10" id="how">
        <div className="mx-auto w-full max-w-[1440px]">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
            <div className="space-y-5">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">How it works</p>
              <h2 className="landing-display text-3xl font-semibold">A clear path from check-in to steady progress.</h2>
              <p className="text-muted-foreground">
                Sahaay follows a simple flow: acknowledge the moment, receive tailored support, and build resilience with
                data-backed guidance.
              </p>
              <div className="grid gap-4">
                {steps.map((step, index) => (
                  <div key={step.title} className="glass-card rounded-2xl p-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-sm font-semibold text-primary">
                        0{index + 1}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{step.title}</p>
                        <p className="text-xs text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="glass-card rounded-3xl p-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Today plan</p>
                  <HeartHandshake className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">A five minute reset</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Choose breathing, grounding, or journaling. Sahaay matches the flow to how you feel now.
                </p>
                <div className="mt-6 grid gap-3">
                  {["Breathing", "Grounding", "Reflection"].map((tool) => (
                    <div key={tool} className="flex items-center justify-between rounded-2xl border border-border/60 bg-surface/60 px-4 py-3">
                      <span className="text-sm text-foreground">{tool}</span>
                      <span className="text-xs text-muted-foreground">Ready</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="glass-card rounded-3xl p-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Community moment</p>
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-4 text-xl font-semibold">Shared rituals</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Curated group prompts keep people supported without pressure to overshare.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {["Calm circles", "Night reflections", "Weekend reset"].map((tag) => (
                    <span key={tag} className="rounded-full border border-border/70 px-3 py-1 text-xs text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section px-4 pb-20 pt-12 md:px-10" id="characters">
        <div className="mx-auto w-full max-w-[1440px]">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Emotion guides</p>
              <h2 className="landing-display text-3xl font-semibold">Meet the supportive characters that shape your flow.</h2>
            </div>
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 rounded-full border border-border/70 px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary/60"
            >
              Unlock your guide
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {emotionCharacters.map((character) => (
              <div key={character.name} className="relative overflow-hidden rounded-3xl border border-border/60 bg-surface/60 p-6">
                <div className={`absolute inset-0 bg-gradient-to-br ${character.accent}`} aria-hidden="true" />
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                      <Sparkles className="h-6 w-6" />
                    </div>
                    <div className="h-10 w-10 rounded-full bg-primary/20 blur-lg" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="landing-display text-lg font-semibold">{character.name}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{character.tone}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-14 w-14 rounded-2xl bg-surface/80 p-2">
                      <svg viewBox="0 0 80 80" className="h-full w-full" aria-hidden="true">
                        <circle cx="40" cy="40" r="32" fill="rgba(124,108,242,0.8)" />
                        <circle cx="30" cy="36" r="4" fill="#0b0b15" />
                        <circle cx="50" cy="36" r="4" fill="#0b0b15" />
                        <path d="M28 50c7 8 17 8 24 0" stroke="#0b0b15" strokeWidth="5" strokeLinecap="round" fill="none" />
                      </svg>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <p>Voice: steady</p>
                      <p>Energy: balanced</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section px-4 pb-24 pt-12 md:px-10" id="stories">
        <div className="mx-auto w-full max-w-[1440px]">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
            <div className="space-y-5">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Stories</p>
              <h2 className="landing-display text-3xl font-semibold">A professional look that feels human.</h2>
              <p className="text-muted-foreground">
                Calm visuals, emotive characters, and subtle motion help people feel seen. These scenes adapt as the
                experience grows with each check-in.
              </p>
              <div className="flex flex-wrap gap-3">
                {["Animated guidance", "Soft transitions", "Inclusive design"].map((item) => (
                  <span key={item} className="rounded-full border border-border/70 px-4 py-2 text-xs text-muted-foreground">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {["Morning calm", "Focused afternoon", "Evening reset"].map((label) => (
                <div key={label} className="landing-photo group rounded-3xl border border-border/60 bg-surface/70 p-5">
                  <div className="photo-frame mb-4 rounded-2xl float-medium" aria-hidden="true" />
                  <p className="text-sm font-semibold text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground">Guided sequence, adaptive prompts.</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section px-4 pb-24 pt-12 md:px-10">
        <div className="mx-auto w-full max-w-[1440px]">
          <div className="relative overflow-hidden rounded-[36px] border border-border/60 bg-[radial-gradient(circle_at_top,rgba(124,108,242,0.25),transparent_60%)] p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(61,181,164,0.2),transparent_55%)]" aria-hidden="true" />
            <div className="relative z-10 grid gap-6 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Ready to begin</p>
                <h2 className="landing-display text-3xl font-semibold">Give your community a place to breathe and grow.</h2>
                <p className="text-sm text-muted-foreground">
                  Create your account, explore the tools, and invite others to start with care.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Link
                  to="/auth"
                  className="inline-flex items-center justify-center rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:-translate-y-0.5"
                >
                  Create your account
                </Link>
                <Link
                  to="/auth"
                  className="inline-flex items-center justify-center rounded-2xl border border-border/70 px-6 py-3 text-sm font-semibold text-foreground transition hover:border-primary/60"
                >
                  See login options
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="px-4 pb-10 md:px-10">
        <div className="mx-auto flex w-full max-w-[1440px] flex-wrap items-center justify-between gap-4 border-t border-border/60 pt-6 text-xs text-muted-foreground">
          <span>Sahaay AI wellbeing platform</span>
          <span>Privacy-first design. Built for real care.</span>
        </div>
      </footer>
    </div>
  );
};

export default Index;
