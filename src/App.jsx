import { useState, useRef, useEffect } from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

// ─── STYLES ───────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Lato:wght@300;400;500;600;700&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; -webkit-tap-highlight-color:transparent; }
  :root {
    --bg: #F5F3EF;
    --bg2: #EBE8E2;
    --surface: rgba(255,255,255,0.85);
    --surface2: rgba(255,255,255,0.65);
    --surface3: rgba(255,255,255,0.45);
    --border: rgba(0,0,0,0.08);
    --border2: rgba(0,0,0,0.14);
    --accent: #fcc612;
    --accent2: #fd8040;
    --accent-dim: rgba(252,198,18,0.12);
    --accent-glow: rgba(252,198,18,0.2);
    --green: #2D9A6A;
    --blue: #3B7DD8;
    --purple: #fd8040;
    --red: #D94F5C;
    --amber: #D4960B;
    --text: #1A1A1A;
    --text2: #5A5A6A;
    --text3: #9A9AAA;
    --shadow: 0 4px 24px rgba(0,0,0,0.08);
    --shadow-sm: 0 2px 12px rgba(0,0,0,0.05);
    --fd: 'Montserrat', sans-serif;
    --fb: 'Lato', sans-serif;
    --sidebar: 240px;
  }

  html, body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--fb);
    height: 100%;
    overflow: hidden;
  }

  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background:
      radial-gradient(ellipse 80% 60% at 20% 10%, rgba(252,198,18,0.08) 0%, transparent 60%),
      radial-gradient(ellipse 60% 50% at 80% 80%, rgba(253,128,64,0.06) 0%, transparent 60%),
      radial-gradient(ellipse 50% 40% at 60% 30%, rgba(252,198,18,0.05) 0%, transparent 60%);
    pointer-events: none;
    z-index: 0;
  }

  .app { display:flex; height:100dvh; overflow:hidden; position:relative; z-index:1; }

  /* ═══ SIDEBAR ═══ */
  .sidebar {
    width: var(--sidebar); height:100vh; position:fixed; left:0; top:0;
    background: #111111; display:flex; flex-direction:column;
    transition: all 0.3s ease; z-index:100; flex-shrink:0;
  }
  .sidebar-logo {
    padding:20px 20px; border-bottom:1px solid #222;
    display:flex; align-items:center; gap:12px; min-height:68px;
  }
  .sidebar-logo-icon {
    width:34px; height:34px; border-radius:10px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    display:flex; align-items:center; justify-content:center;
    color:white; font:700 14px var(--fd); flex-shrink:0;
  }
  .sidebar-logo-text { font:600 14px var(--fd); color:#fff; line-height:1.2; }
  .sidebar-logo-sub { font:400 11px var(--fb); color:#888; }
  .sidebar-nav { flex:1; overflow-y:auto; padding:12px 12px; }
  .sidebar-section { font:500 10px var(--fd); text-transform:uppercase; letter-spacing:1.2px; color:#888; padding:0 16px 6px; }
  .sidebar-section-group { margin-bottom:16px; }
  .sidebar-link {
    display:flex; align-items:center; gap:12px; padding:10px 16px;
    border-radius:8px; text-decoration:none; transition:all 0.15s;
    font:400 13px var(--fb); color:#aaa; cursor:pointer; border:none; background:none; width:100%;
  }
  .sidebar-link:hover { background:#1a1a1a; color:#ccc; }
  .sidebar-link.active { background:rgba(252,198,18,0.15); color:var(--accent); font-weight:500; }
  .sidebar-link-icon { flex-shrink:0; display:flex; font-size:16px; width:20px; justify-content:center; }
  .sidebar-link-badge { margin-left:auto; background:var(--red); color:white; font-size:9px; font-weight:700; padding:1px 6px; border-radius:8px; min-width:16px; text-align:center; }
  .sidebar-footer { padding:12px; border-top:1px solid #222; }
  .sidebar-role-btn {
    display:flex; align-items:center; gap:10px; width:100%;
    padding:10px 16px; background:transparent; border:none; border-radius:8px;
    cursor:pointer; font:400 13px var(--fb); color:#888; transition:all 0.15s;
  }
  .sidebar-role-btn:hover { background:#1a1a1a; color:#ccc; }
  .sidebar-role-dot { width:10px; height:10px; border-radius:50%; flex-shrink:0; }

  /* ═══ MAIN AREA ═══ */
  .main-area {
    margin-left: var(--sidebar); flex:1; display:flex; flex-direction:column;
    min-height:100vh; transition: margin-left 0.25s cubic-bezier(0.16,1,0.3,1);
    position:relative; z-index:1;
  }

  /* TOPBAR */
  .topbar {
    position:sticky; top:0; z-index:50; height:56px;
    background: rgba(245,243,239,0.6);
    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(0,0,0,0.04);
    padding:0 32px; display:flex; align-items:center; justify-content:flex-end; gap:12px;
    flex-shrink:0;
  }
  .topbar-date { font:400 12px 'JetBrains Mono', monospace; color:#aaa; letter-spacing:0.5px; }
  .topbar-divider { width:1px; height:20px; background:rgba(0,0,0,0.08); }
  .t-right { display:flex; align-items:center; gap:12px; flex-shrink:0; }
  .bell-btn {
    position:relative; width:34px; height:34px; border-radius:10px;
    border:1px solid var(--border2);
    background: rgba(255,255,255,0.5);
    backdrop-filter: blur(10px);
    display:flex; align-items:center; justify-content:center; font-size:15px; cursor:pointer; flex-shrink:0;
    transition:all 0.2s;
  }
  .bell-btn:hover { background:rgba(255,255,255,0.8); }
  .bell-dot { position:absolute; top:6px; right:6px; width:6px; height:6px; border-radius:50%; background:var(--red); border:1.5px solid #fff; }
  .top-action-btn {
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    border:none; color:white; font-size:11px; font-weight:600; font-family:var(--fb);
    padding:0 16px; height:34px; border-radius:100px; cursor:pointer; white-space:nowrap;
    box-shadow: 0 4px 14px rgba(252,198,18,0.35); letter-spacing:0.2px; transition:all 0.2s;
  }
  .top-action-btn:hover { box-shadow: 0 6px 20px rgba(252,198,18,0.45); transform:translateY(-1px); }

  /* CONTENT */
  .content { flex:1; overflow-y:auto; padding:32px 36px; max-width:1400px; animation:fadeIn 0.4s cubic-bezier(0.16,1,0.3,1); }
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }

  /* ═══ DASHBOARD ANIMATIONS ═══ */
  @keyframes dashFadeInUp {
    from { opacity:0; transform:translateY(16px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes dashCountUp {
    from { opacity:0; transform:translateY(8px); }
    to   { opacity:1; transform:translateY(0); }
  }
  .dash-card-hover { transition:all 0.3s cubic-bezier(0.16,1,0.3,1); }
  .dash-card-hover:hover { transform:translateY(-3px); box-shadow:0 12px 40px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.03); }

  /* Mobile menu button (hidden on desktop) */
  .mobile-menu-btn {
    display:none; background:none; border:none; cursor:pointer; color:#666; padding:4px;
    flex-shrink:0; margin-right:4px;
  }

  /* Mobile overlay */
  .mobile-sidebar-overlay {
    position:fixed; inset:0; background:rgba(0,0,0,0.3);
    backdrop-filter:blur(4px); z-index:199;
  }
  .mobile-sidebar {
    width:260px; height:100vh; position:fixed; left:0; top:0;
    background:#111; display:flex; flex-direction:column; z-index:200;
    box-shadow:4px 0 24px rgba(0,0,0,0.2);
  }

  @media (max-width: 860px) {
    .sidebar { display:none; }
    .mobile-menu-btn { display:flex; }
    .main-area { margin-left:0 !important; }
    .topbar { padding:0 14px; justify-content:space-between; }
    .content { padding:14px 12px; }
  }
  @media (max-width: 768px) {
    .topbar { height:46px; }
    .topbar-date, .topbar-divider { display:none; }
  }

  /* OVERLAY / SHEETS */
  .overlay { position:fixed; inset:0; background:rgba(0,0,0,0.5); backdrop-filter:blur(4px); z-index:200; display:flex; align-items:flex-end; }
  .sheet {
    background: rgba(255,255,255,0.97);
    backdrop-filter: blur(30px);
    -webkit-backdrop-filter: blur(30px);
    border-radius:22px 22px 0 0; border:1px solid var(--border2); border-bottom:none;
    width:100%; padding:0 16px 32px; max-height:90dvh; overflow-y:auto;
    box-shadow: 0 -8px 40px rgba(0,0,0,0.1);
  }
  .sheet-handle { width:36px; height:4px; background:var(--text3); border-radius:2px; margin:14px auto 18px; opacity:0.4; }
  .sheet-title { font-family:var(--fd); font-size:20px; font-weight:600; color:var(--text); margin-bottom:4px; }
  .sheet-sub { font-size:12px; color:var(--text2); margin-bottom:16px; }

  /* FULL SCREEN PANELS */
  .full-panel { position:fixed; top:56px; right:0; bottom:0; left:var(--sidebar); background:var(--bg); z-index:150; display:flex; flex-direction:column; animation:slideUp 0.22s ease; }
  .full-panel-scroll { flex:1; overflow-y:auto; padding:32px 36px; }
  @keyframes slideUp { from { transform:translateY(10px); opacity:0; } to { transform:translateY(0); opacity:1; } }
  @media (max-width: 860px) {
    .full-panel { left:0; }
    .full-panel-scroll { padding:14px; }
  }

  /* AI COMPONENTS */
  .ai-btn {
    display:flex; align-items:center; gap:12px; padding:14px 16px;
    background: linear-gradient(135deg, rgba(252,198,18,0.08), rgba(253,128,64,0.06));
    border:1px solid rgba(252,198,18,0.25); border-radius:14px;
    cursor:pointer; width:100%; margin-bottom:10px; transition:all 0.18s;
    backdrop-filter: blur(8px); box-shadow: var(--shadow-sm);
  }
  .ai-btn:active { transform:scale(0.98); opacity:0.85; }
  .ai-btn-icon { font-size:22px; flex-shrink:0; }
  .ai-btn-text { font-size:14px; font-weight:600; color:var(--accent); font-family:var(--fd); letter-spacing:0.2px; }
  .ai-btn-sub { font-size:11px; color:var(--text2); margin-top:2px; }

  .ai-spinner { width:16px; height:16px; border:2px solid var(--accent); border-top-color:transparent; border-radius:50%; animation:spin 0.7s linear infinite; flex-shrink:0; }
  @keyframes spin { to { transform:rotate(360deg); } }

  .ai-loading {
    display:flex; align-items:center; gap:10px; padding:14px;
    background: linear-gradient(135deg, rgba(252,198,18,0.07), rgba(253,128,64,0.05));
    border:1px solid rgba(252,198,18,0.2); border-radius:12px; margin-bottom:12px;
  }
  .ai-loading-text { font-size:13px; color:var(--accent); font-weight:500; }
  .ai-loading-sub { font-size:11px; color:var(--text2); margin-top:2px; }

  /* IDEA CARDS */
  .idea-card {
    background: var(--surface); border:1px solid var(--border); border-radius:14px;
    padding:14px 16px; margin-bottom:8px; cursor:pointer; transition:all 0.18s;
    backdrop-filter: blur(12px); box-shadow: var(--shadow-sm);
  }
  .idea-card:active { border-color:var(--accent2); box-shadow:0 4px 20px rgba(252,198,18,0.15); }
  .idea-card-header { display:flex; align-items:flex-start; gap:10px; margin-bottom:6px; }
  .idea-num { font-family:var(--fd); font-size:11px; font-weight:700; color:var(--accent); background:var(--accent-dim); padding:2px 8px; border-radius:20px; flex-shrink:0; border:1px solid rgba(252,198,18,0.2); }
  .idea-title { font-size:14px; font-weight:600; color:var(--text); line-height:1.3; font-family:var(--fd); }
  .idea-desc { font-size:12px; color:var(--text2); line-height:1.6; margin-bottom:8px; }
  .idea-footer { display:flex; align-items:center; gap:8px; }
  .idea-tag { font-size:10px; color:var(--text2); background:var(--surface2); border:1px solid var(--border); padding:2px 9px; border-radius:20px; }
  .idea-script-btn { margin-left:auto; padding:6px 14px; background:linear-gradient(135deg,var(--accent),var(--accent2)); border:none; color:white; font-size:11px; font-weight:600; font-family:var(--fb); border-radius:20px; cursor:pointer; box-shadow:0 3px 10px rgba(252,198,18,0.3); }

  /* CALENDAR */
  .cal-week { display:grid; grid-template-columns:repeat(7,1fr); gap:4px; margin-bottom:4px; }
  .cal-day-label { text-align:center; font-size:9px; color:var(--text3); font-weight:600; text-transform:uppercase; padding:4px 0; }
  .cal-day { aspect-ratio:1; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:500; color:var(--text3); background:var(--surface2); cursor:pointer; position:relative; border:1px solid var(--border); backdrop-filter:blur(8px); }
  .cal-day.has-post { background:var(--accent-dim); border-color:rgba(252,198,18,0.35); color:var(--accent); }
  .cal-day.today { border-color:var(--accent2); color:var(--text); font-weight:700; }
  .cal-post-dot { position:absolute; bottom:3px; left:50%; transform:translateX(-50%); width:4px; height:4px; border-radius:50%; background:var(--accent); }
  .cal-post-item { display:flex; gap:10px; padding:10px 0; border-bottom:1px solid var(--border); }
  .cal-post-item:last-child { border-bottom:none; }
  .cal-post-date { font-family:var(--fd); font-size:13px; font-weight:700; color:var(--accent); min-width:42px; }
  .cal-post-info { flex:1; min-width:0; }
  .cal-post-title { font-size:12px; font-weight:500; color:var(--text); }
  .cal-post-client { font-size:10px; color:var(--text3); margin-top:1px; }

  /* CAPTION / OUTREACH RESULTS */
  .caption-result { background:rgba(255,255,255,0.85); border:1px solid var(--border2); border-radius:12px; padding:16px; margin-top:12px; backdrop-filter:blur(12px); box-shadow:var(--shadow-sm); }
  .caption-text { font-size:13px; color:var(--text); line-height:1.7; white-space:pre-wrap; }
  .caption-copy-btn { margin-top:10px; padding:8px 18px; background:var(--surface); border:1px solid var(--border2); color:var(--text2); font-size:12px; font-family:var(--fb); border-radius:20px; cursor:pointer; box-shadow:var(--shadow-sm); }
  .outreach-result { background:rgba(255,255,255,0.85); border:1px solid var(--border2); border-radius:12px; padding:16px; margin-top:12px; backdrop-filter:blur(12px); box-shadow:var(--shadow-sm); }
  .outreach-text { font-size:13px; color:var(--text); line-height:1.7; white-space:pre-wrap; }

  /* MESSAGING */
  .msg-panel { position:fixed; top:56px; right:0; bottom:0; left:var(--sidebar); background:var(--bg); z-index:150; display:flex; flex-direction:column; animation:slideUp 0.2s ease; }
  @media (max-width:860px) { .msg-panel { left:0; } }
  .msg-top { padding:14px 16px; border-bottom:1px solid var(--border); background:rgba(255,255,255,0.9); backdrop-filter:blur(20px); flex-shrink:0; display:flex; align-items:center; justify-content:space-between; }
  .msg-thread-list { flex:1; overflow-y:auto; padding:14px; }
  .msg-thread-item { display:flex; gap:11px; padding:13px 14px; background:var(--surface); border:1px solid var(--border); border-radius:14px; margin-bottom:8px; cursor:pointer; backdrop-filter:blur(12px); box-shadow:var(--shadow-sm); transition:all 0.15s; }
  .msg-thread-item:active { box-shadow:0 4px 20px rgba(252,198,18,0.15); }
  .msg-thread-item.unread { border-left:3px solid var(--accent); }
  .chat-view { position:fixed; top:56px; right:0; bottom:0; left:var(--sidebar); background:var(--bg); z-index:160; display:flex; flex-direction:column; animation:slideUp 0.15s ease; }
  @media (max-width:860px) { .chat-view { left:0; } }
  .chat-header { padding:12px 14px; border-bottom:1px solid var(--border); background:rgba(255,255,255,0.9); backdrop-filter:blur(20px); display:flex; align-items:center; gap:10px; flex-shrink:0; }
  .chat-messages { flex:1; overflow-y:auto; padding:14px; display:flex; flex-direction:column; gap:10px; }
  .chat-msg { display:flex; gap:8px; max-width:85%; }
  .chat-msg.mine { align-self:flex-end; flex-direction:row-reverse; }
  .chat-bubble { padding:10px 14px; border-radius:16px; font-size:13px; line-height:1.5; }
  .chat-msg:not(.mine) .chat-bubble { background:rgba(255,255,255,0.9); border:1px solid var(--border); color:var(--text); border-radius:4px 16px 16px 16px; box-shadow:var(--shadow-sm); backdrop-filter:blur(8px); }
  .chat-msg.mine .chat-bubble { background:linear-gradient(135deg,var(--accent),var(--accent2)); color:white; border-radius:16px 4px 16px 16px; box-shadow:0 4px 14px rgba(252,198,18,0.3); }
  .chat-time { font-size:9px; color:var(--text3); margin-top:3px; text-align:right; }
  .chat-input-bar { padding:10px 14px; border-top:1px solid var(--border); background:rgba(255,255,255,0.9); backdrop-filter:blur(20px); display:flex; gap:8px; align-items:flex-end; flex-shrink:0; padding-bottom:calc(10px + env(safe-area-inset-bottom)); }
  .chat-input { flex:1; background:var(--surface2); border:1px solid var(--border2); border-radius:22px; padding:10px 16px; font-size:13px; color:var(--text); font-family:var(--fb); outline:none; resize:none; max-height:100px; line-height:1.4; }
  .chat-input:focus { border-color:var(--accent2); box-shadow:0 0 0 3px rgba(252,198,18,0.1); }
  .chat-send-btn { width:38px; height:38px; border-radius:50%; background:linear-gradient(135deg,var(--accent),var(--accent2)); border:none; color:white; font-size:16px; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0; box-shadow:0 4px 12px rgba(252,198,18,0.35); }

  /* NOTIFS */
  .notif-item { display:flex; gap:12px; padding:13px 14px; background:var(--surface); border:1px solid var(--border); border-radius:14px; margin-bottom:8px; cursor:pointer; backdrop-filter:blur(12px); box-shadow:var(--shadow-sm); transition:all 0.15s; }
  .notif-item.unread { border-left:3px solid var(--accent); background:rgba(252,198,18,0.06); }
  .notif-icon { font-size:20px; flex-shrink:0; width:32px; text-align:center; }
  .notif-text { font-size:13px; color:var(--text); line-height:1.4; }
  .notif-text strong { color:var(--accent); }
  .notif-time { font-size:10px; color:var(--text3); margin-top:4px; }
  .notif-unread-dot { width:7px; height:7px; border-radius:50%; background:var(--accent); flex-shrink:0; margin-top:5px; }

  /* FORMS */
  .form-group { margin-bottom:14px; }
  .form-label { font-size:11px; color:var(--text2); text-transform:uppercase; letter-spacing:0.8px; font-weight:600; margin-bottom:6px; display:block; }
  .form-input { width:100%; padding:11px 14px; background:rgba(255,255,255,0.7); border:1px solid var(--border2); border-radius:10px; color:var(--text); font-size:13px; font-family:var(--fb); outline:none; backdrop-filter:blur(8px); }
  .form-input:focus { border-color:var(--accent2); box-shadow:0 0 0 3px rgba(252,198,18,0.1); }
  .form-select { width:100%; padding:11px 14px; background:rgba(255,255,255,0.7); border:1px solid var(--border2); border-radius:10px; color:var(--text); font-size:13px; font-family:var(--fb); outline:none; }
  .form-textarea { width:100%; padding:11px 14px; background:rgba(255,255,255,0.7); border:1px solid var(--border2); border-radius:10px; color:var(--text); font-size:13px; font-family:var(--fb); outline:none; resize:none; min-height:80px; line-height:1.5; }
  .form-textarea:focus { border-color:var(--accent2); box-shadow:0 0 0 3px rgba(252,198,18,0.1); }
  .form-actions { display:flex; gap:8px; margin-top:18px; }

  /* BUTTONS */
  .btn { padding:10px 18px; border-radius:22px; border:1px solid var(--border2); background:rgba(255,255,255,0.7); color:var(--text2); font-size:13px; font-family:var(--fb); cursor:pointer; font-weight:500; transition:all 0.15s; backdrop-filter:blur(8px); }
  .btn:active { opacity:0.8; }
  .btn.primary { background:linear-gradient(135deg,var(--accent),var(--accent2)); border:none; color:white; font-weight:600; flex:1; text-align:center; box-shadow:0 4px 16px rgba(252,198,18,0.3); }
  .btn.full { width:100%; text-align:center; }
  .btn.danger { background:rgba(200,107,122,0.1); border-color:rgba(200,107,122,0.4); color:var(--red); }
  .btn.success { background:rgba(91,168,138,0.1); border-color:rgba(91,168,138,0.4); color:var(--green); }
  .btn.back { display:inline-flex; align-items:center; gap:6px; margin-bottom:12px; font-size:13px; }
  .action-btn { padding:5px 11px; border-radius:20px; border:1px solid var(--border2); background:rgba(255,255,255,0.7); color:var(--text2); font-size:10px; cursor:pointer; font-family:var(--fb); white-space:nowrap; transition:all 0.15s; }
  .action-btn.accent { background:var(--accent-dim); border-color:rgba(252,198,18,0.3); color:var(--accent); }
  .action-btn.green { background:rgba(91,168,138,0.1); border-color:rgba(91,168,138,0.35); color:var(--green); }
  .sheet-role-btn { display:flex; align-items:center; gap:12px; padding:14px 16px; border-radius:14px; border:1px solid var(--border); background:rgba(255,255,255,0.7); color:var(--text); font-size:14px; font-family:var(--fb); cursor:pointer; width:100%; margin-bottom:8px; transition:all 0.15s; text-align:left; backdrop-filter:blur(8px); }
  .sheet-role-btn.active { background:var(--accent-dim); border-color:rgba(252,198,18,0.35); }
  .sheet-dot { width:10px; height:10px; border-radius:50%; flex-shrink:0; }

  /* CARDS */
  .stats-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:12px; }
  .stat-card { background:var(--surface); border:1px solid var(--border); border-radius:16px; padding:16px; backdrop-filter:blur(16px); box-shadow:var(--shadow-sm); }
  .stat-label { font-size:10px; color:var(--text3); text-transform:uppercase; letter-spacing:0.8px; margin-bottom:6px; font-weight:500; }
  .stat-value { font-family:var(--fd); font-size:28px; font-weight:600; color:var(--text); line-height:1; letter-spacing:-0.5px; }
  .stat-sub { font-size:10px; color:var(--text2); margin-top:5px; }
  .card { background:var(--surface); border:1px solid var(--border); border-radius:16px; padding:16px 18px; margin-bottom:12px; backdrop-filter:blur(16px); box-shadow:var(--shadow-sm); }
  .card-title { font-family:var(--fd); font-size:11px; font-weight:600; color:var(--text2); text-transform:uppercase; letter-spacing:1.2px; margin-bottom:14px; }
  .badge { display:inline-flex; align-items:center; padding:2px 8px; border-radius:20px; font-size:10px; font-weight:600; white-space:nowrap; }
  .badge-green { background:rgba(34,197,94,0.12); color:#1A7A42; }
  .badge-amber { background:rgba(255,184,0,0.12); color:#8B6914; }
  .badge-blue { background:rgba(59,130,246,0.12); color:#2A5FAA; }
  .badge-purple { background:rgba(253,128,64,0.12); color:#D05A20; }
  .badge-gray { background:rgba(153,153,168,0.1); color:#4A4F5C; }
  .badge-red { background:rgba(239,68,68,0.12); color:#B03A44; }
  .badge-orange { background:rgba(255,92,0,0.12); color:#C04500; }
  .row-item { display:flex; align-items:center; gap:11px; padding:10px 0; border-bottom:1px solid var(--border); }
  .row-item:last-child { border-bottom:none; padding-bottom:0; }
  .row-item:first-child { padding-top:0; }
  .row-avatar { width:34px; height:34px; border-radius:9px; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:700; flex-shrink:0; font-family:var(--fd); }
  .row-main { flex:1; min-width:0; }
  .row-title { font-size:13px; font-weight:600; color:var(--text); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .row-sub { font-size:11px; color:var(--text3); margin-top:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .row-right { display:flex; flex-direction:column; align-items:flex-end; gap:4px; flex-shrink:0; }
  .activity-item { display:flex; gap:10px; padding:9px 0; border-bottom:1px solid var(--border); }
  .activity-item:last-child { border-bottom:none; }
  .activity-dot { width:7px; height:7px; border-radius:50%; margin-top:5px; flex-shrink:0; }
  .activity-text { font-size:12px; color:var(--text2); line-height:1.5; }
  .activity-text strong { color:var(--text); }
  .activity-time { font-size:10px; color:var(--text3); margin-top:2px; }
  .kanban-scroll { overflow-x:auto; margin:0 -16px; padding:0 16px 8px; -webkit-overflow-scrolling:touch; }
  .kanban { display:flex; gap:10px; width:max-content; }
  .kanban-col { width:185px; }
  .kanban-col-header { display:flex; align-items:center; justify-content:space-between; padding:8px 11px; background:var(--surface2); border:1px solid var(--border); border-bottom:none; border-radius:8px 8px 0 0; }
  .kanban-col-title { font-size:10px; font-weight:700; font-family:var(--fd); color:var(--text); text-transform:uppercase; }
  .kanban-col-count { font-size:10px; color:var(--text3); background:var(--surface3); padding:1px 6px; border-radius:8px; }
  .kanban-col-body { background:var(--surface2); border:1px solid var(--border); border-radius:0 0 8px 8px; padding:8px; display:flex; flex-direction:column; gap:6px; min-height:160px; }
  .kanban-card { background:var(--surface); border:1px solid var(--border); border-radius:7px; padding:10px 11px; }
  .kanban-card-name { font-size:12px; font-weight:600; color:var(--text); margin-bottom:3px; }
  .kanban-card-meta { font-size:10px; color:var(--text3); margin-bottom:5px; }
  .kanban-value { font-size:11px; font-weight:700; color:var(--accent); }
  .script-item { display:flex; align-items:center; gap:11px; padding:12px 14px; background:var(--surface); border:1px solid var(--border); border-radius:9px; margin-bottom:8px; cursor:pointer; }
  .script-pbar { width:3px; height:36px; border-radius:2px; flex-shrink:0; }
  .script-info { flex:1; min-width:0; }
  .script-client { font-size:13px; font-weight:600; color:var(--text); }
  .script-type { font-size:11px; color:var(--text3); margin-top:1px; }
  .script-meta { display:flex; align-items:center; gap:6px; margin-top:5px; flex-wrap:wrap; }
  .editor-wrap { background:var(--surface2); border:1px solid var(--border); border-radius:8px; padding:14px; }
  .editor-toolbar { display:flex; gap:6px; flex-wrap:wrap; margin-bottom:10px; }
  .editor-tool-btn { padding:5px 10px; border-radius:5px; border:1px solid var(--border); background:var(--surface); color:var(--text2); font-size:11px; font-family:var(--fb); cursor:pointer; }
  .editor-tool-btn.ai { background:var(--accent-dim); border-color:var(--accent); color:var(--accent); font-weight:600; }
  .editor-textarea { width:100%; background:transparent; border:none; outline:none; font-size:12px; color:var(--text2); line-height:1.7; font-family:var(--fb); resize:none; min-height:180px; }
  .video-item { display:flex; align-items:center; gap:11px; padding:11px 0; border-bottom:1px solid var(--border); }
  .video-item:last-child { border-bottom:none; }
  .video-thumb { width:44px; height:32px; background:var(--surface3); border-radius:6px; display:flex; align-items:center; justify-content:center; font-size:16px; flex-shrink:0; }
  .video-info { flex:1; min-width:0; }
  .video-title { font-size:12px; font-weight:600; color:var(--text); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .video-meta { font-size:10px; color:var(--text3); margin-top:2px; }
  .ig-panel { background:linear-gradient(135deg,rgba(252,198,18,0.06),rgba(253,128,64,0.04)); border:1px solid rgba(252,198,18,0.15); border-radius:10px; padding:14px 16px; margin-bottom:12px; }
  .ig-header { display:flex; align-items:center; gap:10px; margin-bottom:12px; }
  .ig-title { font-family:var(--fd); font-size:13px; font-weight:700; color:var(--text); }
  .ig-sub { font-size:10px; color:#fcc612; }
  .ig-post { background:rgba(255,255,255,0.7); border:1px solid var(--border); border-radius:8px; padding:10px 12px; margin-bottom:7px; display:flex; align-items:center; gap:10px; }
  .ig-post-thumb { width:36px; height:36px; border-radius:6px; background:rgba(252,198,18,0.1); display:flex; align-items:center; justify-content:center; font-size:16px; flex-shrink:0; }
  .ig-post-title { font-size:12px; font-weight:600; color:var(--text); }
  .ig-post-date { font-size:10px; color:#fcc612; margin-top:1px; }
  .badge { display:inline-flex; align-items:center; padding:3px 10px; border-radius:20px; font-size:10px; font-weight:500; white-space:nowrap; letter-spacing:0.2px; }
  .badge-green  { background:rgba(34,150,80,0.1);   color:#1A7A42; border:1px solid rgba(34,150,80,0.25); }
  .badge-amber  { background:rgba(180,130,30,0.12);  color:#8B6914; border:1px solid rgba(180,130,30,0.25); }
  .badge-blue   { background:rgba(59,125,216,0.1);  color:#2A5FAA; border:1px solid rgba(59,125,216,0.25); }
  .badge-purple { background:rgba(253,128,64,0.1);  color:#D05A20; border:1px solid rgba(253,128,64,0.25); }
  .badge-gray   { background:rgba(85,91,110,0.1);   color:#4A4F5C; border:1px solid rgba(85,91,110,0.25); }
  .badge-red    { background:rgba(200,70,80,0.1);   color:#B03A44; border:1px solid rgba(200,70,80,0.25); }
  .badge-orange { background:rgba(252,198,18,0.1);  color:#A07B00; border:1px solid rgba(252,198,18,0.25); }

  .row-item { display:flex; align-items:center; gap:11px; padding:11px 0; border-bottom:1px solid var(--border); }
  .row-item:last-child { border-bottom:none; padding-bottom:0; }
  .row-item:first-child { padding-top:0; }
  .row-avatar { width:36px; height:36px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:600; flex-shrink:0; font-family:var(--fd); }
  .row-main { flex:1; min-width:0; }
  .row-title { font-size:13px; font-weight:500; color:var(--text); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .row-sub { font-size:11px; color:var(--text3); margin-top:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .row-right { display:flex; flex-direction:column; align-items:flex-end; gap:4px; flex-shrink:0; }

  .activity-item { display:flex; gap:10px; padding:10px 0; border-bottom:1px solid var(--border); }
  .activity-item:last-child { border-bottom:none; }
  .activity-dot { width:7px; height:7px; border-radius:50%; margin-top:5px; flex-shrink:0; }
  .activity-text { font-size:12px; color:var(--text2); line-height:1.5; }
  .activity-text strong { color:var(--text); font-weight:600; }
  .activity-time { font-size:10px; color:var(--text3); margin-top:2px; }

  .kanban-scroll { overflow-x:auto; margin:0 -18px; padding:0 18px 8px; -webkit-overflow-scrolling:touch; }
  .kanban { display:flex; gap:10px; width:max-content; }
  .kanban-col { width:185px; }
  .kanban-col-header { display:flex; align-items:center; justify-content:space-between; padding:9px 12px; background:rgba(255,255,255,0.7); border:1px solid var(--border); border-bottom:none; border-radius:12px 12px 0 0; backdrop-filter:blur(8px); }
  .kanban-col-title { font-size:10px; font-weight:600; font-family:var(--fd); color:var(--text2); text-transform:uppercase; letter-spacing:0.8px; }
  .kanban-col-count { font-size:10px; color:var(--text3); background:rgba(252,198,18,0.08); padding:1px 7px; border-radius:8px; border:1px solid var(--border); }
  .kanban-col-body { background:rgba(255,255,255,0.5); border:1px solid var(--border); border-radius:0 0 12px 12px; padding:8px; display:flex; flex-direction:column; gap:6px; min-height:160px; backdrop-filter:blur(6px); }
  .kanban-card { background:rgba(255,255,255,0.85); border:1px solid var(--border); border-radius:10px; padding:10px 12px; backdrop-filter:blur(8px); box-shadow:var(--shadow-sm); }
  .kanban-card-name { font-size:12px; font-weight:500; color:var(--text); margin-bottom:3px; }
  .kanban-card-meta { font-size:10px; color:var(--text3); margin-bottom:5px; }
  .kanban-value { font-size:11px; font-weight:600; color:var(--accent); font-family:var(--fd); }

  .script-item { display:flex; align-items:center; gap:11px; padding:13px 14px; background:var(--surface); border:1px solid var(--border); border-radius:14px; margin-bottom:8px; cursor:pointer; backdrop-filter:blur(12px); box-shadow:var(--shadow-sm); transition:all 0.15s; }
  .script-item:active { border-color:var(--accent2); }
  .script-pbar { width:3px; height:36px; border-radius:2px; flex-shrink:0; }
  .script-info { flex:1; min-width:0; }
  .script-client { font-size:13px; font-weight:500; color:var(--text); }
  .script-type { font-size:11px; color:var(--text3); margin-top:1px; }
  .script-meta { display:flex; align-items:center; gap:6px; margin-top:5px; flex-wrap:wrap; }

  .editor-wrap { background:rgba(255,255,255,0.85); border:1px solid var(--border2); border-radius:14px; padding:16px; backdrop-filter:blur(16px); box-shadow:var(--shadow-sm); }
  .editor-toolbar { display:flex; gap:6px; flex-wrap:wrap; margin-bottom:10px; }
  .editor-tool-btn { padding:6px 12px; border-radius:20px; border:1px solid var(--border2); background:rgba(255,255,255,0.7); color:var(--text2); font-size:11px; font-family:var(--fb); cursor:pointer; }
  .editor-tool-btn.ai { background:linear-gradient(135deg,rgba(252,198,18,0.1),rgba(253,128,64,0.08)); border-color:rgba(252,198,18,0.3); color:var(--accent); font-weight:600; }
  .editor-textarea { width:100%; background:transparent; border:none; outline:none; font-size:13px; color:var(--text); line-height:1.7; font-family:var(--fb); resize:none; min-height:180px; }

  .video-item { display:flex; align-items:center; gap:11px; padding:11px 0; border-bottom:1px solid var(--border); }
  .video-item:last-child { border-bottom:none; }
  .video-thumb { width:44px; height:32px; background:rgba(252,198,18,0.08); border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:16px; flex-shrink:0; border:1px solid var(--border); }
  .video-info { flex:1; min-width:0; }
  .video-title { font-size:12px; font-weight:500; color:var(--text); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .video-meta { font-size:10px; color:var(--text3); margin-top:2px; }

  .ig-panel { background:linear-gradient(135deg,rgba(252,198,18,0.06),rgba(253,128,64,0.04)); border:1px solid rgba(252,198,18,0.15); border-radius:16px; padding:16px; margin-bottom:12px; backdrop-filter:blur(16px); box-shadow:var(--shadow-sm); }
  .ig-header { display:flex; align-items:center; gap:10px; margin-bottom:12px; }
  .ig-title { font-family:var(--fd); font-size:15px; font-weight:600; color:var(--text); }
  .ig-sub { font-size:10px; color:var(--purple); }
  .ig-post { background:rgba(255,255,255,0.7); border:1px solid rgba(252,198,18,0.25); border-radius:10px; padding:10px 12px; margin-bottom:7px; display:flex; align-items:center; gap:10px; }
  .ig-post-thumb { width:36px; height:36px; border-radius:8px; background:rgba(252,198,18,0.1); display:flex; align-items:center; justify-content:center; font-size:16px; flex-shrink:0; }
  .ig-post-title { font-size:12px; font-weight:500; color:var(--text); }
  .ig-post-date { font-size:10px; color:var(--purple); margin-top:1px; }

  .client-hero { background:var(--surface); border:1px solid var(--border); border-radius:16px; padding:18px; margin-bottom:12px; position:relative; overflow:hidden; backdrop-filter:blur(16px); box-shadow:var(--shadow); }
  .client-hero::before { content:''; position:absolute; right:-30px; top:-30px; width:150px; height:150px; background:radial-gradient(circle,rgba(253,128,64,0.3),transparent 70%); pointer-events:none; }
  .deliverable-item { display:flex; align-items:center; gap:11px; padding:11px 0; border-bottom:1px solid var(--border); }
  .deliverable-item:last-child { border-bottom:none; }
  .deliverable-icon { font-size:20px; width:28px; text-align:center; flex-shrink:0; }
  .deliverable-info { flex:1; min-width:0; }
  .deliverable-title { font-size:12px; font-weight:500; color:var(--text); }
  .deliverable-sub { font-size:10px; color:var(--text3); margin-top:1px; }
  .progress-bar-wrap { background:rgba(252,198,18,0.1); border-radius:4px; height:4px; overflow:hidden; margin-top:6px; }
  .progress-bar { height:100%; border-radius:4px; }

  .call-item { display:flex; align-items:center; gap:11px; padding:11px 0; border-bottom:1px solid var(--border); }
  .call-item:last-child { border-bottom:none; }
  .call-time-block { background:var(--accent-dim); border:1px solid rgba(252,198,18,0.3); border-radius:10px; padding:6px 10px; text-align:center; flex-shrink:0; min-width:56px; }
  .call-time { font-family:var(--fd); font-size:13px; font-weight:700; color:var(--accent); }
  .call-day { font-size:9px; color:var(--accent); opacity:0.7; }

  .custom-tooltip { background:rgba(255,255,255,0.95); border:1px solid var(--border2); border-radius:10px; padding:8px 14px; backdrop-filter:blur(12px); box-shadow:var(--shadow); }
  .ct-label { font-size:10px; color:var(--text3); text-transform:uppercase; letter-spacing:0.5px; }
  .ct-value { font-family:var(--fd); font-size:18px; font-weight:600; color:var(--text); }

  .toast { position:fixed; top:64px; left:calc(var(--sidebar) + 14px); right:14px; background:rgba(255,255,255,0.97); border:1px solid var(--border2); border-radius:14px; padding:12px 16px; z-index:400; display:flex; align-items:center; gap:10px; box-shadow:0 8px 40px rgba(0,0,0,0.1); animation:toastIn 0.2s ease; backdrop-filter:blur(20px); max-width:500px; }
  @media (max-width:860px) { .toast { left:14px; } }
  @keyframes toastIn { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
  .toast-icon { font-size:18px; flex-shrink:0; }
  .toast-text { font-size:13px; font-weight:500; color:var(--text); }
  .toast-sub { font-size:11px; color:var(--text2); margin-top:2px; }

  .empty { text-align:center; padding:48px 20px; color:var(--text3); }
  .empty-icon { font-size:36px; margin-bottom:10px; opacity:0.6; }
  .empty-title { font-family:var(--fd); font-size:16px; color:var(--text2); margin-bottom:6px; font-weight:500; }

  ::-webkit-scrollbar { width:3px; height:3px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:rgba(0,0,0,0.15); border-radius:2px; }
`;

// ─── DATA ─────────────────────────────────────────────────────────────────────
const MRR_DATA = [
  {month:"Oct",mrr:5200},{month:"Nov",mrr:5800},{month:"Dec",mrr:6400},
  {month:"Jan",mrr:7200},{month:"Feb",mrr:7800},{month:"Mar",mrr:8400},
];
const VIDEO_DATA = [
  {month:"Oct",videos:11},{month:"Nov",videos:14},{month:"Dec",videos:16},
  {month:"Jan",videos:18},{month:"Feb",videos:20},{month:"Mar",videos:23},
];

const INIT_CLIENTS = [
  {id:1,name:"Frost Barbershop",    industry:"barbershop",    plan:"Growth",  status:"active",     stage:"Production", nextPost:"Mar 19",color:"#3B82F6",videos:4, mrr:1200},
  {id:2,name:"Desert Sun Realty",   industry:"real estate",   plan:"Pro",     status:"active",     stage:"Publishing", nextPost:"Mar 20",color:"#A855F7",videos:8, mrr:2400},
  {id:3,name:"Cactus CrossFit",     industry:"gym/fitness",   plan:"Starter", status:"active",     stage:"Scripting",  nextPost:"Mar 22",color:"#22C55E",videos:2, mrr:600 },
  {id:4,name:"Mesa Auto Detailing", industry:"auto detailing",plan:"Growth",  status:"review",     stage:"Editing",    nextPost:"Mar 18",color:"#FFB800",videos:6, mrr:1200},
  {id:5,name:"Sky Harbor Dental",   industry:"dental",        plan:"Pro",     status:"active",     stage:"Approved",   nextPost:"Mar 21",color:"#FF5C00",videos:10,mrr:2400},
  {id:6,name:"Tempe Taqueria",      industry:"restaurant",    plan:"Starter", status:"onboarding", stage:"Onboarding", nextPost:"—",     color:"#9999A8",videos:0, mrr:600 },
];

const INIT_LEADS = {
  "New":      [{id:1,name:"Phoenix Flooring Co",  value:"$1,200/mo",source:"IG DM",   rep:"Carlos",industry:"flooring contractor"  },
               {id:2,name:"AZ Landscaping",        value:"$600/mo",  source:"Referral",rep:"Jade",  industry:"landscaping"          },
               {id:3,name:"Scottsdale Spa",         value:"$1,800/mo",source:"Website", rep:"Carlos",industry:"med spa"              }],
  "Contacted":[{id:4,name:"Desert Bloom Boutique", value:"$1,200/mo",source:"Cold",    rep:"Jade",  industry:"retail boutique"      },
               {id:5,name:"Mesa Roofing Co",        value:"$2,400/mo",source:"Referral",rep:"Carlos",industry:"roofing contractor"   }],
  "Demo":     [{id:6,name:"Chandler Law Group",    value:"$2,400/mo",source:"IG DM",   rep:"Jade",  industry:"law firm"             },
               {id:7,name:"Scottsdale Med Spa",     value:"$1,800/mo",source:"Referral",rep:"Carlos",industry:"med spa"              }],
  "Proposal": [{id:8,name:"Sun Devil Gym",         value:"$1,200/mo",source:"Website", rep:"Jade",  industry:"gym/fitness"          }],
  "Won ✓":    [{id:9,name:"Tempe Taqueria",        value:"$600/mo",  source:"Referral",rep:"Carlos",industry:"restaurant"           }],
};

const INIT_SCRIPTS = [
  {id:1,client:"Mesa Auto Detailing",type:"Before/After Reveal", due:"Mar 18",priority:"high",status:"In Progress",  draft:"HOOK (0–3 sec)\nYour car is about to look brand new — watch this.\n\nSETUP (3–10 sec)\nThis Tesla Model S came in covered in swirl marks and a year of Arizona sun damage...\n\nBODY (10–40 sec)\nFirst we do a full decontamination wash. Iron remover. Clay bar. Then two-step paint correction with our 12mm DA polisher...\n\nCTA (40–50 sec)\nIf your car deserves this, link in bio to book your detail. Spots fill fast."},
  {id:2,client:"Desert Sun Realty",  type:"Listing Showcase",     due:"Mar 19",priority:"high",status:"Needs Revision",draft:""},
  {id:3,client:"Frost Barbershop",   type:"Day in the Life",      due:"Mar 21",priority:"med", status:"Assigned",     draft:""},
  {id:4,client:"Sky Harbor Dental",  type:"Patient Testimonial",  due:"Mar 22",priority:"med", status:"Assigned",     draft:""},
  {id:5,client:"Cactus CrossFit",    type:"Workout Highlight",    due:"Mar 24",priority:"low", status:"Assigned",     draft:""},
];

const INIT_VIDEOS = [
  {id:1,client:"Sky Harbor Dental",  title:"Patient Transformation #4", status:"Review",     due:"Mar 18",thumb:"🦷"},
  {id:2,client:"Desert Sun Realty",  title:"Listing @ 4821 Cactus Rd",  status:"Editing",    due:"Mar 19",thumb:"🏠"},
  {id:3,client:"Mesa Auto Detailing",title:"Black Tesla Model S Detail", status:"Raw Footage",due:"Mar 21",thumb:"🚗"},
  {id:4,client:"Frost Barbershop",   title:"Saturday Vibes — March",    status:"Approved",   due:"Mar 22",thumb:"✂️"},
  {id:5,client:"Cactus CrossFit",    title:"Open Workout 25.2 Recap",   status:"Review",     due:"Mar 22",thumb:"🏋️"},
];

const INIT_IG = [
  {id:1,client:"Desert Sun Realty",caption:"Just listed! 4821 Cactus Rd...",    date:"Mar 20, 9:00 AM", thumb:"🏠",status:"Scheduled"},
  {id:2,client:"Sky Harbor Dental", caption:"See what our patients are saying...",date:"Mar 21, 10:30 AM",thumb:"🦷",status:"Scheduled"},
  {id:3,client:"Frost Barbershop",  caption:"Fresh cuts, fresh week ✂️",         date:"Mar 22, 8:00 AM", thumb:"✂️",status:"Draft"},
];

const INIT_NOTIFS = [
  {id:1,icon:"🎬",text:<><strong>Jordan T.</strong> uploaded Patient Transformation #4</>,  time:"11 min ago",unread:true },
  {id:2,icon:"📊",text:<><strong>Carlos V.</strong> moved Chandler Law → Demo Scheduled</>, time:"34 min ago",unread:true },
  {id:3,icon:"✍️",text:<><strong>Maya R.</strong> submitted Frost Barbershop script</>,     time:"1 hr ago",  unread:true },
  {id:4,icon:"📸",text:<>Instagram published for <strong>Desert Sun Realty</strong></>,      time:"2 hr ago",  unread:false},
  {id:5,icon:"💰",text:<><strong>Tempe Taqueria</strong> payment received — $600</>,         time:"3 hr ago",  unread:false},
];

const INIT_THREADS = [
  {id:1,name:"Carlos V.",role:"Account Manager",color:"#3B82F6",last:"Your March content plan is looking great!",time:"11 min",unread:2,
   messages:[{id:1,from:"Carlos V.",mine:false,text:"Hey! Your March content plan is looking great. 8 videos lined up.",time:"11 min ago"},{id:2,from:"Carlos V.",mine:false,text:"The listing showcase for 4821 Cactus is going into editing today.",time:"10 min ago"}]},
  {id:2,name:"Maya R.",role:"Script Writer",color:"#A855F7",last:"I've drafted the neighborhood spotlight script!",time:"1 hr",unread:1,
   messages:[{id:1,from:"Maya R.",mine:false,text:"I've drafted the script for your neighborhood spotlight reel — take a look!",time:"1 hr ago"}]},
  {id:3,name:"Jordan T.",role:"Video Editor",color:"#22C55E",last:"Sold! Desert View is ready for approval.",time:"2 hr",unread:0,
   messages:[{id:1,from:"Jordan T.",mine:false,text:"The 'Sold! 3901 Desert View' video is ready for your approval.",time:"2 hr ago"},{id:2,from:"Me",mine:true,text:"Looks amazing! Approved 👍",time:"1 hr ago"},{id:3,from:"Jordan T.",mine:false,text:"Perfect, scheduling it for tomorrow morning.",time:"58 min ago"}]},
];

const AD_SPEND_DATA = [
  {month:"Oct",spend:2800},{month:"Nov",spend:3200},{month:"Dec",spend:3600},
  {month:"Jan",spend:3900},{month:"Feb",spend:4000},{month:"Mar",spend:4200},
];

const AD_CAMPAIGNS = [
  {id:1,client:"Mesa Auto Detailing",name:"Spring Detail Special",platform:"Instagram",budget:800,impressions:42000,clicks:1344,ctr:"3.2%",conversions:89,status:"Running",roas:"3.8x"},
  {id:2,client:"Desert Sun Realty",name:"New Listing Ads",platform:"Both",budget:1200,impressions:68000,clicks:1904,ctr:"2.8%",conversions:124,status:"Running",roas:"4.8x"},
  {id:3,client:"Tempe Taqueria",name:"Grand Opening",platform:"Facebook",budget:600,impressions:28000,clicks:1148,ctr:"4.1%",conversions:42,status:"Scheduled",roas:"—"},
  {id:4,client:"Cactus CrossFit",name:"Membership Drive",platform:"Instagram",budget:400,impressions:18000,clicks:630,ctr:"3.5%",conversions:29,status:"Paused",roas:"2.1x"},
];

const CLIENT_AD_DATA = [
  {day:"Mar 1",impressions:1800},{day:"Mar 5",impressions:2400},{day:"Mar 10",impressions:3100},
  {day:"Mar 15",impressions:2800},{day:"Mar 20",impressions:3400},{day:"Mar 25",impressions:2600},{day:"Mar 30",impressions:3200},
];

const SALES_ACTIVITY_LOG = [
  {id:1,type:"Deals",text:<><strong>Carlos V.</strong> moved <strong>Chandler Law Group</strong> to Demo Scheduled</>,time:"34 min ago",icon:"📊",color:"var(--blue)"},
  {id:2,type:"Calls",text:<><strong>Jade</strong> completed discovery call with <strong>Desert Bloom Boutique</strong></>,time:"1 hr ago",icon:"📞",color:"var(--green)"},
  {id:3,type:"Emails",text:<><strong>Carlos V.</strong> sent proposal to <strong>Sun Devil Gym</strong></>,time:"2 hr ago",icon:"📧",color:"var(--purple)"},
  {id:4,type:"Deals",text:<><strong>Jade</strong> added <strong>Scottsdale Spa</strong> as a new lead</>,time:"3 hr ago",icon:"🎯",color:"var(--accent)"},
  {id:5,type:"Calls",text:<><strong>Carlos V.</strong> scheduled demo with <strong>Mesa Roofing Co</strong> for Thursday</>,time:"4 hr ago",icon:"🎥",color:"var(--blue)"},
  {id:6,type:"Emails",text:<><strong>Jade</strong> sent follow-up email to <strong>Phoenix Flooring Co</strong></>,time:"5 hr ago",icon:"📧",color:"var(--purple)"},
  {id:7,type:"Deals",text:<><strong>Carlos V.</strong> closed <strong>Tempe Taqueria</strong> — $600/mo</>,time:"Yesterday",icon:"🎉",color:"var(--green)"},
  {id:8,type:"Calls",text:<><strong>Jade</strong> completed onboarding call with <strong>Tempe Taqueria</strong></>,time:"Yesterday",icon:"📞",color:"var(--green)"},
  {id:9,type:"Emails",text:<><strong>Carlos V.</strong> sent contract to <strong>AZ Landscaping</strong></>,time:"2 days ago",icon:"📧",color:"var(--purple)"},
  {id:10,type:"Deals",text:<><strong>Jade</strong> updated pricing for <strong>Scottsdale Med Spa</strong> proposal</>,time:"2 days ago",icon:"💰",color:"var(--accent)"},
];

const STATUS_FLOW = {"Raw Footage":"Editing","Editing":"Review","Review":"Approved","Approved":"Scheduled"};
const VID_STATUS_COLOR = {"Review":"amber","Editing":"blue","Raw Footage":"gray","Approved":"green","Scheduled":"purple"};

// ─── AI HELPER ────────────────────────────────────────────────────────────────
async function callClaude(prompt) {
  // Demo mode: simulate AI generation with realistic content
  await new Promise(r => setTimeout(r, 800 + Math.random() * 1200));
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];

  // Extract common fields from prompt
  const clientMatch = prompt.match(/Client:\s*(.+)/i);
  const client = clientMatch ? clientMatch[1].split("(")[0].trim() : "the business";
  const industryMatch = prompt.match(/\(([^)]+)\s+in\s+Arizona\)/i) || prompt.match(/Industry:\s*(.+)/i);
  const industry = industryMatch ? industryMatch[1].trim() : "local business";

  // ── CONTENT IDEAS (expects JSON array) ──
  if (prompt.includes("video content ideas") && prompt.includes("JSON array")) {
    const types = ["Behind the Scenes","Before/After","Educational","Testimonial","Day in the Life","Trending","Promotional","Story"];
    const ideaTemplates = [
      {t:"Day in the Life",d:`Follow the team at ${client} through a packed Arizona morning. Capture the energy, the hustle, and the little moments that make this place special.`,h:`Ever wonder what happens before ${client} opens the doors?`},
      {t:"Before & After Reveal",d:`Show a dramatic transformation from start to finish. Quick cuts building anticipation, then the jaw-dropping final reveal.`,h:"Wait for the reveal at the end... trust me."},
      {t:"Client Reaction",d:`Film a genuine client seeing their results for the first time at ${client}. Raw reactions, no scripts, just real emotion.`,h:"Watch their face when they see the results..."},
      {t:"Meet the Team",d:`Quick personality intros of the crew at ${client}. Fun questions, hot takes, and why they love what they do in Arizona.`,h:"The people behind ${client} are NOT what you'd expect."},
      {t:"Arizona Hidden Gem",d:`Position ${client} as one of Arizona's best-kept secrets. Tour the space, highlight what makes them unique in the Valley.`,h:"Arizona locals — you need to know about this place."},
      {t:"Process Breakdown",d:`Break down exactly how ${client} delivers their service step by step. Educational but entertaining with fast cuts and text overlays.`,h:"Here's exactly how ${client} does it (most people have no idea)."},
      {t:"5 Things You Didn't Know",d:`Five surprising facts about ${client} or their ${industry} craft. Quick-hit format with one fact per scene.`,h:"5 things you didn't know about ${client}..."},
      {t:"Customer Story Spotlight",d:`Tell a real customer's story — the problem they had, how ${client} solved it, and the outcome. Mini-documentary style.`,h:"This customer drove 45 minutes just for ${client}. Here's why."},
      {t:"Trending Sound Remix",d:`Take a trending audio and put a ${industry} spin on it. Relatable humor meets real business moments.`,h:"When the trending sound fits perfectly..."},
      {t:"Saturday Rush",d:`Capture the energy of ${client}'s busiest time. Fast cuts, great music, the chaos and craft of a packed day.`,h:"This is what a Saturday at ${client} looks like."},
    ];
    const shuffled = ideaTemplates.sort(() => Math.random() - 0.5).slice(0, 8);
    return JSON.stringify(shuffled.map((idea, i) => ({
      title: idea.t,
      description: idea.d,
      type: types[i % types.length],
      hook: idea.h
    })));
  }

  // ── CONTENT CALENDAR (expects JSON array) ──
  if (prompt.includes("content calendar") && prompt.includes("JSON array")) {
    const entries = [];
    const clientsMatch = prompt.match(/- (.+)/g) || [];
    const parsedClients = clientsMatch.map(c => {
      const name = c.replace("- ","").split("(")[0].trim();
      return name;
    });
    const types = ["Behind the Scenes","Before/After","Educational","Testimonial","Day in the Life","Promotional"];
    const titles = ["Spring Lineup Feature","Transformation Tuesday","Meet the Team","Client Spotlight","Arizona Vibes","Weekend Recap","How It's Done","5 Things You Didn't Know"];
    let id = 1;
    for (let day = 1; day <= 28; day += 3) {
      const cl = parsedClients[id % parsedClients.length] || "Client";
      entries.push({
        date: `Apr ${day}`, client: cl, title: pick(titles),
        type: pick(types), description: `Engaging ${pick(types).toLowerCase()} content showcasing what makes ${cl} stand out in the Arizona market. Quick cuts, great energy, and a strong hook to stop the scroll.`,
        platform: "Instagram Reel", time: pick(["9:00 AM","10:00 AM","11:00 AM","12:00 PM"])
      });
      id++;
    }
    return JSON.stringify(entries);
  }

  // ── CAPTION ──
  if (prompt.includes("Instagram caption")) {
    const descMatch = prompt.match(/Video description:\s*(.+)/i);
    const desc = descMatch ? descMatch[1].trim() : "content";
    const captions = [
      `This is what happens when you let the pros handle it. ${client} never misses. Drop a 🔥 if you agree.\n\n#Arizona #AZBusiness #${client.replace(/\s+/g,"")} #SmallBusiness #ContentCreator #ReelsOfInstagram #SupportLocal #ScottsdaleAZ #PhoenixBusiness #VideoMarketing`,
      `POV: You just found your new favorite ${industry} spot in Arizona. You're welcome. Link in bio to book.\n\n#ArizonaLife #LocalBusiness #${client.replace(/\s+/g,"")} #PhoenixAZ #ContentDay #ReelTrending #ShopLocal #AZLocal #BehindTheScenes #SmallBizLove`,
      `Still thinking about this one. ${client} really outdid themselves and we caught every second of it. Tap that follow for more.\n\n#${client.replace(/\s+/g,"")} #ArizonaBusiness #ContentCreation #Reels #SocialMediaMarketing #AZLife #VideoContent #LocalLove #MarketingAgency #Media4You`,
    ];
    return pick(captions);
  }

  // ── OUTREACH MESSAGE ──
  if (prompt.includes("outreach") && (prompt.includes("DM") || prompt.includes("email") || prompt.includes("channel"))) {
    const leadMatch = prompt.match(/Lead business:\s*(.+)/i);
    const lead = leadMatch ? leadMatch[1].trim() : "your business";
    const isDM = prompt.includes("Instagram DM");
    if (isDM) {
      return pick([
        `Hey! 👋 I've been following ${lead} and love what you're doing in the ${industry} space here in AZ. We help businesses like yours create scroll-stopping Reels that actually drive traffic. Would you be open to a quick 10-min call this week to see if we're a fit?`,
        `Hi there! Came across ${lead} and had to reach out. We work with Arizona ${industry} businesses on their social media content and I think there's a huge opportunity for your brand on Reels. Would love to chat for a few minutes if you're open to it!`,
        `Hey! 🙌 Big fan of what ${lead} is building. We're a local AZ content agency and we've helped similar ${industry} businesses grow their Instagram by 3-5x with short-form video. Want to hop on a quick call to see if it makes sense for you?`,
      ]);
    }
    return pick([
      `Subject: Quick idea for ${lead}'s social media\n\nHi there,\n\nI came across ${lead} and was really impressed with what you're building in the Arizona ${industry} space. I run Media4You, a local content agency that specializes in short-form video for businesses like yours.\n\nWe've helped several ${industry} businesses in the Valley grow their social media presence with professional Reels that actually convert followers into customers. I'd love to share a few ideas specific to ${lead}.\n\nWould you be open to a quick 15-minute call this week? No pressure at all — just wanted to connect and see if there's a fit.\n\nBest,\nMedia4You Team`,
      `Subject: Loved what I saw from ${lead}\n\nHi,\n\nI've been following ${lead} on social and your business clearly stands out in Arizona's ${industry} scene. That said, I think there's a massive opportunity to amplify your reach with consistent, high-quality Reels content.\n\nAt Media4You, we handle everything from strategy to filming to posting — so you can focus on running your business. We work with several Arizona businesses in similar industries and the results have been incredible.\n\nI'd love to grab 10 minutes on a call to share some ideas tailored to ${lead}. Would any time this week work?\n\nCheers,\nMedia4You Team`,
    ]);
  }

  // ── SCRIPT (default) ──
  const hookHintMatch = prompt.match(/Hook to use:\s*(.+)/i);
  const hookHint = hookHintMatch ? hookHintMatch[1].trim() : "";
  const hooks = [
    `Stop scrolling — you NEED to see what ${client} just did.`,
    `POV: You just walked into ${client} and your jaw dropped.`,
    `This is why ${client} is blowing up in Arizona right now.`,
    `Wait for it… ${client} does NOT disappoint.`,
    `"No way they actually did this" — yes. Yes they did.`,
  ];
  const setups = [
    `We spent the morning with ${client} and captured something special. Here's the behind-the-scenes look you've been asking for.`,
    `${client} called us in for a full content day and we had to share this. The vibes were unreal from the moment we walked in.`,
    `The team at ${client} has been working on something big and today we finally got to see it in action.`,
  ];
  const bodies = [
    `Watch as the team brings their A-game from start to finish. Every single detail is dialed in — the craftsmanship, the energy, the results. This is what sets ${client} apart from everyone else in the Valley.`,
    `From the setup to the final reveal, everything about this was next level. The attention to detail? Unmatched. The customer reactions? Priceless. ${client} doesn't just deliver — they over-deliver, every single time.`,
    `We filmed the entire process so you could see exactly what makes ${client} different. No shortcuts, no compromises — just real professionals doing what they do best right here in Arizona.`,
  ];
  const ctas = [
    `Follow ${client} for more and tap the link in bio to book yours today. Spots fill up fast — don't sleep on this.`,
    `Drop a 🔥 if you want to see more content like this. Follow us and ${client} so you don't miss the next one.`,
    `Tag someone who needs to see this. Follow for more Arizona business content and hit the link in bio to connect with ${client}.`,
  ];
  const hook = hookHint && !hookHint.toLowerCase().includes("create a strong") ? hookHint : pick(hooks);
  return `HOOK (0–3 sec)\n${hook}\n\nSETUP (3–10 sec)\n${pick(setups)}\n\nBODY (10–40 sec)\n${pick(bodies)}\n\nCTA (40–50 sec)\n${pick(ctas)}`;
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function Badge({ type, children }) { return <span className={`badge badge-${type}`}>{children}</span>; }
function Toast({ toast }) {
  if (!toast) return null;
  return <div className="toast"><div className="toast-icon">{toast.icon}</div><div><div className="toast-text">{toast.text}</div>{toast.sub&&<div className="toast-sub">{toast.sub}</div>}</div></div>;
}
function CustomTooltip({ active, payload, label, prefix="$" }) {
  if (!active||!payload?.length) return null;
  return <div className="custom-tooltip"><div className="ct-label">{label}</div><div className="ct-value">{prefix}{prefix==="$"?payload[0].value.toLocaleString():payload[0].value}</div></div>;
}
function AILoading({ text = "Claude is thinking..." }) {
  return <div className="ai-loading"><div className="ai-spinner"/><div><div className="ai-loading-text">{text}</div><div className="ai-loading-sub">Powered by Claude AI</div></div></div>;
}

// ─── AI: VIDEO IDEA GENERATOR ─────────────────────────────────────────────────
function VideoIdeaGenerator({ client, onIdeaToScript, onClose }) {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const generate = async () => {
    setLoading(true);
    setIdeas([]);
    try {
      const result = await callClaude(
        `Generate 8 specific short-form video content ideas for a ${client.industry} business called "${client.name}" based in Arizona. They post on Instagram Reels.

For each idea return ONLY a JSON array (no markdown, no extra text) like:
[{"title":"...","description":"...","type":"...","hook":"..."}]

where type is one of: Behind the Scenes, Before/After, Educational, Testimonial, Day in the Life, Trending, Promotional, Story
Make each idea specific to their industry and Arizona market.`,
        "You are a content strategist. Return only valid JSON arrays, no markdown backticks, no extra text."
      );
      const parsed = JSON.parse(result.trim());
      setIdeas(parsed);
      setGenerated(true);
    } catch(e) {
      // fallback ideas
      setIdeas([
        {title:"Day in the Life",description:`Follow a ${client.industry} professional through a full day in Arizona`,type:"Day in the Life",hook:"Ever wonder what a day in a ${client.industry} looks like?"},
        {title:"Before & After Reveal",description:"Show a dramatic transformation with the final reveal at the end",type:"Before/After",hook:"You won't believe this transformation..."},
        {title:"Client Reaction",description:"Capture genuine client reactions to your service",type:"Testimonial",hook:"Watch their face when they see the results..."},
      ]);
      setGenerated(true);
    }
    setLoading(false);
  };

  return (
    <div className="full-panel">
      <div style={{padding:"12px 14px",borderBottom:"1px solid var(--border)",background:"var(--surface)",display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
        <button className="btn back" style={{margin:0,padding:"6px 10px",fontSize:12}} onClick={onClose}>←</button>
        <div>
          <div style={{fontFamily:"var(--fd)",fontSize:14,fontWeight:700,color:"var(--text)"}}>{client.name}</div>
          <div style={{fontSize:11,color:"var(--text3)"}}>AI Video Ideas</div>
        </div>
        <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:6}}>
          <div style={{width:6,height:6,borderRadius:"50%",background:"var(--purple)"}}/>
          <span style={{fontSize:10,color:"var(--text3)"}}>Claude AI</span>
        </div>
      </div>
      <div className="full-panel-scroll">
        {!generated && !loading && (
          <>
            <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:10,padding:"16px",marginBottom:12}}>
              <div style={{fontFamily:"var(--fd)",fontSize:13,fontWeight:700,color:"var(--text)",marginBottom:4}}>Generate Content Ideas</div>
              <div style={{fontSize:12,color:"var(--text3)",lineHeight:1.5,marginBottom:14}}>Claude will analyze <strong style={{color:"var(--text)"}}>{client.name}</strong> as a {client.industry} business and generate 8 tailored video ideas for their Instagram Reels.</div>
              <button className="btn primary full" onClick={generate}>✨ Generate Ideas for {client.name}</button>
            </div>
            <div style={{fontSize:10,color:"var(--text3)",textTransform:"uppercase",letterSpacing:"1px",fontWeight:700,marginBottom:8}}>What you'll get</div>
            {["8 ideas tailored to their exact industry","Hook text for each video","Content type tag (BTS, Testimonial, etc.)","One-tap script generation from any idea"].map(f => (
              <div key={f} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:"var(--accent)",flexShrink:0}}/>
                <span style={{fontSize:12,color:"var(--text2)"}}>{f}</span>
              </div>
            ))}
          </>
        )}
        {loading && <AILoading text={`Generating ideas for ${client.name}...`}/>}
        {generated && !loading && (
          <>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
              <div style={{fontSize:11,color:"var(--text3)",textTransform:"uppercase",letterSpacing:"1px",fontWeight:700}}>{ideas.length} ideas generated</div>
              <button className="action-btn accent" onClick={generate}>↺ Regenerate</button>
            </div>
            {ideas.map((idea, i) => (
              <div className="idea-card" key={i}>
                <div className="idea-card-header">
                  <span className="idea-num">#{i+1}</span>
                  <div className="idea-title">{idea.title}</div>
                </div>
                <div className="idea-desc">{idea.description}</div>
                {idea.hook && <div style={{fontSize:11,color:"var(--accent)",fontStyle:"italic",marginBottom:8}}>Hook: "{idea.hook}"</div>}
                <div className="idea-footer">
                  <span className="idea-tag">{idea.type}</span>
                  <button className="idea-script-btn" onClick={() => onIdeaToScript(client, idea)}>✨ Write Script</button>
                </div>
              </div>
            ))}
            <button className="btn full" style={{marginTop:4}} onClick={generate}>✨ Generate 8 More Ideas</button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── AI: CONTENT CALENDAR ─────────────────────────────────────────────────────
function ContentCalendar({ clients, onClose, showToast }) {
  const [calendar, setCalendar] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [selClient, setSelClient] = useState("all");
  const [selectedPost, setSelectedPost] = useState(null);
  const [captionLoading, setCaptionLoading] = useState(false);
  const [scriptLoading, setScriptLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    const targetClients = selClient === "all" ? clients.filter(c=>c.status==="active") : clients.filter(c=>c.name===selClient);
    try {
      const result = await callClaude(
        `Create a social media content calendar for April 2025 for these Arizona businesses managed by a marketing agency:
${targetClients.map(c=>`- ${c.name} (${c.industry}, ${c.plan} plan: ${c.plan==="Starter"?2:c.plan==="Growth"?4:8} posts/mo)`).join("\n")}

Return ONLY a JSON array (no markdown):
[{"date":"Apr X","client":"...","title":"...","type":"...","description":"2-3 sentence description of the video concept","platform":"Instagram Reel","time":"9:00 AM"}]

Distribute posts evenly. Use realistic content types for each industry. Include specific video descriptions.`,
        "Return only valid JSON arrays, no markdown backticks, no extra text."
      );
      const parsed = JSON.parse(result.trim());
      setCalendar(parsed.map((p,i)=>({...p,id:i+1,status:"Planned",caption:"",script:"",assigned:""})));
      setGenerated(true);
    } catch(e) {
      setCalendar([
        {id:1,date:"Apr 1", client:"Frost Barbershop",    title:"Spring Lineup Styles",          type:"Promotional",  description:"Showcase the top 5 trending haircuts for spring. Quick cuts between styles with upbeat music and text overlays naming each cut.",platform:"Instagram Reel",time:"9:00 AM",status:"Planned",caption:"",script:"",assigned:""},
        {id:2,date:"Apr 3", client:"Desert Sun Realty",   title:"New Listing — Scottsdale",      type:"Listing Tour", description:"Cinematic walkthrough of a new Scottsdale listing. Drone opening shot, interior highlights, backyard reveal with mountain views.",platform:"Instagram Reel",time:"10:00 AM",status:"Planned",caption:"",script:"",assigned:""},
        {id:3,date:"Apr 5", client:"Sky Harbor Dental",   title:"Teeth Whitening Before/After",  type:"Before/After", description:"Split-screen before and after of a teeth whitening patient. Show the process briefly, then the dramatic smile reveal.",platform:"Instagram Reel",time:"11:00 AM",status:"Planned",caption:"",script:"",assigned:""},
        {id:4,date:"Apr 7", client:"Mesa Auto Detailing", title:"Spring Detail Special",         type:"Promotional",  description:"Time-lapse of a full exterior detail on a red sports car. Show wash, clay bar, polish, and ceramic coat with satisfying close-ups.",platform:"Instagram Reel",time:"9:00 AM",status:"Planned",caption:"",script:"",assigned:""},
        {id:5,date:"Apr 10",client:"Cactus CrossFit",     title:"Member Transformation Story",   type:"Testimonial",  description:"Interview a member about their 6-month fitness journey. Cut between their story and workout footage. End with their results.",platform:"Instagram Reel",time:"8:00 AM",status:"Planned",caption:"",script:"",assigned:""},
        {id:6,date:"Apr 12",client:"Desert Sun Realty",   title:"Neighborhood Tour — Mesa",      type:"Educational",  description:"Drive-through tour of a Mesa neighborhood. Highlight local restaurants, parks, schools, and home styles. Great for relocating buyers.",platform:"Instagram Reel",time:"10:00 AM",status:"Planned",caption:"",script:"",assigned:""},
        {id:7,date:"Apr 15",client:"Frost Barbershop",    title:"Day in the Shop — Saturday",    type:"Behind Scenes",description:"Follow the busiest day of the week from open to close. Show the energy, the clients, the banter, and the craft of each barber.",platform:"Instagram Reel",time:"9:00 AM",status:"Planned",caption:"",script:"",assigned:""},
        {id:8,date:"Apr 17",client:"Sky Harbor Dental",   title:"Meet the Hygienist Team",       type:"Team Intro",   description:"Quick personality intros of each hygienist. Fun questions, their favorite dental tip, and why they love working here.",platform:"Instagram Reel",time:"11:00 AM",status:"Planned",caption:"",script:"",assigned:""},
      ]);
      setGenerated(true);
    }
    setLoading(false);
  };

  const updatePost = (id, updates) => {
    setCalendar(prev=>prev.map(p=>p.id===id?{...p,...updates}:p));
    if(selectedPost?.id===id) setSelectedPost(prev=>({...prev,...updates}));
  };

  const generateCaption = async (post) => {
    setCaptionLoading(true);
    try {
      const result = await callClaude(
        `Write an Instagram caption for a video post.
Client: ${post.client}
Video: ${post.title}
Description: ${post.description||post.type}

Requirements:
- 2-3 sentences max, punchy and engaging
- Include a clear call to action
- Add 8-12 relevant hashtags on a new line
- Local Arizona hashtags where relevant
- Sound natural, not corporate

Return just the caption and hashtags, nothing else.`
      );
      updatePost(post.id, {caption:result});
      showToast("✨","Caption generated","Review and edit below");
    } catch(e) {
      updatePost(post.id, {caption:`Ready to transform your feed? ${post.client} is bringing the heat this spring 🔥 Check out what's new and book your spot before it's gone!\n\n#Arizona #Phoenix #${post.client.replace(/\s/g,'')} #SmallBusiness #ContentCreation #Reels #SocialMediaMarketing #AZBusiness #Media4You`});
      showToast("✨","Caption generated","Review and edit below");
    }
    setCaptionLoading(false);
  };

  const generateScript = async (post) => {
    setScriptLoading(true);
    try {
      const result = await callClaude(
        `Write a short-form Instagram Reel script for:
Client: ${post.client}
Video: ${post.title}
Concept: ${post.description||post.type}

Format exactly as:
HOOK (0-3 sec)
[hook text]

SETUP (3-10 sec)
[setup text]

BODY (10-40 sec)
[body text]

CTA (40-50 sec)
[cta text]

Punchy, Arizona flavor where relevant. No hashtags. Just the script.`
      );
      updatePost(post.id, {script:result});
      showToast("✨","Script generated","Review and edit below");
    } catch(e) {
      updatePost(post.id, {script:`HOOK (0-3 sec)\nYou need to see this.\n\nSETUP (3-10 sec)\n${post.client} just leveled up and we caught it all on camera...\n\nBODY (10-40 sec)\nWatch as we take you through the full process from start to finish. Every detail matters and this is why ${post.client} is the best in Arizona.\n\nCTA (40-50 sec)\nFollow for more and tap the link in bio to book yours today.`});
      showToast("✨","Script generated","Review and edit below");
    }
    setScriptLoading(false);
  };

  const filtered = selClient==="all" ? calendar : calendar.filter(p=>p.client===selClient);
  const statusColors = {Planned:"gray",Scripted:"blue","Caption Ready":"amber",Approved:"green",Scheduled:"purple",Published:"green"};
  const teamMembers = ["Maya R.","Jordan T.","Carlos V."];

  // ── POST DETAIL VIEW ──
  if (selectedPost) {
    const post = calendar.find(p=>p.id===selectedPost.id)||selectedPost;
    return (
      <div className="full-panel">
        <div style={{padding:"12px 14px",borderBottom:"1px solid var(--border)",background:"var(--surface)",display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
          <button className="btn back" style={{margin:0,padding:"6px 10px",fontSize:12}} onClick={()=>setSelectedPost(null)}>←</button>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontFamily:"var(--fd)",fontSize:14,fontWeight:700,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{post.title}</div>
            <div style={{fontSize:11,color:"var(--text3)"}}>{post.client} · {post.date}</div>
          </div>
          <Badge type={statusColors[post.status]||"gray"}>{post.status}</Badge>
        </div>
        <div className="full-panel-scroll">
          {/* Post Overview */}
          <div className="card">
            <div className="card-title">Post Details</div>
            <div className="row-item" style={{borderBottom:"none"}}>
              <div style={{flex:1}}>
                <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:10}}>
                  <Badge type="gray">{post.type}</Badge>
                  <Badge type="blue">{post.platform||"Instagram Reel"}</Badge>
                  <Badge type="amber">{post.time||"9:00 AM"}</Badge>
                </div>
                <div style={{fontSize:13,color:"var(--text2)",lineHeight:1.6}}>{post.description||"No description yet."}</div>
              </div>
            </div>
            {/* Status & Assignment */}
            <div style={{marginTop:12,display:"flex",gap:8}}>
              <div className="form-group" style={{flex:1,margin:0}}>
                <label className="form-label">Status</label>
                <select className="form-select" value={post.status} onChange={e=>{updatePost(post.id,{status:e.target.value});showToast("✅","Status updated",post.title+" → "+e.target.value);}}>
                  {["Planned","Scripted","Caption Ready","Approved","Scheduled","Published"].map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group" style={{flex:1,margin:0}}>
                <label className="form-label">Assigned To</label>
                <select className="form-select" value={post.assigned||""} onChange={e=>{updatePost(post.id,{assigned:e.target.value});showToast("👤","Assigned",post.title+" → "+e.target.value);}}>
                  <option value="">Unassigned</option>
                  {teamMembers.map(m=><option key={m}>{m}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Script Section */}
          <div className="card">
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
              <div className="card-title" style={{margin:0}}>Script</div>
              <button className="action-btn accent" onClick={()=>generateScript(post)} disabled={scriptLoading}>
                {scriptLoading?"Writing...":"✨ AI Script"}
              </button>
            </div>
            {scriptLoading && <AILoading text="Writing script..."/>}
            {post.script ? (
              <>
                <textarea className="form-textarea" style={{minHeight:160,fontSize:12,lineHeight:1.7}} value={post.script} onChange={e=>updatePost(post.id,{script:e.target.value})}/>
                <div style={{display:"flex",gap:8,marginTop:8}}>
                  <button className="btn" style={{fontSize:11}} onClick={()=>{navigator.clipboard?.writeText(post.script);showToast("📋","Copied","Script copied to clipboard");}}>Copy</button>
                  <button className="btn" style={{fontSize:11}} onClick={()=>generateScript(post)}>↺ Regenerate</button>
                </div>
              </>
            ) : !scriptLoading && (
              <div style={{textAlign:"center",padding:"20px 0",color:"var(--text3)",fontSize:12}}>
                No script yet. Tap ✨ AI Script to generate one.
              </div>
            )}
          </div>

          {/* Caption Section */}
          <div className="card">
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
              <div className="card-title" style={{margin:0}}>Caption + Hashtags</div>
              <button className="action-btn accent" onClick={()=>generateCaption(post)} disabled={captionLoading}>
                {captionLoading?"Writing...":"✨ AI Caption"}
              </button>
            </div>
            {captionLoading && <AILoading text="Writing caption..."/>}
            {post.caption ? (
              <>
                <textarea className="form-textarea" style={{minHeight:120,fontSize:12,lineHeight:1.7}} value={post.caption} onChange={e=>updatePost(post.id,{caption:e.target.value})}/>
                <div style={{display:"flex",gap:8,marginTop:8}}>
                  <button className="btn" style={{fontSize:11}} onClick={()=>{navigator.clipboard?.writeText(post.caption);showToast("📋","Copied","Caption copied to clipboard");}}>Copy</button>
                  <button className="btn" style={{fontSize:11}} onClick={()=>generateCaption(post)}>↺ Regenerate</button>
                </div>
              </>
            ) : !captionLoading && (
              <div style={{textAlign:"center",padding:"20px 0",color:"var(--text3)",fontSize:12}}>
                No caption yet. Tap ✨ AI Caption to generate one.
              </div>
            )}
          </div>

          {/* Actions */}
          <div style={{display:"flex",gap:8,marginTop:4}}>
            <button className="btn primary" style={{flex:1}} onClick={()=>{updatePost(post.id,{status:"Approved"});showToast("✅","Approved",post.title+" is ready for production");}}>Approve Post</button>
            <button className="btn success" style={{flex:1}} onClick={()=>{updatePost(post.id,{status:"Scheduled"});showToast("📅","Scheduled",post.title+" added to queue");}}>Schedule →</button>
          </div>
          <button className="btn danger full" style={{marginTop:8}} onClick={()=>{setCalendar(prev=>prev.filter(p=>p.id!==post.id));setSelectedPost(null);showToast("🗑","Removed",post.title+" removed from calendar");}}>Remove from Calendar</button>
        </div>
      </div>
    );
  }

  // ── CALENDAR LIST VIEW ──
  return (
    <div className="full-panel">
      <div style={{padding:"12px 14px",borderBottom:"1px solid var(--border)",background:"var(--surface)",display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
        <button className="btn back" style={{margin:0,padding:"6px 10px",fontSize:12}} onClick={onClose}>←</button>
        <div style={{flex:1}}>
          <div style={{fontFamily:"var(--fd)",fontSize:14,fontWeight:700}}>Content Calendar</div>
          <div style={{fontSize:11,color:"var(--text3)"}}>AI-generated — April 2025</div>
        </div>
      </div>
      <div className="full-panel-scroll">
        <div style={{marginBottom:12}}>
          <select className="form-select" value={selClient} onChange={e=>setSelClient(e.target.value)}>
            <option value="all">All Clients</option>
            {clients.filter(c=>c.status==="active").map(c=><option key={c.id}>{c.name}</option>)}
          </select>
        </div>
        {!generated && !loading && (
          <button className="btn primary full" onClick={generate}>✨ Generate April Calendar</button>
        )}
        {loading && <AILoading text="Building content calendar..."/>}
        {generated && !loading && (
          <>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
              <div style={{fontSize:11,color:"var(--text3)",textTransform:"uppercase",letterSpacing:"1px",fontWeight:700}}>{filtered.length} posts · Tap for details</div>
              <button className="action-btn accent" onClick={generate}>↺ Regenerate</button>
            </div>
            {filtered.map((p)=>{
              const cl = clients.find(c=>c.name===p.client);
              return (
                <div key={p.id} onClick={()=>setSelectedPost(p)} style={{display:"flex",gap:10,padding:"12px 14px",background:"var(--surface)",border:"1px solid var(--border)",borderRadius:14,marginBottom:8,cursor:"pointer",alignItems:"center",backdropFilter:"blur(12px)",boxShadow:"var(--shadow-sm)",transition:"all 0.15s"}}>
                  <div style={{minWidth:46,textAlign:"center"}}>
                    <div style={{fontFamily:"var(--fd)",fontSize:14,fontWeight:700,color:"var(--accent)"}}>{p.date.split(" ")[1]}</div>
                    <div style={{fontSize:9,color:"var(--text3)",textTransform:"uppercase"}}>{p.date.split(" ")[0]}</div>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,fontWeight:600,color:"var(--text)",marginBottom:2}}>{p.title}</div>
                    <div style={{fontSize:11,color:"var(--text3)"}}>{p.client}</div>
                    <div style={{display:"flex",gap:6,marginTop:4,flexWrap:"wrap"}}>
                      <Badge type={statusColors[p.status]||"gray"}>{p.status}</Badge>
                      <span className="badge badge-gray">{p.type}</span>
                      {p.assigned&&<span style={{fontSize:10,color:"var(--text3)"}}>👤 {p.assigned}</span>}
                    </div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4,flexShrink:0}}>
                    {p.script&&<span style={{fontSize:10,color:"var(--green)"}}>✓ Script</span>}
                    {p.caption&&<span style={{fontSize:10,color:"var(--green)"}}>✓ Caption</span>}
                    <span style={{color:"var(--text3)",fontSize:18}}>›</span>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}

// ─── AI: CAPTION WRITER ───────────────────────────────────────────────────────
function CaptionWriter({ onClose, showToast }) {
  const [client, setClient] = useState("Desert Sun Realty");
  const [description, setDescription] = useState("");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const clientList = INIT_CLIENTS.map(c=>c.name);

  const generate = async () => {
    if (!description.trim()) return;
    setLoading(true);
    setCaption("");
    try {
      const result = await callClaude(
        `Write an Instagram caption for a video post.
Client: ${client}
Video description: ${description}

Requirements:
- 2-3 sentences max, punchy and engaging
- Include a clear call to action
- Add 8-12 relevant hashtags on a new line
- Local Arizona hashtags where relevant
- Do NOT use em dashes
- Sound natural, not corporate

Return just the caption and hashtags, nothing else.`
      );
      setCaption(result);
    } catch(e) { setCaption("Failed to generate. Try again."); }
    setLoading(false);
  };

  return (
    <div className="full-panel">
      <div style={{padding:"12px 14px",borderBottom:"1px solid var(--border)",background:"var(--surface)",display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
        <button className="btn back" style={{margin:0,padding:"6px 10px",fontSize:12}} onClick={onClose}>←</button>
        <div><div style={{fontFamily:"var(--fd)",fontSize:14,fontWeight:700}}>Caption Writer</div><div style={{fontSize:11,color:"var(--text3)"}}>AI-powered Instagram captions</div></div>
      </div>
      <div className="full-panel-scroll">
        <div className="form-group"><label className="form-label">Client</label>
          <select className="form-select" value={client} onChange={e=>setClient(e.target.value)}>
            {clientList.map(n=><option key={n}>{n}</option>)}
          </select>
        </div>
        <div className="form-group"><label className="form-label">Describe the video</label>
          <textarea className="form-textarea" placeholder="e.g. A before and after video showing a black Tesla getting a full paint correction and ceramic coating at our Mesa shop" value={description} onChange={e=>setDescription(e.target.value)}/>
        </div>
        <button className="btn primary full" onClick={generate} disabled={loading||!description.trim()}>
          {loading ? "Writing..." : "✨ Write Caption + Hashtags"}
        </button>
        {loading && <div style={{marginTop:12}}><AILoading text="Writing your caption..."/></div>}
        {caption && !loading && (
          <div className="caption-result">
            <div className="caption-text">{caption}</div>
            <div style={{display:"flex",gap:8,marginTop:12}}>
              <button className="caption-copy-btn" onClick={() => { navigator.clipboard?.writeText(caption); showToast("📋","Copied!","Caption copied to clipboard"); }}>Copy Caption</button>
              <button className="caption-copy-btn" onClick={generate}>↺ Regenerate</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── AI: OUTREACH MESSAGE WRITER ──────────────────────────────────────────────
function OutreachWriter({ onClose, showToast }) {
  const [lead, setLead] = useState({name:"Phoenix Flooring Co", industry:"flooring contractor", source:"IG DM"});
  const [channel, setChannel] = useState("Instagram DM");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const allLeads = Object.values(INIT_LEADS).flat();

  const generate = async () => {
    setLoading(true);
    setMessage("");
    try {
      const result = await callClaude(
        `Write a personalized outreach ${channel} from a social media marketing agency called Media4You to a potential client.

Lead business: ${lead.name}
Industry: ${lead.industry}
How they found us: ${lead.source}
Channel: ${channel}

Requirements:
- Personalized to their specific industry
- Mention a specific pain point or opportunity for their type of business
- Reference their Arizona market
- Include a soft CTA (book a quick call, not pushy)
- ${channel==="Instagram DM" ? "Short, casual, 3-4 sentences max" : "Professional email format with subject line, 4-5 sentences"}
- No em dashes, no corporate fluff
- Sound like a real person wrote it

Return just the message, nothing else.`
      );
      setMessage(result);
    } catch(e) { setMessage("Failed to generate. Try again."); }
    setLoading(false);
  };

  return (
    <div className="full-panel">
      <div style={{padding:"12px 14px",borderBottom:"1px solid var(--border)",background:"var(--surface)",display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
        <button className="btn back" style={{margin:0,padding:"6px 10px",fontSize:12}} onClick={onClose}>←</button>
        <div><div style={{fontFamily:"var(--fd)",fontSize:14,fontWeight:700}}>Outreach Writer</div><div style={{fontSize:11,color:"var(--text3)"}}>AI-personalized messages for leads</div></div>
      </div>
      <div className="full-panel-scroll">
        <div className="form-group"><label className="form-label">Lead</label>
          <select className="form-select" value={lead.name} onChange={e=>{const l=allLeads.find(l=>l.name===e.target.value);if(l)setLead(l);}}>
            {allLeads.map(l=><option key={l.id}>{l.name}</option>)}
          </select>
        </div>
        <div className="form-group"><label className="form-label">Channel</label>
          <select className="form-select" value={channel} onChange={e=>setChannel(e.target.value)}>
            <option>Instagram DM</option><option>Email</option><option>Text Message</option>
          </select>
        </div>
        <button className="btn primary full" onClick={generate} disabled={loading}>
          {loading ? "Writing..." : `✨ Write ${channel} for ${lead.name}`}
        </button>
        {loading && <div style={{marginTop:12}}><AILoading text={`Writing personalized ${channel}...`}/></div>}
        {message && !loading && (
          <div className="outreach-result">
            <div className="outreach-text">{message}</div>
            <div style={{display:"flex",gap:8,marginTop:12}}>
              <button className="caption-copy-btn" onClick={()=>{ navigator.clipboard?.writeText(message); showToast("📋","Copied!","Message copied"); }}>Copy</button>
              <button className="caption-copy-btn" onClick={generate}>↺ Regenerate</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── AI: SCRIPT FROM IDEA ─────────────────────────────────────────────────────
function IdeaScriptView({ client, idea, onBack, onSaveToQueue, showToast }) {
  const [script, setScript] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { generateScript(); }, []);

  const generateScript = async () => {
    setLoading(true);
    setScript("");
    try {
      const result = await callClaude(
        `Write a short-form Instagram Reel script for:
Client: ${client.name} (${client.industry} in Arizona)
Video Idea: ${idea.title}
Description: ${idea.description}
Hook to use: ${idea.hook || "Create a strong hook"}

Format exactly as:
HOOK (0–3 sec)
[hook text]

SETUP (3–10 sec)
[setup text]

BODY (10–40 sec)
[body text]

CTA (40–50 sec)
[cta text]

Keep it punchy, specific to Arizona when relevant, under 50 seconds total. No hashtags. Just the script.`
      );
      setScript(result);
    } catch(e) { setScript("Generation failed. Tap retry."); }
    setLoading(false);
  };

  return (
    <div className="full-panel">
      <div style={{padding:"12px 14px",borderBottom:"1px solid var(--border)",background:"var(--surface)",display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
        <button className="btn back" style={{margin:0,padding:"6px 10px",fontSize:12}} onClick={onBack}>←</button>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontFamily:"var(--fd)",fontSize:13,fontWeight:700,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{idea.title}</div>
          <div style={{fontSize:11,color:"var(--text3)"}}>{client.name}</div>
        </div>
        <button className="action-btn accent" onClick={generateScript}>↺</button>
      </div>
      <div className="full-panel-scroll">
        {loading && <AILoading text="Writing script..."/>}
        {!loading && script && (
          <>
            <div className="editor-wrap">
              <div style={{fontFamily:"var(--fd)",fontSize:12,fontWeight:700,color:"var(--accent)",marginBottom:10,textTransform:"uppercase",letterSpacing:"0.5px"}}>Generated Script</div>
              <div style={{fontSize:13,color:"var(--text2)",lineHeight:1.7,whiteSpace:"pre-wrap"}}>{script}</div>
            </div>
            <div style={{display:"flex",gap:8,marginTop:12}}>
              <button className="btn" onClick={() => { navigator.clipboard?.writeText(script); showToast("📋","Copied","Script copied to clipboard"); }}>Copy</button>
              <button className="btn primary" onClick={() => { onSaveToQueue(client.name, idea.title, script); showToast("✅","Added to queue","Script saved to Script Writer queue"); onBack(); }}>Save to Queue →</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
function NotificationsPanel({ notifs, onClear, onRead }) {
  return (
    <div className="full-panel-scroll" style={{paddingBottom:"calc(var(--bnav) + 14px)"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
        <div style={{fontFamily:"var(--fd)",fontSize:16,fontWeight:800}}>Notifications</div>
        <span style={{fontSize:12,color:"var(--accent)",cursor:"pointer"}} onClick={onClear}>Clear all</span>
      </div>
      {notifs.length===0 && <div className="empty"><div className="empty-icon">🔔</div><div className="empty-title">All caught up</div></div>}
      {notifs.map(n => (
        <div key={n.id} className={`notif-item ${n.unread?"unread":""}`} onClick={()=>onRead(n.id)}>
          <div className="notif-icon">{n.icon}</div>
          <div style={{flex:1}}><div className="notif-text">{n.text}</div><div className="notif-time">{n.time}</div></div>
          {n.unread && <div className="notif-unread-dot"/>}
        </div>
      ))}
    </div>
  );
}

// ─── MESSAGING ────────────────────────────────────────────────────────────────
function MessagingPanel({ threads, onSend }) {
  const [activeThread, setActiveThread] = useState(null);
  const messagesEndRef = useRef(null);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({behavior:"smooth"}); }, [activeThread, threads]);

  if (activeThread !== null) {
    const t = threads[activeThread];
    return (
      <div className="chat-view">
        <div className="chat-header">
          <button className="btn back" style={{margin:0,padding:"6px 10px",fontSize:12}} onClick={()=>setActiveThread(null)}>←</button>
          <div className="row-avatar" style={{background:`${t.color}20`,color:t.color,width:32,height:32,borderRadius:8}}>{t.name[0]}</div>
          <div style={{flex:1}}><div style={{fontFamily:"var(--fd)",fontSize:13,fontWeight:700}}>{t.name}</div><div style={{fontSize:11,color:"var(--text3)"}}>{t.role}</div></div>
          <div style={{width:7,height:7,borderRadius:"50%",background:"var(--green)"}}/>
        </div>
        <div className="chat-messages">
          {t.messages.map(m => (
            <div key={m.id} className={`chat-msg ${m.mine?"mine":""}`}>
              {!m.mine && <div className="row-avatar" style={{background:`${t.color}20`,color:t.color,width:28,height:28,borderRadius:7,fontSize:11}}>{t.name[0]}</div>}
              <div><div className="chat-bubble">{m.text}</div><div className="chat-time">{m.time}</div></div>
            </div>
          ))}
          <div ref={messagesEndRef}/>
        </div>
        <ChatInput onSend={(text) => onSend(activeThread, text)}/>
      </div>
    );
  }

  return (
    <div className="msg-panel">
      <div className="msg-top"><div style={{fontFamily:"var(--fd)",fontSize:16,fontWeight:800}}>Messages</div></div>
      <div className="msg-thread-list">
        {threads.map((t,i) => (
          <div key={t.id} className={`msg-thread-item ${t.unread>0?"unread":""}`} onClick={()=>setActiveThread(i)}>
            <div className="row-avatar" style={{background:`${t.color}20`,color:t.color}}>{t.name[0]}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13,fontWeight:600,color:"var(--text)"}}>{t.name}</div>
              <div style={{fontSize:11,color:"var(--text3)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",marginTop:2}}>{t.last}</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
              <div style={{fontSize:10,color:"var(--text3)"}}>{t.time}</div>
              {t.unread>0&&<div style={{background:"var(--accent)",color:"white",fontSize:9,fontWeight:700,padding:"1px 6px",borderRadius:8,minWidth:16,textAlign:"center"}}>{t.unread}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChatInput({ onSend }) {
  const [val, setVal] = useState("");
  const send = () => { if(val.trim()){onSend(val.trim());setVal("");} };
  return (
    <div className="chat-input-bar">
      <textarea className="chat-input" placeholder="Message..." value={val} rows={1} onChange={e=>setVal(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}}/>
      <button className="chat-send-btn" onClick={send}>↑</button>
    </div>
  );
}

// ─── ADMIN VIEWS ──────────────────────────────────────────────────────────────
function AdminDashboard({ clients, onNav, onOpenIdeas, onOpenCalendar, onOpenClientDetail, showToast }) {
  const mrr = clients.reduce((s,c)=>s+c.mrr,0);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const dateStr = new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'});

  const glass = {
    background:'rgba(255,255,255,0.6)',backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)',
    border:'1px solid rgba(255,255,255,0.65)',borderRadius:18,
    boxShadow:'0 4px 24px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
    transition:'all 0.3s cubic-bezier(0.16,1,0.3,1)',
  };

  const kpis = [
    {label:"Active Clients",value:clients.filter(c=>c.status==="active").length,sub:"↑ +1 this month",icon:"👥"},
    {label:"Monthly Revenue",value:`$${(mrr/1000).toFixed(1)}K`,sub:"↑ +$600 added",icon:"💰"},
    {label:"Videos MTD",value:"23",sub:"↑ +5 vs last month",icon:"🎬"},
    {label:"IG Scheduled",value:"14",sub:"Next post: Mar 18",icon:"📸"},
  ];

  return (
    <div>
      {/* ═══ WELCOME HERO ═══ */}
      <div style={{
        ...glass, padding:'28px 32px', marginBottom:28,
        background:'linear-gradient(135deg, rgba(255,255,255,0.75) 0%, rgba(252,198,18,0.08) 100%)',
        borderLeft:'3px solid var(--accent)',
        animation:'dashFadeInUp 0.5s cubic-bezier(0.16,1,0.3,1) both',
      }}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:16}}>
          <div>
            <h1 style={{font:'600 26px var(--fd)',color:'var(--text)',marginBottom:4,letterSpacing:'-0.3px'}}>{greeting}, team</h1>
            <p style={{font:'400 13px var(--fb)',color:'var(--text2)',margin:0}}>{dateStr}</p>
          </div>
          <div className="dash-hero-right" style={{textAlign:'right'}}>
            <div style={{font:'500 10px var(--fd)',textTransform:'uppercase',letterSpacing:1.5,color:'var(--text3)',marginBottom:2}}>Monthly MRR</div>
            <div style={{font:'600 24px var(--fd)',color:'var(--accent)'}}>${mrr.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* ═══ KPI CARDS ═══ */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))',gap:16,marginBottom:28}}>
        {kpis.map((k,idx)=>(
          <div key={k.label} className="dash-card-hover" style={{
            ...glass, padding:'24px 22px', cursor:'pointer',
            animation:`dashFadeInUp 0.5s cubic-bezier(0.16,1,0.3,1) ${(idx+1)*80}ms backwards`,
          }}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:14}}>
              <div style={{width:40,height:40,borderRadius:12,background:'var(--accent-dim)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18}}>
                {k.icon}
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text3)" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
            <div style={{font:'500 10px var(--fd)',textTransform:'uppercase',letterSpacing:1.5,color:'var(--text3)',marginBottom:8}}>{k.label}</div>
            <div style={{font:'600 32px var(--fd)',color:'var(--text)',marginBottom:6,letterSpacing:'-0.5px',animation:'dashCountUp 0.6s cubic-bezier(0.16,1,0.3,1) both'}}>{k.value}</div>
            <div style={{font:'400 13px var(--fb)',color:'var(--text2)'}}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* ═══ MAIN GRID ═══ */}
      <div className="dash-main-grid" style={{display:'grid',gridTemplateColumns:'1.1fr 0.9fr',gap:20}}>

        {/* LEFT: Clients */}
        <div style={{...glass,overflow:'hidden',animation:'dashFadeInUp 0.5s cubic-bezier(0.16,1,0.3,1) 400ms backwards'}}>
          <div style={{padding:'18px 22px',borderBottom:'1px solid rgba(0,0,0,0.04)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <span style={{font:'600 15px var(--fd)',color:'var(--text)'}}>Clients</span>
            <button onClick={()=>onNav("clients")} style={{padding:'5px 14px',borderRadius:100,border:'1px solid rgba(0,0,0,0.08)',background:'rgba(255,255,255,0.5)',font:'400 11px var(--fb)',color:'var(--text3)',cursor:'pointer',backdropFilter:'blur(8px)'}}>View All</button>
          </div>
          <div>
            {clients.map((c,idx)=>(
              <div key={c.id} className="dash-card-hover" onClick={()=>onOpenClientDetail(c)} style={{
                margin:'6px 10px',padding:'14px 16px',borderRadius:14,
                background:'rgba(255,255,255,0.4)',border:'1px solid rgba(0,0,0,0.02)',
                display:'flex',alignItems:'center',gap:14,cursor:'pointer',
                animation:`dashFadeInUp 0.4s cubic-bezier(0.16,1,0.3,1) ${500+idx*50}ms backwards`,
              }}>
                <div style={{width:40,height:40,borderRadius:12,background:`${c.color}15`,display:'flex',alignItems:'center',justifyContent:'center',color:c.color,font:'600 15px var(--fd)'}}>{c.name[0]}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{font:'500 14px var(--fd)',color:'var(--text)'}}>{c.name}</div>
                  <div style={{font:'400 12px var(--fb)',color:'var(--text2)'}}>{c.industry} · {c.stage}</div>
                </div>
                <div style={{textAlign:'right',flexShrink:0}}>
                  <div style={{font:'600 13px var(--fd)',color:'var(--text)',marginBottom:2}}>${c.mrr.toLocaleString()}</div>
                  <Badge type={c.plan==="Pro"?"purple":c.plan==="Growth"?"blue":"gray"}>{c.plan}</Badge>
                </div>
                <span style={{fontSize:16,color:"var(--accent)",cursor:"pointer",flexShrink:0}} onClick={(e)=>{e.stopPropagation();onOpenIdeas(c);}}>💡</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div style={{display:'flex',flexDirection:'column',gap:20}}>

          {/* MRR Chart */}
          <div style={{...glass,padding:'20px 22px',animation:'dashFadeInUp 0.5s cubic-bezier(0.16,1,0.3,1) 480ms backwards'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
              <div>
                <div style={{font:'500 10px var(--fd)',textTransform:'uppercase',letterSpacing:1.5,color:'var(--text3)',marginBottom:4}}>6-Month MRR Trend</div>
                <div style={{font:'600 22px var(--fd)',color:'var(--text)',letterSpacing:'-0.3px'}}>${mrr.toLocaleString()}</div>
              </div>
              <div style={{padding:'4px 10px',borderRadius:100,background:'rgba(45,154,106,0.1)',font:'500 11px var(--fd)',color:'var(--green)'}}>+62%</div>
            </div>
            <ResponsiveContainer width="100%" height={90}>
              <AreaChart data={MRR_DATA} margin={{top:4,right:4,left:-20,bottom:0}}>
                <defs><linearGradient id="mg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="var(--accent2)" stopOpacity={0.3}/><stop offset="95%" stopColor="var(--accent2)" stopOpacity={0}/></linearGradient></defs>
                <XAxis dataKey="month" tick={{fill:"#999",fontSize:10}} axisLine={false} tickLine={false}/>
                <Tooltip content={<CustomTooltip/>}/>
                <Area type="monotone" dataKey="mrr" stroke="var(--accent2)" strokeWidth={2} fill="url(#mg)"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* AI Tools */}
          <div style={{...glass,padding:'20px 22px',animation:'dashFadeInUp 0.5s cubic-bezier(0.16,1,0.3,1) 560ms backwards'}}>
            <div style={{font:'600 15px var(--fd)',color:'var(--text)',marginBottom:14}}>AI Tools</div>
            <div onClick={onOpenCalendar} className="ai-btn" style={{marginBottom:8}}>
              <div className="ai-btn-icon">📅</div>
              <div><div className="ai-btn-text">Content Calendar</div><div className="ai-btn-sub">Generate posting schedule</div></div>
            </div>
            <div onClick={()=>onOpenIdeas(clients[0])} className="ai-btn" style={{marginBottom:0}}>
              <div className="ai-btn-icon">💡</div>
              <div><div className="ai-btn-text">Video Ideas</div><div className="ai-btn-sub">AI ideas for {clients[0]?.name||"clients"}</div></div>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{...glass,padding:'20px 22px',animation:'dashFadeInUp 0.5s cubic-bezier(0.16,1,0.3,1) 640ms backwards'}}>
            <div style={{font:'600 15px var(--fd)',color:'var(--text)',marginBottom:14}}>Quick Actions</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
              {[{label:'Add Client',icon:'👥',action:()=>showToast("✅","Add client","Use + Client button")},
                {label:'Content Calendar',icon:'📅',action:onOpenCalendar},
                {label:'View Revenue',icon:'💰',action:()=>onNav("revenue")},
                {label:'Manage Ads',icon:'📢',action:()=>onNav("ads")}
              ].map(a=>(
                <button key={a.label} className="dash-card-hover" onClick={a.action} style={{
                  padding:'14px 16px',background:'rgba(255,255,255,0.5)',border:'1px solid rgba(0,0,0,0.06)',
                  borderRadius:12,cursor:'pointer',textAlign:'left',font:'500 13px var(--fb)',color:'var(--text)',
                  display:'flex',alignItems:'center',gap:10,backdropFilter:'blur(8px)',transition:'all 0.25s cubic-bezier(0.16,1,0.3,1)',
                }}>
                  <span style={{opacity:0.7,fontSize:16}}>{a.icon}</span>{a.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width:860px) {
          .dash-main-grid { grid-template-columns:1fr !important; }
          .dash-hero-right { display:none !important; }
        }
      `}</style>
    </div>
  );
}

function AdminRevenue({ clients }) {
  const mrr = clients.reduce((s,c)=>s+c.mrr,0);
  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card"><div className="stat-label">MRR</div><div className="stat-value">${(mrr/1000).toFixed(1)}K</div><div className="stat-sub">↑ +$600 this mo</div></div>
        <div className="stat-card"><div className="stat-label">ARR</div><div className="stat-value">${((mrr*12)/1000).toFixed(0)}K</div><div className="stat-sub">Annualized</div></div>
      </div>
      <div className="card">
        <div className="card-title">MRR Over Time</div>
        <ResponsiveContainer width="100%" height={140}>
          <AreaChart data={MRR_DATA} margin={{top:4,right:4,left:-20,bottom:0}}>
            <defs><linearGradient id="mg2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#FF5C00" stopOpacity={0.3}/><stop offset="95%" stopColor="#FF5C00" stopOpacity={0}/></linearGradient></defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" vertical={false}/>
            <XAxis dataKey="month" tick={{fill:"#999",fontSize:10}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fill:"#999",fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`$${v/1000}K`}/>
            <Tooltip content={<CustomTooltip/>}/>
            <Area type="monotone" dataKey="mrr" stroke="#FF5C00" strokeWidth={2} fill="url(#mg2)"/>
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="card">
        <div className="card-title">Videos Produced</div>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={VIDEO_DATA} margin={{top:4,right:4,left:-20,bottom:0}}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" vertical={false}/>
            <XAxis dataKey="month" tick={{fill:"#999",fontSize:10}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fill:"#999",fontSize:10}} axisLine={false} tickLine={false}/>
            <Tooltip content={<CustomTooltip prefix=""/>}/>
            <Bar dataKey="videos" fill="#3B82F6" radius={[4,4,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function AdminSettings({ showToast }) {
  const [integrations, setIntegrations] = useState([
    {name:"Zoom",connected:true,icon:"🎥"},{name:"Stripe Billing",connected:false,icon:"💳"},{name:"Twilio SMS",connected:false,icon:"💬"}
  ]);
  const toggleIntegration = (name) => {
    setIntegrations(p=>p.map(i=>i.name===name?{...i,connected:!i.connected}:i));
    const intg = integrations.find(i=>i.name===name);
    showToast(intg.connected?"🔌":"✅", intg.connected?"Disconnected":"Connected", name+(intg.connected?" has been disconnected":" is now connected"));
  };
  const [accounts, setAccounts] = useState([
    {id:1,name:"Instagram",handle:"@media.4" + ".you",connected:true,icon:"📸",lastSync:"2 min ago"},
    {id:2,name:"Facebook",handle:"Media4You Page",connected:true,icon:"📘",lastSync:"2 min ago"},
    {id:3,name:"Meta Ads Manager",handle:"Business ID: 847291",connected:true,icon:"📢",lastSync:"5 min ago"},
    {id:4,name:"TikTok",handle:"—",connected:false,icon:"🎵",lastSync:"Never"},
  ]);
  const toggleConnection = (id) => {
    setAccounts(p=>p.map(a=>a.id===id?{...a,connected:!a.connected,lastSync:a.connected?"Never":"Just now",handle:a.connected?"—":a.handle}:a));
    const acct = accounts.find(a=>a.id===id);
    showToast(acct.connected?"🔌":"✅", acct.connected?"Disconnected":"Connected", acct.name+(acct.connected?" has been disconnected":" is now connected"));
  };
  return (
    <div>
      <div className="card">
        <div className="card-title">Connected Accounts</div>
        {accounts.map(a=>(
          <div className="row-item" key={a.id}>
            <div style={{fontSize:20,width:28,textAlign:"center",flexShrink:0}}>{a.icon}</div>
            <div className="row-main">
              <div className="row-title">{a.name}</div>
              <div className="row-sub">{a.handle} · Last sync: {a.lastSync}</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
              <Badge type={a.connected?"green":"gray"}>{a.connected?"Connected":"Not Connected"}</Badge>
              <button className={`action-btn ${a.connected?"":"accent"}`} onClick={()=>toggleConnection(a.id)}>
                {a.connected?"Disconnect":"Connect"}
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="card-title">Meta API Status</div>
        {[{label:"API Version",value:"v19.0"},{label:"Rate Limit",value:"4,800 / 4,800 calls/hr"},{label:"Token Expiry",value:"Apr 15, 2025"},{label:"Permissions",value:"pages_manage_posts, ads_management, instagram_basic"}].map(s=>(
          <div className="row-item" key={s.label}>
            <div className="row-main"><div className="row-title">{s.label}</div></div>
            <div style={{fontSize:11,color:"var(--text2)",maxWidth:"55%",textAlign:"right"}}>{s.value}</div>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="card-title">Integrations</div>
        {integrations.map(i=>(
          <div className="row-item" key={i.name} style={{cursor:"pointer"}} onClick={()=>toggleIntegration(i.name)}>
            <div style={{fontSize:20,width:28,textAlign:"center",flexShrink:0}}>{i.icon}</div>
            <div className="row-main"><div className="row-title">{i.name}</div></div>
            <Badge type={i.connected?"green":"gray"}>{i.connected?"Connected":"Not connected"}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ADMIN CLIENTS ────────────────────────────────────────────────────────
function AdminClients({ clients, showToast, onOpenIdeas }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedClient, setSelectedClient] = useState(null);

  const filtered = clients.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  if (selectedClient) {
    const c = selectedClient;
    const teamMembers = [{name:"Maya R.",role:"Script Writer",color:"#A855F7"},{name:"Jordan T.",role:"Video Editor",color:"#22C55E"},{name:"Carlos V.",role:"Account Manager",color:"#3B82F6"}];
    const pipeline = [{title:"Day in the Life",status:"Scripting",progress:20},{title:"Listing Showcase",status:"Editing",progress:60},{title:"Testimonial Reel",status:"Review",progress:85}];
    return (
      <div>
        <button className="btn back" onClick={()=>setSelectedClient(null)}>← All Clients</button>
        <div className="client-hero">
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div className="row-avatar" style={{background:`${c.color}20`,color:c.color,width:44,height:44,fontSize:18}}>{c.name[0]}</div>
            <div>
              <div style={{fontFamily:"var(--fd)",fontSize:18,fontWeight:800}}>{c.name}</div>
              <div style={{fontSize:12,color:"var(--text2)",marginTop:2}}>{c.industry}</div>
            </div>
          </div>
          <div style={{display:"flex",gap:8,marginTop:14,flexWrap:"wrap"}}>
            <Badge type={c.plan==="Pro"?"purple":c.plan==="Growth"?"blue":"gray"}>{c.plan} Plan</Badge>
            <Badge type={c.status==="active"?"green":c.status==="onboarding"?"amber":"red"}>{c.status}</Badge>
          </div>
        </div>
        <div className="stats-grid">
          <div className="stat-card"><div className="stat-label">MRR</div><div className="stat-value">${c.mrr.toLocaleString()}</div></div>
          <div className="stat-card"><div className="stat-label">Videos</div><div className="stat-value">{c.videos}</div><div className="stat-sub">produced</div></div>
          <div className="stat-card"><div className="stat-label">Next Delivery</div><div className="stat-value" style={{fontSize:16}}>{c.nextPost}</div></div>
          <div className="stat-card"><div className="stat-label">Stage</div><div className="stat-value" style={{fontSize:16}}>{c.stage}</div></div>
        </div>
        <div className="card">
          <div className="card-title">Content Pipeline</div>
          {pipeline.map((p,i)=>(
            <div className="deliverable-item" key={i}>
              <div className="deliverable-icon">{["✍️","🎬","👁️"][i]}</div>
              <div className="deliverable-info">
                <div className="deliverable-title">{p.title}</div>
                <div className="deliverable-sub">{p.status}</div>
                <div className="progress-bar-wrap"><div className="progress-bar" style={{width:`${p.progress}%`,background:"var(--accent)"}}/></div>
              </div>
              <Badge type={p.status==="Scripting"?"gray":p.status==="Editing"?"blue":"amber"}>{p.status}</Badge>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-title">Assigned Team</div>
          {teamMembers.map(m=>(
            <div className="row-item" key={m.name}>
              <div className="row-avatar" style={{background:`${m.color}20`,color:m.color}}>{m.name[0]}</div>
              <div className="row-main"><div className="row-title">{m.name}</div><div className="row-sub">{m.role}</div></div>
            </div>
          ))}
        </div>
        {onOpenIdeas && <button className="btn primary full" style={{marginBottom:8}} onClick={()=>onOpenIdeas(c)}>💡 Generate AI Content Ideas</button>}
        <div style={{display:"flex",gap:8}}>
          <button className="btn" style={{flex:1}} onClick={()=>showToast("✏️","Edit mode","Client details are now editable")}>Edit</button>
          <button className="btn" style={{flex:1}} onClick={()=>showToast("⏸️","Paused","Client account paused")}>Pause</button>
          <button className="btn" style={{flex:1}} onClick={()=>showToast("💬","Message sent","Notification sent to team")}>Message</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="form-group" style={{marginBottom:10}}>
        <input className="form-input" placeholder="Search clients..." value={search} onChange={e=>setSearch(e.target.value)} />
      </div>
      <div style={{display:"flex",gap:6,marginBottom:14}}>
        {["all","active","onboarding","review"].map(s=>(
          <button key={s} className={`action-btn ${statusFilter===s?"accent":""}`} onClick={()=>setStatusFilter(s)} style={{textTransform:"capitalize"}}>{s}</button>
        ))}
      </div>
      <div className="card">
        <div className="card-title">Clients ({filtered.length})</div>
        {filtered.map(c=>(
          <div className="row-item" key={c.id} style={{cursor:"pointer"}} onClick={()=>setSelectedClient(c)}>
            <div className="row-avatar" style={{background:`${c.color}20`,color:c.color}}>{c.name[0]}</div>
            <div className="row-main">
              <div className="row-title">{c.name}</div>
              <div className="row-sub">{c.industry} · {c.stage}</div>
            </div>
            <div className="row-right">
              <Badge type={c.plan==="Pro"?"purple":c.plan==="Growth"?"blue":"gray"}>{c.plan}</Badge>
              {onOpenIdeas && <span style={{fontSize:16,color:"var(--accent)",cursor:"pointer"}} onClick={(e)=>{e.stopPropagation();onOpenIdeas(c);}}>💡</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ADMIN ADS ────────────────────────────────────────────────────────────
function AdminAds({ showToast }) {
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showNewCampaign, setShowNewCampaign] = useState(false);
  const [newCampaignForm, setNewCampaignForm] = useState({client:"Mesa Auto Detailing",platform:"Instagram",objective:"Awareness",budget:"20",duration:"30",audience:"25-54, Phoenix Metro"});

  const dailySpendData = [{day:"Mon",spend:28},{day:"Tue",spend:35},{day:"Wed",spend:42},{day:"Thu",spend:38},{day:"Fri",spend:44},{day:"Sat",spend:32},{day:"Sun",spend:22}];

  if (selectedCampaign) {
    const c = selectedCampaign;
    return (
      <div>
        <button className="btn back" onClick={()=>setSelectedCampaign(null)}>← All Campaigns</button>
        <div className="client-hero">
          <div style={{fontFamily:"var(--fd)",fontSize:18,fontWeight:800}}>{c.name}</div>
          <div style={{fontSize:12,color:"var(--text2)",marginTop:2}}>{c.client}</div>
          <div style={{display:"flex",gap:8,marginTop:10}}>
            <Badge type={c.status==="Running"?"green":c.status==="Scheduled"?"blue":"amber"}>{c.status}</Badge>
            <Badge type="gray">{c.platform}</Badge>
          </div>
        </div>
        <div className="card">
          <div className="card-title">Daily Spend — Last 7 Days</div>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={dailySpendData} margin={{top:4,right:4,left:-20,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" vertical={false}/>
              <XAxis dataKey="day" tick={{fill:"#999",fontSize:10}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:"#999",fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`$${v}`}/>
              <Tooltip content={<CustomTooltip/>}/>
              <Bar dataKey="spend" fill="#FF5C00" radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <div className="card-title">Audience Breakdown</div>
          {[{label:"Age 25-34",pct:"38%",bar:38},{label:"Age 35-44",pct:"29%",bar:29},{label:"Age 45-54",pct:"21%",bar:21},{label:"Age 55+",pct:"12%",bar:12}].map(a=>(
            <div key={a.label} style={{marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"var(--text2)",marginBottom:4}}><span>{a.label}</span><span style={{fontWeight:600}}>{a.pct}</span></div>
              <div className="progress-bar-wrap"><div className="progress-bar" style={{width:`${a.bar}%`,background:"var(--accent)"}}/></div>
            </div>
          ))}
          <div style={{marginTop:14}}>
            <div style={{fontSize:11,color:"var(--text3)",textTransform:"uppercase",letterSpacing:"0.8px",fontWeight:600,marginBottom:8}}>Gender Split</div>
            <div style={{display:"flex",gap:12}}>
              <div style={{flex:1,textAlign:"center",padding:10,background:"var(--surface2)",borderRadius:8,border:"1px solid var(--border)"}}>
                <div style={{fontSize:18,fontFamily:"var(--fd)",fontWeight:700}}>54%</div><div style={{fontSize:10,color:"var(--text3)"}}>Female</div>
              </div>
              <div style={{flex:1,textAlign:"center",padding:10,background:"var(--surface2)",borderRadius:8,border:"1px solid var(--border)"}}>
                <div style={{fontSize:18,fontFamily:"var(--fd)",fontWeight:700}}>46%</div><div style={{fontSize:10,color:"var(--text3)"}}>Male</div>
              </div>
            </div>
          </div>
          <div style={{marginTop:14}}>
            <div style={{fontSize:11,color:"var(--text3)",textTransform:"uppercase",letterSpacing:"0.8px",fontWeight:600,marginBottom:8}}>Top Locations</div>
            {["Phoenix, AZ","Scottsdale, AZ","Mesa, AZ","Tempe, AZ"].map((loc,i)=>(
              <div className="row-item" key={loc}><div className="row-main"><div className="row-title">{loc}</div></div><span style={{fontSize:12,fontFamily:"var(--fd)",fontWeight:700,color:"var(--accent)"}}>{[34,22,18,14][i]}%</span></div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="card-title">Platform Split</div>
          <div style={{display:"flex",gap:12}}>
            <div style={{flex:1,textAlign:"center",padding:14,background:"linear-gradient(135deg,rgba(252,198,18,0.06),rgba(253,128,64,0.04))",borderRadius:12,border:"1px solid rgba(252,198,18,0.15)"}}>
              <div style={{fontSize:20,marginBottom:4}}>📸</div>
              <div style={{fontFamily:"var(--fd)",fontSize:18,fontWeight:700}}>62%</div>
              <div style={{fontSize:10,color:"var(--text3)"}}>Instagram</div>
            </div>
            <div style={{flex:1,textAlign:"center",padding:14,background:"rgba(59,130,246,0.06)",borderRadius:12,border:"1px solid rgba(59,130,246,0.15)"}}>
              <div style={{fontSize:20,marginBottom:4}}>📘</div>
              <div style={{fontFamily:"var(--fd)",fontSize:18,fontWeight:700}}>38%</div>
              <div style={{fontSize:10,color:"var(--text3)"}}>Facebook</div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-title">Top Performing Creative</div>
          <div style={{background:"var(--surface2)",borderRadius:10,padding:16,textAlign:"center",border:"1px solid var(--border)"}}>
            <div style={{fontSize:40,marginBottom:8}}>🎬</div>
            <div style={{fontFamily:"var(--fd)",fontSize:13,fontWeight:700}}>"Before & After Reveal"</div>
            <div style={{fontSize:11,color:"var(--text3)",marginTop:4}}>4.8% CTR · 12.4K impressions · 42 conversions</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="stats-grid" style={{gridTemplateColumns:"1fr 1fr 1fr"}}>
        <div className="stat-card"><div className="stat-label">Ad Spend</div><div className="stat-value" style={{fontSize:22}}>$4.2K</div></div>
        <div className="stat-card"><div className="stat-label">Impressions</div><div className="stat-value" style={{fontSize:22}}>182K</div></div>
        <div className="stat-card"><div className="stat-label">Clicks</div><div className="stat-value" style={{fontSize:22}}>3.8K</div></div>
        <div className="stat-card"><div className="stat-label">Avg CPC</div><div className="stat-value" style={{fontSize:22}}>$1.12</div></div>
        <div className="stat-card"><div className="stat-label">ROAS</div><div className="stat-value" style={{fontSize:22}}>4.2x</div></div>
        <div className="stat-card"><div className="stat-label">Conversions</div><div className="stat-value" style={{fontSize:22}}>284</div></div>
      </div>
      <div className="card">
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
          <div className="card-title" style={{margin:0}}>Ad Spend — 6 Months</div>
          <span style={{fontSize:12,fontWeight:700,color:"var(--green)"}}>+50% growth</span>
        </div>
        <ResponsiveContainer width="100%" height={120}>
          <AreaChart data={AD_SPEND_DATA} margin={{top:4,right:4,left:-20,bottom:0}}>
            <defs><linearGradient id="adsg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#FF5C00" stopOpacity={0.3}/><stop offset="95%" stopColor="#FF5C00" stopOpacity={0}/></linearGradient></defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" vertical={false}/>
            <XAxis dataKey="month" tick={{fill:"#999",fontSize:10}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fill:"#999",fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`$${v/1000}K`}/>
            <Tooltip content={<CustomTooltip/>}/>
            <Area type="monotone" dataKey="spend" stroke="#FF5C00" strokeWidth={2} fill="url(#adsg)"/>
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="card">
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
          <div className="card-title" style={{margin:0}}>Active Campaigns</div>
          <button className="action-btn accent" onClick={()=>setShowNewCampaign(true)}>+ New Campaign</button>
        </div>
        {AD_CAMPAIGNS.map(c=>(
          <div className="row-item" key={c.id} onClick={()=>setSelectedCampaign(c)} style={{cursor:"pointer"}}>
            <div style={{flex:1,minWidth:0}}>
              <div className="row-title">{c.name}</div>
              <div className="row-sub">{c.client} · {c.platform}</div>
              <div style={{display:"flex",gap:8,marginTop:4,flexWrap:"wrap"}}>
                <span style={{fontSize:10,color:"var(--text3)"}}>${c.budget}/mo</span>
                <span style={{fontSize:10,color:"var(--text3)"}}>{(c.impressions/1000).toFixed(0)}K imp</span>
                <span style={{fontSize:10,color:"var(--text3)"}}>{c.ctr} CTR</span>
              </div>
            </div>
            <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4,flexShrink:0}}>
              <Badge type={c.status==="Running"?"green":c.status==="Scheduled"?"blue":"amber"}>{c.status}</Badge>
              <span style={{color:"var(--text3)",fontSize:18}}>›</span>
            </div>
          </div>
        ))}
      </div>
      {showNewCampaign && (
        <div className="overlay" onClick={()=>setShowNewCampaign(false)}>
          <div className="sheet" onClick={e=>e.stopPropagation()}>
            <div className="sheet-handle"/>
            <div className="sheet-title">New Campaign</div>
            <div className="sheet-sub">Set up a new Meta ad campaign</div>
            <div className="form-group"><label className="form-label">Client</label>
              <select className="form-select" value={newCampaignForm.client} onChange={e=>setNewCampaignForm(p=>({...p,client:e.target.value}))}>
                {INIT_CLIENTS.map(c=><option key={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group"><label className="form-label">Platform</label>
              <select className="form-select" value={newCampaignForm.platform} onChange={e=>setNewCampaignForm(p=>({...p,platform:e.target.value}))}>
                <option>Instagram</option><option>Facebook</option><option>Both</option>
              </select>
            </div>
            <div className="form-group"><label className="form-label">Objective</label>
              <select className="form-select" value={newCampaignForm.objective} onChange={e=>setNewCampaignForm(p=>({...p,objective:e.target.value}))}>
                <option>Awareness</option><option>Traffic</option><option>Conversions</option>
              </select>
            </div>
            <div className="form-group"><label className="form-label">Daily Budget ($)</label>
              <input className="form-input" type="number" value={newCampaignForm.budget} onChange={e=>setNewCampaignForm(p=>({...p,budget:e.target.value}))}/>
            </div>
            <div className="form-group"><label className="form-label">Duration (days)</label>
              <input className="form-input" type="number" value={newCampaignForm.duration} onChange={e=>setNewCampaignForm(p=>({...p,duration:e.target.value}))}/>
            </div>
            <div className="form-group"><label className="form-label">Target Audience</label>
              <input className="form-input" value={newCampaignForm.audience} onChange={e=>setNewCampaignForm(p=>({...p,audience:e.target.value}))} placeholder="e.g. 25-54, Phoenix Metro"/>
            </div>
            <div className="form-actions">
              <button className="btn" onClick={()=>setShowNewCampaign(false)}>Cancel</button>
              <button className="btn primary" onClick={()=>{setShowNewCampaign(false);showToast("📢","Campaign Created",`${newCampaignForm.client} — ${newCampaignForm.platform} — $${newCampaignForm.budget}/day`);}}>Create Campaign</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── EDITOR UPLOAD ────────────────────────────────────────────────────────
function EditorUpload({ showToast }) {
  const [selectedUpload, setSelectedUpload] = useState(null);
  const [uploads, setUploads] = useState([
    {id:1,title:"Patient Transformation #4",client:"Sky Harbor Dental",type:"Reel",status:"Ready",time:"2 hr ago"},
    {id:2,title:"Black Tesla Model S Detail",client:"Mesa Auto Detailing",type:"Ad Creative",status:"Ready",time:"4 hr ago"},
    {id:3,title:"Saturday Vibes — March",client:"Frost Barbershop",type:"Reel",status:"Processing",time:"5 hr ago"},
  ]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [form, setForm] = useState({client:"Desert Sun Realty",title:"",type:"Reel",notes:""});
  const [dragOver, setDragOver] = useState(false);

  const simulateUpload = () => {
    if (!form.title.trim()) { showToast("⚠️","Missing title","Please enter a video title"); return; }
    setUploading(true);
    setUploadProgress(0);
    const interval = setInterval(()=>{
      setUploadProgress(p=>{
        if(p>=100){ clearInterval(interval); setUploading(false);
          setUploads(prev=>[{id:Date.now(),title:form.title,client:form.client,type:form.type,status:"Processing",time:"Just now"},...prev]);
          setForm(f=>({...f,title:"",notes:""}));
          showToast("✅","Upload complete",form.title+" added to queue");
          setTimeout(()=>setUploads(prev=>prev.map((u,i)=>i===0?{...u,status:"Ready"}:u)),3000);
          return 0;
        }
        return p+Math.random()*15+5;
      });
    },200);
  };

  return (
    <div>
      <div style={{border:dragOver?"2px solid var(--accent)":"2px dashed var(--border2)",borderRadius:16,padding:32,textAlign:"center",marginBottom:16,background:dragOver?"var(--accent-dim)":"var(--surface)",transition:"all 0.2s",cursor:"pointer"}}
        onDragOver={e=>{e.preventDefault();setDragOver(true);}} onDragLeave={()=>setDragOver(false)} onDrop={e=>{e.preventDefault();setDragOver(false);simulateUpload();}} onClick={simulateUpload}>
        <div style={{fontSize:36,marginBottom:8,opacity:0.5}}>📤</div>
        <div style={{fontFamily:"var(--fd)",fontSize:14,fontWeight:700,color:"var(--text)",marginBottom:4}}>Drop video files here or tap to browse</div>
        <div style={{fontSize:11,color:"var(--text3)"}}>MP4, MOV up to 2GB</div>
      </div>
      {uploading && (
        <div className="card">
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
            <div className="ai-spinner"/>
            <span style={{fontSize:13,fontWeight:600,color:"var(--text)"}}>Uploading...</span>
            <span style={{fontSize:12,color:"var(--text3)",marginLeft:"auto"}}>{Math.min(Math.round(uploadProgress),100)}%</span>
          </div>
          <div className="progress-bar-wrap" style={{height:6}}><div className="progress-bar" style={{width:`${Math.min(uploadProgress,100)}%`,background:"linear-gradient(90deg,var(--accent),var(--accent2))",transition:"width 0.2s"}}/></div>
        </div>
      )}
      <div className="card">
        <div className="card-title">Upload Details</div>
        <div className="form-group"><label className="form-label">Client</label>
          <select className="form-select" value={form.client} onChange={e=>setForm(p=>({...p,client:e.target.value}))}>
            {INIT_CLIENTS.map(c=><option key={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="form-group"><label className="form-label">Title</label>
          <input className="form-input" placeholder="e.g. Spring Detail Reveal" value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))}/>
        </div>
        <div className="form-group"><label className="form-label">Content Type</label>
          <select className="form-select" value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value}))}>
            <option>Reel</option><option>Story</option><option>Ad Creative</option>
          </select>
        </div>
        <div className="form-group"><label className="form-label">Notes</label>
          <textarea className="form-textarea" placeholder="Any notes for the team..." value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))}/>
        </div>
        <button className="btn primary full" onClick={simulateUpload} disabled={uploading}>Upload Video</button>
      </div>
      <div className="card">
        <div className="card-title">Recent Uploads</div>
        {uploads.slice(0,5).map(u=>(
          <div key={u.id}>
            <div className="video-item" style={{cursor:"pointer"}} onClick={()=>setSelectedUpload(selectedUpload===u.id?null:u.id)}>
              <div className="video-thumb">🎬</div>
              <div className="video-info"><div className="video-title">{u.title}</div><div className="video-meta">{u.client} · {u.type} · {u.time}</div></div>
              <Badge type={u.status==="Ready"?"green":"amber"}>{u.status}</Badge>
            </div>
            {selectedUpload===u.id && (
              <div style={{padding:"8px 0 12px 55px",borderBottom:"1px solid var(--border)"}}>
                <div style={{fontSize:11,color:"var(--text3)",textTransform:"uppercase",letterSpacing:"0.8px",fontWeight:600,marginBottom:6}}>Upload Details</div>
                <div className="row-item" style={{paddingTop:0}}><div className="row-main"><div className="row-title">Title</div><div className="row-sub">{u.title}</div></div></div>
                <div className="row-item"><div className="row-main"><div className="row-title">Client</div><div className="row-sub">{u.client}</div></div></div>
                <div className="row-item"><div className="row-main"><div className="row-title">Type</div><div className="row-sub">{u.type}</div></div></div>
                <div className="row-item"><div className="row-main"><div className="row-title">Status</div><div className="row-sub">{u.status}</div></div><Badge type={u.status==="Ready"?"green":"amber"}>{u.status}</Badge></div>
                <div className="row-item" style={{borderBottom:"none",paddingBottom:0}}><div className="row-main"><div className="row-title">Uploaded</div><div className="row-sub">{u.time}</div></div></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CLIENT ADS ───────────────────────────────────────────────────────────
function ClientAds({ showToast }) {
  const [selectedAd, setSelectedAd] = useState(null);
  const adData = [{name:"New Listing Ads",type:"Carousel",impressions:"38K",impNum:38000,clicks:1064,ctr:"2.8%",leads:14,status:"Running",icon:"🏠"},{name:"Open House Promo",type:"Video",impressions:"18K",impNum:18000,clicks:738,ctr:"4.1%",leads:7,status:"Running",icon:"🔑"},{name:"Agent Brand Reel",type:"Reel",impressions:"12K",impNum:12000,clicks:420,ctr:"3.5%",leads:3,status:"Paused",icon:"👤"}];
  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card"><div className="stat-label">Monthly Spend</div><div className="stat-value" style={{fontSize:22}}>$1,200</div></div>
        <div className="stat-card"><div className="stat-label">Impressions</div><div className="stat-value" style={{fontSize:22}}>68K</div></div>
        <div className="stat-card"><div className="stat-label">Leads Generated</div><div className="stat-value" style={{fontSize:22}}>24</div></div>
        <div className="stat-card"><div className="stat-label">Cost Per Lead</div><div className="stat-value" style={{fontSize:22}}>$50</div></div>
      </div>
      <div className="card">
        <div className="card-title">Impressions — Last 30 Days</div>
        <ResponsiveContainer width="100%" height={120}>
          <AreaChart data={CLIENT_AD_DATA} margin={{top:4,right:4,left:-20,bottom:0}}>
            <defs><linearGradient id="clad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/><stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/></linearGradient></defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" vertical={false}/>
            <XAxis dataKey="day" tick={{fill:"#999",fontSize:10}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fill:"#999",fontSize:10}} axisLine={false} tickLine={false}/>
            <Tooltip content={<CustomTooltip prefix=""/>}/>
            <Area type="monotone" dataKey="impressions" stroke="#3B82F6" strokeWidth={2} fill="url(#clad)"/>
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="card">
        <div className="card-title">Active Ads</div>
        {adData.map((ad,i)=>(
          <div key={i}>
            <div className="row-item" style={{cursor:"pointer"}} onClick={()=>setSelectedAd(selectedAd===i?null:i)}>
              <div style={{width:44,height:44,borderRadius:10,background:"var(--accent-dim)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>
                {ad.icon}
              </div>
              <div className="row-main">
                <div className="row-title">{ad.name}</div>
                <div className="row-sub">{ad.type} · {ad.impressions} impressions · {ad.leads} leads</div>
              </div>
              <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4,flexShrink:0}}>
                <Badge type={ad.status==="Running"?"green":"amber"}>{ad.status}</Badge>
              </div>
            </div>
            {selectedAd===i && (
              <div style={{padding:"10px 0 14px 55px",borderBottom:"1px solid var(--border)"}}>
                <div style={{fontSize:11,color:"var(--text3)",textTransform:"uppercase",letterSpacing:"0.8px",fontWeight:600,marginBottom:6}}>Ad Details</div>
                <div style={{display:"flex",justifyContent:"center",marginBottom:12}}>
                  <div style={{width:80,height:80,borderRadius:12,background:"var(--accent-dim)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,border:"1px solid var(--border)"}}>{ad.icon}</div>
                </div>
                <div className="stats-grid" style={{marginBottom:8}}>
                  <div className="stat-card"><div className="stat-label">Impressions</div><div className="stat-value" style={{fontSize:18}}>{ad.impressions}</div></div>
                  <div className="stat-card"><div className="stat-label">Clicks</div><div className="stat-value" style={{fontSize:18}}>{ad.clicks.toLocaleString()}</div></div>
                  <div className="stat-card"><div className="stat-label">CTR</div><div className="stat-value" style={{fontSize:18}}>{ad.ctr}</div></div>
                  <div className="stat-card"><div className="stat-label">Leads</div><div className="stat-value" style={{fontSize:18}}>{ad.leads}</div></div>
                </div>
                <div className="row-item"><div className="row-main"><div className="row-title">Status</div></div><Badge type={ad.status==="Running"?"green":"amber"}>{ad.status}</Badge></div>
                <button className="btn full" style={{marginTop:10}} onClick={()=>showToast("📝","Request Sent","Your change request has been submitted")}>Request Changes</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SALES ACTIVITY ───────────────────────────────────────────────────────
function SalesActivity() {
  const [filter, setFilter] = useState("All");
  const filtered = filter==="All" ? SALES_ACTIVITY_LOG : SALES_ACTIVITY_LOG.filter(a=>a.type===filter);
  return (
    <div>
      <div style={{display:"flex",gap:6,marginBottom:14}}>
        {["All","Calls","Emails","Deals"].map(f=>(
          <button key={f} className={`action-btn ${filter===f?"accent":""}`} onClick={()=>setFilter(f)}>{f}</button>
        ))}
      </div>
      <div className="card">
        <div className="card-title">Recent Activity ({filtered.length})</div>
        {filtered.map(a=>(
          <div className="activity-item" key={a.id}>
            <div style={{fontSize:16,width:28,textAlign:"center",flexShrink:0}}>{a.icon}</div>
            <div style={{flex:1}}>
              <div className="activity-text">{a.text}</div>
              <div className="activity-time">{a.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SALES VIEWS ──────────────────────────────────────────────────────────────
function LeadDetailSheet({ lead, stage, onClose, showToast }) {
  if(!lead) return null;
  const stages = ["New","Contacted","Demo","Proposal","Won \u2713"];
  const curIdx = stages.indexOf(stage);
  const nextStage = curIdx < stages.length-1 ? stages[curIdx+1] : null;
  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet" onClick={e=>e.stopPropagation()}>
        <div className="sheet-handle"/>
        <div className="sheet-title">{lead.name}</div>
        <div className="sheet-sub">{lead.industry} \u00b7 {stage}</div>
        <div className="stats-grid" style={{marginBottom:12}}>
          <div className="stat-card"><div className="stat-label">Value</div><div className="stat-value" style={{fontSize:20}}>{lead.value}</div></div>
          <div className="stat-card"><div className="stat-label">Source</div><div className="stat-value" style={{fontSize:16}}>{lead.source}</div></div>
        </div>
        <div className="card" style={{marginBottom:12}}>
          <div className="row-item" style={{paddingTop:0}}>
            <div className="row-main"><div className="row-title">Assigned Rep</div><div className="row-sub">{lead.rep}</div></div>
          </div>
          <div className="row-item">
            <div className="row-main"><div className="row-title">Industry</div><div className="row-sub">{lead.industry}</div></div>
          </div>
          <div className="row-item" style={{borderBottom:"none",paddingBottom:0}}>
            <div className="row-main"><div className="row-title">Pipeline Stage</div><div className="row-sub">{stage}</div></div>
            <Badge type={stage==="Won \u2713"?"green":stage==="Proposal"?"purple":"blue"}>{stage}</Badge>
          </div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button className="btn" style={{flex:1}} onClick={()=>{showToast("📞","Calling...",lead.name);onClose();}}>📞 Call</button>
          <button className="btn" style={{flex:1}} onClick={()=>{showToast("📧","Email draft opened",lead.name);onClose();}}>📧 Email</button>
          {nextStage && <button className="btn primary" style={{flex:1}} onClick={()=>{showToast("📊","Moved",lead.name+" → "+nextStage);onClose();}}>→ {nextStage}</button>}
        </div>
      </div>
    </div>
  );
}

function SalesDashboard({ leads, onOpenOutreach, showToast }) {
  const [selectedLead, setSelectedLead] = useState(null);
  const [selectedStage, setSelectedStage] = useState(null);
  const total = Object.values(leads).flat().length;
  const won = (leads["Won ✓"]||[]).length;
  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card"><div className="stat-label">Open Leads</div><div className="stat-value">{total-won}</div><div className="stat-sub">3 need follow-up</div></div>
        <div className="stat-card"><div className="stat-label">Demos</div><div className="stat-value">3</div><div className="stat-sub">1 today @ 2pm</div></div>
        <div className="stat-card"><div className="stat-label">Closed</div><div className="stat-value">{won}</div><div className="stat-sub">$600 revenue</div></div>
        <div className="stat-card"><div className="stat-label">Conversion</div><div className="stat-value">34%</div><div className="stat-sub">↑ +8% vs last mo</div></div>
      </div>
      <div className="card" style={{background:"linear-gradient(135deg,rgba(255,92,0,0.08),rgba(59,130,246,0.06))",borderColor:"rgba(255,92,0,0.3)"}}>
        <div style={{fontFamily:"var(--fd)",fontSize:12,fontWeight:700,color:"var(--accent)",marginBottom:10,textTransform:"uppercase",letterSpacing:"1px"}}>✨ AI Sales Tools</div>
        <div className="ai-btn" onClick={onOpenOutreach}>
          <div className="ai-btn-icon">🎯</div>
          <div><div className="ai-btn-text">Write Outreach Message</div><div className="ai-btn-sub">AI-personalized DM or email for any lead</div></div>
        </div>
      </div>
      <div className="card">
        <div className="card-title">Pipeline — Swipe →</div>
        <div className="kanban-scroll">
          <div className="kanban">
            {Object.entries(leads).map(([col,items])=>(
              <div className="kanban-col" key={col}>
                <div className="kanban-col-header"><span className="kanban-col-title">{col}</span><span className="kanban-col-count">{items.length}</span></div>
                <div className="kanban-col-body">
                  {items.map(l=>(
                    <div className="kanban-card" key={l.id} style={{cursor:"pointer"}} onClick={()=>{setSelectedLead(l);setSelectedStage(col);}}>
                      <div className="kanban-card-name">{l.name}</div>
                      <div className="kanban-card-meta">{l.source} · {l.rep}</div>
                      <div className="kanban-value">{l.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {selectedLead && <LeadDetailSheet lead={selectedLead} stage={selectedStage} onClose={()=>setSelectedLead(null)} showToast={showToast}/>}
    </div>
  );
}

function SalesCalls({ showToast }) {
  const [joinedCalls, setJoinedCalls] = useState({});
  const [expandedCall, setExpandedCall] = useState(null);
  const handleJoin = (i) => {
    setJoinedCalls(p=>({...p,[i]:"joining"}));
    setTimeout(()=>setJoinedCalls(p=>({...p,[i]:"joined"})),1500);
  };
  const callData = [{name:"Chandler Law Group",rep:"Jade",time:"2:00 PM",day:"Today",type:"Demo",status:"Confirmed",agenda:"Demo walkthrough of content strategy and pricing packages",notes:"CEO interested in Instagram Reels for brand awareness. Has 2 locations."},{name:"Scottsdale Med Spa",rep:"Carlos",time:"4:30 PM",day:"Today",type:"Discovery",status:"Confirmed",agenda:"Initial discovery call to understand their content needs",notes:"Referred by existing client. Currently not doing any video content."},{name:"Sun Devil Gym",rep:"Jade",time:"10:00 AM",day:"Mar 19",type:"Proposal",status:"Pending",agenda:"Present Growth plan proposal and review content samples",notes:"Wants to focus on member transformation stories and workout highlights."}];
  return (
    <div className="card">
      <div className="card-title">Scheduled Calls</div>
      {callData.map((c,i)=>(
        <div key={i}>
          <div className="call-item" style={{cursor:"pointer"}} onClick={()=>setExpandedCall(expandedCall===i?null:i)}>
            <div className="call-time-block"><div className="call-time">{c.time}</div><div className="call-day">{c.day}</div></div>
            <div className="row-main"><div className="row-title">{c.name}</div><div className="row-sub">{c.type} · {c.rep}</div></div>
            <div style={{display:"flex",flexDirection:"column",gap:4,alignItems:"flex-end"}}>
              <Badge type={c.status==="Confirmed"?"green":"amber"}>{c.status}</Badge>
              {joinedCalls[i]==="joined" ? (
                <button className="action-btn green" disabled>In Call</button>
              ) : joinedCalls[i]==="joining" ? (
                <button className="action-btn" disabled style={{opacity:0.7}}>Joining...</button>
              ) : (
                <button className="action-btn accent" onClick={(e)=>{e.stopPropagation();handleJoin(i);}}>Join</button>
              )}
            </div>
          </div>
          {expandedCall===i && (
            <div style={{padding:"8px 0 12px 66px",borderBottom:"1px solid var(--border)"}}>
              <div style={{fontSize:11,color:"var(--text3)",textTransform:"uppercase",letterSpacing:"0.8px",fontWeight:600,marginBottom:4}}>Agenda</div>
              <div style={{fontSize:12,color:"var(--text2)",lineHeight:1.5,marginBottom:10}}>{c.agenda}</div>
              <div style={{fontSize:11,color:"var(--text3)",textTransform:"uppercase",letterSpacing:"0.8px",fontWeight:600,marginBottom:4}}>Prep Notes</div>
              <div style={{fontSize:12,color:"var(--text2)",lineHeight:1.5}}>{c.notes}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── SALES LEADS LIST ──────────────────────────────────────────────────────
function SalesLeadsList({ leads, showToast }) {
  const [selectedLead, setSelectedLead] = useState(null);
  const [selectedStage, setSelectedStage] = useState(null);
  return (
    <div>
      <div className="card">
        <div className="card-title">All Leads</div>
        {Object.entries(leads).flatMap(([s,items])=>items.map(l=>(
          <div className="row-item" key={l.id} style={{cursor:"pointer"}} onClick={()=>{setSelectedLead(l);setSelectedStage(s);}}>
            <div className="row-avatar" style={{background:"var(--accent-dim)",color:"var(--accent)"}}>{l.name[0]}</div>
            <div className="row-main"><div className="row-title">{l.name}</div><div className="row-sub">{l.source} · {l.rep}</div></div>
            <div className="row-right"><div style={{fontFamily:"var(--fd)",fontSize:12,fontWeight:700,color:"var(--accent)"}}>{l.value}</div><Badge type="gray">{s}</Badge></div>
          </div>
        )))}
      </div>
      {selectedLead && <LeadDetailSheet lead={selectedLead} stage={selectedStage} onClose={()=>setSelectedLead(null)} showToast={showToast}/>}
    </div>
  );
}

// ─── SCRIPT VIEWS ─────────────────────────────────────────────────────────────
function ScriptQueue({ scripts, onSelect }) {
  const [clientFilter, setClientFilter] = useState("all");
  const clientNames = [...new Set(scripts.map(s=>s.client))];
  const filtered = clientFilter==="all" ? scripts : scripts.filter(s=>s.client===clientFilter);
  return (
    <div>
      <div className="stats-grid" style={{marginBottom:12}}>
        <div className="stat-card"><div className="stat-label">In Queue</div><div className="stat-value">{scripts.length}</div><div className="stat-sub">2 due this week</div></div>
        <div className="stat-card"><div className="stat-label">Urgent</div><div className="stat-value">{scripts.filter(s=>s.priority==="high").length}</div><div className="stat-sub">High priority</div></div>
      </div>
      <div className="form-group" style={{marginBottom:10}}>
        <select className="form-select" value={clientFilter} onChange={e=>setClientFilter(e.target.value)}>
          <option value="all">All Clients</option>
          {clientNames.map(n=><option key={n} value={n}>{n}</option>)}
        </select>
      </div>
      <div style={{fontSize:10,color:"var(--text3)",textTransform:"uppercase",letterSpacing:"1px",fontWeight:700,marginBottom:8}}>Tap to open — ✨ AI Draft inside</div>
      {filtered.map((s)=>{
        const realIdx = scripts.findIndex(sc=>sc.id===s.id);
        return (
        <div key={s.id} className="script-item" onClick={()=>onSelect(realIdx)}>
          <div className="script-pbar" style={{background:s.priority==="high"?"#EF4444":s.priority==="med"?"#FFB800":"#3B82F6"}}/>
          <div className="script-info">
            <div className="script-client">{s.client}</div>
            <div className="script-type">{s.type}</div>
            <div className="script-meta">
              <Badge type={s.status==="In Progress"?"blue":s.status==="Needs Revision"?"red":s.status==="Submitted"?"green":"gray"}>{s.status}</Badge>
              <span style={{fontSize:10,color:"var(--text3)"}}>Due {s.due}</span>
            </div>
          </div>
          <span style={{color:"var(--text3)",fontSize:18}}>›</span>
        </div>
      );
      })}
    </div>
  );
}

function ScriptEditor({ script, onBack, onUpdate, showToast }) {
  const [text, setText] = useState(script.draft||"");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true); setText("");
    try {
      const result = await callClaude(
        `Write a short-form Instagram Reel script for:
Client: ${script.client}
Content Type: ${script.type}

Format exactly as:
HOOK (0–3 sec)
[hook text]

SETUP (3–10 sec)
[setup]

BODY (10–40 sec)
[body]

CTA (40–50 sec)
[cta]

Punchy, local Arizona flavor where relevant. No hashtags. Just the script.`
      );
      setText(result);
      onUpdate(script.id,"In Progress",result);
      showToast("✨","Script generated","Review and edit as needed");
    } catch(e) { showToast("❌","Failed","Check connection"); }
    setLoading(false);
  };

  return (
    <div>
      <button className="btn back" onClick={onBack}>← Queue</button>
      <div className="editor-wrap">
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:12}}>
          <div><div style={{fontFamily:"var(--fd)",fontSize:14,fontWeight:700,color:"var(--text)"}}>{script.client}</div><div style={{fontSize:11,color:"var(--text3)",marginTop:2}}>{script.type} · Due {script.due}</div></div>
          <Badge type={script.status==="In Progress"?"blue":script.status==="Needs Revision"?"red":script.status==="Submitted"?"green":"gray"}>{script.status}</Badge>
        </div>
        {loading && <AILoading text="Claude is writing the script..."/>}
        <div className="editor-toolbar">
          {["Hook","Setup","Body","CTA"].map(t=><button key={t} className="editor-tool-btn" onClick={()=>setText(p=>p+(p?"\n\n":"")+t.toUpperCase()+"\n")}>{t}</button>)}
          <button className="editor-tool-btn ai" onClick={generate} disabled={loading}>{loading?"Writing...":"✨ AI Draft"}</button>
        </div>
        <textarea className="editor-textarea" value={text} placeholder="Start writing or tap ✨ AI Draft..." onChange={e=>setText(e.target.value)}/>
        <div style={{display:"flex",gap:8,marginTop:10}}>
          <button className="btn" onClick={()=>{onUpdate(script.id,"In Progress",text);showToast("💾","Saved","");}}>Save</button>
          <button className="btn primary" onClick={()=>{onUpdate(script.id,"Submitted",text);showToast("✅","Submitted","Script sent to production");onBack();}}>Submit →</button>
        </div>
      </div>
    </div>
  );
}

function ScriptCompleted({ scripts }) {
  const done = scripts.filter(s=>s.status==="Submitted");
  if(!done.length) return <div className="empty"><div className="empty-icon">📋</div><div className="empty-title">No completed scripts yet</div></div>;
  return <div className="card"><div className="card-title">Completed ({done.length})</div>{done.map(s=><div className="row-item" key={s.id}><div className="row-avatar" style={{background:"rgba(34,197,94,0.12)",color:"var(--green)"}}>✓</div><div className="row-main"><div className="row-title">{s.client}</div><div className="row-sub">{s.type}</div></div><Badge type="green">Submitted</Badge></div>)}</div>;
}

// ─── EDITOR VIEWS ─────────────────────────────────────────────────────────────
function EditorProduction({ videos, igPosts, onAdvance, onSchedule, onOpenCaption, showToast, onNav }) {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showScheduleSheet, setShowScheduleSheet] = useState(false);
  const [schedForm, setSchedForm] = useState({client:"Desert Sun Realty",date:"2025-03-25",time:"09:00",caption:""});
  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card"><div className="stat-label">In Queue</div><div className="stat-value">{videos.length}</div><div className="stat-sub">2 due this week</div></div>
        <div className="stat-card"><div className="stat-label">In Review</div><div className="stat-value">{videos.filter(v=>v.status==="Review").length}</div><div className="stat-sub">Awaiting approval</div></div>
        <div className="stat-card"><div className="stat-label">Published MTD</div><div className="stat-value">11</div><div className="stat-sub">4 clients</div></div>
        <div className="stat-card"><div className="stat-label">IG Scheduled</div><div className="stat-value">{igPosts.filter(p=>p.status==="Scheduled").length}</div><div className="stat-sub">Next: Mar 20</div></div>
      </div>
      <div className="card" style={{background:"linear-gradient(135deg,rgba(255,92,0,0.08),rgba(253,128,64,0.06))",borderColor:"rgba(255,92,0,0.3)"}}>
        <div style={{fontFamily:"var(--fd)",fontSize:12,fontWeight:700,color:"var(--accent)",marginBottom:10,textTransform:"uppercase",letterSpacing:"1px"}}>✨ AI Tools</div>
        <div className="ai-btn" onClick={onOpenCaption}>
          <div className="ai-btn-icon">📝</div>
          <div><div className="ai-btn-text">Caption Writer</div><div className="ai-btn-sub">Generate Instagram captions + hashtags</div></div>
        </div>
      </div>
      <div className="card">
        <div className="card-title">Production Queue</div>
        {videos.map(v=>(
          <div key={v.id}>
            <div className="video-item" style={{cursor:"pointer"}} onClick={()=>setSelectedVideo(selectedVideo===v.id?null:v.id)}>
              <div className="video-thumb">{v.thumb}</div>
              <div className="video-info"><div className="video-title">{v.title}</div><div className="video-meta">{v.client} · {v.due}</div></div>
              <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4,flexShrink:0}}>
                <Badge type={VID_STATUS_COLOR[v.status]||"gray"}>{v.status}</Badge>
              </div>
            </div>
            {selectedVideo===v.id && (
              <div style={{padding:"10px 0 14px 55px",borderBottom:"1px solid var(--border)"}}>
                <div style={{fontSize:11,color:"var(--text3)",textTransform:"uppercase",letterSpacing:"0.8px",fontWeight:600,marginBottom:6}}>Video Details</div>
                <div className="row-item" style={{paddingTop:0}}><div className="row-main"><div className="row-title">Client</div><div className="row-sub">{v.client}</div></div></div>
                <div className="row-item"><div className="row-main"><div className="row-title">Status</div><div className="row-sub">{v.status}</div></div><Badge type={VID_STATUS_COLOR[v.status]||"gray"}>{v.status}</Badge></div>
                <div className="row-item"><div className="row-main"><div className="row-title">Due Date</div><div className="row-sub">{v.due}</div></div></div>
                <div style={{display:"flex",gap:8,marginTop:10}}>
                  {v.status!=="Approved"&&v.status!=="Scheduled"&&<button className="btn primary" style={{flex:1}} onClick={()=>{onAdvance(v.id);showToast("🎬","Updated",`→ ${STATUS_FLOW[v.status]}`);setSelectedVideo(null);}}>
                    {v.status==="Raw Footage"?"Start Edit":v.status==="Editing"?"Send to Review":"Approve"}
                  </button>}
                  {v.status==="Approved"&&<button className="btn primary" style={{flex:1}} onClick={()=>{onSchedule(v.id);showToast("📸","Scheduled on IG","");setSelectedVideo(null);}}>Schedule on IG</button>}
                  <button className="btn" style={{flex:1}} onClick={()=>showToast("📝","Notes","Add notes feature coming soon")}>Add Notes</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="ig-panel">
        <div className="ig-header"><span style={{fontSize:20}}>📸</span><div><div className="ig-title">Instagram Queue</div><div className="ig-sub">Publish via Meta API</div></div></div>
        {igPosts.map(p=><div className="ig-post" key={p.id}><div className="ig-post-thumb">{p.thumb}</div><div style={{flex:1}}><div className="ig-post-title">{p.client}</div><div className="ig-post-date">{p.date}</div></div><Badge type={p.status==="Scheduled"?"green":"amber"}>{p.status}</Badge></div>)}
        <button className="btn primary full" style={{marginTop:8}} onClick={()=>setShowScheduleSheet(true)}>+ Schedule Post</button>
      </div>
      {showScheduleSheet && (
        <div className="overlay" onClick={()=>setShowScheduleSheet(false)}>
          <div className="sheet" onClick={e=>e.stopPropagation()}>
            <div className="sheet-handle"/>
            <div className="sheet-title">Schedule Post</div>
            <div className="sheet-sub">Schedule a new Instagram post</div>
            <div className="form-group"><label className="form-label">Client</label>
              <select className="form-select" value={schedForm.client} onChange={e=>setSchedForm(p=>({...p,client:e.target.value}))}>
                {INIT_CLIENTS.map(c=><option key={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group"><label className="form-label">Date</label>
              <input className="form-input" type="date" value={schedForm.date} onChange={e=>setSchedForm(p=>({...p,date:e.target.value}))}/>
            </div>
            <div className="form-group"><label className="form-label">Time</label>
              <select className="form-select" value={schedForm.time} onChange={e=>setSchedForm(p=>({...p,time:e.target.value}))}>
                {["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00"].map(t=><option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group"><label className="form-label">Caption</label>
              <textarea className="form-textarea" placeholder="Write your caption..." value={schedForm.caption} onChange={e=>setSchedForm(p=>({...p,caption:e.target.value}))}/>
            </div>
            <div className="form-actions">
              <button className="btn" onClick={()=>setShowScheduleSheet(false)}>Cancel</button>
              <button className="btn primary" onClick={()=>{setShowScheduleSheet(false);showToast("📸","Post Scheduled",`${schedForm.client} — ${schedForm.date} at ${schedForm.time}`);}}>Schedule</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EditorCompleted({ videos }) {
  const done = videos.filter(v=>v.status==="Scheduled");
  if(!done.length) return <div className="empty"><div className="empty-icon">🎬</div><div className="empty-title">Nothing published yet</div></div>;
  return <div className="card"><div className="card-title">Scheduled ({done.length})</div>{done.map(v=><div className="video-item" key={v.id}><div className="video-thumb">{v.thumb}</div><div className="video-info"><div className="video-title">{v.title}</div><div className="video-meta">{v.client}</div></div><Badge type="purple">Scheduled</Badge></div>)}</div>;
}

// ─── CLIENT VIEWS ─────────────────────────────────────────────────────────────
// ─── UNIFIED CONTENT PIPELINE (KANBAN) ────────────────────────────────────────
function ContentPipeline({ scripts, videos, onAdvanceVideo, onUpdateScript, showToast }) {
  const [clientFilter, setClientFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState(null);

  const PIPELINE_STAGES = ["Scripting","Editing","Review","Approved","Scheduled","Published"];
  const STAGE_COLORS = {Scripting:"gray",Editing:"blue",Review:"amber",Approved:"green",Scheduled:"purple",Published:"green"};
  const STAGE_ICONS = {Scripting:"✍️",Editing:"🎬",Review:"👁️",Approved:"✅",Scheduled:"📸",Published:"🎉"};

  // Merge scripts + videos into unified items
  const allItems = [
    ...scripts.map(s => ({
      id:`s-${s.id}`, sourceId:s.id, type:"script", client:s.client, title:s.type,
      status: s.status==="Assigned"||s.status==="In Progress"||s.status==="Needs Revision" ? "Scripting" : s.status==="Submitted" ? "Review" : "Scripting",
      due:s.due, priority:s.priority, thumb:"✍️", source:s,
    })),
    ...videos.map(v => ({
      id:`v-${v.id}`, sourceId:v.id, type:"video", client:v.client, title:v.title,
      status: v.status==="Raw Footage" ? "Editing" : v.status,
      due:v.due, priority:"med", thumb:v.thumb, source:v,
    })),
  ];

  const allClients = [...new Set(allItems.map(i=>i.client))];
  const filtered = clientFilter==="all" ? allItems : allItems.filter(i=>i.client===clientFilter);

  const glass = {
    background:'rgba(255,255,255,0.6)',backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)',
    border:'1px solid rgba(255,255,255,0.65)',borderRadius:18,
    boxShadow:'0 4px 24px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
  };

  const advanceItem = (item) => {
    const stageIdx = PIPELINE_STAGES.indexOf(item.status);
    if (stageIdx < PIPELINE_STAGES.length - 1) {
      const nextStage = PIPELINE_STAGES[stageIdx + 1];
      if (item.type === "video") {
        onAdvanceVideo(item.sourceId);
      } else {
        onUpdateScript(item.sourceId, nextStage === "Review" ? "Submitted" : "In Progress", item.source.draft);
      }
      showToast(STAGE_ICONS[nextStage], "Moved to " + nextStage, item.title);
    }
    setSelectedItem(null);
  };

  // Stats
  const inScripting = filtered.filter(i=>i.status==="Scripting").length;
  const inEditing = filtered.filter(i=>i.status==="Editing").length;
  const inReview = filtered.filter(i=>i.status==="Review").length;
  const completed = filtered.filter(i=>i.status==="Published"||i.status==="Scheduled").length;

  return (
    <div>
      {/* Stats */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))',gap:12,marginBottom:20}}>
        {[{label:"Scripting",val:inScripting,color:"var(--text3)"},{label:"Editing",val:inEditing,color:"var(--blue)"},{label:"In Review",val:inReview,color:"var(--amber)"},{label:"Completed",val:completed,color:"var(--green)"}].map((s,i)=>(
          <div key={s.label} className="dash-card-hover" style={{...glass,padding:'18px 16px',animation:`dashFadeInUp 0.5s cubic-bezier(0.16,1,0.3,1) ${i*60}ms backwards`}}>
            <div style={{font:'500 10px var(--fd)',textTransform:'uppercase',letterSpacing:1.2,color:'var(--text3)',marginBottom:6}}>{s.label}</div>
            <div style={{font:'600 28px var(--fd)',color:s.color}}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
        <span style={{font:'600 13px var(--fd)',color:'var(--text)'}}>Filter:</span>
        <button className={`action-btn ${clientFilter==="all"?"accent":""}`} onClick={()=>setClientFilter("all")}>All Clients</button>
        {allClients.map(c=>(
          <button key={c} className={`action-btn ${clientFilter===c?"accent":""}`} onClick={()=>setClientFilter(c)}>{c}</button>
        ))}
      </div>

      {/* Kanban Board */}
      <div className="kanban-scroll">
        <div className="kanban" style={{gap:14}}>
          {PIPELINE_STAGES.map(stage => {
            const stageItems = filtered.filter(i=>i.status===stage);
            return (
              <div key={stage} style={{width:220}}>
                <div style={{...glass,borderRadius:'14px 14px 0 0',padding:'12px 14px',borderBottom:'none',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <div style={{display:'flex',alignItems:'center',gap:6}}>
                    <span style={{fontSize:14}}>{STAGE_ICONS[stage]}</span>
                    <span style={{font:'600 11px var(--fd)',textTransform:'uppercase',letterSpacing:0.8,color:'var(--text)'}}>{stage}</span>
                  </div>
                  <span style={{font:'600 11px var(--fd)',color:'var(--text3)',background:'var(--accent-dim)',padding:'2px 8px',borderRadius:20}}>{stageItems.length}</span>
                </div>
                <div style={{background:'rgba(255,255,255,0.35)',border:'1px solid rgba(255,255,255,0.5)',borderRadius:'0 0 14px 14px',padding:8,minHeight:200,display:'flex',flexDirection:'column',gap:8,backdropFilter:'blur(10px)'}}>
                  {stageItems.map(item => (
                    <div key={item.id} className="dash-card-hover" style={{
                      background:'rgba(255,255,255,0.85)',border:'1px solid rgba(0,0,0,0.06)',borderRadius:12,
                      padding:'12px 14px',cursor:'pointer',backdropFilter:'blur(8px)',boxShadow:'var(--shadow-sm)',
                    }} onClick={()=>setSelectedItem(selectedItem===item.id?null:item.id)}>
                      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                        <span style={{fontSize:16}}>{item.thumb}</span>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{font:'500 12px var(--fd)',color:'var(--text)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{item.title}</div>
                          <div style={{font:'400 10px var(--fb)',color:'var(--text3)',marginTop:1}}>{item.client}</div>
                        </div>
                      </div>
                      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                        <span style={{font:'400 10px var(--fb)',color:'var(--text3)'}}>Due {item.due}</span>
                        <Badge type={item.type==="script"?"blue":"purple"}>{item.type==="script"?"Script":"Video"}</Badge>
                      </div>
                      {item.priority==="high" && <div style={{width:'100%',height:2,background:'var(--red)',borderRadius:2,marginTop:6,opacity:0.6}}/>}
                      {selectedItem===item.id && (
                        <div style={{marginTop:10,paddingTop:10,borderTop:'1px solid var(--border)'}}>
                          <div style={{display:'flex',gap:6}}>
                            {PIPELINE_STAGES.indexOf(stage) < PIPELINE_STAGES.length - 1 && (
                              <button className="btn primary" style={{flex:1,padding:'8px 12px',fontSize:11}} onClick={(e)=>{e.stopPropagation();advanceItem(item);}}>
                                → {PIPELINE_STAGES[PIPELINE_STAGES.indexOf(stage)+1]}
                              </button>
                            )}
                            <button className="btn" style={{padding:'8px 12px',fontSize:11}} onClick={(e)=>{e.stopPropagation();showToast("📝","Notes","Add notes coming soon");}}>Notes</button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {stageItems.length===0 && (
                    <div style={{padding:'24px 8px',textAlign:'center',font:'400 11px var(--fb)',color:'var(--text3)',opacity:0.6}}>No items</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── CLIENT CONTENT (WITH APPROVAL WORKFLOW) ──────────────────────────────────
function ClientContent({ showToast }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [revisionNotes, setRevisionNotes] = useState("");
  const [showRevisionForm, setShowRevisionForm] = useState(null);
  const [items, setItems] = useState([
    {id:1,title:"Listing @ 4821 Cactus Rd",type:"Reel · Listing Tour",status:"Review",    progress:85, thumb:"🏠", script:"HOOK (0–3 sec)\nThis Scottsdale listing just hit the market and it's STUNNING.\n\nSETUP (3–10 sec)\nLocated in the heart of Old Town, 4821 Cactus Rd features 4 beds, 3 baths, and a backyard oasis with mountain views...\n\nBODY (10–40 sec)\nWalk through the open-concept living area, chef's kitchen with quartz counters, and the primary suite with spa-like bathroom. The real showstopper? That heated pool with a sunset view of Camelback.\n\nCTA (40–50 sec)\nDM us or tap the link in bio to schedule a private showing before it's gone.", approvalHistory:[]},
    {id:2,title:"Agent Intro — Meet Sarah", type:"Reel · Brand",       status:"Approved",  progress:100,thumb:"👤", script:"", approvalHistory:[{action:"approved",date:"Mar 15",note:""}]},
    {id:3,title:"Sold! 3901 Desert View",   type:"Story + Post",       status:"Published", progress:100,thumb:"✅", script:"", approvalHistory:[{action:"approved",date:"Mar 12",note:""}]},
    {id:4,title:"Neighborhood Spotlight",   type:"Reel · Area Guide",  status:"Scripting", progress:20, thumb:"📍", script:"", approvalHistory:[]},
    {id:5,title:"Spring Market Update",     type:"Reel · Educational", status:"Review",    progress:80, thumb:"📊", script:"HOOK (0–3 sec)\nThe Arizona housing market just shifted — here's what you need to know.\n\nSETUP (3–10 sec)\nSpring 2025 is bringing more inventory to the Valley than we've seen in 3 years...\n\nBODY (10–40 sec)\nMedian prices in Scottsdale are up 4% year-over-year, but days on market have increased to 28 from 19. What does that mean for buyers? More negotiating power. For sellers? Pricing strategy matters more than ever.\n\nCTA (40–50 sec)\nFollow for weekly market updates and DM us if you're thinking about buying or selling in Arizona.", approvalHistory:[]},
  ]);

  const approveItem = (id) => {
    setItems(p=>p.map(i=>i.id===id?{...i,status:"Approved",progress:100,approvalHistory:[...i.approvalHistory,{action:"approved",date:new Date().toLocaleDateString('en-US',{month:'short',day:'numeric'}),note:""}]}:i));
    showToast("✅","Approved!","Content approved and moving to production");
    setSelectedItem(null);
  };

  const requestRevision = (id) => {
    if (!revisionNotes.trim()) return;
    setItems(p=>p.map(i=>i.id===id?{...i,status:"Revision Requested",approvalHistory:[...i.approvalHistory,{action:"revision",date:new Date().toLocaleDateString('en-US',{month:'short',day:'numeric'}),note:revisionNotes}]}:i));
    showToast("📝","Revision requested","Team will update the content");
    setRevisionNotes("");
    setShowRevisionForm(null);
    setSelectedItem(null);
  };

  const statusColor = (s) => s==="Published"?"green":s==="Approved"||s==="Scheduled"?"green":s==="Review"?"amber":s==="Revision Requested"?"red":"gray";

  return (
    <div>
      <div className="client-hero">
        <div style={{fontFamily:"var(--fd)",fontSize:18,fontWeight:800}}>Desert Sun Realty</div>
        <div style={{fontSize:12,color:"var(--text2)",marginTop:3}}>Your content dashboard</div>
        <div style={{display:"flex",alignItems:"center",gap:8,marginTop:10,flexWrap:"wrap"}}>
          <span style={{fontFamily:"var(--fd)",fontSize:12,fontWeight:700,color:"var(--accent)"}}>Pro Plan</span>
          <Badge type="green">● Active</Badge>
          <span style={{fontSize:10,color:"var(--text3)",marginLeft:"auto"}}>Renews Apr 1</span>
        </div>
      </div>
      <div className="stats-grid">
        <div className="stat-card"><div className="stat-label">Videos</div><div className="stat-value">8</div><div className="stat-sub">2 in production</div></div>
        <div className="stat-card"><div className="stat-label">IG Posts</div><div className="stat-value">6</div><div className="stat-sub">Published</div></div>
        <div className="stat-card"><div className="stat-label">Followers +</div><div className="stat-value">842</div><div className="stat-sub">Since Jan 1</div></div>
        <div className="stat-card"><div className="stat-label">Awaiting Review</div><div className="stat-value" style={{color:"var(--amber)"}}>{items.filter(i=>i.status==="Review").length}</div><div className="stat-sub">Needs your approval</div></div>
      </div>

      {/* Items needing review — highlighted */}
      {items.filter(i=>i.status==="Review").length > 0 && (
        <div style={{background:'linear-gradient(135deg,rgba(212,150,11,0.08),rgba(253,128,64,0.06))',border:'1px solid rgba(212,150,11,0.25)',borderRadius:16,padding:'16px 18px',marginBottom:12}}>
          <div style={{font:'700 11px var(--fd)',textTransform:'uppercase',letterSpacing:1,color:'var(--amber)',marginBottom:10}}>⏳ Awaiting Your Approval</div>
          {items.filter(i=>i.status==="Review").map(d=>(
            <div key={d.id} style={{background:'rgba(255,255,255,0.8)',borderRadius:12,padding:'14px 16px',marginBottom:8,border:'1px solid rgba(212,150,11,0.15)',cursor:'pointer',backdropFilter:'blur(12px)'}}
              onClick={()=>setSelectedItem(selectedItem===d.id?null:d.id)}>
              <div style={{display:'flex',alignItems:'center',gap:10}}>
                <span style={{fontSize:20}}>{d.thumb}</span>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{font:'600 14px var(--fd)',color:'var(--text)'}}>{d.title}</div>
                  <div style={{font:'400 11px var(--fb)',color:'var(--text2)',marginTop:2}}>{d.type}</div>
                </div>
                <Badge type="amber">Review</Badge>
              </div>
              {selectedItem===d.id && (
                <div style={{marginTop:14,paddingTop:14,borderTop:'1px solid var(--border)'}}>
                  {/* Script preview */}
                  {d.script && (
                    <div style={{marginBottom:14}}>
                      <div style={{font:'600 11px var(--fd)',textTransform:'uppercase',letterSpacing:0.8,color:'var(--text3)',marginBottom:8}}>Script Preview</div>
                      <div style={{background:'rgba(255,255,255,0.9)',border:'1px solid var(--border)',borderRadius:10,padding:'14px 16px',font:'400 12px var(--fb)',color:'var(--text)',lineHeight:1.7,whiteSpace:'pre-wrap',maxHeight:200,overflowY:'auto'}}>{d.script}</div>
                    </div>
                  )}
                  {/* Approval actions */}
                  {showRevisionForm===d.id ? (
                    <div>
                      <div style={{font:'600 11px var(--fd)',textTransform:'uppercase',letterSpacing:0.8,color:'var(--text3)',marginBottom:6}}>What needs to change?</div>
                      <textarea className="form-textarea" placeholder="Describe the changes you'd like..." value={revisionNotes} onChange={e=>setRevisionNotes(e.target.value)} style={{minHeight:80,marginBottom:8}}/>
                      <div style={{display:'flex',gap:8}}>
                        <button className="btn danger" style={{flex:1}} onClick={()=>requestRevision(d.id)}>Submit Revision Request</button>
                        <button className="btn" onClick={()=>{setShowRevisionForm(null);setRevisionNotes("");}}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div style={{display:'flex',gap:8}}>
                      <button className="btn success" style={{flex:1,fontWeight:600}} onClick={()=>approveItem(d.id)}>✅ Approve</button>
                      <button className="btn" style={{flex:1}} onClick={()=>setShowRevisionForm(d.id)}>📝 Request Changes</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* All content */}
      <div className="card">
        <div className="card-title">All Content — March</div>
        {items.map(d=>(
          <div key={d.id}>
            <div className="deliverable-item" style={{cursor:"pointer"}} onClick={()=>setSelectedItem(selectedItem===d.id?null:d.id)}>
              <div className="deliverable-icon">{d.thumb}</div>
              <div className="deliverable-info">
                <div className="deliverable-title">{d.title}</div>
                <div className="deliverable-sub">{d.type}</div>
                <div className="progress-bar-wrap"><div className="progress-bar" style={{width:`${d.progress}%`,background:d.status==="Published"?"var(--green)":d.status==="Approved"||d.status==="Scheduled"?"var(--blue)":d.status==="Revision Requested"?"var(--red)":"var(--accent)"}}/></div>
              </div>
              <Badge type={statusColor(d.status)}>{d.status}</Badge>
            </div>
            {selectedItem===d.id && d.status!=="Review" && (
              <div style={{padding:"10px 0 14px 39px",borderBottom:"1px solid var(--border)"}}>
                <div className="row-item" style={{paddingTop:0}}><div className="row-main"><div className="row-title">Status</div><div className="row-sub">{d.status}</div></div><Badge type={statusColor(d.status)}>{d.status}</Badge></div>
                <div className="row-item"><div className="row-main"><div className="row-title">Progress</div><div className="row-sub">{d.progress}%</div></div></div>
                {d.approvalHistory.length > 0 && (
                  <div style={{marginTop:8}}>
                    <div style={{font:'600 10px var(--fd)',textTransform:'uppercase',letterSpacing:0.8,color:'var(--text3)',marginBottom:6}}>Approval History</div>
                    {d.approvalHistory.map((h,i)=>(
                      <div key={i} style={{display:'flex',alignItems:'center',gap:8,padding:'6px 0',borderBottom:i<d.approvalHistory.length-1?'1px solid var(--border)':'none'}}>
                        <span style={{fontSize:14}}>{h.action==="approved"?"✅":"📝"}</span>
                        <div style={{flex:1}}>
                          <div style={{font:'500 12px var(--fb)',color:'var(--text)'}}>{h.action==="approved"?"Approved":"Revision requested"}</div>
                          {h.note && <div style={{font:'400 11px var(--fb)',color:'var(--text2)',marginTop:2}}>"{h.note}"</div>}
                        </div>
                        <span style={{font:'400 10px var(--fb)',color:'var(--text3)'}}>{h.date}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ClientIG({ igPosts }) {
  const [selectedPost, setSelectedPost] = useState(null);
  const myPosts = igPosts.filter(p=>p.client==="Desert Sun Realty");
  return (
    <div>
      <div className="ig-panel">
        <div className="ig-header"><span style={{fontSize:20}}>📸</span><div><div className="ig-title">Instagram</div><div className="ig-sub">@desertsunrealtyaz</div></div></div>
        {myPosts.map(p=>(
          <div key={p.id}>
            <div className="ig-post" style={{cursor:"pointer"}} onClick={()=>setSelectedPost(selectedPost===p.id?null:p.id)}>
              <div className="ig-post-thumb">{p.thumb}</div>
              <div style={{flex:1}}><div className="ig-post-title" style={{fontSize:11}}>{p.caption.substring(0,30)}...</div><div className="ig-post-date">{p.date}</div></div>
              <Badge type={p.status==="Scheduled"?"green":"amber"}>{p.status}</Badge>
            </div>
            {selectedPost===p.id && (
              <div style={{background:"rgba(255,255,255,0.5)",borderRadius:"0 0 8px 8px",padding:"10px 12px",marginBottom:7,marginTop:-7,border:"1px solid var(--border)",borderTop:"none"}}>
                <div style={{fontSize:11,color:"var(--text3)",textTransform:"uppercase",letterSpacing:"0.8px",fontWeight:600,marginBottom:6}}>Post Details</div>
                <div style={{fontSize:12,color:"var(--text)",lineHeight:1.6,marginBottom:8}}>{p.caption}</div>
                <div className="row-item" style={{paddingTop:0}}><div className="row-main"><div className="row-title">Scheduled</div><div className="row-sub">{p.date}</div></div></div>
                <div className="row-item" style={{borderBottom:"none",paddingBottom:0}}><div className="row-main"><div className="row-title">Status</div></div><Badge type={p.status==="Scheduled"?"green":"amber"}>{p.status}</Badge></div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="card">
        <div className="card-title">Performance</div>
        {[{label:"Avg Reach per Reel",value:"4,200"},{label:"Avg Engagement Rate",value:"6.8%"},{label:"Followers This Month",value:"+842"},{label:"Profile Visits",value:"1,140"}].map(s=>(
          <div className="row-item" key={s.label}><div className="row-main"><div className="row-title">{s.label}</div></div><div style={{fontFamily:"var(--fd)",fontSize:15,fontWeight:800,color:"var(--accent)"}}>{s.value}</div></div>
        ))}
      </div>
    </div>
  );
}

function ClientInvoices({ showToast }) {
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoices, setInvoices] = useState([
    {id:1,month:"March 2025",amount:"$2,400",status:"Due Apr 1",paid:false,processing:false},
    {id:2,month:"February 2025",amount:"$2,400",status:"Paid Feb 28",paid:true,processing:false},
    {id:3,month:"January 2025",amount:"$2,400",status:"Paid Jan 31",paid:true,processing:false},
  ]);
  const handlePay = (id) => {
    setInvoices(p=>p.map(inv=>inv.id===id?{...inv,processing:true}:inv));
    setTimeout(()=>{
      setInvoices(p=>p.map(inv=>inv.id===id?{...inv,processing:false,paid:true,status:"Paid Mar 17"}:inv));
      showToast("✅","Payment Complete","Invoice has been paid");
    },2000);
  };
  return (
    <div className="card">
      <div className="card-title">Invoices</div>
      {invoices.map(inv=>(
        <div key={inv.id}>
          <div className="row-item" style={{cursor:"pointer"}} onClick={()=>setSelectedInvoice(selectedInvoice===inv.id?null:inv.id)}>
            <div className="row-avatar" style={{background:inv.paid?"rgba(34,197,94,0.12)":"rgba(255,184,0,0.12)",color:inv.paid?"var(--green)":"var(--amber)"}}>{inv.paid?"✓":"!"}</div>
            <div className="row-main"><div className="row-title">{inv.month}</div><div className="row-sub">{inv.status}</div></div>
            <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
              <div style={{fontFamily:"var(--fd)",fontSize:14,fontWeight:800}}>{inv.amount}</div>
              {inv.processing ? (
                <Badge type="amber">Processing...</Badge>
              ) : inv.paid ? (
                <Badge type="green">Paid</Badge>
              ) : (
                <button className="action-btn accent" onClick={(e)=>{e.stopPropagation();handlePay(inv.id);}}>Pay Now</button>
              )}
            </div>
          </div>
          {selectedInvoice===inv.id && (
            <div style={{padding:"8px 0 12px 47px",borderBottom:"1px solid var(--border)"}}>
              <div style={{fontSize:11,color:"var(--text3)",textTransform:"uppercase",letterSpacing:"0.8px",fontWeight:600,marginBottom:6}}>Invoice Details</div>
              <div className="row-item" style={{paddingTop:0}}><div className="row-main"><div className="row-title">Period</div><div className="row-sub">{inv.month}</div></div></div>
              <div className="row-item"><div className="row-main"><div className="row-title">Pro Plan — 8 videos/mo</div><div className="row-sub">Monthly retainer</div></div><div style={{fontFamily:"var(--fd)",fontSize:12,fontWeight:700}}>{inv.amount}</div></div>
              <div className="row-item"><div className="row-main"><div className="row-title">Payment Status</div></div><Badge type={inv.paid?"green":"amber"}>{inv.paid?"Paid":"Unpaid"}</Badge></div>
              <div className="row-item" style={{borderBottom:"none",paddingBottom:0}}><div className="row-main"><div className="row-title">Due Date</div><div className="row-sub">{inv.status}</div></div></div>
              {!inv.paid && !inv.processing && <button className="btn primary full" style={{marginTop:10}} onClick={()=>handlePay(inv.id)}>Pay Now — {inv.amount}</button>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ClientTeam({ showToast, onOpenMessages }) {
  const [selectedMember, setSelectedMember] = useState(null);
  const teamData = [{name:"Maya R.",role:"Script Writer",color:"#A855F7",note:"Writing your March scripts",assignments:["Neighborhood Spotlight script","Agent Intro script revision"],email:"maya@media4you.com"},{name:"Jordan T.",role:"Video Editor",color:"#22C55E",note:"Editing Listing Showcase",assignments:["Listing @ 4821 Cactus Rd","Sold! 3901 Desert View"],email:"jordan@media4you.com"},{name:"Carlos V.",role:"Account Manager",color:"#3B82F6",note:"Your main point of contact",assignments:["Monthly strategy call","Content calendar planning"],email:"carlos@media4you.com"}];
  return (
    <div>
      <div className="card">
        <div className="card-title">Your Dedicated Team</div>
        {teamData.map(m=>(
          <div key={m.name}>
            <div className="row-item" style={{cursor:"pointer"}} onClick={()=>setSelectedMember(selectedMember===m.name?null:m.name)}>
              <div className="row-avatar" style={{background:`${m.color}20`,color:m.color}}>{m.name[0]}</div>
              <div className="row-main"><div className="row-title">{m.name}</div><div className="row-sub">{m.role} · {m.note}</div></div>
              <button className="action-btn accent" onClick={(e)=>{e.stopPropagation();onOpenMessages();}}>Message</button>
            </div>
            {selectedMember===m.name && (
              <div style={{padding:"8px 0 12px 47px",borderBottom:"1px solid var(--border)"}}>
                <div style={{fontSize:11,color:"var(--text3)",textTransform:"uppercase",letterSpacing:"0.8px",fontWeight:600,marginBottom:6}}>Team Member Details</div>
                <div className="row-item" style={{paddingTop:0}}><div className="row-main"><div className="row-title">Role</div><div className="row-sub">{m.role}</div></div></div>
                <div className="row-item"><div className="row-main"><div className="row-title">Contact</div><div className="row-sub">{m.email}</div></div></div>
                <div style={{fontSize:11,color:"var(--text3)",textTransform:"uppercase",letterSpacing:"0.8px",fontWeight:600,marginTop:8,marginBottom:6}}>Current Assignments</div>
                {m.assignments.map(a=>(<div className="row-item" key={a}><div className="row-main"><div className="row-sub">{a}</div></div></div>))}
                <button className="btn primary full" style={{marginTop:10}} onClick={onOpenMessages}>💬 Message {m.name}</button>
              </div>
            )}
          </div>
        ))}
      </div>
      <button className="btn primary full" onClick={onOpenMessages}>💬 Open Messages</button>
    </div>
  );
}

// ─── MODALS ───────────────────────────────────────────────────────────────────
function AddClientModal({ onClose, onAdd }) {
  const [form, setForm] = useState({name:"",plan:"Starter",industry:""});
  const colors = ["#3B82F6","#A855F7","#22C55E","#FFB800","#FF5C00","#EF4444"];
  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet" onClick={e=>e.stopPropagation()}>
        <div className="sheet-handle"/>
        <div className="sheet-title">Add New Client</div>
        <div className="form-group"><label className="form-label">Business Name</label><input className="form-input" placeholder="e.g. Scottsdale Med Spa" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))}/></div>
        <div className="form-group"><label className="form-label">Industry</label><input className="form-input" placeholder="e.g. med spa, restaurant, law firm" value={form.industry} onChange={e=>setForm(p=>({...p,industry:e.target.value}))}/></div>
        <div className="form-group"><label className="form-label">Plan</label><select className="form-select" value={form.plan} onChange={e=>setForm(p=>({...p,plan:e.target.value}))}><option>Starter</option><option>Growth</option><option>Pro</option></select></div>
        <div className="form-actions">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn primary" onClick={()=>{if(!form.name.trim())return;onAdd({id:Date.now(),name:form.name,industry:form.industry||form.name,plan:form.plan,status:"onboarding",stage:"Onboarding",nextPost:"—",color:colors[Math.floor(Math.random()*colors.length)],videos:0,mrr:{Starter:600,Growth:1200,Pro:2400}[form.plan]});onClose();}}>Add Client</button>
        </div>
      </div>
    </div>
  );
}

function AddLeadModal({ onClose, onAdd }) {
  const [form, setForm] = useState({name:"",value:"$600/mo",source:"Referral",rep:"Carlos",industry:""});
  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet" onClick={e=>e.stopPropagation()}>
        <div className="sheet-handle"/>
        <div className="sheet-title">Add New Lead</div>
        <div className="form-group"><label className="form-label">Business Name</label><input className="form-input" placeholder="e.g. Mesa Flooring Co" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))}/></div>
        <div className="form-group"><label className="form-label">Industry</label><input className="form-input" placeholder="e.g. flooring contractor" value={form.industry} onChange={e=>setForm(p=>({...p,industry:e.target.value}))}/></div>
        <div className="form-group"><label className="form-label">Value</label><select className="form-select" value={form.value} onChange={e=>setForm(p=>({...p,value:e.target.value}))}><option>$600/mo</option><option>$1,200/mo</option><option>$1,800/mo</option><option>$2,400/mo</option></select></div>
        <div className="form-group"><label className="form-label">Source</label><select className="form-select" value={form.source} onChange={e=>setForm(p=>({...p,source:e.target.value}))}><option>Referral</option><option>IG DM</option><option>Website</option><option>Cold Outreach</option></select></div>
        <div className="form-group"><label className="form-label">Rep</label><select className="form-select" value={form.rep} onChange={e=>setForm(p=>({...p,rep:e.target.value}))}><option>Carlos</option><option>Jade</option></select></div>
        <div className="form-actions">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn primary" onClick={()=>{if(!form.name.trim())return;onAdd({id:Date.now(),...form});onClose();}}>Add Lead</button>
        </div>
      </div>
    </div>
  );
}

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const ROLES = [
  {key:"admin",       label:"Admin",        name:"Alex M.",          color:"#FF5C00",initial:"A"},
  {key:"sales",       label:"Sales Rep",    name:"Carlos V.",        color:"#3B82F6",initial:"S"},
  {key:"scriptwriter",label:"Script Writer",name:"Maya R.",          color:"#A855F7",initial:"W"},
  {key:"editor",      label:"Video Editor", name:"Jordan T.",        color:"#22C55E",initial:"E"},
  {key:"client",      label:"Client",       name:"Desert Sun Realty",color:"#FFB800",initial:"C"},
];
const NAV_CONFIG = {
  admin:        [{label:"Dashboard",icon:"⬛",view:"dashboard"},{label:"Pipeline",icon:"🔄",view:"pipeline"},{label:"Clients",icon:"👥",view:"clients"},{label:"Revenue",icon:"💰",view:"revenue"},{label:"Ads",icon:"📢",view:"ads"},{label:"Settings",icon:"⚙️",view:"settings"}],
  sales:        [{label:"Pipeline",icon:"📊",view:"dashboard",badge:3},{label:"Calls",icon:"🎥",view:"calls"},{label:"Leads",icon:"🎯",view:"leads"},{label:"Activity",icon:"📋",view:"activity"}],
  scriptwriter: [{label:"Queue",icon:"✍️",view:"dashboard",badge:2},{label:"Done",icon:"✅",view:"completed"}],
  editor:       [{label:"Production",icon:"🎬",view:"dashboard",badge:2},{label:"Upload",icon:"📤",view:"upload"},{label:"Done",icon:"✅",view:"completed"}],
  client:       [{label:"Content",icon:"📹",view:"dashboard"},{label:"Instagram",icon:"📸",view:"instagram"},{label:"Ads",icon:"📢",view:"ads"},{label:"Invoices",icon:"🧾",view:"invoices"},{label:"Team",icon:"👥",view:"team"}],
};
const TITLES = {admin:"Admin",sales:"Sales",scriptwriter:"Scripts",editor:"Production",client:"My Content"};

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [role, setRole]           = useState("admin");
  const [view, setView]           = useState("dashboard");
  const [panel, setPanel]         = useState(null); // "notifs"|"messages"|"ideas"|"calendar"|"caption"|"outreach"|"idea-script"
  const [panelData, setPanelData] = useState(null);
  const [sheetOpen, setSheet]     = useState(false);
  const [modal, setModal]         = useState(null);
  const [toast, setToast]         = useState(null);
  const [subView, setSubView]     = useState(null);
  const [selScript, setSelScript] = useState(null);
  const [clients, setClients]     = useState(INIT_CLIENTS);
  const [leads, setLeads]         = useState(INIT_LEADS);
  const [scripts, setScripts]     = useState(INIT_SCRIPTS);
  const [videos, setVideos]       = useState(INIT_VIDEOS);
  const [igPosts, setIgPosts]     = useState(INIT_IG);
  const [notifs, setNotifs]       = useState(INIT_NOTIFS);
  const [threads, setThreads]     = useState(INIT_THREADS);

  const roleInfo = ROLES.find(r=>r.key===role);
  const unreadNotifs = notifs.filter(n=>n.unread).length;
  const unreadMsgs = threads.reduce((s,t)=>s+t.unread,0);

  const showToast = (icon,text,sub="") => { setToast({icon,text,sub}); setTimeout(()=>setToast(null),2500); };
  const switchRole = (r) => { setRole(r);setView("dashboard");setPanel(null);setPanelData(null);setSubView(null);setSelScript(null);setSheet(false); };
  const navTo = (v) => { setView(v);setPanel(null);setSubView(null);setSelScript(null); };
  const openPanel = (p,data=null) => { setPanel(p);setPanelData(data); };
  const closePanel = () => { setPanel(null);setPanelData(null); };

  const advanceVideo = (id) => setVideos(p=>p.map(v=>v.id===id&&STATUS_FLOW[v.status]?{...v,status:STATUS_FLOW[v.status]}:v));
  const scheduleVideo = (id) => {
    const v = videos.find(v=>v.id===id);
    setVideos(p=>p.map(v=>v.id===id?{...v,status:"Scheduled"}:v));
    if(v) setIgPosts(p=>[...p,{id:Date.now(),client:v.client,caption:`New content from ${v.client}...`,date:"TBD",thumb:v.thumb,status:"Scheduled"}]);
  };
  const updateScript = (id,status,draft) => setScripts(p=>p.map(s=>s.id===id?{...s,status,draft}:s));
  const addScriptFromIdea = (clientName, ideaTitle, draft) => {
    setScripts(p=>[...p,{id:Date.now(),client:clientName,type:ideaTitle,due:"TBD",priority:"med",status:"In Progress",draft}]);
  };
  const addClient = (c) => { setClients(p=>[...p,c]); showToast("✅","Client added",c.name+" is now onboarding"); };
  const addLead = (l) => { setLeads(p=>({...p,"New":[...p["New"],l]})); showToast("✅","Lead added",l.name+" added to pipeline"); };
  const sendMessage = (idx,text) => setThreads(p=>p.map((t,i)=>i===idx?{...t,unread:0,last:text,messages:[...t.messages,{id:Date.now(),from:"Me",mine:true,text,time:"Just now"}]}:t));

  const topbarActionLabel = {admin:"+ Client",sales:"+ Lead",scriptwriter:"✨ AI",editor:"+ Upload",client:"Contact"}[role];
  const topbarAction = () => {
    if(role==="admin") setModal("add-client");
    else if(role==="sales") setModal("add-lead");
    else if(role==="scriptwriter") showToast("✨","AI Draft","Select a script first");
    else if(role==="editor") navTo("upload");
    else if(role==="client") openPanel("messages");
  };

  const currentTitle = panel==="notifs"?"Notifications":panel==="messages"?"Messages":TITLES[role];

  const renderMain = () => {
    if(selScript!==null && role==="scriptwriter") return <ScriptEditor script={scripts[selScript]} onBack={()=>setSelScript(null)} onUpdate={updateScript} showToast={showToast}/>;
    if(subView?.type==="client-detail") return null; // handled in panels

    if(role==="admin"){
      if(view==="dashboard") return <AdminDashboard clients={clients} onNav={navTo} onOpenIdeas={(c)=>openPanel("ideas",c)} onOpenCalendar={()=>openPanel("calendar")} onOpenClientDetail={(c)=>openPanel("client-detail",c)} showToast={showToast}/>;
      if(view==="pipeline")  return <ContentPipeline scripts={scripts} videos={videos} onAdvanceVideo={advanceVideo} onUpdateScript={updateScript} showToast={showToast}/>;
      if(view==="clients")   return <AdminClients clients={clients} showToast={showToast} onOpenIdeas={(c)=>openPanel("ideas",c)}/>;
      if(view==="revenue")   return <AdminRevenue clients={clients}/>;
      if(view==="ads")       return <AdminAds showToast={showToast}/>;
      if(view==="settings")  return <AdminSettings showToast={showToast}/>;
    }
    if(role==="sales"){
      if(view==="dashboard") return <SalesDashboard leads={leads} onOpenOutreach={()=>openPanel("outreach")} showToast={showToast}/>;
      if(view==="calls")     return <SalesCalls showToast={showToast}/>;
      if(view==="leads")     return <SalesLeadsList leads={leads} showToast={showToast}/>;
      if(view==="activity")  return <SalesActivity/>;
    }
    if(role==="scriptwriter"){
      if(view==="dashboard") return <ScriptQueue scripts={scripts} onSelect={setSelScript}/>;
      if(view==="completed") return <ScriptCompleted scripts={scripts}/>;
    }
    if(role==="editor"){
      if(view==="dashboard") return <EditorProduction videos={videos} igPosts={igPosts} onAdvance={advanceVideo} onSchedule={scheduleVideo} onOpenCaption={()=>openPanel("caption")} showToast={showToast}/>;
      if(view==="upload")    return <EditorUpload showToast={showToast}/>;
      if(view==="completed") return <EditorCompleted videos={videos}/>;
    }
    if(role==="client"){
      if(view==="dashboard") return <ClientContent showToast={showToast}/>;
      if(view==="instagram") return <ClientIG igPosts={igPosts}/>;
      if(view==="ads")       return <ClientAds showToast={showToast}/>;
      if(view==="invoices")  return <ClientInvoices showToast={showToast}/>;
      if(view==="team")      return <ClientTeam showToast={showToast} onOpenMessages={()=>openPanel("messages")}/>;
    }
    return <div className="empty"><div className="empty-icon">🚧</div><div className="empty-title">Coming soon</div></div>;
  };

  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);

  const SidebarContent = ({ mobile }) => (
    <div className={mobile ? "mobile-sidebar" : "sidebar"}>
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">M</div>
        <div>
          <div className="sidebar-logo-text">MEDIA<span style={{color:"var(--accent)"}}>4</span>YOU</div>
          <div className="sidebar-logo-sub">{roleInfo.label} View</div>
        </div>
      </div>
      <nav className="sidebar-nav">
        <div className="sidebar-section-group">
          <div className="sidebar-section">Navigation</div>
          {NAV_CONFIG[role].map(n=>(
            <button key={n.view} className={`sidebar-link ${view===n.view&&!panel&&selScript===null?"active":""}`}
              onClick={()=>{navTo(n.view);if(mobile)setSidebarMobileOpen(false);}}>
              <span className="sidebar-link-icon">{n.icon}</span>
              <span>{n.label}</span>
              {n.badge && <span className="sidebar-link-badge">{n.badge}</span>}
            </button>
          ))}
          <button className={`sidebar-link ${panel==="messages"?"active":""}`}
            onClick={()=>{openPanel("messages");if(mobile)setSidebarMobileOpen(false);}}>
            <span className="sidebar-link-icon">💬</span>
            <span>Messages</span>
            {unreadMsgs>0 && <span className="sidebar-link-badge">{unreadMsgs}</span>}
          </button>
        </div>
      </nav>
      <div className="sidebar-footer">
        <button className="sidebar-role-btn" onClick={()=>setSheet(true)}>
          <span className="sidebar-role-dot" style={{background:roleInfo.color}}/>
          <span style={{flex:1,textAlign:"left"}}>{roleInfo.label}</span>
          <span style={{fontSize:11,color:"#666"}}>{roleInfo.name}</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <style>{styles}</style>
      <div className="app">

        {/* ═══ DESKTOP SIDEBAR ═══ */}
        <SidebarContent />

        {/* ═══ MOBILE SIDEBAR ═══ */}
        {sidebarMobileOpen && <div className="mobile-sidebar-overlay" onClick={()=>setSidebarMobileOpen(false)}/>}
        {sidebarMobileOpen && <SidebarContent mobile />}

        {/* ═══ MAIN AREA ═══ */}
        <div className="main-area">

          {/* TOPBAR */}
          <div className="topbar">
            <button className="mobile-menu-btn" onClick={()=>setSidebarMobileOpen(true)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <div className="t-right">
              {panel ? (
                <button className="btn back" style={{margin:0,padding:"5px 14px",fontSize:12}} onClick={closePanel}>✕ Close</button>
              ) : (
                <>
                  <span className="topbar-date">
                    {new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'})}
                  </span>
                  <div className="topbar-divider"/>
                  <button className="bell-btn" onClick={()=>openPanel("notifs")}>
                    🔔{unreadNotifs>0&&<div className="bell-dot"/>}
                  </button>
                  <div className="topbar-divider"/>
                  <button className="top-action-btn" onClick={topbarAction}>{topbarActionLabel}</button>
                </>
              )}
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="content" style={{display:panel?"none":"block"}}>
            {renderMain()}
          </div>

          {/* FULL SCREEN PANELS */}
          {panel==="notifs" && (
            <div className="content">
              <NotificationsPanel notifs={notifs} onClear={()=>setNotifs(p=>p.map(n=>({...n,unread:false})))} onRead={(id)=>setNotifs(p=>p.map(n=>n.id===id?{...n,unread:false}:n))}/>
            </div>
          )}
          {panel==="messages" && <MessagingPanel threads={threads} onSend={sendMessage}/>}
          {panel==="ideas" && panelData && (
            <VideoIdeaGenerator
              client={panelData}
              onClose={closePanel}
              onIdeaToScript={(client,idea)=>openPanel("idea-script",{client,idea})}
            />
          )}
          {panel==="idea-script" && panelData && (
            <IdeaScriptView
              client={panelData.client}
              idea={panelData.idea}
              onBack={()=>openPanel("ideas",panelData.client)}
              onSaveToQueue={addScriptFromIdea}
              showToast={showToast}
            />
          )}
          {panel==="calendar" && <ContentCalendar clients={clients} onClose={closePanel} showToast={showToast}/>}
          {panel==="caption" && <CaptionWriter onClose={closePanel} showToast={showToast}/>}
          {panel==="outreach" && <OutreachWriter onClose={closePanel} showToast={showToast}/>}
          {panel==="client-detail" && panelData && (
            <div className="full-panel">
              <div style={{padding:"12px 24px",borderBottom:"1px solid var(--border)",background:"var(--surface)",display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
                <button className="btn back" style={{margin:0,padding:"6px 10px",fontSize:12}} onClick={closePanel}>←</button>
                <div className="row-avatar" style={{background:`${panelData.color}20`,color:panelData.color,width:36,height:36}}>{panelData.name[0]}</div>
                <div style={{flex:1}}>
                  <div style={{fontFamily:"var(--fd)",fontSize:14,fontWeight:700}}>{panelData.name}</div>
                  <div style={{fontSize:11,color:"var(--text3)"}}>{panelData.industry}</div>
                </div>
              </div>
              <div className="full-panel-scroll">
                <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
                  <Badge type={panelData.plan==="Pro"?"purple":panelData.plan==="Growth"?"blue":"gray"}>{panelData.plan} Plan</Badge>
                  <Badge type={panelData.status==="active"?"green":panelData.status==="onboarding"?"amber":"red"}>{panelData.status}</Badge>
                </div>
                <div className="stats-grid">
                  <div className="stat-card"><div className="stat-label">MRR</div><div className="stat-value">${panelData.mrr.toLocaleString()}</div></div>
                  <div className="stat-card"><div className="stat-label">Videos</div><div className="stat-value">{panelData.videos}</div><div className="stat-sub">produced</div></div>
                  <div className="stat-card"><div className="stat-label">Next Delivery</div><div className="stat-value" style={{fontSize:16}}>{panelData.nextPost}</div></div>
                  <div className="stat-card"><div className="stat-label">Stage</div><div className="stat-value" style={{fontSize:16}}>{panelData.stage}</div></div>
                </div>
                <div className="card">
                  <div className="card-title">Content Pipeline</div>
                  {[{title:"Day in the Life",status:"Scripting",progress:20,icon:"✍️"},{title:"Listing Showcase",status:"Editing",progress:60,icon:"🎬"},{title:"Testimonial Reel",status:"Review",progress:85,icon:"👁️"}].map((p,i)=>(
                    <div className="deliverable-item" key={i}>
                      <div className="deliverable-icon">{p.icon}</div>
                      <div className="deliverable-info">
                        <div className="deliverable-title">{p.title}</div>
                        <div className="deliverable-sub">{p.status}</div>
                        <div className="progress-bar-wrap"><div className="progress-bar" style={{width:`${p.progress}%`,background:"var(--accent)"}}/></div>
                      </div>
                      <Badge type={p.status==="Scripting"?"gray":p.status==="Editing"?"blue":"amber"}>{p.status}</Badge>
                    </div>
                  ))}
                </div>
                <div style={{display:"flex",gap:8}}>
                  <button className="btn primary" style={{flex:1}} onClick={()=>{openPanel("ideas",panelData);}}>💡 AI Ideas</button>
                  <button className="btn" style={{flex:1}} onClick={()=>showToast("💬","Message sent","Notification sent to team")}>Message</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ROLE SHEET */}
        {sheetOpen && (
          <div className="overlay" onClick={()=>setSheet(false)}>
            <div className="sheet" onClick={e=>e.stopPropagation()}>
              <div className="sheet-handle"/>
              <div className="sheet-title">Switch Role — Demo</div>
              {ROLES.map(r=>(
                <button key={r.key} className={`sheet-role-btn ${role===r.key?"active":""}`} onClick={()=>switchRole(r.key)}>
                  <span className="sheet-dot" style={{background:r.color}}/>
                  <span style={{fontWeight:600,flex:1}}>{r.label}</span>
                  <span style={{fontSize:11,color:"var(--text3)"}}>{r.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {modal==="add-client"&&<AddClientModal onClose={()=>setModal(null)} onAdd={addClient}/>}
        {modal==="add-lead"  &&<AddLeadModal   onClose={()=>setModal(null)} onAdd={addLead}/>}
        <Toast toast={toast}/>
      </div>
    </>
  );
}
