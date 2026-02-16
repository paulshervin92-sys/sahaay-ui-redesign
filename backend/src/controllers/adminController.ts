import type { Response } from "express";
import type { AuthRequest } from "../middlewares/authMiddleware.js";
import { env } from "../config/env.js";
import { createSession } from "../services/auth/sessionService.js";
import { getFirestore } from "../config/firebase.js";
import { getGlobalAnalytics } from "../services/analytics/analyticsService.js";

const htmlPage = (title: string, body: string) => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${title}</title>
  <style>
    body { font-family: "Segoe UI", Arial, sans-serif; padding: 28px; color: #0f172a; background: #f8fafc; }
    h1 { margin: 0 0 8px; font-size: 22px; }
    h2 { margin: 0 0 12px; font-size: 16px; }
    table { border-collapse: collapse; width: 100%; margin-bottom: 24px; background: #fff; border-radius: 12px; overflow: hidden; }
    th, td { border-bottom: 1px solid #e2e8f0; padding: 10px 12px; font-size: 12px; vertical-align: top; }
    th { background: #f1f5f9; text-align: left; color: #334155; }
    tr:last-child td { border-bottom: none; }
    .section { margin-bottom: 28px; }
    .muted { color: #64748b; font-size: 12px; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 999px; background: #e2e8f0; font-size: 11px; color: #334155; }
    .card { background: #fff; border-radius: 14px; padding: 16px; box-shadow: 0 8px 20px rgba(15, 23, 42, 0.06); }
    details { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 8px 10px; }
    summary { cursor: pointer; font-weight: 600; color: #0f172a; }
    pre { margin: 8px 0 0; white-space: pre-wrap; word-break: break-word; font-size: 11px; color: #1e293b; }
  </style>
</head>
<body>
${body}
</body>
</html>`;

export const adminLoginForm = async (_req: AuthRequest, res: Response) => {
  res.send(
    htmlPage(
      "Admin Login",
      `<h1>Admin Login</h1>
<form method="post" action="/admin/login">
  <label>Email</label><br />
  <input type="email" name="email" required /><br /><br />
  <label>Password</label><br />
  <input type="password" name="password" required /><br /><br />
  <button type="submit">Sign in</button>
</form>`,
    ),
  );
};

export const adminLogin = async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };
  if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD) {
    return res.status(500).send("Admin login not configured");
  }

  if (email !== env.ADMIN_EMAIL || password !== env.ADMIN_PASSWORD) {
    return res.status(401).send("Invalid admin credentials");
  }

  const session = await createSession("admin", true);
  res.cookie(env.SESSION_COOKIE_NAME, session.sessionId, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
  });
  return res.redirect("/admin");
};

export const adminDashboard = async (_req: AuthRequest, res: Response) => {
  const db = getFirestore();
  const [
    users,
    profiles,
    settings,
    checkins,
    journals,
    chats,
    reports,
    usage,
    globalTrends,
  ] = await Promise.all([
    db.collection("users").limit(50).get(),
    db.collection("profiles").limit(50).get(),
    db.collection("settings").limit(50).get(),
    db.collection("checkinsDaily").limit(50).get(),
    db.collection("journals").limit(50).get(),
    db.collection("chatMessages").limit(50).get(),
    db.collection("reports").limit(50).get(),
    db.collection("openaiUsage").limit(50).get(),
    getGlobalAnalytics(),
  ]);

  const moodEmojis: Record<string, string> = {
    happy: "😊",
    calm: "😌",
    neutral: "😐",
    sad: "😔",
    anxious: "😰",
    frustrated: "😤",
  };

  const trendRows = globalTrends.map(t => {
    const percentage = Math.round(t.averageSentiment * 100);
    const emoji = moodEmojis[t.topMood] || "😐";
    return `
      <div style="margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
          <span style="font-weight: 600;">${new Date(t.day).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
          <span class="muted">${t.totalParticipants} participants • Top Mood: ${emoji}</span>
        </div>
        <div style="height: 12px; background: #e2e8f0; border-radius: 6px; overflow: hidden;">
          <div style="height: 100%; width: ${percentage}%; background: ${percentage > 70 ? '#10b981' : percentage > 40 ? '#f59e0b' : '#ef4444'};"></div>
        </div>
        <div style="text-align: right; font-size: 11px; margin-top: 2px;">Positivity: ${percentage}%</div>
      </div>
    `;
  }).join("");

  const toRows = (snap: FirebaseFirestore.QuerySnapshot) =>
    snap.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .map(
        (row) =>
          `<tr>
            <td><span class="badge">${row.id}</span></td>
            <td>
              <details>
                <summary>View data</summary>
                <pre>${JSON.stringify(row, null, 2)}</pre>
              </details>
            </td>
          </tr>`,
      )
      .join("");

  const body = `
<div class="card" style="margin-bottom: 28px;">
  <h1>Admin Overview</h1>
  <p class="muted">Institutional Wellbeing Dashboard</p>
</div>

<div class="card section">
  <h2>Institutional Wellbeing Trends (Anonymized)</h2>
  <div style="padding: 10px 0;">
    ${trendRows || '<p class="muted">No aggregate data available yet.</p>'}
  </div>
  <p class="muted" style="border-top: 1px solid #e2e8f0; padding-top: 12px; margin-top: 12px;">
    <strong>Privacy Guard:</strong> Individual data is aggregated and anonymized to preserve participant trust while providing systemic insights.
  </p>
</div>

<div class="card">
  <h2>Recent Raw Data</h2>
  <p class="muted">Showing last 50 records per section.</p>
</div>
<div class="section"><h2>Users</h2><table><tr><th>ID</th><th>Data</th></tr>${toRows(users)}</table></div>
<div class="section"><h2>Profiles</h2><table><tr><th>ID</th><th>Data</th></tr>${toRows(profiles)}</table></div>
<div class="section"><h2>Settings</h2><table><tr><th>ID</th><th>Data</th></tr>${toRows(settings)}</table></div>
<div class="section"><h2>Check-ins (Daily)</h2><table><tr><th>ID</th><th>Data</th></tr>${toRows(checkins)}</table></div>
<div class="section"><h2>Journals</h2><table><tr><th>ID</th><th>Data</th></tr>${toRows(journals)}</table></div>
<div class="section"><h2>Chat Messages</h2><table><tr><th>ID</th><th>Data</th></tr>${toRows(chats)}</table></div>
<div class="section"><h2>Reports</h2><table><tr><th>ID</th><th>Data</th></tr>${toRows(reports)}</table></div>
<div class="section"><h2>OpenAI Usage</h2><table><tr><th>ID</th><th>Data</th></tr>${toRows(usage)}</table></div>
`;

  res.send(htmlPage("Admin", body));
};
