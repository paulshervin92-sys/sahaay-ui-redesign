import React from "react";
import type { InteractiveCopingTool } from "@/lib/emotionBasedCopingTools";


// --- Mini-game components for each tool ---
// Each is a simple interactive UI matching the tool's description

// HAPPY
export const JoyJarCollector: React.FC<{ tool: InteractiveCopingTool }> = () => {
  const [entry, setEntry] = React.useState("");
  const [jar, setJar] = React.useState<string[]>([]);
  return (
    <div>
      <p>Write a happy moment:</p>
      <input className="border rounded px-2 py-1" value={entry} onChange={e => setEntry(e.target.value)} placeholder="Something that made you smile" />
      <button className="ml-2 px-3 py-1 rounded bg-yellow-200 text-yellow-900" onClick={() => { if (entry) { setJar([...jar, entry]); setEntry(""); } }}>Add</button>
      <div className="mt-3"><strong>Joy Jar:</strong><ul>{jar.map((item, i) => <li key={i}>🌟 {item}</li>)}</ul></div>
    </div>
  );
};
export const GratitudeBingo: React.FC<{ tool: InteractiveCopingTool }> = () => {
  const prompts = ["Family", "Friends", "Nature", "Music", "Food", "Health", "Laughter", "Learning", "Kindness", "Pets", "Home", "Sunshine", "Books", "Art", "Memories", "Opportunities", "Freedom", "Support", "Growth", "Peace", "Comfort", "Fun", "Technology", "Rest", "Hope"];
  const [checked, setChecked] = React.useState<boolean[]>(Array(25).fill(false));
  const toggle = (i: number) => setChecked(c => c.map((v, idx) => idx === i ? !v : v));
  const hasBingo = () => {
    // Check rows, cols, diags for 3 in a row
    for (let i = 0; i < 5; i++) {
      if (checked.slice(i*5, i*5+5).filter(Boolean).length >= 3) return true;
      if ([0,1,2,3,4].map(r => checked[r*5+i]).filter(Boolean).length >= 3) return true;
    }
    if ([0,6,12,18,24].map(i => checked[i]).filter(Boolean).length >= 3) return true;
    if ([4,8,12,16,20].map(i => checked[i]).filter(Boolean).length >= 3) return true;
    return false;
  };
  return (
    <div>
      <p>Mark things you are grateful for (get 3 in a row!):</p>
      <div className="grid grid-cols-5 gap-1">
        {prompts.map((p, i) => (
          <button key={i} className={`border rounded px-1 py-1 text-xs ${checked[i] ? 'bg-pink-200' : ''}`} onClick={() => toggle(i)}>{p}</button>
        ))}
      </div>
      {hasBingo() && <div className="mt-2 text-green-700 font-bold">Bingo! 🎉</div>}
    </div>
  );
};
export const EnergyColorMixer: React.FC<{ tool: InteractiveCopingTool }> = () => {
  const [colors, setColors] = React.useState<string[]>([]);
  const [input, setInput] = React.useState("");
  return (
    <div>
      <p>Pick colors that match your mood (type and add):</p>
      <input className="border rounded px-2 py-1" value={input} onChange={e => setInput(e.target.value)} placeholder="e.g. yellow, blue" />
      <button className="ml-2 px-3 py-1 rounded bg-purple-200 text-purple-900" onClick={() => { if (input) { setColors([...colors, input]); setInput(""); } }}>Add</button>
      <div className="mt-3 flex gap-2">{colors.map((c, i) => <span key={i} className="px-3 py-1 rounded" style={{background:c, color:'#222'}}>{c}</span>)}</div>
    </div>
  );
};
export const SmileChainChallenge: React.FC<{ tool: InteractiveCopingTool }> = () => {
  const [reasons, setReasons] = React.useState<string[]>([]);
  const [input, setInput] = React.useState("");
  return (
    <div>
      <p>Find a reason to smile today:</p>
      <input className="border rounded px-2 py-1" value={input} onChange={e => setInput(e.target.value)} placeholder="Reason to smile" />
      <button className="ml-2 px-3 py-1 rounded bg-orange-200 text-orange-900" onClick={() => { if (input) { setReasons([...reasons, input]); setInput(""); } }}>Add</button>
      <div className="mt-3">Streak: <strong>{reasons.length}</strong> {reasons.length >= 7 && <span>🏅</span>}</div>
      <ul>{reasons.map((r, i) => <li key={i}>😊 {r}</li>)}</ul>
    </div>
  );
};
export const VictoryDanceCreator: React.FC<{ tool: InteractiveCopingTool }> = () => {
  const [moves, setMoves] = React.useState<string[]>([]);
  const [input, setInput] = React.useState("");
  return (
    <div>
      <p>Create 3 simple dance moves:</p>
      <input className="border rounded px-2 py-1" value={input} onChange={e => setInput(e.target.value)} placeholder="Dance move" />
      <button className="ml-2 px-3 py-1 rounded bg-green-200 text-green-900" onClick={() => { if (input && moves.length < 3) { setMoves([...moves, input]); setInput(""); } }}>Add</button>
      <div className="mt-3">Your dance: {moves.map((m, i) => <span key={i} className="mx-1">💃 {m}</span>)}{moves.length === 3 && <span> 🎉</span>}</div>
    </div>
  );
};


// CALM
export const BreathWaveRider: React.FC<{ tool: InteractiveCopingTool }> = () => {
  const [count, setCount] = React.useState(0);
  return (
    <div>
      <p>Click the wave to breathe in and out. Complete 10 waves!</p>
      <button className="w-24 h-12 bg-blue-200 rounded-full text-blue-900 text-lg" onClick={() => setCount(c => c+1)}>
        🌊 Wave {count+1}
      </button>
      <div className="mt-2">Waves completed: {count}</div>
      {count >= 10 && <div className="text-green-700 font-bold">You finished 10 waves! 🎉</div>}
    </div>
  );
};
export const CloudWatchingTimer: React.FC<{ tool: InteractiveCopingTool }> = () => {
  const [seconds, setSeconds] = React.useState(0);
  const [running, setRunning] = React.useState(false);
  React.useEffect(() => { if (running && seconds < 60) { const t = setTimeout(() => setSeconds(s => s+1), 1000); return () => clearTimeout(t); } }, [running, seconds]);
  return (
    <div>
      <p>Watch clouds drift by. Relax for a minute.</p>
      <button className="bg-sky-200 px-3 py-1 rounded" onClick={() => setRunning(true)}>Start Timer</button>
      <div className="mt-2">{Array(Math.floor(seconds/5)).fill(0).map((_,i) => <span key={i}>☁️</span>)} {seconds}s</div>
      {seconds >= 60 && <div className="text-green-700 font-bold">Relaxation complete! 🌤️</div>}
    </div>
  );
};
export const ZenGardenBuilder: React.FC<{ tool: InteractiveCopingTool }> = () => {
  const [patterns, setPatterns] = React.useState<string[]>([]);
  const [input, setInput] = React.useState("");
  return (
    <div>
      <p>Describe a pattern or element for your zen garden:</p>
      <input className="border rounded px-2 py-1" value={input} onChange={e => setInput(e.target.value)} placeholder="e.g. spiral, rock, flower" />
      <button className="ml-2 px-3 py-1 rounded bg-green-200 text-green-900" onClick={() => { if (input) { setPatterns([...patterns, input]); setInput(""); } }}>Add</button>
      <div className="mt-3">Your garden: {patterns.map((p, i) => <span key={i} className="mx-1">🌱 {p}</span>)}</div>
    </div>
  );
};
export const MeditationStreak: React.FC<{ tool: InteractiveCopingTool }> = () => {
  const [days, setDays] = React.useState(0);
  return (
    <div>
      <p>Click to log a meditation session. Build your streak!</p>
      <button className="bg-purple-200 px-3 py-1 rounded" onClick={() => setDays(d => d+1)}>Log Session</button>
      <div className="mt-2">Streak: {days} days {days >= 21 && <span>🏆</span>}</div>
    </div>
  );
};
export const SoundBathJourney: React.FC<{ tool: InteractiveCopingTool }> = () => {
  const [sound, setSound] = React.useState("rain");
  const [done, setDone] = React.useState(false);
  return (
    <div>
      <p>Choose a soundscape and complete your journey:</p>
      <select className="border rounded px-2 py-1" value={sound} onChange={e => setSound(e.target.value)}>
        <option value="rain">Rain</option>
        <option value="ocean">Ocean</option>
        <option value="forest">Forest</option>
      </select>
      <button className="ml-2 px-3 py-1 rounded bg-indigo-200 text-indigo-900" onClick={() => setDone(true)}>Finish</button>
      {done && <div className="mt-2 text-green-700 font-bold">Journey complete! 🎶</div>}
    </div>
  );
};

// NEUTRAL
export const MoodExplorerWheel: React.FC<{ tool: InteractiveCopingTool }> = () => {
  const emotions = ["Happy", "Sad", "Calm", "Anxious", "Frustrated", "Excited", "Bored", "Curious", "Tired", "Hopeful"];
  const [spinning, setSpinning] = React.useState(false);
  const [angle, setAngle] = React.useState(0);
  const [result, setResult] = React.useState<string | null>(null);
  const [rating, setRating] = React.useState<number>(5);
  const [saved, setSaved] = React.useState(false);
  const [lastSpin, setLastSpin] = React.useState(0);

  // Calculate which emotion is at the top after spin
  const spinWheel = () => {
    setSaved(false);
    setResult(null);
    setSpinning(true);
    const spins = 5 + Math.random() * 2; // 5-7 full spins
    const final = Math.floor(Math.random() * emotions.length);
    const degPer = 360 / emotions.length;
    const finalAngle = 360 * spins + (360 - final * degPer - degPer / 2);
    setAngle(a => a + (finalAngle - (a % 360))); // always spin forward, modulo 360
    setLastSpin(Date.now());
    setTimeout(() => {
      setSpinning(false);
      setResult(emotions[final]);
    }, 1800);
  };

  return (
    <div className="flex flex-col items-center">
      <p className="mb-2">Spin the wheel to discover an emotion:</p>
      <div className="relative mb-4" style={{height:180, width:180}}>
        <div
          className="rounded-full border-4 border-primary shadow-lg"
          style={{
            width: 180,
            height: 180,
            position: 'absolute',
            top: 0,
            left: 0,
            background: 'conic-gradient(#a5b4fc 0% 10%, #fca5a5 10% 20%, #fcd34d 20% 30%, #6ee7b7 30% 40%, #f472b6 40% 50%, #fbbf24 50% 60%, #38bdf8 60% 70%, #f87171 70% 80%, #a7f3d0 80% 90%, #f9a8d4 90% 100%)',
            transform: `rotate(${angle}deg)`,
            transition: spinning ? 'transform 1.8s cubic-bezier(0.23, 1, 0.32, 1)' : 'none',
          }}
        >
          {/* Emotion labels */}
          {emotions.map((emo, i) => {
            const deg = (360 / emotions.length) * i;
            return (
              <span
                key={emo}
                style={{
                  position: 'absolute',
                  left: 90 + 70 * Math.cos((deg-90) * Math.PI/180),
                  top: 90 + 70 * Math.sin((deg-90) * Math.PI/180),
                  transform: 'translate(-50%,-50%)',
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#222',
                  pointerEvents: 'none',
                  textShadow: '0 1px 2px #fff8',
                }}
              >{emo}</span>
            );
          })}
        </div>
        {/* Pointer */}
        <div style={{position:'absolute',top:-18,left:80,width:20,height:30,zIndex:2}}>
          <svg width="20" height="30"><polygon points="10,0 20,30 0,30" fill="#6366f1" /></svg>
        </div>
      </div>
      <button
        className={`px-5 py-2 rounded-full font-bold text-white bg-primary transition-all shadow-lg ${spinning ? 'opacity-60 pointer-events-none' : ''}`}
        onClick={spinWheel}
        disabled={spinning}
      >{spinning ? 'Spinning...' : 'Spin'}</button>
      {result && (
        <div className="mt-6 text-center animate-bounce-in">
          <div className="text-lg font-bold mb-2">You got: <span className="text-primary">{result}</span></div>
          <div className="mt-2">
            <label className="block mb-1">How much do you feel it? <span className="font-bold">{rating}</span></label>
            <input type="range" min={0} max={10} value={rating} onChange={e => setRating(Number(e.target.value))} className="w-40 accent-primary" />
          </div>
          <button
            className="mt-4 px-4 py-1.5 rounded bg-green-500 text-white font-semibold shadow"
            onClick={() => setSaved(true)}
          >Save Reflection</button>
          {saved && <div className="mt-2 text-green-600 font-bold animate-pulse">Reflection saved! 🎉</div>}
        </div>
      )}
    </div>
  );
};
export const DailyDiscoveries: React.FC<{ tool: InteractiveCopingTool }> = () => {
  const [discoveries, setDiscoveries] = React.useState<string[]>([]);
  const [input, setInput] = React.useState("");
  return (
    <div>
      <p>Log 3 new things you noticed today:</p>
      <input className="border rounded px-2 py-1" value={input} onChange={e => setInput(e.target.value)} placeholder="New thing" />
      <button className="ml-2 px-3 py-1 rounded bg-teal-200 text-teal-900" onClick={() => { if (input && discoveries.length < 3) { setDiscoveries([...discoveries, input]); setInput(""); } }}>Add</button>
      <div className="mt-3">Discoveries: {discoveries.map((d, i) => <span key={i} className="mx-1">🔎 {d}</span>)}{discoveries.length === 3 && <span> 🎉</span>}</div>
    </div>
  );
};
export const MiniGoalSetter: React.FC<{ tool: InteractiveCopingTool }> = () => {
  const [goal, setGoal] = React.useState("");
  const [set, setSet] = React.useState(false);
  return (
    <div>
      <p>Set a tiny goal for the next hour:</p>
      <input className="border rounded px-2 py-1" value={goal} onChange={e => setGoal(e.target.value)} placeholder="Your goal" />
      <button className="ml-2 px-3 py-1 rounded bg-amber-200 text-amber-900" onClick={() => { if (goal) setSet(true); }}>Set Goal</button>
      {set && <div className="mt-2 text-green-700 font-bold">Goal set: {goal} 🎯</div>}
    </div>
  );
};
export const EnergyCheckGame: React.FC<{ tool: InteractiveCopingTool }> = () => {
  const parts = ["Head", "Arms", "Chest", "Stomach", "Legs"];
  const [levels, setLevels] = React.useState<number[]>(Array(5).fill(5));
  return (
    <div>
      <p>Rate your energy for each body part (1-10):</p>
      {parts.map((p, i) => (
        <div key={i} className="flex items-center gap-2 my-1">
          <span>{p}:</span>
          <input type="range" min={1} max={10} value={levels[i]} onChange={e => setLevels(l => l.map((v, idx) => idx === i ? Number(e.target.value) : v))} />
          <span>{levels[i]}</span>
        </div>
      ))}
      <div className="mt-2">Total energy: {levels.reduce((a,b) => a+b,0)}</div>
    </div>
  );
};
export const ReflectionCards: React.FC<{ tool: InteractiveCopingTool }> = () => {
  const prompts = ["What made you think today?", "A lesson learned?", "A moment of gratitude?", "A challenge faced?", "A surprise?"];
  const [card, setCard] = React.useState<string | null>(null);
  return (
    <div>
      <p>Draw a reflection card:</p>
      <button className="bg-lime-200 px-3 py-1 rounded" onClick={() => setCard(prompts[Math.floor(Math.random()*prompts.length)])}>Draw Card</button>
      {card && <div className="mt-2">Prompt: <strong>{card}</strong></div>}
    </div>
  );
};

// SAD
export const SelfCompassionMessages: React.FC<{ tool: InteractiveCopingTool }> = () => {
  const messages = ["You are enough.", "It's okay to feel sad.", "You deserve kindness.", "This will pass.", "You are loved."];
  const [msg, setMsg] = React.useState<string | null>(null);
  return (
    <div>
      <p>Generate a compassion message:</p>
      <button className="bg-rose-200 px-3 py-1 rounded" onClick={() => setMsg(messages[Math.floor(Math.random()*messages.length)])}>Generate</button>
      {msg && <div className="mt-2">💌 {msg}</div>}
    </div>
  );
};
export const HopeTimeline: React.FC<{ tool: InteractiveCopingTool }> = () => {
  const [items, setItems] = React.useState<string[]>([]);
  const [input, setInput] = React.useState("");
  return (
    <div>
      <p>Add things to look forward to:</p>
      <input className="border rounded px-2 py-1" value={input} onChange={e => setInput(e.target.value)} placeholder="Future event" />
      <button className="ml-2 px-3 py-1 rounded bg-orange-200 text-orange-900" onClick={() => { if (input) { setItems([...items, input]); setInput(""); } }}>Add</button>
      <div className="mt-3">Timeline: {items.map((i, idx) => <span key={idx} className="mx-1">⏳ {i}</span>)}</div>
    </div>
  );
};
export const EmotionReleasePainter: React.FC<{ tool: InteractiveCopingTool }> = () => {
  const [colors, setColors] = React.useState<string[]>([]);
  const [input, setInput] = React.useState("");
  return (
    <div>
      <p>Pick a color and express your sadness:</p>
      <input className="border rounded px-2 py-1" value={input} onChange={e => setInput(e.target.value)} placeholder="Color or feeling" />
      <button className="ml-2 px-3 py-1 rounded bg-blue-200 text-blue-900" onClick={() => { if (input) { setColors([...colors, input]); setInput(""); } }}>Add</button>
      <div className="mt-3">Your painting: {colors.map((c, i) => <span key={i} className="mx-1">🎨 {c}</span>)}</div>
    </div>
  );
};
export const ComfortBoxCreator: React.FC<{ tool: InteractiveCopingTool }> = () => {
  const [items, setItems] = React.useState<string[]>([]);
  const [input, setInput] = React.useState("");
  return (
    <div>
      <p>Add comforting items to your box:</p>
      <input className="border rounded px-2 py-1" value={input} onChange={e => setInput(e.target.value)} placeholder="Photo, quote, song..." />
      <button className="ml-2 px-3 py-1 rounded bg-pink-200 text-pink-900" onClick={() => { if (input) { setItems([...items, input]); setInput(""); } }}>Add</button>
      <div className="mt-3">Box: {items.map((i, idx) => <span key={idx} className="mx-1">🧸 {i}</span>)}</div>
    </div>
  );
};
export const FutureSelfLetter: React.FC<{ tool: InteractiveCopingTool }> = () => {
  const [letter, setLetter] = React.useState("");
  const [sent, setSent] = React.useState(false);
  return (
    <div>
      <p>Write a letter to your future self:</p>
      <textarea className="border rounded px-2 py-1 w-full" rows={3} value={letter} onChange={e => setLetter(e.target.value)} placeholder="Dear future me..." />
      <button className="mt-2 px-3 py-1 rounded bg-purple-200 text-purple-900" onClick={() => setSent(true)}>Send</button>
      {sent && <div className="mt-2 text-green-700 font-bold">Letter scheduled! 💌</div>}
    </div>
  );
};

// ANXIOUS
export const WorryTimeBox: React.FC<{ tool: InteractiveCopingTool }> = () => {
  const [worry, setWorry] = React.useState("");
  const [time, setTime] = React.useState("");
  const [boxed, setBoxed] = React.useState(false);
  return (
    <div>
      <p>Write your worry and schedule it for later:</p>
      <input className="border rounded px-2 py-1" value={worry} onChange={e => setWorry(e.target.value)} placeholder="Worry" />
      <input className="ml-2 border rounded px-2 py-1" value={time} onChange={e => setTime(e.target.value)} placeholder="Time (e.g. 6pm)" />
      <button className="ml-2 px-3 py-1 rounded bg-amber-200 text-amber-900" onClick={() => { if (worry && time) setBoxed(true); }}>Box It</button>
      {boxed && <div className="mt-2 text-green-700 font-bold">Worry boxed until {time}!</div>}
    </div>
  );
};
export const AnxietyThermometer: React.FC<{ tool: InteractiveCopingTool }> = () => {
  const [level, setLevel] = React.useState(5);
  const [after, setAfter] = React.useState<number | null>(null);
  return (
    <div>
      <p>Rate your anxiety (0-10):</p>
      <input type="range" min={0} max={10} value={level} onChange={e => setLevel(Number(e.target.value))} /> <span>{level}</span>
      <button className="ml-2 px-3 py-1 rounded bg-red-200 text-red-900" onClick={() => setAfter(Math.max(0, level-2))}>Do calming technique</button>
      {after !== null && <div className="mt-2">New anxiety level: <strong>{after}</strong></div>}
    </div>
  );
};
export const Grounding54321Game: React.FC<{ tool: InteractiveCopingTool }> = () => {
  const senses = [5,4,3,2,1];
  const [done, setDone] = React.useState(false);
  return (
    <div>
      <p>Find and name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste.</p>
      <button className="bg-green-200 px-3 py-1 rounded" onClick={() => setDone(true)}>I did it!</button>
      {done && <div className="mt-2 text-green-700 font-bold">Great job grounding! 🌱</div>}
    </div>
  );
};
export const ThoughtBubblePop: React.FC<{ tool: InteractiveCopingTool }> = () => {
  const [thoughts, setThoughts] = React.useState<string[]>(["I'm worried", "What if...", "Too much to do", "Can't relax"]);
  const pop = (i: number) => setThoughts(ts => ts.filter((_, idx) => idx !== i));
  return (
    <div>
      <p>Pop your anxious thoughts:</p>
      <div className="flex flex-wrap gap-2 mt-2">{thoughts.map((t, i) => <button key={i} className="bg-blue-200 px-2 py-1 rounded-full" onClick={() => pop(i)}>{t} ✨</button>)}</div>
      {thoughts.length === 0 && <div className="mt-2 text-green-700 font-bold">All thoughts popped! 🎈</div>}
    </div>
  );
};
export const SafePlaceVisualizer: React.FC<{ tool: InteractiveCopingTool }> = () => {
  const [place, setPlace] = React.useState("");
  const [elements, setElements] = React.useState<string[]>([]);
  const [input, setInput] = React.useState("");
  return (
    <div>
      <p>Design your safe place:</p>
      <input className="border rounded px-2 py-1" value={place} onChange={e => setPlace(e.target.value)} placeholder="e.g. beach, forest, room" />
      <input className="ml-2 border rounded px-2 py-1" value={input} onChange={e => setInput(e.target.value)} placeholder="Add element" />
      <button className="ml-2 px-3 py-1 rounded bg-teal-200 text-teal-900" onClick={() => { if (input) { setElements([...elements, input]); setInput(""); } }}>Add</button>
      <div className="mt-3">Safe place: <strong>{place}</strong> {elements.map((e, i) => <span key={i} className="mx-1">🪴 {e}</span>)}</div>
    </div>
  );
};

// FRUSTRATED
export const AngerReleaseScribble: React.FC<{ tool: InteractiveCopingTool }> = () => {
  const [scribbles, setScribbles] = React.useState<string[]>([]);
  const [input, setInput] = React.useState("");
  return (
    <div>
      <p>Scribble your anger (describe or type):</p>
      <input className="border rounded px-2 py-1" value={input} onChange={e => setInput(e.target.value)} placeholder="Scribble or word" />
      <button className="ml-2 px-3 py-1 rounded bg-red-200 text-red-900" onClick={() => { if (input) { setScribbles([...scribbles, input]); setInput(""); } }}>Add</button>
      <div className="mt-3">Scribbles: {scribbles.map((s, i) => <span key={i} className="mx-1">🖍️ {s}</span>)}</div>
    </div>
  );
};
export const ProblemSolverWizard: React.FC<{ tool: InteractiveCopingTool }> = () => {
  const [problem, setProblem] = React.useState("");
  const [actions, setActions] = React.useState<string[]>([]);
  const [input, setInput] = React.useState("");
  return (
    <div>
      <p>Name your problem and brainstorm 3 actions:</p>
      <input className="border rounded px-2 py-1" value={problem} onChange={e => setProblem(e.target.value)} placeholder="Problem" />
      <input className="ml-2 border rounded px-2 py-1" value={input} onChange={e => setInput(e.target.value)} placeholder="Action" />
      <button className="ml-2 px-3 py-1 rounded bg-purple-200 text-purple-900" onClick={() => { if (input && actions.length < 3) { setActions([...actions, input]); setInput(""); } }}>Add</button>
      <div className="mt-3">Problem: {problem}</div>
      <div>Actions: {actions.map((a, i) => <span key={i} className="mx-1">🪄 {a}</span>)}{actions.length === 3 && <span> 🎯</span>}</div>
    </div>
  );
};
export const TensionTracker: React.FC<{ tool: InteractiveCopingTool }> = () => {
  const parts = ["Neck", "Shoulders", "Back", "Jaw", "Hands"];
  const [tense, setTense] = React.useState<boolean[]>(Array(5).fill(false));
  const toggle = (i: number) => setTense(t => t.map((v, idx) => idx === i ? !v : v));
  return (
    <div>
      <p>Tap where you feel tense:</p>
      <div className="flex gap-2 mt-2">{parts.map((p, i) => <button key={i} className={`px-3 py-1 rounded ${tense[i] ? 'bg-orange-200' : 'bg-gray-100'}`} onClick={() => toggle(i)}>{p}</button>)}</div>
      <div className="mt-2">Tense areas: {parts.filter((_,i) => tense[i]).join(", ")}</div>
    </div>
  );
};
export const IceCubeChallenge: React.FC<{ tool: InteractiveCopingTool }> = () => {
  const [holding, setHolding] = React.useState(false);
  const [seconds, setSeconds] = React.useState(0);
  React.useEffect(() => { if (holding && seconds < 60) { const t = setTimeout(() => setSeconds(s => s+1), 1000); return () => clearTimeout(t); } }, [holding, seconds]);
  return (
    <div>
      <p>Press and hold the button for 60 seconds:</p>
      <button className={`px-3 py-1 rounded ${holding ? 'bg-cyan-300' : 'bg-cyan-100'}`} onMouseDown={() => { setHolding(true); setSeconds(0); }} onMouseUp={() => setHolding(false)} onMouseLeave={() => setHolding(false)}>
        🧊 Hold Me
      </button>
      <div className="mt-2">Held for: {seconds}s</div>
      {seconds >= 60 && <div className="text-green-700 font-bold">Challenge complete! ❄️</div>}
    </div>
  );
};
export const PerspectiveShifter: React.FC<{ tool: InteractiveCopingTool }> = () => {
  const perspectives = ["Bird's eye view", "Friend's advice", "Future you", "Comic relief", "Learning opportunity"];
  const [desc, setDesc] = React.useState("");
  const [persp, setPersp] = React.useState<string | null>(null);
  return (
    <div>
      <p>Describe your frustration and spin for a new perspective:</p>
      <input className="border rounded px-2 py-1" value={desc} onChange={e => setDesc(e.target.value)} placeholder="Situation" />
      <button className="ml-2 px-3 py-1 rounded bg-indigo-200 text-indigo-900" onClick={() => setPersp(perspectives[Math.floor(Math.random()*perspectives.length)])}>Spin</button>
      {persp && <div className="mt-2">Perspective: <strong>{persp}</strong></div>}
    </div>
  );
};

// --- Tool ID to component mapping ---
export const MINI_GAME_COMPONENTS: Record<string, React.FC<{ tool: InteractiveCopingTool }>> = {
  // HAPPY
  "joy-jar": JoyJarCollector,
  "gratitude-bingo": GratitudeBingo,
  "energy-color-mixer": EnergyColorMixer,
  "smile-chain": SmileChainChallenge,
  "victory-dance": VictoryDanceCreator,
  // CALM
  "breath-wave-rider": BreathWaveRider,
  "cloud-watching-timer": CloudWatchingTimer,
  "zen-garden-builder": ZenGardenBuilder,
  "meditation-streak": MeditationStreak,
  "sound-bath-journey": SoundBathJourney,
  // NEUTRAL
  "mood-explorer-wheel": MoodExplorerWheel,
  "daily-discoveries": DailyDiscoveries,
  "mini-goal-setter": MiniGoalSetter,
  "energy-check-game": EnergyCheckGame,
  "reflection-cards": ReflectionCards,
  // SAD
  "self-compassion-messages": SelfCompassionMessages,
  "hope-timeline": HopeTimeline,
  "emotion-release-painter": EmotionReleasePainter,
  "comfort-box-creator": ComfortBoxCreator,
  "future-self-letter": FutureSelfLetter,
  // ANXIOUS
  "worry-time-box": WorryTimeBox,
  "anxiety-thermometer": AnxietyThermometer,
  "grounding-54321-game": Grounding54321Game,
  "thought-bubble-pop": ThoughtBubblePop,
  "safe-place-visualizer": SafePlaceVisualizer,
  // FRUSTRATED
  "anger-release-scribble": AngerReleaseScribble,
  "problem-solver-wizard": ProblemSolverWizard,
  "tension-tracker": TensionTracker,
  "ice-cube-challenge": IceCubeChallenge,
  "perspective-shifter": PerspectiveShifter,
};
