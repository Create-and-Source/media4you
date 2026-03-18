import { useState, useRef, useEffect, useCallback } from "react";
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

  .dark {
    --bg: #0F0F0F;
    --bg2: #1A1A1A;
    --surface: rgba(30,30,30,0.85);
    --surface2: rgba(40,40,40,0.65);
    --surface3: rgba(50,50,50,0.45);
    --border: rgba(255,255,255,0.08);
    --border2: rgba(255,255,255,0.14);
    --text: #E8E8E8;
    --text2: #A0A0B0;
    --text3: #666678;
    --shadow: 0 4px 24px rgba(0,0,0,0.3);
    --shadow-sm: 0 2px 12px rgba(0,0,0,0.2);
  }
  .dark body::before { opacity:0.4; }

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
  .overlay { position:fixed; inset:0; background:rgba(0,0,0,0.5); backdrop-filter:blur(4px); z-index:300; display:flex; align-items:center; justify-content:center; padding:20px; }
  .sheet {
    background: rgba(255,255,255,0.97);
    backdrop-filter: blur(30px);
    -webkit-backdrop-filter: blur(30px);
    border-radius:18px; border:1px solid var(--border2);
    width:100%; max-width:480px; padding:0 20px 28px; max-height:85dvh; overflow-y:auto;
    box-shadow: 0 20px 60px rgba(0,0,0,0.15);
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
  .editor-textarea { width:100%; background:transparent; border:none; outline:none; font-size:13px; color:var(--text); line-height:1.7; font-family:var(--fb); resize:vertical; min-height:calc(100vh - 320px); }
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
  .editor-textarea { width:100%; background:transparent; border:none; outline:none; font-size:13px; color:var(--text); line-height:1.7; font-family:var(--fb); resize:vertical; min-height:calc(100vh - 320px); }

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

  /* SEARCH MODAL */
  .search-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.4); backdrop-filter:blur(8px); z-index:500; display:flex; align-items:flex-start; justify-content:center; padding-top:12vh; }
  .search-modal { width:90%; max-width:560px; background:rgba(255,255,255,0.97); border:1px solid var(--border2); border-radius:18px; overflow:hidden; box-shadow:0 20px 60px rgba(0,0,0,0.2); backdrop-filter:blur(30px); animation:slideUp 0.15s ease; }
  .search-input-wrap { padding:16px 20px; border-bottom:1px solid var(--border); display:flex; align-items:center; gap:10px; }
  .search-input-wrap input { flex:1; border:none; outline:none; font:400 15px var(--fb); color:var(--text); background:none; }
  .search-results { max-height:50vh; overflow-y:auto; padding:8px; }
  .search-result { display:flex; align-items:center; gap:12px; padding:10px 14px; border-radius:10px; cursor:pointer; transition:background 0.1s; }
  .search-result:hover { background:var(--accent-dim); }
  .search-result-icon { font-size:18px; width:24px; text-align:center; flex-shrink:0; }
  .search-hint { padding:12px 20px; border-top:1px solid var(--border); font:400 11px var(--fb); color:var(--text3); display:flex; justify-content:space-between; }

  /* CONFETTI */
  @keyframes confettiFall { 0% { transform:translateY(-100vh) rotate(0deg); opacity:1; } 100% { transform:translateY(100vh) rotate(720deg); opacity:0; } }
  .confetti-piece { position:fixed; width:10px; height:10px; z-index:600; pointer-events:none; animation:confettiFall 2.5s ease-in forwards; }

  /* STATUS DROPDOWN */
  .status-dropdown { position:absolute; top:100%; right:0; background:rgba(255,255,255,0.97); border:1px solid var(--border2); border-radius:10px; padding:4px; z-index:300; box-shadow:0 8px 30px rgba(0,0,0,0.15); backdrop-filter:blur(20px); min-width:120px; }
  .status-option { padding:8px 12px; border-radius:6px; cursor:pointer; font:400 12px var(--fb); color:var(--text); transition:background 0.1s; }
  .status-option:hover { background:var(--accent-dim); }

  /* INLINE EDIT */
  .inline-edit { border:none; outline:none; background:none; font:inherit; color:inherit; width:100%; border-bottom:1px dashed var(--accent); padding:2px 0; }
  .inline-edit:focus { border-bottom:2px solid var(--accent); }
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

const PLAN_DETAILS = {
  Copper: {videos:4,shoots:"1×3hr/mo",fbAds:true,googleAds:false,coaching:false,strategy:false,socialMgmt:true,scriptwriting:false,photos:0,price:"$1,500"},
  Gold:   {videos:8,shoots:"4×2hr/mo",fbAds:true,googleAds:false,coaching:true,strategy:false,socialMgmt:true,scriptwriting:true,photos:0,price:"$3,000"},
  Platinum:{videos:20,shoots:"8×3hr/mo",fbAds:true,googleAds:true,coaching:true,strategy:true,socialMgmt:true,scriptwriting:true,photos:8,price:"$5,000"},
};

const INIT_SHOOTS = [
  {id:1,client:"Frost Barbershop",date:"Mar 19",time:"10:00 AM",duration:"2hr",location:"Frost Barbershop — Scottsdale",status:"Confirmed",crew:"Jordan T., Carlos V.",notes:"Saturday morning rush content. Capture haircuts, banter, energy."},
  {id:2,client:"Desert Sun Realty",date:"Mar 20",time:"9:00 AM",duration:"3hr",location:"4821 Cactus Rd, Scottsdale",status:"Confirmed",crew:"Jordan T.",notes:"Listing showcase. Bring drone. Shoot interior + backyard at golden hour."},
  {id:3,client:"Desert Sun Realty",date:"Mar 22",time:"2:00 PM",duration:"2hr",location:"Desert Sun Office",status:"Pending",crew:"Jordan T., Maya R.",notes:"Agent intro + testimonial reel. 2 agents, 1 client interview."},
  {id:4,client:"Sky Harbor Dental",date:"Mar 24",time:"11:00 AM",duration:"3hr",location:"Sky Harbor Dental — Phoenix",status:"Confirmed",crew:"Jordan T.",notes:"Patient transformation + meet the team. Need signed media releases."},
  {id:5,client:"Mesa Auto Detailing",date:"Mar 25",time:"8:00 AM",duration:"2hr",location:"Mesa Auto Detailing",status:"Pending",crew:"Jordan T., Carlos V.",notes:"Tesla ceramic coating process. Full detail start to finish."},
  {id:6,client:"Cactus CrossFit",date:"Mar 27",time:"6:00 AM",duration:"3hr",location:"Cactus CrossFit — Tempe",status:"Confirmed",crew:"Jordan T.",notes:"Open gym workout. Capture member energy, coaching, community."},
];

const INIT_COACHING = [
  {id:1,client:"Desert Sun Realty",type:"Strategy Call",date:"Mar 20",time:"3:00 PM",duration:"30min",status:"Upcoming",notes:"Monthly strategy review. Discuss Q2 content calendar and ad performance."},
  {id:2,client:"Sky Harbor Dental",type:"Strategy Call",date:"Mar 21",time:"1:00 PM",duration:"30min",status:"Upcoming",notes:"Review patient acquisition funnel. Google Ads performance deep-dive."},
  {id:3,client:"Mesa Auto Detailing",type:"Camera Coaching",date:"Mar 18",time:"4:00 PM",duration:"45min",status:"Completed",notes:"Taught team how to film BTS clips on iPhone. Covered lighting + audio."},
  {id:4,client:"Frost Barbershop",type:"Camera Coaching",date:"Mar 15",time:"11:00 AM",duration:"30min",status:"Completed",notes:"Showed barbers how to capture client reactions. Quick phone filming tips."},
  {id:5,client:"Cactus CrossFit",type:"Sales Coaching",date:"Mar 28",time:"10:00 AM",duration:"45min",status:"Upcoming",notes:"Help gym convert IG followers to memberships. DM strategy + landing page review."},
  {id:6,client:"Internal",type:"Team 1:1 — Maya R.",date:"Mar 18",time:"9:00 AM",duration:"30min",status:"Upcoming",notes:"Weekly 1:1 with Maya. Review script queue, workload, any blockers."},
  {id:7,client:"Internal",type:"Team 1:1 — Jordan T.",date:"Mar 18",time:"9:30 AM",duration:"30min",status:"Upcoming",notes:"Weekly 1:1 with Jordan. Check edit progress, equipment needs, upcoming shoots."},
  {id:8,client:"Internal",type:"Team 1:1 — Carlos V.",date:"Mar 18",time:"10:00 AM",duration:"30min",status:"Upcoming",notes:"Weekly 1:1 with Carlos. Pipeline review, lead follow-ups, client feedback."},
  {id:9,client:"Internal",type:"All Hands",date:"Mar 19",time:"10:00 AM",duration:"45min",status:"Upcoming",notes:"Weekly team standup. Review pipeline, shoot schedule, wins from last week."},
];

const INIT_CLIENTS = [
  {id:1,name:"Frost Barbershop",    industry:"barbershop",    plan:"Gold",  status:"active",     stage:"Production", nextPost:"Mar 19",color:"#3B82F6",videos:4, mrr:3000,
    brandKit:{colors:["#1A1A2E","#E0E0E0","#C4A35A"],tone:"Masculine, confident, clean",hashtags:["#FrostBarbershop","#AZBarber","#ScottsdaleBarber","#FreshCut"],audience:"Men 18-45, Scottsdale area",ig:"@frostbarbershop"},
    metrics:{followers:2840,gained:312,avgViews:4200,avgLikes:280,engRate:6.7,topPost:"Spring Lineup Styles"}},
  {id:2,name:"Desert Sun Realty",   industry:"real estate",   plan:"Platinum",     status:"active",     stage:"Publishing", nextPost:"Mar 20",color:"#A855F7",videos:8, mrr:5000,
    brandKit:{colors:["#2D1B69","#F5F0EB","#D4A574"],tone:"Professional, aspirational, local expert",hashtags:["#DesertSunRealty","#ScottsdaleHomes","#AZRealEstate","#PhoenixRealtor"],audience:"Home buyers/sellers 28-55",ig:"@desertsunrealty"},
    metrics:{followers:5120,gained:842,avgViews:8400,avgLikes:520,engRate:6.2,topPost:"Listing @ 4821 Cactus Rd"}},
  {id:3,name:"Cactus CrossFit",     industry:"gym/fitness",   plan:"Copper", status:"active",     stage:"Scripting",  nextPost:"Mar 22",color:"#22C55E",videos:2, mrr:1500,
    brandKit:{colors:["#1B4332","#F0F0F0","#FF6B35"],tone:"Energetic, motivating, community-driven",hashtags:["#CactusCrossFit","#AZFitness","#CrossFitAZ","#DesertStrong"],audience:"Fitness enthusiasts 22-40",ig:"@cactuscrossfit"},
    metrics:{followers:1650,gained:180,avgViews:3100,avgLikes:210,engRate:6.8,topPost:"Member Transformation Story"}},
  {id:4,name:"Mesa Auto Detailing", industry:"auto detailing",plan:"Gold",  status:"review",     stage:"Editing",    nextPost:"Mar 18",color:"#FFB800",videos:6, mrr:3000,
    brandKit:{colors:["#0D0D0D","#FFB800","#FFFFFF"],tone:"Satisfying, premium, before/after focused",hashtags:["#MesaAutoDetail","#AZDetailing","#CeramicCoating","#CarCare"],audience:"Car enthusiasts, luxury vehicle owners 25-50",ig:"@mesaautodetail"},
    metrics:{followers:3200,gained:410,avgViews:6800,avgLikes:450,engRate:6.6,topPost:"Black Tesla Model S Detail"}},
  {id:5,name:"Sky Harbor Dental",   industry:"dental",        plan:"Platinum",     status:"active",     stage:"Approved",   nextPost:"Mar 21",color:"#FF5C00",videos:10,mrr:5000,
    brandKit:{colors:["#0077B6","#FFFFFF","#90E0EF"],tone:"Friendly, reassuring, results-driven",hashtags:["#SkyHarborDental","#AZDentist","#SmileTransformation","#PhoenixDentist"],audience:"Adults 25-60 needing dental care",ig:"@skyharbordental"},
    metrics:{followers:1890,gained:220,avgViews:3500,avgLikes:190,engRate:5.4,topPost:"Teeth Whitening Before/After"}},
  {id:6,name:"Tempe Taqueria",      industry:"restaurant",    plan:"Copper", status:"onboarding", stage:"Onboarding", nextPost:"—",     color:"#9999A8",videos:0, mrr:1500,
    brandKit:{colors:["#D62828","#FFF8E7","#F77F00"],tone:"Fun, authentic, mouth-watering, local flavor",hashtags:["#TempeTaqueria","#AZFood","#TacoTuesday","#PhoenixEats"],audience:"Foodies 18-40, Tempe/Phoenix area",ig:"@tempetaqueria"},
    metrics:{followers:0,gained:0,avgViews:0,avgLikes:0,engRate:0,topPost:"—"}},
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
  {id:1,client:"Mesa Auto Detailing",type:"Before/After Reveal", due:"Mar 18",priority:"high",status:"In Progress",  draft:"HOOK (0–3 sec)\nYour car is about to look brand new — watch this transformation.\n\nSETUP (3–10 sec)\nThis Tesla Model S came in covered in swirl marks, water spots, and a full year of Arizona sun damage. The owner said he'd given up on getting the paint back. We told him to trust the process.\n\nBODY (10–45 sec)\nFirst we do a full decontamination wash — pre-rinse, foam cannon, two-bucket method. Then iron remover to pull embedded contaminants. Clay bar the entire surface until it's glass smooth.\n\nNext: two-step paint correction. We start with a heavy cutting compound on a microfiber pad to remove the deep scratches and swirl marks. Then a finishing polish with our 12mm DA polisher to bring out that mirror-like clarity.\n\nFinally, two coats of ceramic coating — each one hand-applied and leveled. This gives the paint 3+ years of UV protection and hydrophobic properties. Watch the water just bead right off.\n\nThe before and after is insane. This is the same car. Same paint. Zero respray. Just skill, patience, and the right products.\n\nCTA (45–60 sec)\nIf your car deserves this level of care, tap the link in bio to book your detail with Mesa Auto Detailing. We're booked 2-3 weeks out, so don't wait.\n\nFollow for more satisfying detail videos — we post new transformations every week.\n\n---\nSHOOT NOTES:\n- Film in 4K vertical (9:16)\n- Time-lapse the wash process (30 sec compressed to 5 sec)\n- Close-up macro shots of swirl marks before correction\n- Slow-motion water bead test after ceramic coat\n- Split-screen before/after at the 40 sec mark\n- Natural garage lighting + LED panel for detail shots\n- Music: satisfying/ASMR style, low tempo"},
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
  {id:1,icon:"▶",text:<><strong>Jordan T.</strong> uploaded Patient Transformation #4</>,  time:"11 min ago",unread:true, action:{view:"pipeline"} },
  {id:2,icon:"◎",text:<><strong>Carlos V.</strong> moved Chandler Law → Demo Scheduled</>, time:"34 min ago",unread:true, action:{view:"dashboard",role:"sales"} },
  {id:3,icon:"▤",text:<><strong>Maya R.</strong> submitted Frost Barbershop script</>,     time:"1 hr ago",  unread:true, action:{view:"pipeline"} },
  {id:4,icon:"◎",text:<>Instagram published for <strong>Desert Sun Realty</strong></>,      time:"2 hr ago",  unread:false, action:{view:"clients"} },
  {id:5,icon:"$",text:<><strong>Tempe Taqueria</strong> payment received — $1,500</>,         time:"3 hr ago",  unread:false, action:{view:"revenue"} },
  {id:6,icon:"▶",text:<><strong>Mar 20 Shoot</strong> confirmed — Desert Sun Realty</>,   time:"4 hr ago",  unread:false, action:{view:"shoots"} },
  {id:7,icon:"◉",text:<><strong>Sky Harbor Dental</strong> strategy call tomorrow 1 PM</>, time:"5 hr ago",  unread:false, action:{view:"coaching"} },
];

const THREADS_BY_ROLE = {
  admin: [
    {id:1,name:"Carlos V.",role:"Account Manager",color:"#3B82F6",last:"The listing showcase is going into editing today.",time:"11 min",unread:2,
     messages:[{id:1,from:"Carlos V.",mine:false,text:"Hey! Your March content plan for @Desert Sun Realty is looking great. 8 videos lined up.",time:"11 min ago"},{id:2,from:"Carlos V.",mine:false,text:"The @Listing Showcase for 4821 Cactus is going into editing today. @Jordan T. is on it.",time:"10 min ago"}]},
    {id:2,name:"Maya R.",role:"Script Writer",color:"#A855F7",last:"Drafted the neighborhood spotlight script!",time:"1 hr",unread:1,
     messages:[{id:1,from:"Maya R.",mine:false,text:"I've drafted the script for @Neighborhood Spotlight — take a look when you get a chance!",time:"1 hr ago"},{id:2,from:"Maya R.",mine:false,text:"Also working on the @Day in the Life script for @Frost Barbershop next.",time:"45 min ago"}]},
    {id:3,name:"Jordan T.",role:"Video Editor",color:"#22C55E",last:"Shot list ready for tomorrow.",time:"2 hr",unread:0,
     messages:[{id:1,from:"Jordan T.",mine:false,text:"The @Testimonial Reel for @Desert Sun Realty is ready for your review.",time:"2 hr ago"},{id:2,from:"Me",mine:true,text:"Looks amazing! Approved. Can you also prep for the @Mar 20 Shoot — Desert Sun session?",time:"1 hr ago"},{id:3,from:"Jordan T.",mine:false,text:"Already on it. I'll have the shot list ready by tonight.",time:"58 min ago"}]},
  ],
  sales: [
    {id:10,name:"Sabrina",role:"Owner",color:"#FF5C00",last:"How did the Chandler Law demo go?",time:"20 min",unread:1,
     messages:[{id:1,from:"Sabrina",mine:false,text:"How did the Chandler Law demo go? They seemed interested on the intro call.",time:"20 min ago"}]},
    {id:11,name:"Jade",role:"Sales Rep",color:"#A855F7",last:"I've got 3 follow-ups to do today.",time:"1 hr",unread:0,
     messages:[{id:1,from:"Jade",mine:false,text:"I've got 3 follow-ups to do today. Sun Devil Gym wants to reschedule to Friday.",time:"1 hr ago"},{id:2,from:"Me",mine:true,text:"That's fine. Make sure to send them the @Content Strategy Ideas email before the call.",time:"45 min ago"}]},
    {id:12,name:"Alex M.",role:"Admin",color:"#FF5C00",last:"New lead came in from the website.",time:"3 hr",unread:1,
     messages:[{id:1,from:"Alex M.",mine:false,text:"New lead just came in from the website — Phoenix Plumbing. They want a Gold plan. Can you reach out today?",time:"3 hr ago"}]},
  ],
  scriptwriter: [
    {id:20,name:"Sabrina",role:"Owner",color:"#FF5C00",last:"Make sure the Frost script has energy.",time:"30 min",unread:1,
     messages:[{id:1,from:"Sabrina",mine:false,text:"Make sure the @Frost Barbershop script has a lot of energy. They want that Saturday rush vibe.",time:"30 min ago"}]},
    {id:21,name:"Jordan T.",role:"Video Editor",color:"#22C55E",last:"Can you write the voiceover for the dental vid?",time:"2 hr",unread:0,
     messages:[{id:1,from:"Jordan T.",mine:false,text:"Hey Maya, can you write the voiceover text for the @Sky Harbor Dental transformation video? I need it by Thursday.",time:"2 hr ago"},{id:2,from:"Me",mine:true,text:"On it. I'll have it to you by end of day tomorrow.",time:"1 hr ago"}]},
    {id:22,name:"Carlos V.",role:"Account Manager",color:"#3B82F6",last:"Client wants more humor in the scripts.",time:"4 hr",unread:0,
     messages:[{id:1,from:"Carlos V.",mine:false,text:"@Mesa Auto Detailing client said they want more humor in the scripts. Less corporate, more personality.",time:"4 hr ago"},{id:2,from:"Me",mine:true,text:"Got it. I'll adjust the tone for the next batch.",time:"3 hr ago"}]},
  ],
  editor: [
    {id:30,name:"Sabrina",role:"Owner",color:"#FF5C00",last:"The dental video needs to be 4K.",time:"15 min",unread:1,
     messages:[{id:1,from:"Sabrina",mine:false,text:"The @Sky Harbor Dental video needs to be exported in 4K. They're using it for their website too.",time:"15 min ago"}]},
    {id:31,name:"Maya R.",role:"Script Writer",color:"#A855F7",last:"Script is done for the CrossFit reel.",time:"1 hr",unread:1,
     messages:[{id:1,from:"Maya R.",mine:false,text:"Script is finalized for the @Cactus CrossFit workout reel. Ready for you to start editing whenever.",time:"1 hr ago"}]},
    {id:32,name:"Carlos V.",role:"Account Manager",color:"#3B82F6",last:"Client approved the listing video.",time:"3 hr",unread:0,
     messages:[{id:1,from:"Carlos V.",mine:false,text:"@Desert Sun Realty approved the listing video. You can schedule it for posting now.",time:"3 hr ago"},{id:2,from:"Me",mine:true,text:"Scheduling it for tomorrow at 10 AM. Looks clean.",time:"2 hr ago"}]},
  ],
  client: [
    {id:40,name:"Carlos V.",role:"Your Account Manager",color:"#3B82F6",last:"Your content plan for March is set!",time:"11 min",unread:2,
     messages:[{id:1,from:"Carlos V.",mine:false,text:"Hey! Your March content plan is finalized. 8 videos scheduled across Instagram and TikTok.",time:"11 min ago"},{id:2,from:"Carlos V.",mine:false,text:"The listing showcase for 4821 Cactus Rd goes into editing today. Should be ready for your review by Thursday.",time:"10 min ago"}]},
    {id:41,name:"Jordan T.",role:"Your Video Editor",color:"#22C55E",last:"Your new video is ready for review!",time:"2 hr",unread:1,
     messages:[{id:1,from:"Jordan T.",mine:false,text:"Your Sold! 3901 Desert View video is ready for review. Let me know if you want any changes!",time:"2 hr ago"}]},
    {id:42,name:"Media4You Team",role:"Support",color:"#fcc612",last:"Welcome to Media4You!",time:"1 day",unread:0,
     messages:[{id:1,from:"Media4You Team",mine:false,text:"Welcome to Media4You! This is your content dashboard. You can review scripts, approve videos, and track everything from here.",time:"1 day ago"},{id:2,from:"Me",mine:true,text:"Thanks! Excited to get started.",time:"1 day ago"}]},
  ],
};

const AD_SPEND_DATA = [
  {month:"Oct",spend:2800},{month:"Nov",spend:3200},{month:"Dec",spend:3600},
  {month:"Jan",spend:3900},{month:"Feb",spend:4000},{month:"Mar",spend:4200},
];

const AD_CAMPAIGNS = [
  {id:1,client:"Mesa Auto Detailing",name:"Spring Detail Special",platform:"Instagram",budget:800,impressions:42000,clicks:1344,ctr:"3.2%",conversions:89,status:"Running",roas:"3.8x"},
  {id:2,client:"Desert Sun Realty",name:"New Listing Ads",platform:"Both",budget:1200,impressions:68000,clicks:1904,ctr:"2.8%",conversions:124,status:"Running",roas:"4.8x"},
  {id:3,client:"Tempe Taqueria",name:"Grand Opening",platform:"Facebook",budget:600,impressions:28000,clicks:1148,ctr:"4.1%",conversions:42,status:"Scheduled",roas:"—"},
  {id:4,client:"Cactus CrossFit",name:"Membership Drive",platform:"Instagram",budget:400,impressions:18000,clicks:630,ctr:"3.5%",conversions:29,status:"Paused",roas:"2.1x"},
  {id:5,client:"Sky Harbor Dental",name:"Invisalign Leads",platform:"Google Ads",budget:1500,impressions:52000,clicks:2340,ctr:"4.5%",conversions:156,status:"Running",roas:"5.2x"},
  {id:6,client:"Desert Sun Realty",name:"Scottsdale Buyers",platform:"Google Ads",budget:2000,impressions:74000,clicks:3108,ctr:"4.2%",conversions:89,status:"Running",roas:"6.1x"},
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

const STATUS_FLOW = {"Raw Footage":"Editing","Editing":"Review","Review":"Approved","Approved":"Scheduled","Scheduled":"Published"};
const VID_STATUS_COLOR = {"Review":"amber","Editing":"blue","Raw Footage":"gray","Approved":"green","Scheduled":"purple","Published":"green"};

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
    `We spent the entire morning with the team at ${client} and captured something special. Here's the behind-the-scenes look you've been asking for. From the moment we walked in, you could feel the energy — this is a team that takes pride in every single detail.`,
    `${client} called us in for a full content day and we knew right away this was going to be different. The space, the team, the vibe — everything about this shoot was next level. We brought two cameras, a drone, and a lav mic to make sure we captured it all.`,
    `The team at ${client} has been working on something big and today we finally got the green light to film it. We arrived early, set up three angles, and let the magic happen. What you're about to see is completely unscripted.`,
  ];
  const bodies = [
    `Watch as the team brings their A-game from start to finish. Every single detail is dialed in — the craftsmanship, the energy, the results. This is what sets ${client} apart from everyone else in the Valley. You can tell these are professionals who genuinely love what they do.\n\nWe captured the full process: the preparation, the execution, the client reactions. Pay attention to the details — the precision, the care, the finishing touches that most people would never notice. That's the difference between good and great.\n\nThe Arizona sun was hitting just right through the windows. The natural lighting made every shot look cinematic without even trying. Sometimes the best content comes from just showing up and letting real professionals do their thing.`,
    `From the setup to the final reveal, everything about this was next level. The attention to detail? Unmatched. The customer reactions? Priceless. ${client} doesn't just deliver — they over-deliver, every single time.\n\nWe filmed for three hours straight and had enough content for a week's worth of posts. But this reel? This is the highlight reel. The best moments, the biggest reactions, the shots that made us stop and rewatch on the camera.\n\nWhat makes ${client} different is that they treat every single person who walks through that door like they're the only customer. You can see it in the way the team communicates, the way they prepare, and the way clients leave with a smile every time.`,
    `We filmed the entire process so you could see exactly what makes ${client} different. No shortcuts, no compromises — just real professionals doing what they do best right here in Arizona.\n\nThe team walked us through every step: what they're thinking, why they make specific choices, how they've refined their craft over the years. It's one thing to see the finished product — it's another to understand the thought and expertise behind it.\n\nEvery shot in this video is real. No staging, no fake reactions, no scripts for the team. We just pointed the cameras at people who are genuinely excellent at what they do and let the work speak for itself. That's the Media4You way.`,
  ];
  const ctas = [
    `If this blew your mind, imagine what ${client} could do for you. Follow for more Arizona business content — we post new videos every week showcasing the best local businesses in the Valley.\n\nTap the link in bio to book with ${client} directly. Spots fill up fast, especially on weekends. Don't sleep on this one.`,
    `Tag someone who needs to see this. Seriously — if you know anyone looking for a great ${industry} experience in Arizona, send them this video.\n\nFollow ${client} for more content like this. We've got behind-the-scenes, client reactions, and tutorials coming every week. Hit the link in bio to connect.`,
    `That's a wrap on this one. If you made it this far, drop a comment and let us know what you thought. We read every single one.\n\nFollow ${client} and tap the link in bio to learn more. New content drops every Tuesday and Thursday. Turn on post notifications so you never miss one.`,
  ];
  const hook = hookHint && !hookHint.toLowerCase().includes("create a strong") ? hookHint : pick(hooks);
  return `HOOK (0–3 sec)\n${hook}\n\nSETUP (3–10 sec)\n${pick(setups)}\n\nBODY (10–45 sec)\n${pick(bodies)}\n\nCTA (45–60 sec)\n${pick(ctas)}\n\n---\nSHOOT NOTES:\n- Film in 4K vertical (9:16) for Reels/TikTok\n- Capture 3-5 B-roll clips during setup\n- Get at least 2 genuine client/customer reactions\n- Natural lighting preferred, bring LED panel as backup\n- Lav mic on main speaker, shotgun mic for ambient\n- Grab a clean thumbnail frame during the hero moment\n- Music: upbeat, trending audio if possible\n- Text overlays: hook text on screen for first 3 sec\n- Color grade: warm tones, slight contrast boost`;
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function Badge({ type, children, onClick }) { return <span className={`badge badge-${type}`} style={onClick?{cursor:'pointer'}:{}} onClick={onClick}>{children}</span>; }

// ─── INLINE EDIT ─────────────────────────────────────────────────────────────
function InlineEdit({ value, onSave, style }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value);
  useEffect(()=>setVal(value),[value]);
  if (editing) {
    return <input className="inline-edit" value={val} onChange={e=>setVal(e.target.value)}
      onBlur={()=>{onSave(val);setEditing(false);}}
      onKeyDown={e=>{if(e.key==="Enter"){onSave(val);setEditing(false);}if(e.key==="Escape"){setVal(value);setEditing(false);}}}
      autoFocus style={style}/>;
  }
  return <span style={{cursor:'pointer',borderBottom:'1px dashed transparent',...style}} onClick={()=>setEditing(true)}
    onMouseEnter={e=>e.currentTarget.style.borderBottomColor='var(--accent)'}
    onMouseLeave={e=>e.currentTarget.style.borderBottomColor='transparent'}
    title="Click to edit">{value||"—"}</span>;
}

// ─── STATUS DROPDOWN ─────────────────────────────────────────────────────────
function StatusBadge({ status, options, onChange, colorMap }) {
  const [open, setOpen] = useState(false);
  const colors = colorMap || {Planned:"gray",Scripting:"gray",Editing:"blue",Review:"amber",Approved:"green",Scheduled:"purple",Published:"green","In Progress":"blue","Needs Revision":"red",Assigned:"gray",Submitted:"blue",Completed:"green",Running:"green",Paused:"amber",Confirmed:"green",Pending:"amber"};
  if (!onChange || !options) return <Badge type={colors[status]||"gray"}>{status}</Badge>;
  return (
    <div style={{position:'relative',display:'inline-block'}}>
      <Badge type={colors[status]||"gray"} onClick={()=>setOpen(!open)}>{status}</Badge>
      {open && (
        <div className="status-dropdown">
          {options.map(opt=>(
            <div key={opt} className="status-option" style={{display:'flex',alignItems:'center',gap:6}}
              onClick={()=>{onChange(opt);setOpen(false);}}>
              <div style={{width:6,height:6,borderRadius:'50%',background:`var(--${colors[opt]||"text3"})`}}/>
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── COMMENTS SYSTEM ─────────────────────────────────────────────────────────
function CommentThread({ itemId, showToast }) {
  const [comments, setComments] = useState([]);
  const [input, setInput] = useState("");
  const [showTagPicker, setShowTagPicker] = useState(false);
  const [tagFilter, setTagFilter] = useState("");

  const tagPeople = ["Sabrina","Jaden","Maya R.","Jordan T.","Carlos V.","Alex M.","Desert Sun Realty","Frost Barbershop","Sky Harbor Dental","Mesa Auto Detailing","Cactus CrossFit"];
  const filteredTags = tagFilter ? tagPeople.filter(t=>t.toLowerCase().includes(tagFilter.toLowerCase())) : tagPeople;

  const handleInput = (e) => {
    const v = e.target.value;
    setInput(v);
    const lastAt = v.lastIndexOf("@");
    if (lastAt >= 0 && lastAt === v.length - 1) { setShowTagPicker(true); setTagFilter(""); }
    else if (lastAt >= 0 && !v.substring(lastAt).includes(" ")) { setShowTagPicker(true); setTagFilter(v.substring(lastAt + 1)); }
    else { setShowTagPicker(false); }
  };

  const insertTag = (name) => {
    const before = input.substring(0, input.lastIndexOf("@"));
    setInput(before + `@${name} `);
    setShowTagPicker(false);
    setTagFilter("");
  };

  const addComment = () => {
    if (!input.trim()) return;
    setComments(p=>[...p,{id:Date.now(),author:"You",text:input,time:"Just now"}]);
    setInput("");
    setShowTagPicker(false);
    showToast("✓","Comment added","");
  };

  const renderText = (text) => text.split(/(@\S+(?:\s\S+)?\.?\s?)/g).map((part,i) =>
    part.startsWith("@") ? <span key={i} style={{background:'var(--accent-dim)',color:'var(--accent)',padding:'1px 4px',borderRadius:3,fontWeight:600,fontSize:11}}>{part.trim()}</span> : part
  );

  return (
    <div style={{marginTop:12}}>
      <div style={{font:'600 10px var(--fd)',textTransform:'uppercase',letterSpacing:0.8,color:'var(--text3)',marginBottom:8}}>Comments ({comments.length})</div>
      {comments.map(c=>(
        <div key={c.id} style={{display:'flex',gap:8,marginBottom:10}}>
          <div style={{width:24,height:24,borderRadius:6,background:'var(--accent-dim)',display:'flex',alignItems:'center',justifyContent:'center',font:'600 10px var(--fd)',color:'var(--accent)',flexShrink:0}}>Y</div>
          <div style={{flex:1}}>
            <div style={{font:'500 12px var(--fb)',color:'var(--text)',lineHeight:1.5}}>{renderText(c.text)}</div>
            <div style={{font:'400 10px var(--fb)',color:'var(--text3)',marginTop:2}}>{c.author} · {c.time}</div>
          </div>
        </div>
      ))}
      <div style={{position:'relative'}}>
        {showTagPicker && (
          <div style={{position:'absolute',bottom:'100%',left:0,right:0,maxHeight:180,overflowY:'auto',background:'rgba(255,255,255,0.97)',border:'1px solid var(--border2)',borderRadius:10,boxShadow:'0 -6px 20px rgba(0,0,0,0.1)',backdropFilter:'blur(20px)',marginBottom:4,padding:4}}>
            <div style={{padding:'4px 10px',font:'600 9px var(--fd)',textTransform:'uppercase',letterSpacing:0.8,color:'var(--text3)'}}>Tag someone</div>
            {filteredTags.slice(0,8).map(name=>(
              <div key={name} style={{padding:'7px 12px',borderRadius:6,cursor:'pointer',font:'400 12px var(--fb)',color:'var(--text)',display:'flex',alignItems:'center',gap:8}}
                onMouseEnter={e=>e.currentTarget.style.background='var(--accent-dim)'} onMouseLeave={e=>e.currentTarget.style.background='none'}
                onClick={()=>insertTag(name)}>
                <div style={{width:20,height:20,borderRadius:5,background:'var(--accent-dim)',display:'flex',alignItems:'center',justifyContent:'center',font:'600 9px var(--fd)',color:'var(--accent)'}}>{name[0]}</div>
                {name}
              </div>
            ))}
          </div>
        )}
        <div style={{display:'flex',gap:6}}>
          <input className="form-input" style={{flex:1,padding:'8px 12px',fontSize:12,borderRadius:20}} placeholder="Comment... (type @ to tag)" value={input} onChange={handleInput} onKeyDown={e=>{if(e.key==="Enter"&&!showTagPicker)addComment();if(e.key==="Escape")setShowTagPicker(false);}}/>
          <button className="action-btn accent" onClick={addComment}>Post</button>
        </div>
      </div>
    </div>
  );
}

// ─── CONFETTI ────────────────────────────────────────────────────────────────
function fireConfetti() {
  const colors = ['#fcc612','#fd8040','#22C55E','#3B82F6','#A855F7','#EF4444'];
  for (let i = 0; i < 50; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.left = Math.random()*100+'vw';
    el.style.background = colors[Math.floor(Math.random()*colors.length)];
    el.style.borderRadius = Math.random()>0.5?'50%':'2px';
    el.style.width = (6+Math.random()*8)+'px';
    el.style.height = (6+Math.random()*8)+'px';
    el.style.animationDelay = Math.random()*0.8+'s';
    el.style.animationDuration = (2+Math.random()*1.5)+'s';
    document.body.appendChild(el);
    setTimeout(()=>el.remove(),4000);
  }
}

// ─── GLOBAL SEARCH ───────────────────────────────────────────────────────────
function GlobalSearch({ clients, scripts, videos, leads, onClose, onNavigate, showToast }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  useEffect(()=>{inputRef.current?.focus();},[]);

  const q = query.toLowerCase();
  const results = [];
  if (q) {
    clients.forEach(c => { if(c.name.toLowerCase().includes(q)||c.industry.toLowerCase().includes(q)) results.push({type:"client",icon:"👥",title:c.name,sub:c.industry+" · "+c.plan,action:()=>{onNavigate("clients");onClose();}}); });
    scripts.forEach(s => { if(s.client.toLowerCase().includes(q)||s.type.toLowerCase().includes(q)) results.push({type:"script",icon:"✍️",title:s.type,sub:s.client+" · "+s.status,action:()=>{onNavigate("pipeline");onClose();}}); });
    videos.forEach(v => { if(v.client.toLowerCase().includes(q)||v.title.toLowerCase().includes(q)) results.push({type:"video",icon:"🎬",title:v.title,sub:v.client+" · "+v.status,action:()=>{onNavigate("pipeline");onClose();}}); });
    Object.entries(leads).forEach(([stage,items])=>items.forEach(l=>{ if(l.name.toLowerCase().includes(q)) results.push({type:"lead",icon:"🎯",title:l.name,sub:stage+" · "+l.source,action:()=>{onClose();showToast("🎯","Lead",l.name+" — "+stage);}}); }));
    if(results.length===0) results.push({type:"none",icon:"🔍",title:"No results",sub:"Try a different search",action:()=>{}});
  }

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-modal" onClick={e=>e.stopPropagation()}>
        <div className="search-input-wrap">
          <span style={{fontSize:16,color:'var(--text3)'}}>🔍</span>
          <input ref={inputRef} placeholder="Search clients, scripts, videos, leads..." value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>{if(e.key==="Escape")onClose();}}/>
          <span style={{font:'400 10px var(--fd)',color:'var(--text3)',background:'var(--surface2)',padding:'2px 8px',borderRadius:4}}>ESC</span>
        </div>
        {q && (
          <div className="search-results">
            {results.slice(0,8).map((r,i)=>(
              <div key={i} className="search-result" onClick={r.action}>
                <div className="search-result-icon">{r.icon}</div>
                <div>
                  <div style={{font:'500 13px var(--fb)',color:'var(--text)'}}>{r.title}</div>
                  <div style={{font:'400 11px var(--fb)',color:'var(--text3)'}}>{r.sub}</div>
                </div>
              </div>
            ))}
          </div>
        )}
        {!q && (
          <div className="search-results" style={{padding:20,textAlign:'center'}}>
            <div style={{font:'400 13px var(--fb)',color:'var(--text3)'}}>Start typing to search across everything</div>
          </div>
        )}
        <div className="search-hint">
          <span>↑↓ Navigate</span>
          <span>⏎ Open</span>
          <span>ESC Close</span>
        </div>
      </div>
    </div>
  );
}
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

// ─── PAGE TOUR ("Teach me this page") ────────────────────────────────────────
function PageTour({ steps = [] }) {
  const [active, setActive] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [rect, setRect] = useState(null);

  const current = steps[stepIdx];

  const measureTarget = useCallback(() => {
    if (!current?.target) { setRect(null); return; }
    const el = document.querySelector(current.target);
    if (!el) { setRect(null); return; }
    const r = el.getBoundingClientRect();
    setRect({ top: r.top + window.scrollY, left: r.left, width: r.width, height: r.height });
    if (r.top < 80 || r.top > window.innerHeight - 250) {
      window.scrollTo({ top: Math.max(0, r.top + window.scrollY - 100), behavior: 'smooth' });
      setTimeout(() => { const r2 = el.getBoundingClientRect(); setRect({ top: r2.top + window.scrollY, left: r2.left, width: r2.width, height: r2.height }); }, 400);
    }
  }, [current]);

  useEffect(() => {
    if (active && current) { measureTarget(); window.addEventListener('resize', measureTarget); return () => window.removeEventListener('resize', measureTarget); }
  }, [active, stepIdx, measureTarget]);

  const start = () => { setStepIdx(0); setActive(true); };
  const next = () => { if (stepIdx < steps.length - 1) setStepIdx(stepIdx + 1); else setActive(false); };
  const prev = () => { if (stepIdx > 0) setStepIdx(stepIdx - 1); };

  if (!steps.length) return null;

  if (!active) {
    return (
      <button onClick={start} style={{
        display:'inline-flex',alignItems:'center',gap:6,padding:'6px 14px',borderRadius:100,
        background:'var(--accent-dim)',border:'1px solid rgba(252,198,18,0.2)',
        color:'var(--accent)',font:'500 12px var(--fd)',cursor:'pointer',transition:'all 0.2s',
        marginBottom:16,
      }}
        onMouseEnter={e=>e.currentTarget.style.background='rgba(252,198,18,0.15)'}
        onMouseLeave={e=>e.currentTarget.style.background='var(--accent-dim)'}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        Teach me this page
      </button>
    );
  }

  const bubbleW = 360;
  let bubbleStyle = { position:'fixed',zIndex:10002,width:bubbleW,maxWidth:'calc(100vw - 32px)' };
  if (rect) {
    const vTop = rect.top - window.scrollY;
    const below = vTop + rect.height + 16;
    if (below + 240 < window.innerHeight) bubbleStyle.top = below;
    else if (vTop > 260) { bubbleStyle.top = Math.max(16, vTop - 16); bubbleStyle.transform = 'translateY(-100%)'; }
    else { bubbleStyle.top = '50%'; bubbleStyle.transform = 'translateY(-50%)'; }
    bubbleStyle.left = Math.max(16, Math.min(rect.left, window.innerWidth - 16 - bubbleW));
  } else {
    bubbleStyle.top = '50%'; bubbleStyle.left = '50%'; bubbleStyle.transform = 'translate(-50%,-50%)';
  }

  return (<>
    <div style={{position:'fixed',inset:0,zIndex:10000,pointerEvents:'none'}}>
      <svg width="100%" height="100%" style={{position:'absolute',inset:0}}>
        <defs><mask id="tour-mask"><rect width="100%" height="100%" fill="white"/>
          {rect && <rect x={rect.left-6} y={rect.top-window.scrollY-6} width={rect.width+12} height={rect.height+12} rx="8" fill="black"/>}
        </mask></defs>
        <rect width="100%" height="100%" fill="rgba(0,0,0,0.55)" mask="url(#tour-mask)"/>
      </svg>
    </div>
    {rect && <div style={{position:'fixed',top:rect.top-window.scrollY-6,left:rect.left-6,width:rect.width+12,height:rect.height+12,border:'2px solid var(--accent)',borderRadius:8,zIndex:10001,pointerEvents:'none',boxShadow:'0 0 0 4px rgba(252,198,18,0.2)',transition:'all 0.3s'}}/>}
    <div onClick={()=>setActive(false)} style={{position:'fixed',inset:0,zIndex:10001,cursor:'default'}}/>
    <div style={{...bubbleStyle,background:'rgba(255,255,255,0.97)',backdropFilter:'blur(20px)',borderRadius:14,boxShadow:'0 12px 40px rgba(0,0,0,0.18)',padding:'24px',pointerEvents:'auto',border:'1px solid var(--border2)'}} onClick={e=>e.stopPropagation()}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
        <span style={{font:'600 10px var(--fd)',letterSpacing:1,textTransform:'uppercase',color:'var(--accent)'}}>Step {stepIdx+1} of {steps.length}</span>
        <button onClick={()=>setActive(false)} style={{background:'none',border:'none',color:'var(--text3)',cursor:'pointer',fontSize:16}}>✕</button>
      </div>
      <div style={{display:'flex',gap:4,marginBottom:16}}>{steps.map((_,i)=><div key={i} style={{width:i===stepIdx?20:6,height:6,borderRadius:3,background:i<=stepIdx?'var(--accent)':'var(--border2)',transition:'all 0.3s'}}/>)}</div>
      <h3 style={{font:'600 17px var(--fd)',color:'var(--text)',margin:'0 0 8px'}}>{current?.title||''}</h3>
      <p style={{font:'400 14px/1.6 var(--fb)',color:'var(--text2)',margin:'0 0 20px'}}>{current?.text||''}</p>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <button onClick={prev} disabled={stepIdx===0} style={{font:'500 13px var(--fd)',color:stepIdx===0?'var(--text3)':'var(--text2)',background:'none',border:'none',cursor:stepIdx===0?'default':'pointer',padding:'8px 0'}}>Back</button>
        <button onClick={next} style={{font:'600 13px var(--fd)',color:'white',background:'var(--accent)',border:'none',borderRadius:6,padding:'10px 24px',cursor:'pointer'}}>{stepIdx===steps.length-1?'Got it!':'Next'}</button>
      </div>
    </div>
  </>);
}

// Tour steps for each page
const TOUR_STEPS = {
  dashboard: [
    {target:'.dash-hero',title:'Welcome Hero',text:'Your daily greeting with the total MRR at a glance. Updates in real-time as clients are added or plans change.'},
    {target:'.dash-card-hover',title:'KPI Cards',text:'Key metrics for your agency — active clients, revenue, videos produced, posts scheduled. Click any card to dive deeper.'},
    {target:'.dash-main-grid',title:'Clients & Performance',text:'Left shows your clients with MRR. Right shows the revenue trend and content performance by client. Everything is clickable.'},
  ],
  pipeline: [
    {target:'.kanban-scroll',title:'Drag-and-Drop Kanban',text:'Drag cards between columns to change their status. 6 stages: Scripting → Editing → Review → Approved → Scheduled → Published.'},
    {target:'.action-btn',title:'Filter by Client',text:'Click any client name to filter the board. Shows only that client\'s content items.'},
  ],
  library: [
    {target:'.action-btn',title:'Filter Assets',text:'Filter by Videos, Raw Footage, or Photos. Click any asset to see full specs and download options.'},
  ],
  scheduler: [
    {target:'.top-action-btn',title:'Schedule Posts',text:'See all upcoming posts across Instagram, TikTok, and Facebook. Peak time posts are highlighted. Click to publish or reschedule.'},
  ],
  shoots: [
    {target:'.top-action-btn',title:'Schedule a Shoot',text:'Book filming sessions with date, time, location, crew, and notes. Message crew directly from the shoot detail.'},
  ],
  coaching: [
    {title:'Coaching & Strategy',text:'Track all coaching sessions — camera coaching, strategy calls, sales coaching, and weekly team 1:1s. Upcoming and completed sessions at a glance.'},
  ],
  team: [
    {title:'Team Workload',text:'See each team member\'s active tasks, overdue count, and capacity. Color-coded load indicators show who\'s available and who\'s overloaded.'},
  ],
  clients: [
    {target:'.form-input',title:'Search & Filter',text:'Search clients by name. Filter by status (Active, Onboarding, Review). Click any client for their full 6-tab detail page.'},
  ],
  revenue: [
    {title:'Revenue Dashboard',text:'Full agency financials — MRR by client, profit/loss, plan distribution, expenses overview. Click any client row to see their plan breakdown.'},
  ],
  expenses: [
    {target:'.btn.primary',title:'Add Expenses',text:'Add new expenses with category, amount, and notes. Click any dollar amount to edit inline. QuickBooks syncs automatically.'},
  ],
  reports: [
    {title:'Client Reports',text:'Select any active client to generate a monthly performance report. Shows videos delivered, follower growth, engagement, ad ROI. Download as PDF or email to client.'},
  ],
  ads: [
    {title:'Ad Campaigns',text:'Track all Facebook, Instagram, and Google Ads campaigns. See spend, impressions, clicks, CTR, conversions, and ROAS. Click any campaign for audience breakdowns.'},
  ],
  settings: [
    {title:'Settings',text:'Connect accounts (IG, FB, TikTok, Google Ads), manage integrations (QuickBooks, Zoom, Stripe), customize branding, and toggle dark mode.'},
  ],
  salesPipeline: [
    {target:'.kanban-scroll',title:'Sales Pipeline',text:'Track leads from New → Contacted → Demo → Proposal → Won. Click any lead to see details, call, email, or text them directly.'},
  ],
  comms: [
    {title:'Communication Hub',text:'Three tabs: Calls (upcoming + history), Texts (threaded conversations), Emails (compose with AI writer + sent log with open tracking). All communication in one place.'},
  ],
  finder: [
    {target:'.top-action-btn',title:'Scan for Leads',text:'Discover Arizona businesses with weak social media. Score-based prospects — click to see why they need your services. One-click add to pipeline.'},
  ],
  proposals: [
    {target:'.top-action-btn',title:'Create Proposals',text:'Generate proposals with plan selection (Copper/Gold/Platinum). Track sent, draft, and accepted status with open tracking.'},
  ],
  scriptQueue: [
    {title:'Script Queue',text:'All scripts assigned to you with priority indicators and due dates. Use AI tools to generate content ideas per client, or open the content calendar.'},
  ],
  templates: [
    {title:'Script Templates',text:'Reusable scripts by industry — Barbershop BTS, Real Estate Listing, Before/After, Testimonial. Copy and customize for any client.'},
  ],
  editor: [
    {title:'Video Editor',text:'Production queue with file specs (4K, codec, FPS). Edit checklist, session timer, and notes per video. Start editing to begin tracking your time.'},
  ],
  clientContent: [
    {title:'Your Content',text:'Review scripts, approve or request changes, and browse your finished video gallery. Items awaiting your approval are highlighted at the top.'},
  ],
  clientSocial: [
    {title:'Social Media',text:'Browse your published content across Instagram and TikTok. Video gallery cards with view counts and engagement. Filter by platform.'},
  ],
  clientInvoices: [
    {title:'Invoices',text:'See your plan details, pay invoices, download receipts, or email invoices to your records. Full payment history with line items.'},
  ],
};

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
${targetClients.map(c=>`- ${c.name} (${c.industry}, ${c.plan} plan: ${c.plan==="Copper"?4:c.plan==="Gold"?8:20} posts/mo)`).join("\n")}

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
      showToast("●","Caption generated","Review and edit below");
    } catch(e) {
      updatePost(post.id, {caption:`Ready to transform your feed? ${post.client} is bringing the heat this spring 🔥 Check out what's new and book your spot before it's gone!\n\n#Arizona #Phoenix #${post.client.replace(/\s/g,'')} #SmallBusiness #ContentCreation #Reels #SocialMediaMarketing #AZBusiness #Media4You`});
      showToast("●","Caption generated","Review and edit below");
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
      showToast("●","Script generated","Review and edit below");
    } catch(e) {
      updatePost(post.id, {script:`HOOK (0-3 sec)\nYou need to see this. ${post.client} just raised the bar.\n\nSETUP (3-10 sec)\n${post.client} called us in for a content day and we brought the full crew — two cameras, drone, and lav mics. From the moment we walked in, you could tell this was going to be special. The energy, the space, the team — everything was dialed in.\n\nBODY (10-45 sec)\nWatch as we take you through the full process from start to finish. Every detail matters — the preparation, the execution, the finishing touches that most people would never notice. This is why ${post.client} is the best in Arizona.\n\nWe captured genuine reactions, behind-the-scenes moments, and the craft that goes into every single interaction. No scripts, no staging — just real professionals doing what they love.\n\nCTA (45-60 sec)\nIf this impressed you, imagine experiencing it yourself. Follow ${post.client} for weekly content showing the best of Arizona's local business scene.\n\nTap the link in bio to book with ${post.client} directly. New content drops every week.\n\n---\nSHOOT NOTES:\n- Film 4K vertical (9:16)\n- Capture B-roll during setup\n- Get 2+ genuine reactions\n- Natural lighting, LED backup\n- Trending audio if available`});
      showToast("●","Script generated","Review and edit below");
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
                <select className="form-select" value={post.status} onChange={e=>{updatePost(post.id,{status:e.target.value});showToast("✓","Status updated",post.title+" → "+e.target.value);}}>
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
            <button className="btn primary" style={{flex:1}} onClick={()=>{updatePost(post.id,{status:"Approved"});showToast("✓","Approved",post.title+" is ready for production");}}>Approve Post</button>
            <button className="btn success" style={{flex:1}} onClick={()=>{updatePost(post.id,{status:"Scheduled"});showToast("📅","Scheduled",post.title+" added to queue");}}>Schedule →</button>
          </div>
          <CommentThread itemId={`cal-${post.id}`} showToast={showToast}/>
          <button className="btn danger full" style={{marginTop:8}} onClick={()=>{setCalendar(prev=>prev.filter(p=>p.id!==post.id));setSelectedPost(null);showToast("◉","Removed",post.title+" removed from calendar");}}>Remove from Calendar</button>
        </div>
      </div>
    );
  }

  const [showAddPost, setShowAddPost] = useState(false);
  const [newPost, setNewPost] = useState({client:clients[0]?.name||"",title:"",type:"Behind the Scenes",date:"Apr 20",time:"9:00 AM",description:""});
  const [calView, setCalView] = useState("list");

  const addManualPost = () => {
    if(!newPost.title.trim()) return;
    setCalendar(p=>[...p,{...newPost,id:Date.now(),status:"Planned",caption:"",script:"",assigned:"",platform:"Instagram Reel"}]);
    setShowAddPost(false);
    setNewPost({client:clients[0]?.name||"",title:"",type:"Behind the Scenes",date:"Apr 20",time:"9:00 AM",description:""});
    showToast("✓","Post added","Added to calendar");
  };

  // Month grid helper
  const daysInApril = 30;
  const firstDayOffset = 1; // Apr 1 2025 is Tuesday (offset 1 from Mon)
  const getPostsForDay = (day) => filtered.filter(p => {
    const d = parseInt(p.date?.split(" ")[1]);
    return d === day;
  });

  // ── CALENDAR VIEW ──
  return (
    <div className="full-panel">
      <div style={{padding:"12px 14px",borderBottom:"1px solid var(--border)",background:"var(--surface)",display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
        <button className="btn back" style={{margin:0,padding:"6px 10px",fontSize:12}} onClick={onClose}>←</button>
        <div style={{flex:1}}>
          <div style={{fontFamily:"var(--fd)",fontSize:14,fontWeight:700}}>Content Calendar</div>
          <div style={{fontSize:11,color:"var(--text3)"}}>April 2025</div>
        </div>
        <div style={{display:'flex',gap:4}}>
          <button className={`action-btn ${calView==="grid"?"accent":""}`} onClick={()=>setCalView("grid")}>Grid</button>
          <button className={`action-btn ${calView==="list"?"accent":""}`} onClick={()=>setCalView("list")}>List</button>
        </div>
      </div>
      <div className="full-panel-scroll">
        <div style={{display:'flex',gap:8,marginBottom:12}}>
          <select className="form-select" style={{flex:1}} value={selClient} onChange={e=>setSelClient(e.target.value)}>
            <option value="all">All Clients</option>
            {clients.filter(c=>c.status==="active").map(c=><option key={c.id}>{c.name}</option>)}
          </select>
          <button className="btn primary" onClick={()=>setShowAddPost(!showAddPost)}>+ Add Post</button>
        </div>

        {/* Add Post Form */}
        {showAddPost && (
          <div className="card" style={{marginBottom:12}}>
            <div className="card-title">Add New Post</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
              <div className="form-group" style={{margin:0}}><label className="form-label">Client</label><select className="form-select" value={newPost.client} onChange={e=>setNewPost(p=>({...p,client:e.target.value}))}>{clients.map(c=><option key={c.id}>{c.name}</option>)}</select></div>
              <div className="form-group" style={{margin:0}}><label className="form-label">Type</label><select className="form-select" value={newPost.type} onChange={e=>setNewPost(p=>({...p,type:e.target.value}))}>{["Behind the Scenes","Before/After","Educational","Testimonial","Day in the Life","Promotional","Listing Tour","Team Intro"].map(t=><option key={t}>{t}</option>)}</select></div>
            </div>
            <div className="form-group"><label className="form-label">Title</label><input className="form-input" placeholder="Video title" value={newPost.title} onChange={e=>setNewPost(p=>({...p,title:e.target.value}))}/></div>
            <div className="form-group"><label className="form-label">Description</label><textarea className="form-textarea" style={{minHeight:60}} placeholder="Describe the video concept..." value={newPost.description} onChange={e=>setNewPost(p=>({...p,description:e.target.value}))}/></div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
              <div className="form-group" style={{margin:0}}><label className="form-label">Date</label><select className="form-select" value={newPost.date} onChange={e=>setNewPost(p=>({...p,date:e.target.value}))}>{Array.from({length:30},(_,i)=><option key={i+1} value={`Apr ${i+1}`}>Apr {i+1}</option>)}</select></div>
              <div className="form-group" style={{margin:0}}><label className="form-label">Time</label><select className="form-select" value={newPost.time} onChange={e=>setNewPost(p=>({...p,time:e.target.value}))}>{["8:00 AM","9:00 AM","10:00 AM","11:00 AM","12:00 PM","1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM"].map(t=><option key={t}>{t}</option>)}</select></div>
            </div>
            <div style={{display:'flex',gap:8,marginTop:12}}>
              <button className="btn primary" style={{flex:1}} onClick={addManualPost}>Add to Calendar</button>
              <button className="btn" onClick={()=>setShowAddPost(false)}>Cancel</button>
            </div>
          </div>
        )}

        {!generated && !loading && (
          <div style={{textAlign:'center',padding:20}}>
            <button className="btn primary" onClick={generate} style={{marginBottom:8}}>Generate Calendar with AI</button>
            <div style={{font:'400 11px var(--fb)',color:'var(--text3)'}}>Or add posts manually above</div>
          </div>
        )}
        {loading && <AILoading text="Building content calendar..."/>}
        {generated && !loading && (<>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
            <div style={{fontSize:11,color:"var(--text3)",textTransform:"uppercase",letterSpacing:"1px",fontWeight:700}}>{filtered.length} posts</div>
            <button className="action-btn accent" onClick={generate}>↺ Regenerate</button>
          </div>

          {/* Month Grid View */}
          {calView==="grid" && (
            <div className="card" style={{marginBottom:12}}>
              <div className="cal-week">
                {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d=><div key={d} className="cal-day-label">{d}</div>)}
              </div>
              {Array.from({length:5}).map((_,week)=>(
                <div key={week} className="cal-week">
                  {Array.from({length:7}).map((_,dow)=>{
                    const dayNum = week*7+dow-firstDayOffset+1;
                    if(dayNum<1||dayNum>daysInApril) return <div key={dow} style={{aspectRatio:'1'}}/>;
                    const dayPosts = getPostsForDay(dayNum);
                    return (
                      <div key={dow} className={`cal-day ${dayPosts.length>0?"has-post":""}`}
                        style={{cursor:dayPosts.length?'pointer':'default',position:'relative'}}
                        onClick={()=>{if(dayPosts.length===1)setSelectedPost(dayPosts[0]);else if(dayPosts.length>1)showToast("◎",`${dayPosts.length} posts on Apr ${dayNum}`,dayPosts.map(p=>p.title).join(", "));}}>
                        {dayNum}
                        {dayPosts.length>0 && <div className="cal-post-dot"/>}
                        {dayPosts.length>1 && <div style={{position:'absolute',top:2,right:2,font:'700 8px var(--fd)',color:'var(--accent)'}}>{dayPosts.length}</div>}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}

          {/* List View */}
          {filtered.map((p)=>(
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
                  {p.assigned&&<span style={{fontSize:10,color:"var(--text3)"}}>{p.assigned}</span>}
                </div>
              </div>
              <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4,flexShrink:0}}>
                {p.script&&<span style={{fontSize:10,color:"var(--green)"}}>✓ Script</span>}
                {p.caption&&<span style={{fontSize:10,color:"var(--green)"}}>✓ Caption</span>}
                <span style={{color:"var(--text3)",fontSize:14}}>›</span>
              </div>
            </div>
          ))}
        </>)}
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
              <button className="btn primary" onClick={() => { onSaveToQueue(client.name, idea.title, script); showToast("✓","Added to queue","Script saved to Script Writer queue"); onBack(); }}>Save to Queue →</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
function NotificationsPanel({ notifs, onClear, onRead, onNavigate }) {
  return (
    <div className="full-panel-scroll">
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
        <div style={{fontFamily:"var(--fd)",fontSize:16,fontWeight:800}}>Notifications</div>
        <span style={{fontSize:12,color:"var(--accent)",cursor:"pointer"}} onClick={onClear}>Clear all</span>
      </div>
      {notifs.length===0 && <div className="empty"><div className="empty-icon">◇</div><div className="empty-title">All caught up</div></div>}
      {notifs.map(n => (
        <div key={n.id} className={`notif-item ${n.unread?"unread":""}`} onClick={()=>{onRead(n.id);if(n.action&&onNavigate)onNavigate(n.action.view);}}>
          <div className="notif-icon">{n.icon}</div>
          <div style={{flex:1}}>
            <div className="notif-text">{n.text}</div>
            <div className="notif-time">{n.time}</div>
          </div>
          {n.unread && <div className="notif-unread-dot"/>}
          {n.action && <span style={{color:'var(--text3)',fontSize:14}}>›</span>}
        </div>
      ))}
    </div>
  );
}

// ─── MESSAGING ────────────────────────────────────────────────────────────────
// Item lookup for rich previews
const TAG_PREVIEWS = {
  "Listing Showcase":{type:"Script",status:"Editing",assigned:"Jordan T.",preview:"HOOK: This Scottsdale listing just hit the market and it is STUNNING..."},
  "Day in the Life":{type:"Script",status:"Scripting",assigned:"Maya R.",preview:"HOOK: Ever wonder what a day looks like behind the scenes..."},
  "Testimonial Reel":{type:"Video",status:"Review",assigned:"Jordan T.",preview:"Final cut ready. Awaiting client review for brand tone and CTA."},
  "Neighborhood Spotlight":{type:"Script",status:"Scripting",assigned:"Maya R.",preview:"Area guide reel — drive-through tour of a neighborhood."},
  "Desert Sun Realty":{type:"Client",status:"Active",assigned:"Carlos V.",preview:"Platinum Plan · $5,000/mo · 8 videos produced · Real Estate"},
  "Frost Barbershop":{type:"Client",status:"Active",assigned:"Carlos V.",preview:"Gold Plan · $3,000/mo · 4 videos produced · Barbershop"},
  "Mar 20 Shoot — Desert Sun":{type:"Shoot",status:"Confirmed",assigned:"Jordan T.",preview:"9:00 AM · 3hr · 4821 Cactus Rd, Scottsdale — Listing showcase + drone"},
  "Spring Detail Special":{type:"Campaign",status:"Running",assigned:"—",preview:"Instagram · $800/mo · 3.2% CTR · 89 conversions · 3.8x ROAS"},
};

function RichTagPreview({ tag }) {
  const data = TAG_PREVIEWS[tag];
  if (!data) return null;
  const typeColors = {Script:"blue",Video:"purple",Client:"green",Shoot:"amber",Campaign:"orange"};
  return (
    <div style={{background:'rgba(255,255,255,0.9)',border:'1px solid var(--border)',borderRadius:10,padding:'10px 12px',margin:'8px 0 4px',backdropFilter:'blur(8px)',boxShadow:'var(--shadow-sm)',maxWidth:280}}>
      <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:4}}>
        <Badge type={typeColors[data.type]||"gray"}>{data.type}</Badge>
        <Badge type={data.status==="Active"||data.status==="Running"||data.status==="Confirmed"?"green":"amber"}>{data.status}</Badge>
      </div>
      <div style={{font:'500 12px var(--fd)',color:'var(--text)',marginBottom:2}}>{tag}</div>
      <div style={{font:'400 11px var(--fb)',color:'var(--text2)',lineHeight:1.5}}>{data.preview}</div>
      {data.assigned && data.assigned!=="—" && <div style={{font:'400 10px var(--fb)',color:'var(--text3)',marginTop:4}}>Assigned: {data.assigned}</div>}
    </div>
  );
}

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
              <div>
                <div className="chat-bubble">
                  {m.text.split(/(@[^@]+?\s)/g).map((part,i)=>part.startsWith("@")?<span key={i} style={{background:m.mine?'rgba(255,255,255,0.25)':'var(--accent-dim)',color:m.mine?'white':'var(--accent)',padding:'1px 6px',borderRadius:4,fontWeight:600,fontSize:12,cursor:'pointer'}}>{part.trim()}</span>:part)}
                </div>
                {/* Rich previews for tagged items */}
                {m.text.match(/@([^@]+?)\s/g)?.map((tag,i)=>{
                  const name=tag.trim().substring(1);
                  return TAG_PREVIEWS[name]?<RichTagPreview key={i} tag={name}/>:null;
                })}
                <div className="chat-time">{m.time}</div>
              </div>
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
  const [showTags, setShowTags] = useState(false);
  const [tagFilter, setTagFilter] = useState("");

  const tagItems = [
    {type:"client",items:["Frost Barbershop","Desert Sun Realty","Cactus CrossFit","Mesa Auto Detailing","Sky Harbor Dental","Tempe Taqueria"]},
    {type:"project",items:["Day in the Life","Listing Showcase","Testimonial Reel","Spring Detail Special","Member Transformation"]},
    {type:"shoot",items:["Mar 19 Shoot — Frost","Mar 20 Shoot — Desert Sun","Mar 22 Shoot — Desert Sun","Mar 24 Shoot — Sky Harbor"]},
    {type:"campaign",items:["Spring Detail Special (Ads)","New Listing Ads","Grand Opening","Membership Drive","Invisalign Leads"]},
  ];

  const allTags = tagItems.flatMap(g=>g.items.map(i=>({label:i,type:g.type})));
  const filteredTags = tagFilter ? allTags.filter(t=>t.label.toLowerCase().includes(tagFilter.toLowerCase())) : allTags;

  const insertTag = (tag) => {
    const before = val.substring(0, val.lastIndexOf("@"));
    setVal(before + `@${tag.label} `);
    setShowTags(false);
    setTagFilter("");
  };

  const handleChange = (e) => {
    const v = e.target.value;
    setVal(v);
    const lastAt = v.lastIndexOf("@");
    if (lastAt >= 0 && lastAt === v.length - 1) {
      setShowTags(true);
      setTagFilter("");
    } else if (lastAt >= 0 && !v.substring(lastAt).includes(" ")) {
      setShowTags(true);
      setTagFilter(v.substring(lastAt + 1));
    } else {
      setShowTags(false);
    }
  };

  const send = () => { if(val.trim()){onSend(val.trim());setVal("");setShowTags(false);} };

  return (
    <div style={{position:'relative'}}>
      {showTags && (
        <div style={{position:'absolute',bottom:'100%',left:14,right:14,maxHeight:220,overflowY:'auto',background:'rgba(255,255,255,0.97)',border:'1px solid var(--border2)',borderRadius:12,boxShadow:'0 -8px 30px rgba(0,0,0,0.12)',backdropFilter:'blur(20px)',marginBottom:4,padding:6}}>
          <div style={{padding:'6px 10px',font:'600 9px var(--fd)',textTransform:'uppercase',letterSpacing:1,color:'var(--text3)'}}>Tag a client, project, shoot, or campaign</div>
          {filteredTags.slice(0,10).map((t,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 12px',borderRadius:8,cursor:'pointer',transition:'background 0.1s'}}
              onMouseEnter={e=>e.currentTarget.style.background='var(--accent-dim)'} onMouseLeave={e=>e.currentTarget.style.background='none'}
              onClick={()=>insertTag(t)}>
              <Badge type={t.type==="client"?"blue":t.type==="project"?"purple":t.type==="shoot"?"green":"amber"}>{t.type}</Badge>
              <span style={{font:'400 13px var(--fb)',color:'var(--text)'}}>{t.label}</span>
            </div>
          ))}
          {filteredTags.length===0 && <div style={{padding:'12px',font:'400 12px var(--fb)',color:'var(--text3)',textAlign:'center'}}>No matches</div>}
        </div>
      )}
      <div className="chat-input-bar">
        <textarea className="chat-input" placeholder="Message... (type @ to tag)" value={val} rows={1} onChange={handleChange} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}if(e.key==="Escape")setShowTags(false);}}/>
        <button className="chat-send-btn" onClick={send}>↑</button>
      </div>
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
      <PageTour steps={TOUR_STEPS.dashboard}/>
      {/* ═══ WELCOME HERO ═══ */}
      <div className="dash-hero" style={{
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
                  <Badge type={c.plan==="Platinum"?"purple":c.plan==="Gold"?"blue":"gray"}>{c.plan}</Badge>
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

          {/* Content Performance */}
          <div style={{...glass,padding:'20px 22px',animation:'dashFadeInUp 0.5s cubic-bezier(0.16,1,0.3,1) 560ms backwards'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
              <div style={{font:'600 15px var(--fd)',color:'var(--text)'}}>Content Performance</div>
              <div style={{padding:'3px 10px',borderRadius:100,background:'rgba(45,154,106,0.1)',font:'500 10px var(--fd)',color:'var(--green)'}}>This month</div>
            </div>
            {clients.filter(c=>c.metrics&&c.metrics.followers>0).slice(0,3).map(c=>(
              <div key={c.id} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 0',borderBottom:'1px solid var(--border)'}}>
                <div style={{width:28,height:28,borderRadius:8,background:`${c.color}15`,display:'flex',alignItems:'center',justifyContent:'center',color:c.color,font:'600 11px var(--fd)'}}>{c.name[0]}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{font:'500 12px var(--fb)',color:'var(--text)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{c.name}</div>
                </div>
                <div style={{font:'500 11px var(--fd)',color:'var(--green)'}}>+{c.metrics.gained}</div>
                <div style={{font:'400 10px var(--fb)',color:'var(--text3)'}}>{c.metrics.engRate}%</div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div style={{...glass,padding:'20px 22px',animation:'dashFadeInUp 0.5s cubic-bezier(0.16,1,0.3,1) 640ms backwards'}}>
            <div style={{font:'600 15px var(--fd)',color:'var(--text)',marginBottom:14}}>Quick Actions</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
              {[{label:'Add Client',icon:'👥',action:()=>showToast("✓","Add client","Use + Client button")},
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

function AdminRevenue({ clients, expenses }) {
  const [expandedRow, setExpandedRow] = useState(null);
  const mrr = clients.reduce((s,c)=>s+c.mrr,0);
  const adRevenue = AD_CAMPAIGNS.reduce((s,c)=>s+c.budget,0);
  const totalRevenue = mrr + adRevenue;
  const copperClients = clients.filter(c=>c.plan==="Copper").length;
  const goldClients = clients.filter(c=>c.plan==="Gold").length;
  const platClients = clients.filter(c=>c.plan==="Platinum").length;
  const totalExpenses = expenses.reduce((s,e)=>s+e.amount,0);
  const profit = totalRevenue - totalExpenses;

  const glass = {
    background:'rgba(255,255,255,0.6)',backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)',
    border:'1px solid rgba(255,255,255,0.65)',borderRadius:18,
    boxShadow:'0 4px 24px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
  };

  return (
    <div>
      <PageTour steps={TOUR_STEPS.revenue}/>
      <div style={{...glass,padding:'28px 32px',marginBottom:24,background:'linear-gradient(135deg, rgba(255,255,255,0.75) 0%, rgba(252,198,18,0.08) 100%)',borderLeft:'3px solid var(--accent)',animation:'dashFadeInUp 0.5s cubic-bezier(0.16,1,0.3,1) both'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:16}}>
          <div>
            <h1 style={{font:'600 22px var(--fd)',color:'var(--text)',marginBottom:4}}>Revenue & Financials</h1>
            <p style={{font:'400 13px var(--fb)',color:'var(--text2)',margin:0}}>Agency-wide financial overview</p>
          </div>
          <div style={{textAlign:'right'}}>
            <div style={{font:'500 10px var(--fd)',textTransform:'uppercase',letterSpacing:1.5,color:'var(--text3)',marginBottom:2}}>Net Profit</div>
            <div style={{font:'600 24px var(--fd)',color:profit>0?'var(--green)':'var(--red)'}}>${(profit/1000).toFixed(1)}K</div>
          </div>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))',gap:14,marginBottom:24}}>
        {[
          {label:"Monthly Revenue",val:`$${(totalRevenue/1000).toFixed(1)}K`,sub:"Retainers + ad mgmt",color:"var(--accent)"},
          {label:"MRR (Retainers)",val:`$${(mrr/1000).toFixed(1)}K`,sub:`${clients.length} clients`,color:"var(--text)"},
          {label:"Ad Mgmt Revenue",val:`$${(adRevenue/1000).toFixed(1)}K`,sub:`${AD_CAMPAIGNS.filter(a=>a.status==="Running").length} active campaigns`,color:"var(--blue)"},
          {label:"Monthly Expenses",val:`$${(totalExpenses/1000).toFixed(1)}K`,sub:"Payroll, software, ads",color:"var(--red)"},
          {label:"Profit Margin",val:`${Math.round((profit/totalRevenue)*100)}%`,sub:profit>0?"Healthy":"Needs attention",color:profit>0?"var(--green)":"var(--red)"},
          {label:"ARR",val:`$${((totalRevenue*12)/1000).toFixed(0)}K`,sub:"Annualized",color:"var(--text)"},
        ].map((s,i)=>(
          <div key={s.label} className="dash-card-hover" style={{...glass,padding:'20px 18px',animation:`dashFadeInUp 0.5s cubic-bezier(0.16,1,0.3,1) ${i*60}ms backwards`}}>
            <div style={{font:'500 10px var(--fd)',textTransform:'uppercase',letterSpacing:1.2,color:'var(--text3)',marginBottom:6}}>{s.label}</div>
            <div style={{font:'600 26px var(--fd)',color:s.color,letterSpacing:'-0.5px'}}>{s.val}</div>
            <div style={{font:'400 11px var(--fb)',color:'var(--text2)',marginTop:4}}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1.1fr 0.9fr',gap:20}}>
        {/* LEFT: Revenue Breakdown */}
        <div>
          <div className="card">
            <div className="card-title">MRR Trend</div>
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
            <div className="card-title">Revenue by Client</div>
            {clients.sort((a,b)=>b.mrr-a.mrr).map(c=>(
              <div key={c.id} className="row-item" style={{cursor:'pointer'}} onClick={()=>setExpandedRow(expandedRow===c.id?null:c.id)}>
                <div className="row-avatar" style={{background:`${c.color}20`,color:c.color}}>{c.name[0]}</div>
                <div className="row-main">
                  <div className="row-title">{c.name}</div>
                  <div className="row-sub">{c.plan} · {c.industry}</div>
                  {expandedRow===c.id && (
                    <div style={{marginTop:8}}>
                      <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'var(--text2)',marginBottom:4}}><span>Retainer</span><span style={{fontWeight:600}}>${c.mrr.toLocaleString()}/mo</span></div>
                      <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'var(--text2)',marginBottom:4}}><span>Videos/mo</span><span>{PLAN_DETAILS[c.plan]?.videos||4}</span></div>
                      <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'var(--text2)',marginBottom:4}}><span>Shoots/mo</span><span>{PLAN_DETAILS[c.plan]?.shoots||"1x3hr"}</span></div>
                      <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'var(--text2)'}}><span>Ad management</span><span>{(PLAN_DETAILS[c.plan]?.googleAds?"FB + Google":"FB only")}</span></div>
                    </div>
                  )}
                </div>
                <div style={{font:'600 14px var(--fd)',color:'var(--text)',flexShrink:0}}>${c.mrr.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Expenses + Plan Distribution */}
        <div>
          <div className="card">
            <div className="card-title">Monthly Expenses</div>
            {expenses.slice(0,5).map(e=>(
              <div key={e.id} className="row-item">
                <div className="row-main"><div className="row-title">{e.category}</div></div>
                <div style={{font:'600 13px var(--fd)',color:'var(--red)'}}>${e.amount.toLocaleString()}</div>
              </div>
            ))}
            <div style={{borderTop:'1px solid var(--border)',paddingTop:10,marginTop:4,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <span style={{font:'600 12px var(--fd)',color:'var(--text)'}}>Total Expenses</span>
              <span style={{font:'700 16px var(--fd)',color:'var(--red)'}}>${totalExpenses.toLocaleString()}</span>
            </div>
          </div>

          <div className="card">
            <div className="card-title">Plan Distribution</div>
            {[{plan:"Platinum",count:platClients,price:"$5,000",color:"#A855F7"},{plan:"Gold",count:goldClients,price:"$3,000",color:"#3B82F6"},{plan:"Copper",count:copperClients,price:"$1,500",color:"#9999A8"}].map(p=>(
              <div key={p.plan} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 0',borderBottom:'1px solid var(--border)'}}>
                <div style={{width:36,height:36,borderRadius:10,background:`${p.color}15`,display:'flex',alignItems:'center',justifyContent:'center',font:'700 12px var(--fd)',color:p.color}}>{p.count}</div>
                <div style={{flex:1}}>
                  <div style={{font:'600 13px var(--fd)',color:'var(--text)'}}>{p.plan}</div>
                  <div style={{font:'400 11px var(--fb)',color:'var(--text3)'}}>{p.price}/mo per client</div>
                </div>
                <div style={{font:'600 14px var(--fd)',color:'var(--text)'}}>${(p.count*(parseInt(p.price.replace(/\D/g,"")))).toLocaleString()}</div>
              </div>
            ))}
          </div>

          <div className="card">
            <div className="card-title">Videos Produced</div>
            <ResponsiveContainer width="100%" height={100}>
              <BarChart data={VIDEO_DATA} margin={{top:4,right:4,left:-20,bottom:0}}>
                <XAxis dataKey="month" tick={{fill:"#999",fontSize:10}} axisLine={false} tickLine={false}/>
                <Tooltip content={<CustomTooltip prefix=""/>}/>
                <Bar dataKey="videos" fill="#3B82F6" radius={[4,4,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <style>{"@media(max-width:860px){.card:has(.card-title){margin-bottom:12px}}"}</style>
    </div>
  );
}

// ─── EXPENSES ────────────────────────────────────────────────────────────────
function AdminExpenses({ expenses, setExpenses, showToast }) {
  const [editingId, setEditingId] = useState(null);
  const [editVal, setEditVal] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newExpense, setNewExpense] = useState({category:"",amount:"",recurring:true,note:""});

  const totalExpenses = expenses.reduce((s,e)=>s+e.amount,0);

  const glass = {
    background:'rgba(255,255,255,0.6)',backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)',
    border:'1px solid rgba(255,255,255,0.65)',borderRadius:18,
    boxShadow:'0 4px 24px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
  };

  const saveEdit = (id) => {
    const num = parseInt(editVal) || 0;
    setExpenses(p=>p.map(e=>e.id===id?{...e,amount:num}:e));
    setEditingId(null);
    showToast("✓","Updated","Expense amount saved");
  };

  const deleteExpense = (id) => {
    setExpenses(p=>p.filter(e=>e.id!==id));
    showToast("✓","Removed","Expense deleted");
  };

  const addExpense = () => {
    if(!newExpense.category.trim()) return;
    setExpenses(p=>[...p,{id:Date.now(),category:newExpense.category,amount:parseInt(newExpense.amount)||0,recurring:newExpense.recurring,note:newExpense.note}]);
    setNewExpense({category:"",amount:"",recurring:true,note:""});
    setShowAdd(false);
    showToast("✓","Added","New expense added");
  };

  return (
    <div>
      <PageTour steps={TOUR_STEPS.expenses}/>
      <div style={{...glass,padding:'28px 32px',marginBottom:24,background:'linear-gradient(135deg, rgba(255,255,255,0.75) 0%, rgba(217,79,92,0.06) 100%)',borderLeft:'3px solid var(--red)',animation:'dashFadeInUp 0.5s cubic-bezier(0.16,1,0.3,1) both'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:16}}>
          <div>
            <h1 style={{font:'600 22px var(--fd)',color:'var(--text)',marginBottom:4}}>Expenses</h1>
            <p style={{font:'400 13px var(--fb)',color:'var(--text2)',margin:0}}>Track and manage all agency costs</p>
          </div>
          <div style={{textAlign:'right'}}>
            <div style={{font:'500 10px var(--fd)',textTransform:'uppercase',letterSpacing:1.5,color:'var(--text3)',marginBottom:2}}>Total Monthly</div>
            <div style={{font:'600 24px var(--fd)',color:'var(--red)'}}>${totalExpenses.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* QuickBooks Sync */}
      <div style={{...glass,padding:'14px 20px',marginBottom:16,display:'flex',alignItems:'center',gap:12,cursor:'pointer'}} onClick={()=>showToast("✓","QuickBooks synced","Last sync: just now — 7 transactions imported")}>
        <div style={{font:'600 16px var(--fd)',color:'var(--green)'}}>$</div>
        <div style={{flex:1}}>
          <div style={{font:'500 13px var(--fd)',color:'var(--text)'}}>QuickBooks Connected</div>
          <div style={{font:'400 11px var(--fb)',color:'var(--text3)'}}>Last synced: 2 hours ago · Tap to sync now</div>
        </div>
        <Badge type="green">Connected</Badge>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))',gap:12,marginBottom:20}}>
        <div className="dash-card-hover" style={{...glass,padding:'18px 16px'}}><div style={{font:'500 10px var(--fd)',textTransform:'uppercase',letterSpacing:1.2,color:'var(--text3)',marginBottom:6}}>Recurring</div><div style={{font:'600 24px var(--fd)',color:'var(--text)'}}>${expenses.filter(e=>e.recurring).reduce((s,e)=>s+e.amount,0).toLocaleString()}</div></div>
        <div className="dash-card-hover" style={{...glass,padding:'18px 16px'}}><div style={{font:'500 10px var(--fd)',textTransform:'uppercase',letterSpacing:1.2,color:'var(--text3)',marginBottom:6}}>One-Time</div><div style={{font:'600 24px var(--fd)',color:'var(--text)'}}>${expenses.filter(e=>!e.recurring).reduce((s,e)=>s+e.amount,0).toLocaleString()}</div></div>
        <div className="dash-card-hover" style={{...glass,padding:'18px 16px'}}><div style={{font:'500 10px var(--fd)',textTransform:'uppercase',letterSpacing:1.2,color:'var(--text3)',marginBottom:6}}>Line Items</div><div style={{font:'600 24px var(--fd)',color:'var(--text)'}}>{expenses.length}</div></div>
      </div>

      <div style={{marginBottom:12}}>
        <button className="btn primary" onClick={()=>setShowAdd(!showAdd)}>{showAdd?"Cancel":"+ Add Expense"}</button>
      </div>

      {showAdd && (
        <div className="card" style={{marginBottom:12}}>
          <div className="card-title">New Expense</div>
          <div className="form-group"><label className="form-label">Category</label><input className="form-input" placeholder="e.g. New Camera Lens" value={newExpense.category} onChange={e=>setNewExpense(p=>({...p,category:e.target.value}))}/></div>
          <div className="form-group"><label className="form-label">Amount ($)</label><input className="form-input" type="number" placeholder="0" value={newExpense.amount} onChange={e=>setNewExpense(p=>({...p,amount:e.target.value}))}/></div>
          <div className="form-group"><label className="form-label">Note</label><input className="form-input" placeholder="Description or details" value={newExpense.note} onChange={e=>setNewExpense(p=>({...p,note:e.target.value}))}/></div>
          <div className="form-group">
            <label style={{display:'flex',alignItems:'center',gap:8,font:'400 13px var(--fb)',color:'var(--text)',cursor:'pointer'}}>
              <input type="checkbox" checked={newExpense.recurring} onChange={e=>setNewExpense(p=>({...p,recurring:e.target.checked}))} style={{accentColor:'var(--accent)',width:16,height:16}}/>
              Recurring monthly expense
            </label>
          </div>
          <button className="btn primary full" onClick={addExpense}>Add Expense</button>
        </div>
      )}

      <div style={{...glass,overflow:'hidden'}}>
        <div style={{padding:'18px 22px',borderBottom:'1px solid rgba(0,0,0,0.04)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <span style={{font:'600 15px var(--fd)',color:'var(--text)'}}>All Expenses</span>
        </div>
        {expenses.map((e,idx)=>(
          <div key={e.id} className="dash-card-hover" style={{
            margin:'6px 10px',padding:'16px 18px',borderRadius:14,
            background:'rgba(255,255,255,0.4)',border:'1px solid rgba(0,0,0,0.02)',
            animation:`dashFadeInUp 0.4s cubic-bezier(0.16,1,0.3,1) ${idx*40}ms backwards`,
          }}>
            <div style={{display:'flex',alignItems:'center',gap:14}}>
              <div style={{flex:1,minWidth:0}}>
                <div style={{font:'500 14px var(--fd)',color:'var(--text)'}}>{e.category}</div>
                <div style={{font:'400 11px var(--fb)',color:'var(--text3)',marginTop:2}}>{e.note}</div>
                <div style={{marginTop:4}}>
                  <Badge type={e.recurring?"blue":"gray"}>{e.recurring?"Recurring":"One-time"}</Badge>
                </div>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:8,flexShrink:0}}>
                {editingId===e.id ? (
                  <div style={{display:'flex',gap:4,alignItems:'center'}}>
                    <span style={{font:'400 13px var(--fb)',color:'var(--text3)'}}>$</span>
                    <input className="form-input" type="number" style={{width:100,padding:'6px 10px'}} value={editVal} onChange={ev=>setEditVal(ev.target.value)} onKeyDown={ev=>{if(ev.key==="Enter")saveEdit(e.id);}} autoFocus/>
                    <button className="action-btn accent" onClick={()=>saveEdit(e.id)}>Save</button>
                  </div>
                ) : (
                  <div style={{font:'600 18px var(--fd)',color:'var(--red)',cursor:'pointer'}} onClick={()=>{setEditingId(e.id);setEditVal(e.amount.toString());}}>${e.amount.toLocaleString()}</div>
                )}
                <button style={{background:'none',border:'none',color:'var(--text3)',cursor:'pointer',fontSize:14}} onClick={()=>deleteExpense(e.id)}>✕</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminSettings({ showToast, darkMode, setDarkMode }) {
  const [integrations, setIntegrations] = useState([
    {name:"Zoom",connected:true,icon:"◉"},{name:"QuickBooks",connected:true,icon:"$"},{name:"Stripe Billing",connected:false,icon:"◎"},{name:"Twilio SMS",connected:false,icon:"◉"},{name:"Google Ads API",connected:true,icon:"◐"}
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
      <PageTour steps={TOUR_STEPS.settings}/>
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
      <div className="card">
        <div className="card-title">Appearance</div>
        <div className="row-item" style={{cursor:"pointer"}} onClick={()=>{setDarkMode(!darkMode);showToast(darkMode?"☀️":"🌙",darkMode?"Light mode":"Dark mode","Theme updated");}}>
          <div style={{fontSize:20,width:28,textAlign:"center",flexShrink:0}}>{darkMode?"🌙":"☀️"}</div>
          <div className="row-main">
            <div className="row-title">Dark Mode</div>
            <div className="row-sub">{darkMode?"Currently dark — tap to switch to light":"Currently light — tap to switch to dark"}</div>
          </div>
          <div style={{width:44,height:24,borderRadius:12,background:darkMode?"var(--accent)":"var(--border2)",padding:2,cursor:"pointer",transition:"background 0.2s"}}>
            <div style={{width:20,height:20,borderRadius:10,background:"white",boxShadow:"0 1px 4px rgba(0,0,0,0.2)",transform:darkMode?"translateX(20px)":"translateX(0)",transition:"transform 0.2s"}}/>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-title">Branding</div>
        <div className="row-item" style={{paddingTop:0}}>
          <div className="row-main">
            <div className="row-title">Business Name</div>
            <div className="row-sub"><InlineEdit value="Media4You" onSave={v=>showToast("✓","Updated","Business name changed to "+v)}/></div>
          </div>
        </div>
        <div className="row-item">
          <div className="row-main">
            <div className="row-title">Tagline</div>
            <div className="row-sub"><InlineEdit value="A Complete Growth Engine" onSave={v=>showToast("✓","Updated","Tagline updated")}/></div>
          </div>
        </div>
        <div className="row-item">
          <div className="row-main">
            <div className="row-title">Primary Color</div>
            <div style={{display:'flex',alignItems:'center',gap:8,marginTop:4}}>
              <input type="color" defaultValue="#fcc612" style={{width:32,height:32,borderRadius:8,border:'1px solid var(--border2)',cursor:'pointer',padding:2}} onChange={()=>showToast("✓","Color updated","Refresh to see changes")}/>
              <span style={{font:'400 11px monospace',color:'var(--text3)'}}>#fcc612</span>
            </div>
          </div>
        </div>
        <div className="row-item">
          <div className="row-main">
            <div className="row-title">Logo</div>
            <div className="row-sub">Current: MEDIA4YOU text logo</div>
          </div>
          <button className="action-btn" onClick={()=>showToast("✓","Upload","Logo upload dialog opened")}>Upload</button>
        </div>
        <div className="row-item" style={{borderBottom:'none'}}>
          <div className="row-main">
            <div className="row-title">Client Portal URL</div>
            <div className="row-sub">app.media4you.agency</div>
          </div>
          <button className="action-btn" onClick={()=>{navigator.clipboard?.writeText("app.media4you.agency");showToast("✓","Copied","URL copied");}}>Copy</button>
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN CLIENTS ────────────────────────────────────────────────────────
function AdminClients({ clients, showToast, onOpenIdeas, autoSelect, onClearAutoSelect, onUpdateClient, onOpenMessages }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedClient, setSelectedClient] = useState(autoSelect||null);
  const [clientTab, setClientTab] = useState("overview");
  const [expandedPipeline, setExpandedPipeline] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);
  useEffect(()=>{if(autoSelect){setSelectedClient(autoSelect);setClientTab("overview");onClearAutoSelect?.();}}, [autoSelect]);

  const filtered = clients.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  if (selectedClient) {
    const c = selectedClient;
    const teamMembers = [{name:"Maya R.",role:"Script Writer",color:"#A855F7",tasks:3,status:"Active"},{name:"Jordan T.",role:"Video Editor",color:"#22C55E",tasks:2,status:"Active"},{name:"Carlos V.",role:"Account Manager",color:"#3B82F6",tasks:1,status:"Available"}];
    const pipeline = [
      {id:1,title:"Day in the Life",status:"Scripting",progress:20,icon:"✍️",assigned:"Maya R.",due:"Mar 22",script:"HOOK (0–3 sec)\nEver wonder what a day at "+c.name+" looks like?\n\nSETUP (3–10 sec)\nWe spent a full morning with the team and captured everything. The energy before the doors open is unreal.\n\nBODY (10–40 sec)\nWatch as "+c.name+" takes on a packed morning. Every detail is dialed in — the craft, the hustle, the passion. This is what sets them apart from everyone else in the Valley. You can feel the energy through the screen.\n\nCTA (40–50 sec)\nFollow "+c.name+" for more behind-the-scenes content. Tap the link in bio to book yours today.",notes:"Client wants to highlight the morning rush. Keep it authentic."},
      {id:2,title:"Listing Showcase",status:"Editing",progress:60,icon:"🎬",assigned:"Jordan T.",due:"Mar 20",script:"HOOK (0–3 sec)\nThis Scottsdale listing just hit the market and it is STUNNING.\n\nSETUP (3–10 sec)\nLocated in the heart of Old Town, this 4-bed, 3-bath beauty features mountain views and a backyard oasis you have to see to believe.\n\nBODY (10–40 sec)\nWalk through the open-concept living area with floor-to-ceiling windows. The chef's kitchen has quartz counters and a massive island. The primary suite includes a spa-like bathroom with dual vanities. And the real showstopper? That heated pool with an unobstructed view of Camelback Mountain.\n\nCTA (40–50 sec)\nDM us or tap the link in bio to schedule a private showing before this one is gone. Homes like this do not last in Scottsdale.",notes:"Drone shots approved. Need to add text overlays for property specs."},
      {id:3,title:"Testimonial Reel",status:"Review",progress:85,icon:"👁️",assigned:"Jordan T.",due:"Mar 19",script:"HOOK (0–3 sec)\nThis client drove 45 minutes just for "+c.name+". Here is why.\n\nSETUP (3–10 sec)\nWe sat down with a real customer to hear their experience working with "+c.name+". No scripts, no prompts — just their honest words.\n\nBODY (10–40 sec)\nThey talk about the problem they had, how they found "+c.name+", and what happened next. The transformation speaks for itself. You can see the genuine emotion and satisfaction in every word.\n\nCTA (40–50 sec)\nIf you want results like this, follow "+c.name+" and tap the link in bio. Your turn is next.",notes:"Client mentioned they want a stronger call-to-action at the end."},
    ];
    const [expandedActivity, setExpandedActivity] = useState(null);
    const activity = [
      {action:"Script submitted",item:"Testimonial Reel",by:"Maya R.",time:"2 hours ago",dot:"var(--blue)",detail:"Maya submitted the final draft of the Testimonial Reel script. It's now in Review status and ready for client approval. The script follows the HOOK/SETUP/BODY/CTA format with a strong emotional close.",tab:"content"},
      {action:"Video uploaded",item:"Listing Showcase — raw footage",by:"Jordan T.",time:"Yesterday",dot:"var(--green)",detail:"Jordan uploaded 1.2 GB of 4K raw footage from the 4821 Cactus Rd listing shoot. 47 clips total including drone footage, interior walkthrough, and backyard reveal. Ready for editing.",tab:"content"},
      {action:"Revision requested",item:"Day in the Life script",by:c.name,time:"2 days ago",dot:"var(--amber)",detail:"Client requested changes to the Day in the Life script. Notes: 'We want to highlight the morning rush more and include a clip of our new equipment. The CTA should mention our booking link specifically.'",tab:"content"},
      {action:"Content approved",item:"Agent Intro — Meet Sarah",by:c.name,time:"3 days ago",dot:"var(--green)",detail:"Client approved the Agent Intro video. It's been moved to Scheduled status and will be posted on Instagram and TikTok this Thursday at 10:00 AM (peak engagement time).",tab:"content"},
      {action:"New content idea generated",item:"5 AI ideas created",by:"Alex M.",time:"4 days ago",dot:"var(--accent)",detail:"Alex generated 5 new content ideas for this client using the AI Video Ideas tool. Ideas include: Arizona Hidden Gem, Process Breakdown, Customer Story Spotlight, 5 Things You Didn't Know, and Saturday Rush.",tab:"content"},
      {action:"Shoot confirmed",item:"Mar 20 — 4821 Cactus Rd",by:"Carlos V.",time:"5 days ago",dot:"var(--green)",detail:"Carlos confirmed the shoot for March 20 at 9:00 AM. Location: 4821 Cactus Rd, Scottsdale. Crew: Jordan T. Equipment: drone + 2 cameras + lav mic. Duration: 3 hours.",tab:"shoots"},
      {action:"Invoice paid",item:"February 2025 — $5,000",by:c.name,time:"1 week ago",dot:"var(--green)",detail:"Client paid the February invoice ($5,000 Platinum Plan). Payment processed via Stripe. Receipt emailed to client automatically.",tab:null},
    ];
    const planInfo = PLAN_DETAILS[c.plan] || PLAN_DETAILS.Copper;
    const clientShoots = INIT_SHOOTS.filter(s=>s.client===c.name);
    const clientCoaching = INIT_COACHING.filter(s=>s.client===c.name);
    const clientAds = AD_CAMPAIGNS.filter(a=>a.client===c.name);
    /* expandedSection already declared at component top */
    const socials = [
      {platform:"Instagram",handle:c.brandKit?.ig||"—",icon:"📸",connected:c.status==="active",followers:c.metrics?.followers||0},
      {platform:"Facebook",handle:c.name+" Page",icon:"📘",connected:c.status==="active",followers:Math.round((c.metrics?.followers||0)*0.6)},
      {platform:"Google Business",handle:c.name,icon:"🔍",connected:planInfo.googleAds,followers:0},
      {platform:"TikTok",handle:"—",icon:"🎵",connected:false,followers:0},
    ];
    const tabs = [{key:"overview",label:"Overview"},{key:"content",label:"Content"},{key:"ads",label:"Ads"},{key:"shoots",label:"Shoots"},{key:"analytics",label:"Analytics"},{key:"brand",label:"Brand Kit"}];

    return (
      <div>
        <button className="btn back" onClick={()=>setSelectedClient(null)}>← All Clients</button>
        <div className="client-hero">
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div className="row-avatar" style={{background:`${c.color}20`,color:c.color,width:48,height:48,fontSize:20}}>{c.name[0]}</div>
            <div style={{flex:1}}>
              <div style={{fontFamily:"var(--fd)",fontSize:20,fontWeight:800}}><InlineEdit value={c.name} onSave={v=>{if(onUpdateClient)onUpdateClient(c.id,{name:v});showToast("✓","Updated",v);}}/></div>
              <div style={{fontSize:12,color:"var(--text2)",marginTop:2}}><InlineEdit value={c.industry} onSave={v=>{if(onUpdateClient)onUpdateClient(c.id,{industry:v});}}/> · {c.brandKit?.ig||"No IG"}</div>
            </div>
          </div>
          <div style={{display:"flex",gap:8,marginTop:14,flexWrap:"wrap"}}>
            <Badge type={c.plan==="Platinum"?"purple":c.plan==="Gold"?"blue":"gray"}>{c.plan} Plan — ${c.mrr.toLocaleString()}/mo</Badge>
            <Badge type={c.status==="active"?"green":c.status==="onboarding"?"amber":"red"}>{c.status}</Badge>
          </div>
        </div>

        {/* Tabs */}
        <div style={{display:'flex',gap:2,marginBottom:16,borderBottom:'1px solid var(--border)',overflowX:'auto',flexShrink:0}}>
          {tabs.map(t=>(
            <button key={t.key} onClick={()=>setClientTab(t.key)} style={{
              padding:'10px 14px',border:'none',background:'none',cursor:'pointer',whiteSpace:'nowrap',
              font:`${clientTab===t.key?600:400} 11px var(--fd)`,
              color:clientTab===t.key?'var(--accent)':'var(--text3)',
              borderBottom:clientTab===t.key?'2px solid var(--accent)':'2px solid transparent',
            }}>{t.label}</button>
          ))}
        </div>

        {clientTab==="overview" && (<>
          {/* Plan Deliverables */}
          <div className="card" style={{cursor:'pointer'}} onClick={()=>setExpandedSection(expandedSection==="plan"?null:"plan")}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <div className="card-title" style={{margin:0}}>{c.plan} Plan Deliverables</div>
              <span style={{color:'var(--text3)',fontSize:14}}>{expandedSection==="plan"?"▾":"›"}</span>
            </div>
            {expandedSection==="plan" && (
              <div style={{marginTop:12}}>
                {[
                  {label:`${planInfo.videos} HD Videos/mo`,included:true},
                  {label:`Shoot Sessions: ${planInfo.shoots}`,included:true},
                  {label:"Scheduled Post Management",included:planInfo.socialMgmt},
                  {label:"Scriptwriting",included:planInfo.scriptwriting},
                  {label:"Camera Coaching",included:planInfo.coaching},
                  {label:"Facebook Ad Management",included:planInfo.fbAds},
                  {label:"Google Ad Management",included:planInfo.googleAds},
                  {label:"Monthly Strategy Call + Sales Coaching",included:planInfo.strategy},
                  {label:`${planInfo.photos} Edited Photos/mo`,included:planInfo.photos>0},
                ].map((d,i)=>(
                  <div key={i} style={{display:'flex',alignItems:'center',gap:8,padding:'6px 0',font:'400 12px var(--fb)',color:d.included?'var(--text)':'var(--text3)'}}>
                    <span style={{fontSize:12}}>{d.included?"✅":"—"}</span>
                    <span style={{textDecoration:d.included?'none':'line-through'}}>{d.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="stats-grid">
            <div className="stat-card" style={{cursor:'pointer'}}><div className="stat-label">MRR</div><div className="stat-value">$<InlineEdit value={c.mrr.toLocaleString()} onSave={v=>{const num=parseInt(v.replace(/,/g,""))||0;if(onUpdateClient)onUpdateClient(c.id,{mrr:num});showToast("✓","MRR updated","$"+num.toLocaleString());}} style={{font:'inherit'}}/></div></div>
            <div className="stat-card" style={{cursor:'pointer'}} onClick={()=>setClientTab("content")}><div className="stat-label">Videos</div><div className="stat-value">{c.videos}</div><div className="stat-sub">produced</div></div>
            <div className="stat-card" style={{cursor:'pointer'}} onClick={()=>setClientTab("shoots")}><div className="stat-label">Shoots</div><div className="stat-value">{clientShoots.length}</div><div className="stat-sub">scheduled</div></div>
            <div className="stat-card" style={{cursor:'pointer'}} onClick={()=>setClientTab("ads")}><div className="stat-label">Ad Campaigns</div><div className="stat-value">{clientAds.length}</div><div className="stat-sub">active</div></div>
          </div>

          {/* Connected Accounts */}
          <div className="card" style={{cursor:'pointer'}} onClick={()=>setExpandedSection(expandedSection==="socials"?null:"socials")}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <div className="card-title" style={{margin:0}}>Connected Accounts</div>
              <span style={{color:'var(--text3)',fontSize:14}}>{expandedSection==="socials"?"▾":"›"}</span>
            </div>
            {expandedSection==="socials" && (
              <div style={{marginTop:12}}>
                {socials.map((s,i)=>(
                  <div key={i} className="row-item" style={{cursor:'pointer'}} onClick={(e)=>{e.stopPropagation();showToast(s.icon,s.platform,s.connected?s.handle+" · Connected":"Not connected — tap to connect");}}>
                    <div style={{fontSize:20,width:28,textAlign:'center',flexShrink:0}}>{s.icon}</div>
                    <div className="row-main">
                      <div className="row-title">{s.platform}</div>
                      <div className="row-sub">{s.handle}{s.followers>0?` · ${s.followers.toLocaleString()} followers`:""}</div>
                    </div>
                    <Badge type={s.connected?"green":"gray"}>{s.connected?"Connected":"Not Connected"}</Badge>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Team */}
          <div className="card" style={{cursor:'pointer'}} onClick={()=>setExpandedSection(expandedSection==="team"?null:"team")}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <div className="card-title" style={{margin:0}}>Assigned Team</div>
              <span style={{color:'var(--text3)',fontSize:14}}>{expandedSection==="team"?"▾":"›"}</span>
            </div>
            {expandedSection==="team" && (
              <div style={{marginTop:12}}>
                {teamMembers.map(m=>(
                  <div className="row-item" key={m.name} style={{cursor:'pointer'}} onClick={(e)=>{e.stopPropagation();showToast(m.status==="Active"?"🟢":"🔵",m.name,m.tasks+" active tasks · "+m.role);}}>
                    <div className="row-avatar" style={{background:`${m.color}20`,color:m.color}}>{m.name[0]}</div>
                    <div className="row-main"><div className="row-title">{m.name}</div><div className="row-sub">{m.role}</div></div>
                    <div style={{display:'flex',alignItems:'center',gap:6}}>
                      <span style={{font:'500 11px var(--fd)',color:'var(--text3)'}}>{m.tasks} tasks</span>
                      <div style={{width:7,height:7,borderRadius:'50%',background:m.status==="Active"?"var(--green)":"var(--blue)"}}/>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Activity */}
          <div className="card">
            <div className="card-title">Recent Activity</div>
            {activity.map((a,i)=>(
              <div key={i}>
                <div className="activity-item" style={{cursor:'pointer'}} onClick={()=>setExpandedActivity(expandedActivity===i?null:i)}>
                  <div className="activity-dot" style={{background:a.dot}}/>
                  <div style={{flex:1}}>
                    <div className="activity-text"><strong>{a.action}</strong> — {a.item}</div>
                    <div className="activity-time">{a.by} · {a.time}</div>
                  </div>
                  <span style={{color:'var(--text3)',fontSize:12,transition:'transform 0.2s',transform:expandedActivity===i?'rotate(90deg)':'none'}}>›</span>
                </div>
                {expandedActivity===i && (
                  <div style={{padding:'8px 0 14px 18px',borderBottom:'1px solid var(--border)'}}>
                    <div style={{font:'400 12px var(--fb)',color:'var(--text2)',lineHeight:1.6,marginBottom:10}}>{a.detail}</div>
                    {a.tab && <button className="btn" style={{fontSize:11,padding:'6px 14px'}} onClick={()=>setClientTab(a.tab)}>View in {a.tab.charAt(0).toUpperCase()+a.tab.slice(1)} →</button>}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:8}}>
            <button className="btn" style={{flex:1}} onClick={()=>showToast("✏️","Edit mode","Client details are now editable")}>Edit Client</button>
            <button className="btn" style={{flex:1}} onClick={()=>{if(onOpenMessages)onOpenMessages();else showToast("◉","Messages","Opening messages...");}}>Message</button>
          </div>
        </>)}

        {clientTab==="content" && (<>
          {onOpenIdeas && <button className="btn primary full" style={{marginBottom:12}} onClick={()=>onOpenIdeas(c)}>💡 Generate AI Content Ideas</button>}
          <div className="card">
            <div className="card-title">Content Pipeline</div>
            {pipeline.map(p=>(
              <div key={p.id}>
                <div className="deliverable-item" style={{cursor:'pointer'}} onClick={()=>setExpandedPipeline(expandedPipeline===p.id?null:p.id)}>
                  <div className="deliverable-icon">{p.icon}</div>
                  <div className="deliverable-info">
                    <div className="deliverable-title">{p.title}</div>
                    <div className="deliverable-sub">{p.status} · {p.assigned}</div>
                    <div className="progress-bar-wrap"><div className="progress-bar" style={{width:`${p.progress}%`,background:p.status==="Review"?"var(--amber)":p.status==="Editing"?"var(--blue)":"var(--accent)"}}/></div>
                  </div>
                  <StatusBadge status={p.status} options={["Scripting","Editing","Review","Approved","Scheduled","Published"]} onChange={(s)=>showToast("✓","Status changed",p.title+" → "+s)}/>
                </div>
                {expandedPipeline===p.id && (
                  <div style={{padding:'12px 0 16px 40px',borderBottom:'1px solid var(--border)'}}>
                    <div className="row-item" style={{paddingTop:0}}><div className="row-main"><div className="row-title">Assigned To</div><div className="row-sub">{p.assigned}</div></div></div>
                    <div className="row-item"><div className="row-main"><div className="row-title">Due Date</div><div className="row-sub" style={{color:p.due<"Mar 18"?"var(--red)":"var(--text3)"}}>{p.due<"Mar 18"?"⚠ OVERDUE — "+p.due:p.due}</div></div></div>
                    <div className="row-item"><div className="row-main"><div className="row-title">Progress</div><div className="row-sub">{p.progress}%</div></div></div>
                    {p.notes && <div className="row-item"><div className="row-main"><div className="row-title">Notes</div><div className="row-sub">{p.notes}</div></div></div>}
                    {p.script && (
                      <div style={{marginTop:8}}>
                        <div style={{font:'600 10px var(--fd)',textTransform:'uppercase',letterSpacing:0.8,color:'var(--text3)',marginBottom:6}}>Script / Details</div>
                        <div style={{background:'rgba(255,255,255,0.7)',border:'1px solid var(--border)',borderRadius:10,padding:'12px 14px',font:'400 11px var(--fb)',color:'var(--text2)',lineHeight:1.7,whiteSpace:'pre-wrap',maxHeight:'none'}}>{p.script}</div>
                      </div>
                    )}
                    <div style={{display:'flex',gap:6,marginTop:10}}>
                      <button className="btn primary" style={{flex:1,padding:'8px 12px',fontSize:11}} onClick={()=>{showToast("✓","Approved","Content moved to next stage");fireConfetti();}}>Approve</button>
                      <button className="btn" style={{padding:'8px 12px',fontSize:11}} onClick={()=>showToast("◉","Revision","Request sent to team")}>Request Changes</button>
                    </div>
                    <CommentThread itemId={`pipeline-${p.id}`} showToast={showToast}/>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>)}

        {clientTab==="ads" && (<>
          {clientAds.length > 0 ? (
            <div>
              <div className="stats-grid">
                <div className="stat-card"><div className="stat-label">Monthly Spend</div><div className="stat-value" style={{fontSize:20}}>${clientAds.reduce((s,a)=>s+a.budget,0).toLocaleString()}</div></div>
                <div className="stat-card"><div className="stat-label">Impressions</div><div className="stat-value" style={{fontSize:20}}>{(clientAds.reduce((s,a)=>s+a.impressions,0)/1000).toFixed(0)}K</div></div>
                <div className="stat-card"><div className="stat-label">Conversions</div><div className="stat-value" style={{fontSize:20}}>{clientAds.reduce((s,a)=>s+a.conversions,0)}</div></div>
                <div className="stat-card"><div className="stat-label">Best ROAS</div><div className="stat-value" style={{fontSize:20}}>{clientAds[0]?.roas||"—"}</div></div>
              </div>
              <div className="card">
                <div className="card-title">Active Campaigns</div>
                {clientAds.map(a=>(
                  <div key={a.id} className="row-item" style={{cursor:'pointer'}} onClick={()=>showToast("📢",a.name,`${a.platform} · $${a.budget}/mo · ${a.ctr} CTR · ${a.conversions} conversions`)}>
                    <div style={{fontSize:18,flexShrink:0}}>{a.platform==="Google Ads"?"🔍":"📸"}</div>
                    <div className="row-main">
                      <div className="row-title">{a.name}</div>
                      <div className="row-sub">{a.platform} · ${a.budget}/mo · {a.ctr} CTR</div>
                    </div>
                    <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:4}}>
                      <Badge type={a.status==="Running"?"green":"amber"}>{a.status}</Badge>
                      <span style={{font:'600 11px var(--fd)',color:'var(--accent)'}}>{a.roas} ROAS</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="card">
                <div className="card-title">Platforms</div>
                <div style={{display:'flex',gap:8}}>
                  {[...new Set(clientAds.map(a=>a.platform))].map(p=>(
                    <div key={p} style={{flex:1,textAlign:'center',padding:14,background:'var(--accent-dim)',borderRadius:12,border:'1px solid rgba(252,198,18,0.15)'}}>
                      <div style={{fontSize:20,marginBottom:4}}>{p==="Google Ads"?"🔍":p==="Instagram"?"📸":"📘"}</div>
                      <div style={{font:'600 12px var(--fd)',color:'var(--text)'}}>{p}</div>
                      <div style={{font:'400 10px var(--fb)',color:'var(--text3)',marginTop:2}}>Active</div>
                    </div>
                  ))}
                  {!planInfo.googleAds && <div style={{flex:1,textAlign:'center',padding:14,background:'var(--surface2)',borderRadius:12,border:'1px solid var(--border)',opacity:0.5}}>
                    <div style={{fontSize:20,marginBottom:4}}>🔍</div>
                    <div style={{font:'600 12px var(--fd)',color:'var(--text3)'}}>Google Ads</div>
                    <div style={{font:'400 10px var(--fb)',color:'var(--text3)',marginTop:2}}>Platinum only</div>
                  </div>}
                </div>
              </div>
            </div>
          ) : (
            <div className="empty"><div className="empty-icon">📢</div><div className="empty-title">No ad campaigns yet</div><div style={{fontSize:12,color:'var(--text3)'}}>Facebook Ads included in {c.plan} plan</div></div>
          )}
        </>)}

        {clientTab==="shoots" && (<>
          {clientShoots.length > 0 ? (
            <div className="card">
              <div className="card-title">Scheduled Shoots</div>
              {clientShoots.map(s=>(
                <div key={s.id} className="row-item" style={{cursor:'pointer'}} onClick={()=>setExpandedSection(expandedSection===`shoot-${s.id}`?null:`shoot-${s.id}`)}>
                  <div style={{width:44,height:44,borderRadius:10,background:s.status==="Confirmed"?"rgba(45,154,106,0.1)":"rgba(212,150,11,0.1)",display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                    <div style={{font:'600 13px var(--fd)',color:s.status==="Confirmed"?"var(--green)":"var(--amber)"}}>{s.date.split(" ")[1]}</div>
                    <div style={{font:'500 8px var(--fd)',color:'var(--text3)'}}>{s.date.split(" ")[0]}</div>
                  </div>
                  <div className="row-main">
                    <div className="row-title">{s.time} · {s.duration}</div>
                    <div className="row-sub">{s.location}</div>
                    {expandedSection===`shoot-${s.id}` && (
                      <div style={{marginTop:8}}>
                        <div style={{font:'400 11px var(--fb)',color:'var(--text2)',marginBottom:4}}>Crew: {s.crew}</div>
                        <div style={{font:'400 11px var(--fb)',color:'var(--text2)'}}>Notes: {s.notes}</div>
                      </div>
                    )}
                  </div>
                  <Badge type={s.status==="Confirmed"?"green":"amber"}>{s.status}</Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty"><div className="empty-icon">🎥</div><div className="empty-title">No shoots scheduled</div></div>
          )}
          {clientCoaching.length > 0 && (
            <div className="card">
              <div className="card-title">Coaching & Strategy Sessions</div>
              {clientCoaching.map(s=>(
                <div key={s.id} className="row-item" style={{cursor:'pointer'}} onClick={()=>showToast(s.type==="Strategy Call"?"📊":"📷",s.type,s.date+" at "+s.time+" · "+s.notes)}>
                  <div style={{fontSize:18,flexShrink:0}}>{s.type==="Strategy Call"?"📊":s.type==="Camera Coaching"?"📷":"💰"}</div>
                  <div className="row-main">
                    <div className="row-title">{s.type}</div>
                    <div className="row-sub">{s.date} at {s.time} · {s.duration}</div>
                  </div>
                  <Badge type={s.status==="Upcoming"?"amber":"green"}>{s.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </>)}

        {clientTab==="analytics" && (<>
          {c.metrics && c.metrics.followers > 0 ? (
            <div>
              <div className="stats-grid">
                <div className="stat-card" style={{cursor:'pointer'}} onClick={()=>showToast("📸","Instagram Followers",c.metrics.followers.toLocaleString()+" total · +"+c.metrics.gained+" this month")}><div className="stat-label">Followers</div><div className="stat-value">{c.metrics.followers.toLocaleString()}</div><div className="stat-sub" style={{color:'var(--green)'}}>+{c.metrics.gained} this month</div></div>
                <div className="stat-card" style={{cursor:'pointer'}} onClick={()=>showToast("👁️","Average Views",c.metrics.avgViews.toLocaleString()+" per video")}><div className="stat-label">Avg Views</div><div className="stat-value">{c.metrics.avgViews.toLocaleString()}</div></div>
                <div className="stat-card" style={{cursor:'pointer'}} onClick={()=>showToast("❤️","Average Likes",c.metrics.avgLikes+" per video")}><div className="stat-label">Avg Likes</div><div className="stat-value">{c.metrics.avgLikes}</div></div>
                <div className="stat-card" style={{cursor:'pointer'}} onClick={()=>showToast("📊","Engagement",c.metrics.engRate+"% — "+(c.metrics.engRate>5?"Above average":"Average"))}><div className="stat-label">Engagement</div><div className="stat-value">{c.metrics.engRate}%</div></div>
              </div>
              <div className="card">
                <div className="card-title">Top Performing Content</div>
                <div className="row-item" style={{paddingTop:0,cursor:'pointer'}} onClick={()=>showToast("🏆","Top Post",c.metrics.topPost+" — highest engagement this month")}>
                  <div style={{fontSize:20}}>🏆</div>
                  <div className="row-main"><div className="row-title">{c.metrics.topPost}</div><div className="row-sub">Highest engagement this month</div></div>
                  <span style={{color:'var(--text3)',fontSize:12}}>›</span>
                </div>
              </div>
              <div className="card">
                <div className="card-title">Growth Summary</div>
                <div className="row-item" style={{paddingTop:0,cursor:'pointer'}} onClick={()=>showToast("📈","Follower Growth","+"+c.metrics.gained+" followers gained this month")}><div className="row-main"><div className="row-title">Followers Gained</div></div><div style={{font:'600 14px var(--fd)',color:'var(--green)'}}>+{c.metrics.gained}</div></div>
                <div className="row-item" style={{cursor:'pointer'}} onClick={()=>showToast("👁️","Total Views","Estimated "+((c.metrics.avgViews*c.videos).toLocaleString())+" total views across "+c.videos+" videos")}><div className="row-main"><div className="row-title">Total Views (est.)</div></div><div style={{font:'600 14px var(--fd)',color:'var(--text)'}}>{(c.metrics.avgViews * c.videos).toLocaleString()}</div></div>
                <div className="row-item" style={{cursor:'pointer'}} onClick={()=>setClientTab("content")}><div className="row-main"><div className="row-title">Videos Produced</div></div><div style={{font:'600 14px var(--fd)',color:'var(--text)'}}>{c.videos}</div></div>
                <div className="row-item" style={{borderBottom:'none',cursor:'pointer'}} onClick={()=>showToast("💪","ROI Score","Strong — engagement rate above industry average")}><div className="row-main"><div className="row-title">ROI Score</div></div><Badge type="green">Strong</Badge></div>
              </div>
            </div>
          ) : (
            <div className="empty"><div className="empty-icon">📊</div><div className="empty-title">No analytics yet</div><div style={{fontSize:12,color:'var(--text3)'}}>Metrics will appear once content is published</div></div>
          )}
        </>)}

        {clientTab==="brand" && (<>
          {c.brandKit ? (
            <div>
              <div className="card">
                <div className="card-title">Brand Colors</div>
                <div style={{display:'flex',gap:10,marginBottom:12}}>
                  {c.brandKit.colors.map((clr,i)=>(
                    <div key={i} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4,cursor:'pointer'}} onClick={()=>showToast("🎨","Color copied",clr+" — "+["Primary","Secondary","Accent"][i])}>
                      <div style={{width:48,height:48,borderRadius:12,background:clr,border:'1px solid var(--border2)',boxShadow:'var(--shadow-sm)'}}/>
                      <span style={{font:'400 9px var(--fd)',color:'var(--text3)',textTransform:'uppercase'}}>{clr}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card">
                <div className="card-title">Brand Voice & Socials</div>
                <div className="row-item" style={{paddingTop:0,cursor:'pointer'}} onClick={()=>showToast("🎯","Tone",c.brandKit.tone)}><div className="row-main"><div className="row-title">Tone</div><div className="row-sub">{c.brandKit.tone}</div></div><span style={{color:'var(--text3)',fontSize:12}}>›</span></div>
                <div className="row-item" style={{cursor:'pointer'}} onClick={()=>showToast("👥","Target Audience",c.brandKit.audience)}><div className="row-main"><div className="row-title">Target Audience</div><div className="row-sub">{c.brandKit.audience}</div></div><span style={{color:'var(--text3)',fontSize:12}}>›</span></div>
                <div className="row-item" style={{cursor:'pointer'}} onClick={()=>showToast("📸","Instagram",c.brandKit.ig)}><div className="row-main"><div className="row-title">Instagram</div><div className="row-sub">{c.brandKit.ig}</div></div><Badge type="green">Connected</Badge></div>
                <div className="row-item" style={{cursor:'pointer'}} onClick={()=>showToast("📘","Facebook",c.name+" Page")}><div className="row-main"><div className="row-title">Facebook</div><div className="row-sub">{c.name} Page</div></div><Badge type="green">Connected</Badge></div>
                {planInfo.googleAds && <div className="row-item" style={{cursor:'pointer'}} onClick={()=>showToast("🔍","Google Business",c.name)}><div className="row-main"><div className="row-title">Google Business</div><div className="row-sub">{c.name}</div></div><Badge type="green">Connected</Badge></div>}
                <div className="row-item" style={{borderBottom:'none',cursor:'pointer'}} onClick={()=>showToast("🎵","TikTok","Not connected — tap to set up")}><div className="row-main"><div className="row-title">TikTok</div><div className="row-sub">Not connected</div></div><Badge type="gray">Not Connected</Badge></div>
              </div>
              <div className="card">
                <div className="card-title">Hashtags</div>
                <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                  {c.brandKit.hashtags.map((h,i)=>(
                    <span key={i} style={{font:'500 12px var(--fb)',color:'var(--accent)',background:'var(--accent-dim)',padding:'6px 14px',borderRadius:20,border:'1px solid rgba(252,198,18,0.2)',cursor:'pointer'}} onClick={()=>showToast("📋","Copied",h)}>{h}</span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="empty"><div className="empty-icon">🎨</div><div className="empty-title">No brand kit yet</div><div style={{fontSize:12,color:'var(--text3)'}}>Add brand info during onboarding</div></div>
          )}
        </>)}
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
              <Badge type={c.plan==="Platinum"?"purple":c.plan==="Gold"?"blue":"gray"}>{c.plan}</Badge>
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
      <PageTour steps={TOUR_STEPS.ads}/>
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
              <div style={{fontFamily:"var(--fd)",fontSize:18,fontWeight:700}}>38%</div>
              <div style={{fontSize:10,color:"var(--text3)"}}>Instagram</div>
            </div>
            <div style={{flex:1,textAlign:"center",padding:14,background:"rgba(59,130,246,0.06)",borderRadius:12,border:"1px solid rgba(59,130,246,0.15)"}}>
              <div style={{fontSize:20,marginBottom:4}}>📘</div>
              <div style={{fontFamily:"var(--fd)",fontSize:18,fontWeight:700}}>24%</div>
              <div style={{fontSize:10,color:"var(--text3)"}}>Facebook</div>
            </div>
            <div style={{flex:1,textAlign:"center",padding:14,background:"rgba(34,197,94,0.06)",borderRadius:12,border:"1px solid rgba(34,197,94,0.15)"}}>
              <div style={{fontSize:20,marginBottom:4}}>🔍</div>
              <div style={{fontFamily:"var(--fd)",fontSize:18,fontWeight:700}}>38%</div>
              <div style={{fontSize:10,color:"var(--text3)"}}>Google Ads</div>
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
                <option>Instagram</option><option>Facebook</option><option>Google Ads</option><option>Meta (FB + IG)</option><option>All Platforms</option>
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
          showToast("✓","Upload complete",form.title+" added to queue");
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
function LeadDetailSheet({ lead, stage, onClose, showToast, onOpenComms }) {
  if(!lead) return null;
  const stages = ["New","Contacted","Demo","Proposal","Won \u2713"];
  const curIdx = stages.indexOf(stage);
  const nextStage = curIdx < stages.length-1 ? stages[curIdx+1] : null;
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',backdropFilter:'blur(4px)',zIndex:200,display:'flex',alignItems:'center',justifyContent:'center',padding:20}} onClick={onClose}>
      <div style={{background:'rgba(255,255,255,0.97)',backdropFilter:'blur(30px)',borderRadius:18,border:'1px solid var(--border2)',width:'100%',maxWidth:480,padding:'28px 24px',boxShadow:'0 20px 60px rgba(0,0,0,0.15)',animation:'slideUp 0.2s ease'}} onClick={e=>e.stopPropagation()}>
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:20}}>
          <div className="row-avatar" style={{background:'var(--accent-dim)',color:'var(--accent)',width:44,height:44,fontSize:18}}>{lead.name[0]}</div>
          <div style={{flex:1}}>
            <div style={{font:'700 18px var(--fd)',color:'var(--text)'}}>{lead.name}</div>
            <div style={{font:'400 12px var(--fb)',color:'var(--text2)',marginTop:2}}>{lead.industry} · {stage}</div>
          </div>
          <button style={{background:'none',border:'none',fontSize:18,color:'var(--text3)',cursor:'pointer'}} onClick={onClose}>✕</button>
        </div>
        <div className="stats-grid" style={{marginBottom:16}}>
          <div className="stat-card"><div className="stat-label">Deal Value</div><div className="stat-value" style={{fontSize:22}}>{lead.value}</div></div>
          <div className="stat-card"><div className="stat-label">Source</div><div className="stat-value" style={{fontSize:16}}>{lead.source}</div></div>
        </div>
        <div className="card" style={{marginBottom:16}}>
          <div className="row-item" style={{paddingTop:0}}>
            <div className="row-main"><div className="row-title">Assigned Rep</div><div className="row-sub">{lead.rep}</div></div>
          </div>
          <div className="row-item">
            <div className="row-main"><div className="row-title">Industry</div><div className="row-sub">{lead.industry}</div></div>
          </div>
          <div className="row-item">
            <div className="row-main"><div className="row-title">Pipeline Stage</div><div className="row-sub">{stage}</div></div>
            <Badge type={stage==="Won \u2713"?"green":stage==="Proposal"?"purple":"blue"}>{stage}</Badge>
          </div>
          <div className="row-item" style={{borderBottom:'none',paddingBottom:0}}>
            <div className="row-main"><div className="row-title">Next Step</div><div className="row-sub">{nextStage||"Won — no further action"}</div></div>
          </div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button className="btn" style={{flex:1}} onClick={()=>{onClose();if(onOpenComms)onOpenComms();}}>Call</button>
          <button className="btn" style={{flex:1}} onClick={()=>{onClose();if(onOpenComms)onOpenComms();}}>Email</button>
          <button className="btn" style={{flex:1}} onClick={()=>{onClose();if(onOpenComms)onOpenComms();}}>Text</button>
          {nextStage && <button className="btn primary" style={{flex:1}} onClick={()=>{showToast("✓","Moved",lead.name+" → "+nextStage);onClose();fireConfetti();}}>→ {nextStage}</button>}
        </div>
      </div>
    </div>
  );
}

function SalesDashboard({ leads, onOpenOutreach, showToast, onOpenComms }) {
  const [selectedLead, setSelectedLead] = useState(null);
  const [selectedStage, setSelectedStage] = useState(null);
  const total = Object.values(leads).flat().length;
  const won = (leads["Won ✓"]||[]).length;
  return (
    <div>
      <PageTour steps={TOUR_STEPS.salesPipeline}/>
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
      {selectedLead && <LeadDetailSheet lead={selectedLead} stage={selectedStage} onClose={()=>setSelectedLead(null)} showToast={showToast} onOpenComms={onOpenComms}/>}
    </div>
  );
}

function SalesCalls({ showToast }) {
  const [commTab, setCommTab] = useState("calls");
  const [joinedCalls, setJoinedCalls] = useState({});
  const [expandedItem, setExpandedItem] = useState(null);
  const [composeEmail, setComposeEmail] = useState(false);
  const [emailForm, setEmailForm] = useState({to:"",subject:"",body:""});
  const [textConvo, setTextConvo] = useState(null);
  const [textInput, setTextInput] = useState("");

  const handleJoin = (i) => {
    setJoinedCalls(p=>({...p,[i]:"joining"}));
    setTimeout(()=>setJoinedCalls(p=>({...p,[i]:"joined"})),1500);
  };

  const callData = [
    {name:"Chandler Law Group",rep:"Jade",time:"2:00 PM",day:"Today",type:"Demo",status:"Confirmed",duration:"—",agenda:"Demo walkthrough of content strategy and pricing packages",notes:"CEO interested in Instagram Reels for brand awareness. Has 2 locations."},
    {name:"Scottsdale Med Spa",rep:"Carlos",time:"4:30 PM",day:"Today",type:"Discovery",status:"Confirmed",duration:"—",agenda:"Initial discovery call to understand their content needs",notes:"Referred by existing client. Currently not doing any video content."},
    {name:"Sun Devil Gym",rep:"Jade",time:"10:00 AM",day:"Mar 19",type:"Proposal",status:"Pending",duration:"—",agenda:"Present Gold plan proposal and review content samples",notes:"Wants to focus on member transformation stories and workout highlights."},
  ];
  const callLog = [
    {name:"Mesa Flooring Co",rep:"Carlos",time:"11:30 AM",day:"Mar 17",type:"Discovery",duration:"18 min",outcome:"Interested — sending proposal",status:"Completed"},
    {name:"Phoenix Plumbing",rep:"Jade",time:"3:00 PM",day:"Mar 16",type:"Follow-up",duration:"8 min",outcome:"Not ready yet — revisit in 30 days",status:"Completed"},
    {name:"AZ Pool Pros",rep:"Carlos",time:"10:00 AM",day:"Mar 15",type:"Demo",duration:"32 min",outcome:"Signed Gold plan",status:"Won"},
  ];
  const textThreads = [
    {id:1,name:"Chandler Law Group",phone:"(480) 555-0142",lastMsg:"Looking forward to the demo today!",time:"1h ago",unread:1,messages:[
      {from:"them",text:"Hey, is the demo still at 2pm today?",time:"2h ago"},
      {from:"me",text:"Yes! I'll send you the Zoom link 10 min before. Any specific questions you want covered?",time:"1.5h ago"},
      {from:"them",text:"Looking forward to the demo today!",time:"1h ago"},
    ]},
    {id:2,name:"Sun Devil Gym",phone:"(480) 555-0198",lastMsg:"Can we push to Friday?",time:"3h ago",unread:0,messages:[
      {from:"me",text:"Hi! Just confirming our call tomorrow at 10am to go over the proposal.",time:"Yesterday"},
      {from:"them",text:"Can we push to Friday?",time:"3h ago"},
    ]},
    {id:3,name:"Mesa Flooring Co",phone:"(480) 555-0231",lastMsg:"Sent! Check your email for the Gold plan breakdown.",time:"Yesterday",unread:0,messages:[
      {from:"them",text:"Hey Carlos, can you send over that proposal we discussed?",time:"Mar 17"},
      {from:"me",text:"Sent! Check your email for the Gold plan breakdown.",time:"Yesterday"},
    ]},
  ];
  const emailLog = [
    {id:1,to:"Chandler Law Group",subject:"Media4You Demo — Agenda + Link",time:"Today 1:30 PM",status:"Sent",preview:"Hi!\n\nHere's the Zoom link for our 2pm demo today: zoom.us/j/media4you-demo\n\nAgenda:\n1. Overview of Media4You services\n2. Content strategy walkthrough for law firms\n3. Pricing and packages (Copper/Gold/Platinum)\n4. Q&A\n\nLooking forward to connecting. If you have any questions beforehand, feel free to reply to this email or text me directly.\n\nBest,\nCarlos V.\nMedia4You"},
    {id:2,to:"Mesa Flooring Co",subject:"Gold Plan Proposal — Mesa Flooring Co",time:"Yesterday",status:"Opened",preview:"Hi there,\n\nThanks for the great call yesterday! As discussed, here's the Gold plan breakdown for Mesa Flooring Co:\n\nGold Plan — $3,000/mo\n- 8 High-Definition Short-Form Videos per month\n- 4 x 2hr Video Shoot Sessions per month\n- Scriptwriting included\n- Camera Coaching sessions\n- Facebook Ad Management included\n- Scheduled Post Management (auto-posting, captions, hashtags, peak times)\n\nBased on our conversation, I think the Gold plan is the perfect fit. You'll get enough content to post 2x/week with professional production quality.\n\nWant to hop on a quick call to finalize?\n\nBest,\nCarlos V.\nMedia4You"},
    {id:3,to:"Sun Devil Gym",subject:"Content Strategy Ideas for Sun Devil Gym",time:"Mar 16",status:"Sent",preview:"Hey!\n\nI put together some content ideas based on what we discussed:\n\n1. Member Transformation Stories — before/after with their journey\n2. Workout of the Day Reels — quick, high-energy clips\n3. Coach Spotlight Series — introduce each trainer\n4. Community Events — capture the energy of group workouts\n5. Behind the Scenes — early morning gym setup, culture moments\n\nThese would all be shot as Instagram Reels and TikToks, optimized for maximum reach. We'd handle everything from scripting to posting.\n\nLet me know your thoughts!\n\nJade\nMedia4You"},
    {id:4,to:"Scottsdale Med Spa",subject:"Intro — Media4You Content Services",time:"Mar 15",status:"Opened",preview:"Hi there,\n\nI came across Scottsdale Med Spa and was really impressed with what you're building. I run the sales team at Media4You, a done-for-you content agency here in Arizona.\n\nWe specialize in short-form video for local businesses — scripting, filming, editing, and posting, all handled by our team. We currently work with dental offices, barbershops, real estate agents, and fitness studios across the Valley.\n\nI'd love to chat for 15 minutes about how we could help grow your social media presence. No pressure at all.\n\nWould any time this week work for a quick call?\n\nBest,\nCarlos V.\nMedia4You"},
  ];

  const tabs = [{key:"calls",label:"Calls",icon:"📞"},{key:"texts",label:"Texts",icon:"💬"},{key:"emails",label:"Emails",icon:"📧"}];

  if (textConvo !== null) {
    const t = textThreads[textConvo];
    return (
      <div>
      <PageTour steps={TOUR_STEPS.comms}/>
        <button className="btn back" onClick={()=>setTextConvo(null)}>← All Texts</button>
        <div style={{font:'600 16px var(--fd)',color:'var(--text)',marginBottom:4}}>{t.name}</div>
        <div style={{font:'400 12px var(--fb)',color:'var(--text3)',marginBottom:16}}>{t.phone}</div>
        <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:16}}>
          {t.messages.map((m,i)=>(
            <div key={i} style={{display:'flex',justifyContent:m.from==="me"?'flex-end':'flex-start'}}>
              <div style={{
                maxWidth:'75%',padding:'10px 14px',borderRadius:m.from==="me"?'16px 4px 16px 16px':'4px 16px 16px 16px',
                background:m.from==="me"?'linear-gradient(135deg,var(--accent),var(--accent2))':'var(--surface)',
                color:m.from==="me"?'white':'var(--text)',
                border:m.from==="me"?'none':'1px solid var(--border)',
                font:'400 13px var(--fb)',lineHeight:1.5,
                boxShadow:m.from==="me"?'0 4px 14px rgba(252,198,18,0.3)':'var(--shadow-sm)',
              }}>
                {m.text}
                <div style={{font:'400 9px var(--fb)',color:m.from==="me"?'rgba(255,255,255,0.7)':'var(--text3)',marginTop:4,textAlign:'right'}}>{m.time}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{display:'flex',gap:8}}>
          <input className="form-input" style={{flex:1,borderRadius:22,padding:'10px 16px'}} placeholder="Type a message..." value={textInput} onChange={e=>setTextInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&textInput.trim()){showToast("💬","Text sent",t.name);setTextInput("");}}}/>
          <button className="chat-send-btn" onClick={()=>{if(textInput.trim()){showToast("💬","Text sent",t.name);setTextInput("");}}}>→</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Comm Tabs */}
      <div style={{display:'flex',gap:4,marginBottom:16,borderBottom:'1px solid var(--border)'}}>
        {tabs.map(t=>(
          <button key={t.key} onClick={()=>setCommTab(t.key)} style={{
            padding:'10px 16px',border:'none',background:'none',cursor:'pointer',
            font:`${commTab===t.key?600:400} 12px var(--fd)`,
            color:commTab===t.key?'var(--accent)':'var(--text3)',
            borderBottom:commTab===t.key?'2px solid var(--accent)':'2px solid transparent',
          }}>{t.icon} {t.label}</button>
        ))}
      </div>

      {commTab==="calls" && (<>
        <div className="card">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
            <div className="card-title" style={{margin:0}}>Upcoming Calls</div>
          </div>
          {callData.map((c,i)=>(
            <div key={i}>
              <div className="call-item" style={{cursor:"pointer"}} onClick={()=>setExpandedItem(expandedItem===`call-${i}`?null:`call-${i}`)}>
                <div className="call-time-block"><div className="call-time">{c.time}</div><div className="call-day">{c.day}</div></div>
                <div className="row-main"><div className="row-title">{c.name}</div><div className="row-sub">{c.type} · {c.rep}</div></div>
                <div style={{display:"flex",flexDirection:"column",gap:4,alignItems:"flex-end"}}>
                  <Badge type={c.status==="Confirmed"?"green":"amber"}>{c.status}</Badge>
                  {joinedCalls[i]==="joined"?<button className="action-btn green" disabled>In Call</button>:joinedCalls[i]==="joining"?<button className="action-btn" disabled>Joining...</button>:<button className="action-btn accent" onClick={e=>{e.stopPropagation();handleJoin(i);}}>Join</button>}
                </div>
              </div>
              {expandedItem===`call-${i}` && (
                <div style={{padding:"8px 0 12px 66px",borderBottom:"1px solid var(--border)"}}>
                  <div style={{fontSize:11,color:"var(--text3)",textTransform:"uppercase",letterSpacing:"0.8px",fontWeight:600,marginBottom:4}}>Agenda</div>
                  <div style={{fontSize:12,color:"var(--text2)",lineHeight:1.5,marginBottom:10}}>{c.agenda}</div>
                  <div style={{fontSize:11,color:"var(--text3)",textTransform:"uppercase",letterSpacing:"0.8px",fontWeight:600,marginBottom:4}}>Prep Notes</div>
                  <div style={{fontSize:12,color:"var(--text2)",lineHeight:1.5,marginBottom:10}}>{c.notes}</div>
                  <div style={{display:'flex',gap:6}}>
                    <button className="btn primary" style={{flex:1,fontSize:11,padding:'8px 12px'}} onClick={()=>{handleJoin(i);showToast("◉","Connecting...",c.name);}}>Call Now</button>
                    <button className="btn" style={{fontSize:11,padding:'8px 12px'}} onClick={()=>{setCommTab("texts");showToast("💬","Opening texts",c.name);}}>Text</button>
                    <button className="btn" style={{fontSize:11,padding:'8px 12px'}} onClick={()=>{setComposeEmail(true);setEmailForm({to:c.name,subject:`Follow-up: ${c.type} Call`,body:""});setCommTab("emails");}}>Email</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-title">Call History</div>
          {callLog.map((c,i)=>(
            <div key={i} className="call-item" style={{cursor:'pointer'}} onClick={()=>setExpandedItem(expandedItem===`log-${i}`?null:`log-${i}`)}>
              <div className="call-time-block"><div className="call-time">{c.duration}</div><div className="call-day">{c.day}</div></div>
              <div className="row-main">
                <div className="row-title">{c.name}</div>
                <div className="row-sub">{c.type} · {c.rep}</div>
                {expandedItem===`log-${i}` && <div style={{font:'400 11px var(--fb)',color:'var(--text2)',marginTop:6,lineHeight:1.5}}>Outcome: {c.outcome}</div>}
              </div>
              <Badge type={c.status==="Won"?"green":"gray"}>{c.status}</Badge>
            </div>
          ))}
        </div>
      </>)}

      {commTab==="texts" && (<>
        <div className="card">
          <div className="card-title">Text Conversations</div>
          {textThreads.map((t,i)=>(
            <div key={t.id} className="row-item" style={{cursor:'pointer'}} onClick={()=>setTextConvo(i)}>
              <div className="row-avatar" style={{background:'var(--accent-dim)',color:'var(--accent)'}}>{t.name[0]}</div>
              <div className="row-main">
                <div className="row-title">{t.name}</div>
                <div className="row-sub" style={{overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{t.lastMsg}</div>
              </div>
              <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:4}}>
                <span style={{font:'400 10px var(--fb)',color:'var(--text3)'}}>{t.time}</span>
                {t.unread>0&&<div style={{background:'var(--accent)',color:'white',font:'700 9px var(--fd)',padding:'1px 6px',borderRadius:8}}>{t.unread}</div>}
              </div>
            </div>
          ))}
        </div>
      </>)}

      {commTab==="emails" && (<>
        <div style={{marginBottom:12}}>
          <button className="btn primary" onClick={()=>setComposeEmail(!composeEmail)}>{composeEmail?"Cancel":"+ Compose Email"}</button>
        </div>
        {composeEmail && (
          <div className="card" style={{marginBottom:12}}>
            <div className="card-title">New Email</div>
            <div className="form-group"><label className="form-label">To</label><input className="form-input" placeholder="Lead name or email" value={emailForm.to} onChange={e=>setEmailForm(p=>({...p,to:e.target.value}))}/></div>
            <div className="form-group"><label className="form-label">Subject</label><input className="form-input" placeholder="Subject line" value={emailForm.subject} onChange={e=>setEmailForm(p=>({...p,subject:e.target.value}))}/></div>
            <div className="form-group"><label className="form-label">Body</label><textarea className="form-textarea" style={{minHeight:120}} placeholder="Write your email..." value={emailForm.body} onChange={e=>setEmailForm(p=>({...p,body:e.target.value}))}/></div>
            <div style={{display:'flex',gap:8}}>
              <button className="btn primary" style={{flex:1}} onClick={()=>{setComposeEmail(false);showToast("📧","Email sent",emailForm.to);setEmailForm({to:"",subject:"",body:""});}}>Send Email</button>
              <button className="btn" onClick={()=>{showToast("●","AI Draft","Generating personalized email...");}}>✨ AI Write</button>
            </div>
          </div>
        )}
        <div className="card">
          <div className="card-title">Sent Emails</div>
          {emailLog.map(e=>(
            <div key={e.id} className="row-item" style={{cursor:'pointer'}} onClick={()=>setExpandedItem(expandedItem===`email-${e.id}`?null:`email-${e.id}`)}>
              <div style={{fontSize:16,flexShrink:0}}>{e.status==="Opened"?"📬":"📧"}</div>
              <div className="row-main">
                <div className="row-title">{e.subject}</div>
                <div className="row-sub">To: {e.to} · {e.time}</div>
                {expandedItem===`email-${e.id}` && (
                  <div style={{font:'400 12px var(--fb)',color:'var(--text2)',marginTop:8,lineHeight:1.7,padding:'14px 16px',background:'var(--surface2)',borderRadius:10,border:'1px solid var(--border)',whiteSpace:'pre-wrap'}}>{e.preview}</div>
                )}
              </div>
              <Badge type={e.status==="Opened"?"green":"gray"}>{e.status}</Badge>
            </div>
          ))}
        </div>
      </>)}
    </div>
  );
}

// ─── LEAD FINDER ─────────────────────────────────────────────────────────────
function LeadFinder({ onAddLead, showToast, onOpenOutreach }) {
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [filter, setFilter] = useState("all");
  const [addedIds, setAddedIds] = useState({});
  const [expandedId, setExpandedId] = useState(null);

  const prospects = [
    {id:1,name:"Chandler Chiropractic",industry:"Healthcare",location:"Chandler, AZ",ig:"@chandlerchiro",followers:340,lastPost:"6 weeks ago",website:true,googleBiz:true,score:92,issues:["No video content","Last IG post 6 weeks ago","No TikTok presence","Google listing has no photos"]},
    {id:2,name:"Prestige Auto Spa",industry:"Auto Detailing",location:"Scottsdale, AZ",ig:"—",followers:0,lastPost:"Never",website:true,googleBiz:true,score:96,issues:["No Instagram account","No social media at all","5-star Google reviews but no content","High-ticket service perfect for video"]},
    {id:3,name:"Roots Kitchen & Bar",industry:"Restaurant",location:"Tempe, AZ",ig:"@rootskitchenaz",followers:820,lastPost:"3 weeks ago",website:true,googleBiz:true,score:78,issues:["Low posting frequency","No Reels or video content","Good food photography potential","Active Google reviews"]},
    {id:4,name:"AZ Smile Dental",industry:"Dental",location:"Mesa, AZ",ig:"@azsmile_dental",followers:180,lastPost:"2 months ago",website:true,googleBiz:false,score:88,issues:["Almost no social activity","Before/after potential is huge","Competitors are posting weekly","No Google Business listing"]},
    {id:5,name:"Peak Performance PT",industry:"Physical Therapy",location:"Scottsdale, AZ",ig:"@peakpt_az",followers:520,lastPost:"1 week ago",website:true,googleBiz:true,score:65,issues:["Posts but no video","All static images","Transformation stories would crush","Has a following to build on"]},
    {id:6,name:"Desert Bloom Florist",industry:"Florist",location:"Phoenix, AZ",ig:"—",followers:0,lastPost:"Never",website:false,googleBiz:true,score:94,issues:["No website","No social media","Visual product perfect for IG/TikTok","Competitor florists are growing fast"]},
    {id:7,name:"Iron Temple Gym",industry:"Gym/Fitness",location:"Gilbert, AZ",ig:"@irontemple_az",followers:1200,lastPost:"4 days ago",website:true,googleBiz:true,score:52,issues:["Posts regularly but low engagement","No professional video content","Member transformation potential","Could 3x engagement with Reels"]},
    {id:8,name:"Valley View Law",industry:"Law Firm",location:"Phoenix, AZ",ig:"—",followers:0,lastPost:"Never",website:true,googleBiz:true,score:90,issues:["No social presence at all","Every competitor has Instagram","Educational content would build trust","High-value client acquisition"]},
  ];

  const filtered = filter==="all" ? prospects : prospects.filter(p=>p.industry.toLowerCase()===filter.toLowerCase());
  const scoreColor = (s) => s >= 85 ? "var(--red)" : s >= 65 ? "var(--amber)" : "var(--green)";
  const scoreLabel = (s) => s >= 85 ? "Hot" : s >= 65 ? "Warm" : "Cool";

  const startScan = () => {
    setScanning(true);
    setTimeout(()=>{setScanning(false);setScanned(true);},2500);
  };

  const glass = {
    background:'rgba(255,255,255,0.6)',backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)',
    border:'1px solid rgba(255,255,255,0.65)',borderRadius:18,
    boxShadow:'0 4px 24px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
  };

  return (
    <div>
      <PageTour steps={TOUR_STEPS.finder}/>
      <div style={{...glass,padding:'28px 32px',marginBottom:24,background:'linear-gradient(135deg, rgba(255,255,255,0.75) 0%, rgba(252,198,18,0.08) 100%)',borderLeft:'3px solid var(--accent)',animation:'dashFadeInUp 0.5s cubic-bezier(0.16,1,0.3,1) both'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:16}}>
          <div>
            <h1 style={{font:'600 22px var(--fd)',color:'var(--text)',marginBottom:4}}>Lead Finder</h1>
            <p style={{font:'400 13px var(--fb)',color:'var(--text2)',margin:0}}>Discover Arizona businesses that need your services</p>
          </div>
          {!scanning && <button className="top-action-btn" onClick={startScan}>{scanned?"Scan Again":"Scan Arizona Businesses"}</button>}
        </div>
      </div>

      {!scanned && !scanning && (
        <div style={{textAlign:'center',padding:60}}>
          <div style={{font:'600 40px var(--fd)',color:'var(--text3)',marginBottom:12,opacity:0.4}}>◇</div>
          <div style={{font:'500 16px var(--fd)',color:'var(--text2)',marginBottom:8}}>Find businesses that need content</div>
          <div style={{font:'400 13px var(--fb)',color:'var(--text3)',maxWidth:400,margin:'0 auto',lineHeight:1.6}}>We scan Google Maps, Instagram, TikTok, and business directories to find Arizona businesses with weak or no social media presence.</div>
        </div>
      )}

      {scanning && (
        <div style={{textAlign:'center',padding:40}}>
          <div className="ai-spinner" style={{width:32,height:32,margin:'0 auto 16px',borderWidth:3}}/>
          <div style={{font:'500 14px var(--fd)',color:'var(--accent)',marginBottom:4}}>Scanning Arizona businesses...</div>
          <div style={{font:'400 12px var(--fb)',color:'var(--text3)'}}>Checking Google Maps, Instagram, TikTok, and websites</div>
        </div>
      )}

      {scanned && !scanning && (<>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))',gap:12,marginBottom:20}}>
          <div className="dash-card-hover" style={{...glass,padding:'18px 16px'}}><div style={{font:'500 10px var(--fd)',textTransform:'uppercase',letterSpacing:1.2,color:'var(--text3)',marginBottom:6}}>Found</div><div style={{font:'600 28px var(--fd)',color:'var(--text)'}}>{prospects.length}</div></div>
          <div className="dash-card-hover" style={{...glass,padding:'18px 16px'}}><div style={{font:'500 10px var(--fd)',textTransform:'uppercase',letterSpacing:1.2,color:'var(--text3)',marginBottom:6}}>Hot Leads</div><div style={{font:'600 28px var(--fd)',color:'var(--red)'}}>{prospects.filter(p=>p.score>=85).length}</div></div>
          <div className="dash-card-hover" style={{...glass,padding:'18px 16px'}}><div style={{font:'500 10px var(--fd)',textTransform:'uppercase',letterSpacing:1.2,color:'var(--text3)',marginBottom:6}}>No IG</div><div style={{font:'600 28px var(--fd)',color:'var(--amber)'}}>{prospects.filter(p=>p.followers===0).length}</div></div>
        </div>

        <div style={{display:'flex',gap:6,marginBottom:16,flexWrap:'wrap'}}>
          {["all","Healthcare","Auto Detailing","Restaurant","Dental","Gym/Fitness","Law Firm"].map(f=>(
            <button key={f} className={`action-btn ${filter===f?"accent":""}`} onClick={()=>setFilter(f)} style={{textTransform:'capitalize'}}>{f}</button>
          ))}
        </div>

        <div style={{...glass,overflow:'hidden'}}>
          <div style={{padding:'18px 22px',borderBottom:'1px solid rgba(0,0,0,0.04)'}}>
            <span style={{font:'600 15px var(--fd)',color:'var(--text)'}}>Prospects</span>
          </div>
          {filtered.map((p,idx)=>(
            <div key={p.id} className="dash-card-hover" style={{
              margin:'6px 10px',padding:'16px 18px',borderRadius:14,
              background:addedIds[p.id]?'rgba(45,154,106,0.04)':'rgba(255,255,255,0.4)',
              border:addedIds[p.id]?'1px solid rgba(45,154,106,0.15)':'1px solid rgba(0,0,0,0.02)',
              cursor:'pointer',animation:`dashFadeInUp 0.3s cubic-bezier(0.16,1,0.3,1) ${idx*40}ms backwards`,
            }} onClick={()=>setExpandedId(expandedId===p.id?null:p.id)}>
              <div style={{display:'flex',alignItems:'center',gap:14}}>
                {/* Score circle */}
                <div style={{width:48,height:48,borderRadius:'50%',border:`3px solid ${scoreColor(p.score)}`,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  <div style={{font:'700 16px var(--fd)',color:scoreColor(p.score),lineHeight:1}}>{p.score}</div>
                  <div style={{font:'600 7px var(--fd)',color:scoreColor(p.score),textTransform:'uppercase'}}>{scoreLabel(p.score)}</div>
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{font:'600 14px var(--fd)',color:'var(--text)'}}>{p.name}</div>
                  <div style={{font:'400 11px var(--fb)',color:'var(--text2)',marginTop:2}}>{p.industry} · {p.location}</div>
                  <div style={{display:'flex',gap:6,marginTop:4,flexWrap:'wrap'}}>
                    {p.followers===0 ? <Badge type="red">No Instagram</Badge> : <Badge type="gray">{p.followers} followers</Badge>}
                    {p.lastPost==="Never" ? <Badge type="red">No posts</Badge> : <Badge type="amber">Last: {p.lastPost}</Badge>}
                  </div>
                </div>
                <div style={{flexShrink:0}}>
                  {addedIds[p.id] ? <Badge type="green">Added</Badge> : <span style={{color:'var(--text3)',fontSize:14}}>›</span>}
                </div>
              </div>

              {expandedId===p.id && (
                <div style={{marginTop:14,paddingTop:14,borderTop:'1px solid var(--border)'}}>
                  <div style={{font:'600 10px var(--fd)',textTransform:'uppercase',letterSpacing:0.8,color:'var(--text3)',marginBottom:8}}>Why they need Media4You</div>
                  {p.issues.map((issue,i)=>(
                    <div key={i} style={{display:'flex',alignItems:'center',gap:8,padding:'4px 0',font:'400 12px var(--fb)',color:'var(--text2)'}}>
                      <span style={{color:'var(--red)',fontSize:10}}>●</span>{issue}
                    </div>
                  ))}
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginTop:12}}>
                    <div style={{padding:'8px 10px',background:'var(--surface2)',borderRadius:8,border:'1px solid var(--border)'}}>
                      <div style={{font:'400 9px var(--fd)',color:'var(--text3)',textTransform:'uppercase',marginBottom:2}}>Instagram</div>
                      <div style={{font:'500 12px var(--fb)',color:'var(--text)'}}>{p.ig}</div>
                    </div>
                    <div style={{padding:'8px 10px',background:'var(--surface2)',borderRadius:8,border:'1px solid var(--border)'}}>
                      <div style={{font:'400 9px var(--fd)',color:'var(--text3)',textTransform:'uppercase',marginBottom:2}}>Website</div>
                      <div style={{font:'500 12px var(--fb)',color:p.website?'var(--green)':'var(--red)'}}>{p.website?"Has website":"No website"}</div>
                    </div>
                  </div>
                  {!addedIds[p.id] && (
                    <div style={{display:'flex',gap:8,marginTop:12}}>
                      <button className="btn primary" style={{flex:1}} onClick={(e)=>{e.stopPropagation();setAddedIds(prev=>({...prev,[p.id]:true}));onAddLead({id:Date.now(),name:p.name,industry:p.industry,value:`$${p.score>=85?3000:1500}/mo`,source:"Lead Finder",rep:"Carlos"});showToast("✓","Added to pipeline",p.name);fireConfetti();}}>Add to Pipeline</button>
                      <button className="btn" style={{flex:1}} onClick={(e)=>{e.stopPropagation();if(onOpenOutreach)onOpenOutreach();}}>Draft Outreach</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </>)}
    </div>
  );
}

// ─── SALES LEADS LIST ──────────────────────────────────────────────────────
function SalesLeadsList({ leads, showToast, onOpenComms }) {
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
      {selectedLead && <LeadDetailSheet lead={selectedLead} stage={selectedStage} onClose={()=>setSelectedLead(null)} showToast={showToast} onOpenComms={onOpenComms}/>}
    </div>
  );
}

// ─── SCRIPT VIEWS ─────────────────────────────────────────────────────────────
function ScriptQueue({ scripts, onSelect, onOpenIdeas, onOpenCalendar, clients, showToast }) {
  const [clientFilter, setClientFilter] = useState("all");
  const clientNames = [...new Set(scripts.map(s=>s.client))];
  const filtered = clientFilter==="all" ? scripts : scripts.filter(s=>s.client===clientFilter);
  return (
    <div>
      <PageTour steps={TOUR_STEPS.scriptQueue}/>
      <div className="stats-grid" style={{marginBottom:12}}>
        <div className="stat-card"><div className="stat-label">In Queue</div><div className="stat-value">{scripts.length}</div><div className="stat-sub">2 due this week</div></div>
        <div className="stat-card"><div className="stat-label">Urgent</div><div className="stat-value">{scripts.filter(s=>s.priority==="high").length}</div><div className="stat-sub">High priority</div></div>
      </div>
      {onOpenIdeas && clients && (
        <div className="card" style={{background:"linear-gradient(135deg,rgba(255,92,0,0.08),rgba(253,128,64,0.06))",borderColor:"rgba(255,92,0,0.3)",marginBottom:12}}>
          <div style={{fontFamily:"var(--fd)",fontSize:12,fontWeight:700,color:"var(--accent)",marginBottom:10,textTransform:"uppercase",letterSpacing:"1px"}}>✨ AI Tools</div>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            {clients.filter(c=>c.status==="active").map(c=>(
              <button key={c.id} className="action-btn accent" onClick={()=>onOpenIdeas(c)} style={{fontSize:11}}>💡 {c.name}</button>
            ))}
          </div>
          {/* Calendar removed — scriptwriter focuses on scripts only */}
        </div>
      )}
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
              <StatusBadge status={s.status} options={["Assigned","In Progress","Needs Revision","Submitted"]} onChange={(st)=>showToast("✓","Status",s.client+" → "+st)}/>
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
      showToast("●","Script generated","Review and edit as needed");
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
          <button className="btn primary" onClick={()=>{onUpdate(script.id,"Submitted",text);showToast("✓","Submitted","Script sent to production");onBack();}}>Submit →</button>
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
function EditorProduction({ videos, onAdvance, showToast }) {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [editNotes, setEditNotes] = useState({});
  const [activeTimer, setActiveTimer] = useState(null);
  const [timerSeconds, setTimerSeconds] = useState(0);

  // Edit timer
  useEffect(()=>{
    if(activeTimer!==null){const i=setInterval(()=>setTimerSeconds(s=>s+1),1000);return()=>clearInterval(i);}
  },[activeTimer]);
  const formatTime=(s)=>`${Math.floor(s/3600).toString().padStart(2,"0")}:${Math.floor((s%3600)/60).toString().padStart(2,"0")}:${(s%60).toString().padStart(2,"0")}`;

  const rawCount = videos.filter(v=>v.status==="Raw Footage").length;
  const editingCount = videos.filter(v=>v.status==="Editing").length;
  const reviewCount = videos.filter(v=>v.status==="Review").length;
  const doneCount = videos.filter(v=>v.status==="Approved"||v.status==="Scheduled"||v.status==="Published").length;

  const editSpecs = {
    "Patient Transformation #4":{resolution:"4K 3840x2160",fps:"30fps",codec:"H.264",duration:"0:47",fileSize:"842 MB",colorProfile:"Rec. 709"},
    "Listing @ 4821 Cactus Rd":{resolution:"4K 3840x2160",fps:"24fps",codec:"H.265",duration:"1:12",fileSize:"1.2 GB",colorProfile:"S-Log3"},
    "Black Tesla Model S Detail":{resolution:"4K 3840x2160",fps:"60fps",codec:"H.264",duration:"2:34",fileSize:"2.8 GB",colorProfile:"Rec. 709"},
    "Saturday Vibes — March":{resolution:"1080p 1920x1080",fps:"30fps",codec:"H.264",duration:"0:52",fileSize:"380 MB",colorProfile:"Standard"},
    "Open Workout 25.2 Recap":{resolution:"4K 3840x2160",fps:"60fps",codec:"H.265",duration:"1:28",fileSize:"1.6 GB",colorProfile:"HLG"},
  };

  const glass = {
    background:'rgba(255,255,255,0.6)',backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)',
    border:'1px solid rgba(255,255,255,0.65)',borderRadius:18,
    boxShadow:'0 4px 24px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
  };

  return (
    <div>
      <PageTour steps={TOUR_STEPS.editor}/>
      {/* Active Edit Timer */}
      {activeTimer!==null && (
        <div style={{...glass,padding:'16px 22px',marginBottom:16,background:'linear-gradient(135deg,rgba(45,154,106,0.08),rgba(45,154,106,0.04))',borderLeft:'3px solid var(--green)',display:'flex',alignItems:'center',gap:14}}>
          <div style={{width:10,height:10,borderRadius:'50%',background:'var(--green)',animation:'dashPulseGlow 2s infinite'}}/>
          <div style={{flex:1}}>
            <div style={{font:'600 13px var(--fd)',color:'var(--text)'}}>Editing: {videos[activeTimer]?.title}</div>
            <div style={{font:'400 11px var(--fb)',color:'var(--text2)'}}>{videos[activeTimer]?.client}</div>
          </div>
          <div style={{font:'600 20px monospace',color:'var(--green)',letterSpacing:1}}>{formatTime(timerSeconds)}</div>
          <button className="btn" style={{padding:'6px 14px',fontSize:11}} onClick={()=>{showToast("◉","Session saved",formatTime(timerSeconds)+" logged");setActiveTimer(null);setTimerSeconds(0);}}>Stop</button>
        </div>
      )}

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(140px, 1fr))',gap:12,marginBottom:20}}>
        {[{label:"Raw Footage",val:rawCount,color:"var(--text3)"},{label:"Editing",val:editingCount,color:"var(--blue)"},{label:"In Review",val:reviewCount,color:"var(--amber)"},{label:"Completed",val:doneCount,color:"var(--green)"}].map((s,i)=>(
          <div key={s.label} className="dash-card-hover" style={{...glass,padding:'16px 14px',animation:`dashFadeInUp 0.5s cubic-bezier(0.16,1,0.3,1) ${i*60}ms backwards`}}>
            <div style={{font:'500 9px var(--fd)',textTransform:'uppercase',letterSpacing:1,color:'var(--text3)',marginBottom:4}}>{s.label}</div>
            <div style={{font:'600 26px var(--fd)',color:s.color}}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Production Queue */}
      <div style={{...glass,overflow:'hidden',animation:'dashFadeInUp 0.5s cubic-bezier(0.16,1,0.3,1) 250ms backwards'}}>
        <div style={{padding:'18px 22px',borderBottom:'1px solid rgba(0,0,0,0.04)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <span style={{font:'600 15px var(--fd)',color:'var(--text)'}}>Production Queue</span>
          <span style={{font:'400 11px var(--fb)',color:'var(--text3)'}}>{videos.length} videos</span>
        </div>
        {videos.map((v,idx)=>{
          const specs = editSpecs[v.title]||{resolution:"1080p",fps:"30fps",codec:"H.264",duration:"—",fileSize:"—",colorProfile:"Standard"};
          return (
          <div key={v.id}>
            <div className="dash-card-hover" style={{
              margin:'6px 10px',padding:'16px 18px',borderRadius:14,
              background:v.status==="Editing"?'rgba(59,125,216,0.04)':'rgba(255,255,255,0.4)',
              border:v.status==="Editing"?'1px solid rgba(59,125,216,0.15)':'1px solid rgba(0,0,0,0.02)',
              cursor:'pointer',
            }} onClick={()=>setSelectedVideo(selectedVideo===v.id?null:v.id)}>
              <div style={{display:'flex',alignItems:'center',gap:14}}>
                <div style={{width:52,height:38,borderRadius:8,background:'var(--surface3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,flexShrink:0,border:'1px solid var(--border)'}}>
                  {v.thumb}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{font:'500 14px var(--fd)',color:'var(--text)'}}>{v.title}</div>
                  <div style={{font:'400 11px var(--fb)',color:'var(--text2)',marginTop:2}}>{v.client} · Due {v.due}</div>
                </div>
                <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:4,flexShrink:0}}>
                  <Badge type={VID_STATUS_COLOR[v.status]||"gray"}>{v.status}</Badge>
                  <span style={{font:'400 10px monospace',color:'var(--text3)'}}>{specs.resolution.split(" ")[0]}</span>
                </div>
              </div>
            </div>

            {selectedVideo===v.id && (
              <div style={{margin:'0 10px 6px',padding:'16px 18px',background:'var(--surface2)',borderRadius:'0 0 14px 14px',border:'1px solid var(--border)',borderTop:'none'}}>
                {/* File Specs */}
                <div style={{font:'600 10px var(--fd)',textTransform:'uppercase',letterSpacing:0.8,color:'var(--text3)',marginBottom:8}}>File Specifications</div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,marginBottom:14}}>
                  {[{l:"Resolution",v:specs.resolution},{l:"Frame Rate",v:specs.fps},{l:"Codec",v:specs.codec},{l:"Duration",v:specs.duration},{l:"File Size",v:specs.fileSize},{l:"Color",v:specs.colorProfile}].map(s=>(
                    <div key={s.l} style={{padding:'8px 10px',background:'rgba(255,255,255,0.6)',borderRadius:8,border:'1px solid var(--border)'}}>
                      <div style={{font:'400 9px var(--fd)',color:'var(--text3)',textTransform:'uppercase',letterSpacing:0.5,marginBottom:2}}>{s.l}</div>
                      <div style={{font:'500 12px var(--fb)',color:'var(--text)'}}>{s.v}</div>
                    </div>
                  ))}
                </div>

                {/* Edit Checklist */}
                <div style={{font:'600 10px var(--fd)',textTransform:'uppercase',letterSpacing:0.8,color:'var(--text3)',marginBottom:8}}>Edit Checklist</div>
                <div style={{marginBottom:14}}>
                  {["Color grade / correction","Audio levels & music sync","Text overlays & lower thirds","Transitions & pacing","Thumbnail frame selected","Export 1080p vertical (9:16)"].map((task,i)=>(
                    <label key={i} style={{display:'flex',alignItems:'center',gap:8,padding:'5px 0',font:'400 12px var(--fb)',color:'var(--text)',cursor:'pointer'}}>
                      <input type="checkbox" style={{accentColor:'var(--accent)',width:16,height:16}}/>
                      {task}
                    </label>
                  ))}
                </div>

                {/* Editor Notes */}
                <div style={{font:'600 10px var(--fd)',textTransform:'uppercase',letterSpacing:0.8,color:'var(--text3)',marginBottom:6}}>Editor Notes</div>
                <textarea className="form-textarea" style={{minHeight:60,marginBottom:12}} placeholder="Add edit notes, timestamps, revision details..." value={editNotes[v.id]||""} onChange={e=>setEditNotes(p=>({...p,[v.id]:e.target.value}))}/>

                {/* Actions */}
                <div style={{display:'flex',gap:8}}>
                  {v.status==="Raw Footage" && (
                    <button className="btn primary" style={{flex:1}} onClick={()=>{onAdvance(v.id);setActiveTimer(idx);setTimerSeconds(0);showToast("▶","Editing started",v.title);setSelectedVideo(null);}}>Start Editing</button>
                  )}
                  {v.status==="Editing" && (
                    <button className="btn primary" style={{flex:1}} onClick={()=>{onAdvance(v.id);showToast("◉","Sent to review",v.title);setSelectedVideo(null);if(activeTimer===idx){setActiveTimer(null);setTimerSeconds(0);}}}>Send to Review</button>
                  )}
                  {v.status==="Review" && (
                    <button className="btn success" style={{flex:1}} onClick={()=>{onAdvance(v.id);showToast("✓","Approved",v.title);setSelectedVideo(null);fireConfetti();}}>Mark Approved</button>
                  )}
                  {v.status==="Approved" && (
                    <button className="btn" style={{flex:1,opacity:0.6}} disabled>Ready for scheduling</button>
                  )}
                  <button className="btn" onClick={()=>showToast("◉","Re-export","Queuing 1080p re-export...")}>Re-export</button>
                </div>
                <CommentThread itemId={`video-${v.id}`} showToast={showToast}/>
              </div>
            )}
          </div>
        );})}
      </div>
    </div>
  );
}

function EditorCompleted({ videos }) {
  const done = videos.filter(v=>v.status==="Scheduled");
  if(!done.length) return <div className="empty"><div className="empty-icon">🎬</div><div className="empty-title">Nothing published yet</div></div>;
  return <div className="card"><div className="card-title">Scheduled ({done.length})</div>{done.map(v=><div className="video-item" key={v.id}><div className="video-thumb">{v.thumb}</div><div className="video-info"><div className="video-title">{v.title}</div><div className="video-meta">{v.client}</div></div><Badge type="purple">Scheduled</Badge></div>)}</div>;
}

// ─── CLIENT VIEWS ─────────────────────────────────────────────────────────────
// ─── CLIENT REPORT GENERATOR ─────────────────────────────────────────────────
function ClientReportGenerator({ clients, showToast }) {
  const [selectedClient, setSelectedClient] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(null);

  const generateReport = (client) => {
    setGenerating(true);
    setSelectedClient(client);
    setTimeout(()=>{
      setGenerating(false);
      setGenerated(client);
    },2000);
  };

  const glass = {background:'rgba(255,255,255,0.6)',backdropFilter:'blur(20px)',border:'1px solid rgba(255,255,255,0.65)',borderRadius:18,boxShadow:'0 4px 24px rgba(0,0,0,0.04)'};

  if (generated) {
    const c = generated;
    const m = c.metrics||{followers:0,gained:0,avgViews:0,avgLikes:0,engRate:0,topPost:"—"};
    const planInfo = PLAN_DETAILS[c.plan]||PLAN_DETAILS.Copper;
    const adCamps = AD_CAMPAIGNS.filter(a=>a.client===c.name);
    const adSpend = adCamps.reduce((s,a)=>s+a.budget,0);
    const adConversions = adCamps.reduce((s,a)=>s+a.conversions,0);

    return (
      <div>
      <PageTour steps={TOUR_STEPS.reports}/>
        <button className="btn back" onClick={()=>{setGenerated(null);setSelectedClient(null);}}>← All Clients</button>

        {/* Report Header */}
        <div style={{...glass,padding:'32px',marginBottom:24,background:'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(252,198,18,0.06) 100%)',borderLeft:'3px solid var(--accent)'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:16}}>
            <div>
              <div style={{font:'500 10px var(--fd)',textTransform:'uppercase',letterSpacing:1.5,color:'var(--accent)',marginBottom:8}}>Monthly Performance Report</div>
              <h1 style={{font:'700 28px var(--fd)',color:'var(--text)',marginBottom:4}}>{c.name}</h1>
              <p style={{font:'400 14px var(--fb)',color:'var(--text2)',margin:0}}>March 2025 · {c.plan} Plan</p>
            </div>
            <div style={{display:'flex',gap:8}}>
              <button className="btn" onClick={()=>{showToast("✓","Downloaded","PDF report saved");fireConfetti();}}>Download PDF</button>
              <button className="btn" onClick={()=>showToast("✓","Shared","Report link copied to clipboard")}>Share Link</button>
              <button className="btn" onClick={()=>showToast("✓","Sent","Report emailed to client")}>Email to Client</button>
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))',gap:14,marginBottom:24}}>
          {[
            {label:"Videos Delivered",value:c.videos,sub:`of ${planInfo.videos} included`,color:"var(--text)"},
            {label:"Followers Gained",value:`+${m.gained}`,sub:`Total: ${m.followers.toLocaleString()}`,color:"var(--green)"},
            {label:"Avg Views / Video",value:m.avgViews.toLocaleString(),sub:"Across all platforms",color:"var(--blue)"},
            {label:"Engagement Rate",value:`${m.engRate}%`,sub:m.engRate>5?"Above average":"Average",color:m.engRate>5?"var(--green)":"var(--amber)"},
            {label:"Ad Spend",value:`$${adSpend.toLocaleString()}`,sub:`${adCamps.length} campaigns`,color:"var(--text)"},
            {label:"Ad Conversions",value:adConversions,sub:adSpend>0?`$${Math.round(adSpend/Math.max(adConversions,1))} per conversion`:"No ads",color:"var(--green)"},
          ].map((k,i)=>(
            <div key={k.label} className="dash-card-hover" style={{...glass,padding:'22px 20px',animation:`dashFadeInUp 0.5s cubic-bezier(0.16,1,0.3,1) ${i*60}ms backwards`}}>
              <div style={{font:'500 10px var(--fd)',textTransform:'uppercase',letterSpacing:1.2,color:'var(--text3)',marginBottom:8}}>{k.label}</div>
              <div style={{font:'600 28px var(--fd)',color:k.color,letterSpacing:'-0.5px'}}>{k.value}</div>
              <div style={{font:'400 11px var(--fb)',color:'var(--text2)',marginTop:4}}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Content Summary */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20,marginBottom:24}}>
          <div style={{...glass,padding:'22px'}}>
            <div style={{font:'600 15px var(--fd)',color:'var(--text)',marginBottom:14}}>Content Delivered</div>
            {[
              {item:`${c.videos} HD short-form videos`,done:true},
              {item:`${planInfo.shoots} shoot sessions`,done:true},
              {item:"Scriptwriting for all videos",done:planInfo.scriptwriting},
              {item:"Scheduled posting + captions",done:true},
              {item:"Facebook Ad management",done:planInfo.fbAds},
              {item:"Google Ad management",done:planInfo.googleAds},
              {item:"Camera coaching session",done:planInfo.coaching},
              {item:"Monthly strategy call",done:planInfo.strategy},
            ].filter(i=>i.done).map((item,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:8,padding:'5px 0',font:'400 12px var(--fb)',color:'var(--text)'}}>
                <span style={{color:'var(--green)',fontSize:12}}>✓</span>{item.item}
              </div>
            ))}
          </div>
          <div style={{...glass,padding:'22px'}}>
            <div style={{font:'600 15px var(--fd)',color:'var(--text)',marginBottom:14}}>Top Performing Content</div>
            <div style={{padding:'16px',background:'var(--surface2)',borderRadius:12,border:'1px solid var(--border)',textAlign:'center',marginBottom:12}}>
              <div style={{font:'600 14px var(--fd)',color:'var(--text)',marginBottom:4}}>{m.topPost}</div>
              <div style={{font:'400 11px var(--fb)',color:'var(--text3)'}}>Highest engagement this month</div>
            </div>
            <div style={{font:'600 15px var(--fd)',color:'var(--text)',marginBottom:10,marginTop:16}}>Platform Breakdown</div>
            {["Instagram","TikTok","Facebook"].map(p=>(
              <div key={p} style={{display:'flex',alignItems:'center',gap:10,padding:'6px 0'}}>
                <div style={{flex:1}}><div style={{font:'500 12px var(--fb)',color:'var(--text)'}}>{p}</div></div>
                <Badge type={p==="Instagram"?"purple":p==="TikTok"?"blue":"blue"}>{p==="Instagram"?"Primary":p==="TikTok"?"Growing":"Active"}</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* ROI Summary */}
        <div style={{...glass,padding:'24px',marginBottom:24}}>
          <div style={{font:'600 15px var(--fd)',color:'var(--text)',marginBottom:14}}>Return on Investment</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:16}}>
            <div style={{textAlign:'center',padding:'16px',background:'rgba(45,154,106,0.06)',borderRadius:12,border:'1px solid rgba(45,154,106,0.15)'}}>
              <div style={{font:'600 24px var(--fd)',color:'var(--green)'}}>{m.gained>0?Math.round(c.mrr/m.gained):"—"}</div>
              <div style={{font:'400 11px var(--fb)',color:'var(--text3)',marginTop:4}}>Cost per follower</div>
            </div>
            <div style={{textAlign:'center',padding:'16px',background:'rgba(45,154,106,0.06)',borderRadius:12,border:'1px solid rgba(45,154,106,0.15)'}}>
              <div style={{font:'600 24px var(--fd)',color:'var(--green)'}}>{(m.avgViews*c.videos).toLocaleString()}</div>
              <div style={{font:'400 11px var(--fb)',color:'var(--text3)',marginTop:4}}>Total estimated views</div>
            </div>
            <div style={{textAlign:'center',padding:'16px',background:'rgba(45,154,106,0.06)',borderRadius:12,border:'1px solid rgba(45,154,106,0.15)'}}>
              <div style={{font:'600 24px var(--fd)',color:'var(--green)'}}>Strong</div>
              <div style={{font:'400 11px var(--fb)',color:'var(--text3)',marginTop:4}}>Overall ROI score</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{...glass,padding:'28px 32px',marginBottom:24,background:'linear-gradient(135deg, rgba(255,255,255,0.75) 0%, rgba(252,198,18,0.08) 100%)',borderLeft:'3px solid var(--accent)',animation:'dashFadeInUp 0.5s cubic-bezier(0.16,1,0.3,1) both'}}>
        <h1 style={{font:'600 22px var(--fd)',color:'var(--text)',marginBottom:4}}>Client Reports</h1>
        <p style={{font:'400 13px var(--fb)',color:'var(--text2)',margin:0}}>Generate monthly performance reports for clients</p>
      </div>
      {generating && (
        <div style={{textAlign:'center',padding:40}}>
          <div className="ai-spinner" style={{width:32,height:32,margin:'0 auto 16px',borderWidth:3}}/>
          <div style={{font:'500 14px var(--fd)',color:'var(--accent)',marginBottom:4}}>Generating report for {selectedClient?.name}...</div>
          <div style={{font:'400 12px var(--fb)',color:'var(--text3)'}}>Pulling analytics, content stats, and ROI data</div>
        </div>
      )}
      {!generating && (
        <div style={{...glass,overflow:'hidden'}}>
          <div style={{padding:'18px 22px',borderBottom:'1px solid rgba(0,0,0,0.04)'}}><span style={{font:'600 15px var(--fd)',color:'var(--text)'}}>Select a Client</span></div>
          {clients.filter(c=>c.status==="active"&&c.metrics?.followers>0).map((c,idx)=>(
            <div key={c.id} className="dash-card-hover" style={{margin:'6px 10px',padding:'16px 18px',borderRadius:14,background:'rgba(255,255,255,0.4)',border:'1px solid rgba(0,0,0,0.02)',cursor:'pointer',animation:`dashFadeInUp 0.3s ease ${idx*40}ms backwards`}} onClick={()=>generateReport(c)}>
              <div style={{display:'flex',alignItems:'center',gap:14}}>
                <div style={{width:40,height:40,borderRadius:10,background:`${c.color}15`,display:'flex',alignItems:'center',justifyContent:'center',font:'600 15px var(--fd)',color:c.color}}>{c.name[0]}</div>
                <div style={{flex:1}}>
                  <div style={{font:'500 14px var(--fd)',color:'var(--text)'}}>{c.name}</div>
                  <div style={{font:'400 11px var(--fb)',color:'var(--text2)'}}>{c.plan} Plan · {c.videos} videos · {c.metrics?.followers.toLocaleString()} followers</div>
                </div>
                <button className="top-action-btn" style={{fontSize:10,padding:'0 12px',height:28}}>Generate Report</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── CONTENT LIBRARY ─────────────────────────────────────────────────────────
function ContentLibrary({ showToast }) {
  const [filter, setFilter] = useState("all");
  const [selectedAsset, setSelectedAsset] = useState(null);
  const assets = [
    {id:1,name:"Frost Barbershop — Spring Lineup",client:"Frost Barbershop",type:"Video",format:"MP4 · 1080p",size:"380 MB",date:"Mar 15",status:"Published",platform:"Instagram + TikTok",duration:"0:47"},
    {id:2,name:"Desert Sun — 4821 Cactus Rd Tour",client:"Desert Sun Realty",type:"Video",format:"MP4 · 4K",size:"1.2 GB",date:"Mar 12",status:"Published",platform:"Instagram",duration:"1:12"},
    {id:3,name:"Sky Harbor — Whitening Before/After",client:"Sky Harbor Dental",type:"Video",format:"MP4 · 4K",size:"842 MB",date:"Mar 10",status:"Published",platform:"Instagram + TikTok",duration:"0:52"},
    {id:4,name:"Mesa Auto — Tesla Detail Process",client:"Mesa Auto Detailing",type:"Video",format:"MP4 · 4K",size:"2.8 GB",date:"Mar 8",status:"In Edit",platform:"—",duration:"2:34"},
    {id:5,name:"Frost — Saturday Vibes B-Roll",client:"Frost Barbershop",type:"Raw Footage",format:"MOV · 4K",size:"4.1 GB",date:"Mar 14",status:"Archived",platform:"—",duration:"12:30"},
    {id:6,name:"Desert Sun — Agent Headshots",client:"Desert Sun Realty",type:"Photos",format:"JPG · 6000x4000",size:"48 MB (8 files)",date:"Mar 11",status:"Published",platform:"Instagram",duration:"—"},
    {id:7,name:"CrossFit — Member Transformation",client:"Cactus CrossFit",type:"Video",format:"MP4 · 1080p",size:"520 MB",date:"Mar 6",status:"Published",platform:"Instagram",duration:"0:58"},
    {id:8,name:"Sky Harbor — Team Intros",client:"Sky Harbor Dental",type:"Raw Footage",format:"MOV · 4K",size:"6.2 GB",date:"Mar 13",status:"Archived",platform:"—",duration:"18:45"},
  ];
  const types = ["all","Video","Raw Footage","Photos"];
  const filtered = filter==="all"?assets:assets.filter(a=>a.type===filter);
  const glass = {background:'rgba(255,255,255,0.6)',backdropFilter:'blur(20px)',border:'1px solid rgba(255,255,255,0.65)',borderRadius:18,boxShadow:'0 4px 24px rgba(0,0,0,0.04)'};

  return (
    <div>
      <PageTour steps={TOUR_STEPS.library}/>
      <div style={{...glass,padding:'28px 32px',marginBottom:24,background:'linear-gradient(135deg, rgba(255,255,255,0.75) 0%, rgba(252,198,18,0.08) 100%)',borderLeft:'3px solid var(--accent)',animation:'dashFadeInUp 0.5s cubic-bezier(0.16,1,0.3,1) both'}}>
        <h1 style={{font:'600 22px var(--fd)',color:'var(--text)',marginBottom:4}}>Content Library</h1>
        <p style={{font:'400 13px var(--fb)',color:'var(--text2)',margin:0}}>All videos, photos, and raw footage in one place</p>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(140px, 1fr))',gap:12,marginBottom:20}}>
        {[{l:"Total Assets",v:assets.length},{l:"Videos",v:assets.filter(a=>a.type==="Video").length},{l:"Raw Footage",v:assets.filter(a=>a.type==="Raw Footage").length},{l:"Storage Used",v:"16.2 GB"}].map((s,i)=>(
          <div key={s.l} className="dash-card-hover" style={{...glass,padding:'16px 14px'}}><div style={{font:'500 9px var(--fd)',textTransform:'uppercase',letterSpacing:1,color:'var(--text3)',marginBottom:4}}>{s.l}</div><div style={{font:'600 24px var(--fd)',color:'var(--text)'}}>{s.v}</div></div>
        ))}
      </div>
      <div style={{display:'flex',gap:6,marginBottom:16}}>{types.map(t=><button key={t} className={`action-btn ${filter===t?"accent":""}`} onClick={()=>setFilter(t)} style={{textTransform:'capitalize'}}>{t}</button>)}</div>
      <div style={{...glass,overflow:'hidden'}}>
        {filtered.map((a,idx)=>(
          <div key={a.id} className="dash-card-hover" style={{margin:'6px 10px',padding:'14px 18px',borderRadius:14,background:'rgba(255,255,255,0.4)',border:'1px solid rgba(0,0,0,0.02)',cursor:'pointer',animation:`dashFadeInUp 0.3s ease ${idx*30}ms backwards`}} onClick={()=>setSelectedAsset(selectedAsset===a.id?null:a.id)}>
            <div style={{display:'flex',alignItems:'center',gap:14}}>
              <div style={{width:48,height:36,borderRadius:8,background:'#1a1a1a',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontSize:14,flexShrink:0}}>{a.type==="Photos"?"◫":"▶"}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{font:'500 13px var(--fd)',color:'var(--text)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{a.name}</div>
                <div style={{font:'400 11px var(--fb)',color:'var(--text3)',marginTop:2}}>{a.client} · {a.format} · {a.size}</div>
              </div>
              <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:4,flexShrink:0}}>
                <Badge type={a.status==="Published"?"green":a.status==="In Edit"?"blue":"gray"}>{a.status}</Badge>
                <span style={{font:'400 10px var(--fb)',color:'var(--text3)'}}>{a.date}</span>
              </div>
            </div>
            {selectedAsset===a.id && (
              <div style={{marginTop:12,paddingTop:12,borderTop:'1px solid var(--border)'}}>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,marginBottom:10}}>
                  {[{l:"Duration",v:a.duration},{l:"Platform",v:a.platform},{l:"Size",v:a.size}].map(s=>(
                    <div key={s.l} style={{padding:'6px 8px',background:'var(--surface2)',borderRadius:6,border:'1px solid var(--border)'}}>
                      <div style={{font:'400 8px var(--fd)',color:'var(--text3)',textTransform:'uppercase',letterSpacing:0.5}}>{s.l}</div>
                      <div style={{font:'500 11px var(--fb)',color:'var(--text)'}}>{s.v}</div>
                    </div>
                  ))}
                </div>
                <div style={{display:'flex',gap:6}}>
                  <button className="btn" style={{flex:1,fontSize:11,padding:'6px 10px'}} onClick={e=>{e.stopPropagation();showToast("✓","Downloaded",a.name);}}>Download</button>
                  <button className="btn" style={{flex:1,fontSize:11,padding:'6px 10px'}} onClick={e=>{e.stopPropagation();showToast("✓","Copied","Share link copied");}}>Share Link</button>
                  <button className="btn" style={{fontSize:11,padding:'6px 10px'}} onClick={e=>{e.stopPropagation();showToast("✓","Reuse","Added to content calendar");}}>Reuse</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MULTI-PLATFORM SCHEDULER ────────────────────────────────────────────────
function PlatformScheduler({ showToast }) {
  const [selectedDay, setSelectedDay] = useState(null);
  const schedule = [
    {id:1,client:"Frost Barbershop",title:"Spring Lineup Styles",date:"Mar 19",time:"9:00 AM",platforms:["Instagram","TikTok"],status:"Scheduled",peakTime:true},
    {id:2,client:"Desert Sun Realty",title:"4821 Cactus Rd Tour",date:"Mar 20",time:"10:00 AM",platforms:["Instagram","TikTok","Facebook"],status:"Scheduled",peakTime:true},
    {id:3,client:"Sky Harbor Dental",title:"Whitening Results",date:"Mar 21",time:"11:00 AM",platforms:["Instagram"],status:"Draft",peakTime:false},
    {id:4,client:"Mesa Auto Detailing",title:"Tesla Detail Reveal",date:"Mar 22",time:"9:00 AM",platforms:["Instagram","TikTok"],status:"Scheduled",peakTime:true},
    {id:5,client:"Cactus CrossFit",title:"Saturday Workout",date:"Mar 22",time:"7:00 AM",platforms:["Instagram","TikTok"],status:"Draft",peakTime:true},
    {id:6,client:"Desert Sun Realty",title:"Market Update Reel",date:"Mar 24",time:"12:00 PM",platforms:["Instagram","Facebook"],status:"Scheduled",peakTime:false},
    {id:7,client:"Frost Barbershop",title:"Behind the Chair",date:"Mar 25",time:"2:00 PM",platforms:["TikTok"],status:"Draft",peakTime:false},
    {id:8,client:"Sky Harbor Dental",title:"Meet Dr. Chen",date:"Mar 26",time:"10:00 AM",platforms:["Instagram","Facebook","TikTok"],status:"Scheduled",peakTime:true},
  ];
  const glass = {background:'rgba(255,255,255,0.6)',backdropFilter:'blur(20px)',border:'1px solid rgba(255,255,255,0.65)',borderRadius:18,boxShadow:'0 4px 24px rgba(0,0,0,0.04)'};
  const platformColors = {Instagram:"#A855F7",TikTok:"#3B82F6",Facebook:"#3B82F6",Google:"#22C55E"};

  return (
    <div>
      <PageTour steps={TOUR_STEPS.scheduler}/>
      <div style={{...glass,padding:'28px 32px',marginBottom:24,background:'linear-gradient(135deg, rgba(255,255,255,0.75) 0%, rgba(252,198,18,0.08) 100%)',borderLeft:'3px solid var(--accent)',animation:'dashFadeInUp 0.5s cubic-bezier(0.16,1,0.3,1) both'}}>
        <h1 style={{font:'600 22px var(--fd)',color:'var(--text)',marginBottom:4}}>Post Scheduler</h1>
        <p style={{font:'400 13px var(--fb)',color:'var(--text2)',margin:0}}>Schedule content across Instagram, TikTok, and Facebook</p>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(140px, 1fr))',gap:12,marginBottom:20}}>
        {[{l:"Scheduled",v:schedule.filter(s=>s.status==="Scheduled").length,c:"var(--green)"},{l:"Drafts",v:schedule.filter(s=>s.status==="Draft").length,c:"var(--amber)"},{l:"This Week",v:schedule.filter(s=>s.date>="Mar 18"&&s.date<="Mar 24").length,c:"var(--blue)"},{l:"Peak Time",v:schedule.filter(s=>s.peakTime).length,c:"var(--accent)"}].map(s=>(
          <div key={s.l} className="dash-card-hover" style={{...glass,padding:'16px 14px'}}><div style={{font:'500 9px var(--fd)',textTransform:'uppercase',letterSpacing:1,color:'var(--text3)',marginBottom:4}}>{s.l}</div><div style={{font:'600 24px var(--fd)',color:s.c}}>{s.v}</div></div>
        ))}
      </div>
      <div style={{...glass,overflow:'hidden'}}>
        <div style={{padding:'18px 22px',borderBottom:'1px solid rgba(0,0,0,0.04)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <span style={{font:'600 15px var(--fd)',color:'var(--text)'}}>Upcoming Posts</span>
          <button className="top-action-btn" style={{fontSize:11,padding:'0 14px',height:30}} onClick={()=>showToast("✓","Scheduling","Opening content calendar...")}>+ Schedule Post</button>
        </div>
        {schedule.map((s,idx)=>(
          <div key={s.id} className="dash-card-hover" style={{margin:'6px 10px',padding:'16px 18px',borderRadius:14,background:s.peakTime?'rgba(252,198,18,0.04)':'rgba(255,255,255,0.4)',border:s.peakTime?'1px solid rgba(252,198,18,0.12)':'1px solid rgba(0,0,0,0.02)',cursor:'pointer'}} onClick={()=>setSelectedDay(selectedDay===s.id?null:s.id)}>
            <div style={{display:'flex',alignItems:'center',gap:14}}>
              <div style={{minWidth:50,textAlign:'center'}}>
                <div style={{font:'600 16px var(--fd)',color:'var(--accent)'}}>{s.date.split(" ")[1]}</div>
                <div style={{font:'400 9px var(--fd)',color:'var(--text3)',textTransform:'uppercase'}}>{s.date.split(" ")[0]}</div>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{font:'500 13px var(--fd)',color:'var(--text)'}}>{s.title}</div>
                <div style={{font:'400 11px var(--fb)',color:'var(--text2)',marginTop:2}}>{s.client} · {s.time}</div>
                <div style={{display:'flex',gap:4,marginTop:6}}>
                  {s.platforms.map(p=><span key={p} style={{font:'500 9px var(--fd)',color:platformColors[p]||'var(--text3)',background:`${platformColors[p]||'var(--text3)'}15`,padding:'2px 8px',borderRadius:10,border:`1px solid ${platformColors[p]||'var(--text3)'}30`}}>{p}</span>)}
                </div>
              </div>
              <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:4,flexShrink:0}}>
                <Badge type={s.status==="Scheduled"?"green":"amber"}>{s.status}</Badge>
                {s.peakTime && <span style={{font:'500 9px var(--fd)',color:'var(--accent)'}}>Peak time</span>}
              </div>
            </div>
            {selectedDay===s.id && (
              <div style={{marginTop:12,paddingTop:12,borderTop:'1px solid var(--border)',display:'flex',gap:6}}>
                <button className="btn primary" style={{flex:1,fontSize:11,padding:'6px 10px'}} onClick={e=>{e.stopPropagation();showToast("✓","Published","Posted to "+s.platforms.join(", "));fireConfetti();}}>Publish Now</button>
                <button className="btn" style={{fontSize:11,padding:'6px 10px'}} onClick={e=>{e.stopPropagation();showToast("◉","Rescheduled","Pick a new time...");}}>Reschedule</button>
                <button className="btn" style={{fontSize:11,padding:'6px 10px'}} onClick={e=>{e.stopPropagation();showToast("◉","Preview","Opening preview...");}}>Preview</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PROPOSAL GENERATOR ──────────────────────────────────────────────────────
function ProposalGenerator({ showToast }) {
  const [proposals, setProposals] = useState([
    {id:1,client:"Chandler Law Group",plan:"Gold",status:"Sent",date:"Mar 17",value:"$3,000/mo",opened:true},
    {id:2,client:"Sun Devil Gym",plan:"Gold",status:"Draft",date:"Mar 16",value:"$3,000/mo",opened:false},
    {id:3,client:"AZ Pool Pros",plan:"Gold",status:"Accepted",date:"Mar 14",value:"$3,000/mo",opened:true},
  ]);
  const [showNew, setShowNew] = useState(false);
  const [newForm, setNewForm] = useState({client:"",plan:"Gold"});

  return (
    <div>
      <PageTour steps={TOUR_STEPS.proposals}/>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
        <div><h1 style={{font:'600 22px var(--fd)',color:'var(--text)',marginBottom:4}}>Proposals</h1><p style={{font:'400 13px var(--fb)',color:'var(--text2)',margin:0}}>Create and track client proposals</p></div>
        <button className="top-action-btn" onClick={()=>setShowNew(!showNew)}>+ New Proposal</button>
      </div>
      {showNew && (
        <div className="card" style={{marginBottom:16}}>
          <div className="card-title">Create Proposal</div>
          <div className="form-group"><label className="form-label">Client / Business Name</label><input className="form-input" placeholder="e.g. Scottsdale Med Spa" value={newForm.client} onChange={e=>setNewForm(p=>({...p,client:e.target.value}))}/></div>
          <div className="form-group"><label className="form-label">Recommended Plan</label>
            <div style={{display:'flex',gap:8}}>{["Copper","Gold","Platinum"].map(p=>(<button key={p} className={`action-btn ${newForm.plan===p?"accent":""}`} style={{flex:1,padding:10}} onClick={()=>setNewForm(f=>({...f,plan:p}))}><div style={{font:'600 12px var(--fd)'}}>{p}</div><div style={{font:'400 10px var(--fb)',color:'var(--text3)',marginTop:2}}>{PLAN_DETAILS[p]?.price||""}/mo</div></button>))}</div>
          </div>
          <button className="btn primary full" onClick={()=>{if(!newForm.client.trim())return;setProposals(p=>[{id:Date.now(),client:newForm.client,plan:newForm.plan,status:"Draft",date:"Mar 18",value:PLAN_DETAILS[newForm.plan]?.price+"/mo"||"",opened:false},...p]);setShowNew(false);showToast("✓","Proposal created","Ready to send");}}>Generate Proposal</button>
        </div>
      )}
      <div className="card">
        <div className="card-title">All Proposals</div>
        {proposals.map(p=>(
          <div key={p.id} className="row-item" style={{cursor:'pointer'}} onClick={()=>showToast("◉","Proposal",p.client+" — "+p.plan+" plan · "+p.value)}>
            <div className="row-avatar" style={{background:'var(--accent-dim)',color:'var(--accent)'}}>{p.client[0]}</div>
            <div className="row-main">
              <div className="row-title">{p.client}</div>
              <div className="row-sub">{p.plan} Plan · {p.value} · {p.date}</div>
            </div>
            <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:4}}>
              <Badge type={p.status==="Accepted"?"green":p.status==="Sent"?"blue":"gray"}>{p.status}</Badge>
              {p.opened && p.status==="Sent" && <span style={{font:'400 10px var(--fb)',color:'var(--green)'}}>Opened</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SCRIPT TEMPLATES ────────────────────────────────────────────────────────
function ScriptTemplates({ showToast }) {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const templates = [
    {id:1,name:"Barbershop — Day in the Life",industry:"Barbershop",script:"HOOK (0–3 sec)\nEver wonder what happens inside [BUSINESS] before the doors open?\n\nSETUP (3–10 sec)\nWe spent the morning with the crew and captured everything — the prep, the banter, the craft.\n\nBODY (10–40 sec)\nWatch as [BUSINESS] takes on a packed [DAY]. Every detail is dialed in. The lineups are sharp, the vibes are right, and the clients keep coming back. This is why [BUSINESS] is the go-to spot in [CITY].\n\nCTA (40–50 sec)\nFollow [BUSINESS] for more behind-the-scenes content. Link in bio to book your appointment.",uses:12},
    {id:2,name:"Real Estate — Listing Tour",industry:"Real Estate",script:"HOOK (0–3 sec)\nThis [CITY] listing just hit the market and it is STUNNING.\n\nSETUP (3–10 sec)\nLocated in [NEIGHBORHOOD], this [BEDS]-bed, [BATHS]-bath home features [KEY FEATURE] and [KEY FEATURE].\n\nBODY (10–40 sec)\nWalk through the [ROOM 1], the [ROOM 2], and the [STANDOUT FEATURE]. The real showstopper? [HERO FEATURE].\n\nCTA (40–50 sec)\nDM us or tap the link in bio to schedule a private showing before this one is gone.",uses:18},
    {id:3,name:"Before/After Transformation",industry:"Universal",script:"HOOK (0–3 sec)\nWait for the reveal at the end... trust me.\n\nSETUP (3–10 sec)\n[CLIENT] came to [BUSINESS] with [PROBLEM]. Here is what we did.\n\nBODY (10–40 sec)\n[Describe process step by step]. Every detail matters. The difference is night and day.\n\nCTA (40–50 sec)\nIf you want results like this, follow [BUSINESS] and tap the link in bio. Your turn is next.",uses:24},
    {id:4,name:"Client Testimonial",industry:"Universal",script:"HOOK (0–3 sec)\nThis customer drove [DISTANCE] just for [BUSINESS]. Here is why.\n\nSETUP (3–10 sec)\nWe sat down with a real customer to hear their experience. No scripts, no prompts.\n\nBODY (10–40 sec)\n[Customer talks about their problem, how they found BUSINESS, and the result]. The genuine emotion says it all.\n\nCTA (40–50 sec)\nIf you want results like this, follow [BUSINESS] and tap the link in bio.",uses:15},
    {id:5,name:"Dental — Smile Transformation",industry:"Dental",script:"HOOK (0–3 sec)\nYou will not believe this smile transformation.\n\nSETUP (3–10 sec)\n[PATIENT] came to [BUSINESS] wanting [TREATMENT]. Here is the journey from start to finish.\n\nBODY (10–40 sec)\nWatch the process: [STEP 1], [STEP 2], [STEP 3]. The final reveal speaks for itself.\n\nCTA (40–50 sec)\nReady for your transformation? Follow [BUSINESS] and book your consultation through the link in bio.",uses:8},
    {id:6,name:"Fitness — Member Story",industry:"Gym/Fitness",script:"HOOK (0–3 sec)\n[MONTHS] months. [POUNDS] pounds. One gym.\n\nSETUP (3–10 sec)\nMeet [MEMBER], a member at [BUSINESS] who decided to change their life.\n\nBODY (10–40 sec)\n[Member's journey — what motivated them, the workouts, the struggles, the wins]. Cut between interview and workout footage.\n\nCTA (40–50 sec)\nYour story could be next. Follow [BUSINESS] and start your journey today.",uses:10},
  ];

  return (
    <div>
      <PageTour steps={TOUR_STEPS.templates}/>
      <div style={{marginBottom:20}}><h1 style={{font:'600 22px var(--fd)',color:'var(--text)',marginBottom:4}}>Script Templates</h1><p style={{font:'400 13px var(--fb)',color:'var(--text2)',margin:0}}>Reusable scripts by industry — customize and use</p></div>
      <div className="card">
        {templates.map(t=>(
          <div key={t.id}>
            <div className="row-item" style={{cursor:'pointer'}} onClick={()=>setSelectedTemplate(selectedTemplate===t.id?null:t.id)}>
              <div className="row-avatar" style={{background:'var(--accent-dim)',color:'var(--accent)'}}>{t.industry[0]}</div>
              <div className="row-main">
                <div className="row-title">{t.name}</div>
                <div className="row-sub">{t.industry} · Used {t.uses} times</div>
              </div>
              <span style={{color:'var(--text3)',fontSize:14}}>{selectedTemplate===t.id?"▾":"›"}</span>
            </div>
            {selectedTemplate===t.id && (
              <div style={{padding:'12px 0 16px 48px',borderBottom:'1px solid var(--border)'}}>
                <div style={{background:'var(--surface2)',border:'1px solid var(--border)',borderRadius:10,padding:'14px 16px',font:'400 12px var(--fb)',color:'var(--text)',lineHeight:1.7,whiteSpace:'pre-wrap',marginBottom:10}}>{t.script}</div>
                <div style={{display:'flex',gap:6}}>
                  <button className="btn primary" style={{flex:1,fontSize:11,padding:'6px 10px'}} onClick={()=>{navigator.clipboard?.writeText(t.script);showToast("✓","Copied","Template copied — paste into script editor");}}>Copy Template</button>
                  <button className="btn" style={{fontSize:11,padding:'6px 10px'}} onClick={()=>showToast("✓","Duplicated","Template saved as new draft")}>Duplicate</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SHOOT CALENDAR ──────────────────────────────────────────────────────────
function ShootCalendar({ shoots, showToast, onOpenMessages }) {
  const [selectedShoot, setSelectedShoot] = useState(null);
  const [showNewShoot, setShowNewShoot] = useState(false);

  const glass = {
    background:'rgba(255,255,255,0.6)',backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)',
    border:'1px solid rgba(255,255,255,0.65)',borderRadius:18,
    boxShadow:'0 4px 24px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
  };

  const upcoming = shoots.filter(s=>s.status!=="Completed").length;
  const thisWeek = shoots.filter(s=>s.date>="Mar 18"&&s.date<="Mar 24").length;

  return (
    <div>
      <PageTour steps={TOUR_STEPS.shoots}/>
      <div style={{...glass,padding:'28px 32px',marginBottom:24,background:'linear-gradient(135deg, rgba(255,255,255,0.75) 0%, rgba(252,198,18,0.08) 100%)',borderLeft:'3px solid var(--accent)',animation:'dashFadeInUp 0.5s cubic-bezier(0.16,1,0.3,1) both'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div>
            <h1 style={{font:'600 22px var(--fd)',color:'var(--text)',marginBottom:4}}>Shoot Calendar</h1>
            <p style={{font:'400 13px var(--fb)',color:'var(--text2)',margin:0}}>Schedule and track filming sessions</p>
          </div>
          <button className="top-action-btn" onClick={()=>setShowNewShoot(true)}>+ Schedule Shoot</button>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))',gap:12,marginBottom:20}}>
        {[{label:"Upcoming",val:upcoming,color:"var(--accent)"},{label:"This Week",val:thisWeek,color:"var(--blue)"},{label:"Total Scheduled",val:shoots.length,color:"var(--text)"}].map((s,i)=>(
          <div key={s.label} className="dash-card-hover" style={{...glass,padding:'18px 16px',animation:`dashFadeInUp 0.5s cubic-bezier(0.16,1,0.3,1) ${i*60}ms backwards`}}>
            <div style={{font:'500 10px var(--fd)',textTransform:'uppercase',letterSpacing:1.2,color:'var(--text3)',marginBottom:6}}>{s.label}</div>
            <div style={{font:'600 28px var(--fd)',color:s.color}}>{s.val}</div>
          </div>
        ))}
      </div>

      <div style={{...glass,overflow:'hidden',animation:'dashFadeInUp 0.5s cubic-bezier(0.16,1,0.3,1) 200ms backwards'}}>
        <div style={{padding:'18px 22px',borderBottom:'1px solid rgba(0,0,0,0.04)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <span style={{font:'600 15px var(--fd)',color:'var(--text)'}}>Scheduled Shoots</span>
        </div>
        {shoots.map((s,idx)=>(
          <div key={s.id} className="dash-card-hover" style={{
            margin:'6px 10px',padding:'16px 18px',borderRadius:14,
            background:s.status==="Confirmed"?'rgba(45,154,106,0.04)':'rgba(255,255,255,0.4)',
            border:s.status==="Confirmed"?'1px solid rgba(45,154,106,0.15)':'1px solid rgba(0,0,0,0.02)',
            cursor:'pointer',animation:`dashFadeInUp 0.4s cubic-bezier(0.16,1,0.3,1) ${300+idx*50}ms backwards`,
          }} onClick={()=>setSelectedShoot(selectedShoot===s.id?null:s.id)}>
            <div style={{display:'flex',alignItems:'center',gap:14}}>
              <div style={{width:48,height:48,borderRadius:12,background:s.status==="Confirmed"?'var(--green)':'var(--amber)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',flexShrink:0,boxShadow:`0 4px 12px ${s.status==="Confirmed"?'rgba(45,154,106,0.3)':'rgba(212,150,11,0.3)'}`}}>
                <div style={{font:'600 14px var(--fd)',color:'white',lineHeight:1}}>{s.date.split(" ")[1]}</div>
                <div style={{font:'500 9px var(--fd)',color:'rgba(255,255,255,0.8)',textTransform:'uppercase'}}>{s.date.split(" ")[0]}</div>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{font:'500 14px var(--fd)',color:'var(--text)'}}>{s.client}</div>
                <div style={{font:'400 12px var(--fb)',color:'var(--text2)'}}>{s.time} · {s.duration} · {s.location}</div>
              </div>
              <Badge type={s.status==="Confirmed"?"green":"amber"}>{s.status}</Badge>
            </div>
            {selectedShoot===s.id && (
              <div style={{marginTop:14,paddingTop:14,borderTop:'1px solid var(--border)'}}>
                <div className="row-item" style={{paddingTop:0}}><div className="row-main"><div className="row-title">Crew</div><div className="row-sub">{s.crew}</div></div></div>
                <div className="row-item"><div className="row-main"><div className="row-title">Location</div><div className="row-sub">{s.location}</div></div></div>
                <div className="row-item"><div className="row-main"><div className="row-title">Notes</div><div className="row-sub">{s.notes}</div></div></div>
                <div style={{display:'flex',gap:8,marginTop:10}}>
                  {s.status==="Pending" && <button className="btn success" style={{flex:1}} onClick={(e)=>{e.stopPropagation();showToast("✓","Confirmed",s.client+" shoot confirmed");}}>Confirm</button>}
                  <button className="btn" style={{flex:1}} onClick={(e)=>{e.stopPropagation();showToast("◉","Reschedule","Reschedule request sent");}}>Reschedule</button>
                  <button className="btn" onClick={(e)=>{e.stopPropagation();if(onOpenMessages)onOpenMessages();else showToast("◉","Messages","Opening...");}}>Message Crew</button>
                </div>
                <CommentThread itemId={`shoot-${s.id}`} showToast={showToast}/>
              </div>
            )}
          </div>
        ))}
      </div>

      {showNewShoot && (
        <div className="overlay" onClick={()=>setShowNewShoot(false)}>
          <div className="sheet" onClick={e=>e.stopPropagation()}>
            <div className="sheet-handle"/>
            <div className="sheet-title">Schedule New Shoot</div>
            <div className="form-group"><label className="form-label">Client</label><select className="form-select">{INIT_CLIENTS.map(c=><option key={c.id}>{c.name}</option>)}</select></div>
            <div className="form-group"><label className="form-label">Date</label><input className="form-input" type="date"/></div>
            <div className="form-group"><label className="form-label">Time</label><select className="form-select">{["6:00 AM","7:00 AM","8:00 AM","9:00 AM","10:00 AM","11:00 AM","12:00 PM","1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM"].map(t=><option key={t}>{t}</option>)}</select></div>
            <div className="form-group"><label className="form-label">Duration</label><select className="form-select"><option>2hr</option><option>3hr</option><option>4hr</option></select></div>
            <div className="form-group"><label className="form-label">Location</label><input className="form-input" placeholder="Shoot location"/></div>
            <div className="form-group"><label className="form-label">Crew</label><input className="form-input" placeholder="e.g. Jordan T., Carlos V."/></div>
            <div className="form-group"><label className="form-label">Notes</label><textarea className="form-textarea" placeholder="What to capture, equipment needed, etc."/></div>
            <div className="form-actions">
              <button className="btn" onClick={()=>setShowNewShoot(false)}>Cancel</button>
              <button className="btn primary" onClick={()=>{setShowNewShoot(false);showToast("📸","Shoot Scheduled","New shoot added to calendar");}}>Schedule Shoot</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── COACHING & STRATEGY CALLS ──────────────────────────────────────────────
function CoachingTracker({ sessions, showToast }) {
  const [selectedSession, setSelectedSession] = useState(null);

  const glass = {
    background:'rgba(255,255,255,0.6)',backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)',
    border:'1px solid rgba(255,255,255,0.65)',borderRadius:18,
    boxShadow:'0 4px 24px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
  };

  const upcoming = sessions.filter(s=>s.status==="Upcoming").length;
  const completed = sessions.filter(s=>s.status==="Completed").length;
  const typeIcons = {"Strategy Call":"📊","Camera Coaching":"📷","Sales Coaching":"💰"};

  return (
    <div>
      <PageTour steps={TOUR_STEPS.coaching}/>
      <div style={{...glass,padding:'28px 32px',marginBottom:24,background:'linear-gradient(135deg, rgba(255,255,255,0.75) 0%, rgba(252,198,18,0.08) 100%)',borderLeft:'3px solid var(--accent)',animation:'dashFadeInUp 0.5s cubic-bezier(0.16,1,0.3,1) both'}}>
        <h1 style={{font:'600 22px var(--fd)',color:'var(--text)',marginBottom:4}}>Coaching & Strategy</h1>
        <p style={{font:'400 13px var(--fb)',color:'var(--text2)',margin:0}}>Camera coaching, strategy calls, and sales coaching sessions</p>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))',gap:12,marginBottom:20}}>
        <div className="dash-card-hover" style={{...glass,padding:'18px 16px'}}><div style={{font:'500 10px var(--fd)',textTransform:'uppercase',letterSpacing:1.2,color:'var(--text3)',marginBottom:6}}>Upcoming</div><div style={{font:'600 28px var(--fd)',color:'var(--accent)'}}>{upcoming}</div></div>
        <div className="dash-card-hover" style={{...glass,padding:'18px 16px'}}><div style={{font:'500 10px var(--fd)',textTransform:'uppercase',letterSpacing:1.2,color:'var(--text3)',marginBottom:6}}>Completed</div><div style={{font:'600 28px var(--fd)',color:'var(--green)'}}>{completed}</div></div>
        <div className="dash-card-hover" style={{...glass,padding:'18px 16px'}}><div style={{font:'500 10px var(--fd)',textTransform:'uppercase',letterSpacing:1.2,color:'var(--text3)',marginBottom:6}}>Total</div><div style={{font:'600 28px var(--fd)',color:'var(--text)'}}>{sessions.length}</div></div>
      </div>

      {/* Upcoming */}
      {upcoming > 0 && (
        <div style={{...glass,overflow:'hidden',marginBottom:20}}>
          <div style={{padding:'18px 22px',borderBottom:'1px solid rgba(0,0,0,0.04)'}}><span style={{font:'600 15px var(--fd)',color:'var(--text)'}}>Upcoming Sessions</span></div>
          {sessions.filter(s=>s.status==="Upcoming").map((s,idx)=>(
            <div key={s.id} className="dash-card-hover" style={{margin:'6px 10px',padding:'16px 18px',borderRadius:14,background:'rgba(252,198,18,0.04)',border:'1px solid rgba(252,198,18,0.12)',cursor:'pointer'}}
              onClick={()=>setSelectedSession(selectedSession===s.id?null:s.id)}>
              <div style={{display:'flex',alignItems:'center',gap:14}}>
                <div style={{fontSize:24,flexShrink:0}}>{typeIcons[s.type]||"📞"}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{font:'500 14px var(--fd)',color:'var(--text)'}}>{s.type}</div>
                  <div style={{font:'400 12px var(--fb)',color:'var(--text2)'}}>{s.client} · {s.date} at {s.time} · {s.duration}</div>
                </div>
                <Badge type="amber">Upcoming</Badge>
              </div>
              {selectedSession===s.id && (
                <div style={{marginTop:12,paddingTop:12,borderTop:'1px solid var(--border)'}}>
                  <div style={{font:'400 12px var(--fb)',color:'var(--text2)',lineHeight:1.6,marginBottom:10}}>{s.notes}</div>
                  <div style={{display:'flex',gap:8}}>
                    <button className="btn success" style={{flex:1}} onClick={(e)=>{e.stopPropagation();showToast("✓","Confirmed","Session confirmed with "+s.client);}}>Confirm</button>
                    <button className="btn" onClick={(e)=>{e.stopPropagation();showToast("📅","Reschedule","Request sent");}}>Reschedule</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Completed */}
      <div style={{...glass,overflow:'hidden'}}>
        <div style={{padding:'18px 22px',borderBottom:'1px solid rgba(0,0,0,0.04)'}}><span style={{font:'600 15px var(--fd)',color:'var(--text)'}}>Completed Sessions</span></div>
        {sessions.filter(s=>s.status==="Completed").map(s=>(
          <div key={s.id} style={{margin:'6px 10px',padding:'14px 18px',borderRadius:14,background:'rgba(255,255,255,0.4)',border:'1px solid rgba(0,0,0,0.02)',cursor:'pointer'}}
            onClick={()=>setSelectedSession(selectedSession===s.id?null:s.id)}>
            <div style={{display:'flex',alignItems:'center',gap:14}}>
              <div style={{fontSize:24,flexShrink:0}}>{typeIcons[s.type]||"📞"}</div>
              <div style={{flex:1}}>
                <div style={{font:'500 13px var(--fd)',color:'var(--text)'}}>{s.type} — {s.client}</div>
                <div style={{font:'400 11px var(--fb)',color:'var(--text3)'}}>{s.date} · {s.duration}</div>
              </div>
              <Badge type="green">Done</Badge>
            </div>
            {selectedSession===s.id && (
              <div style={{marginTop:10,paddingTop:10,borderTop:'1px solid var(--border)'}}>
                <div style={{font:'400 12px var(--fb)',color:'var(--text2)',lineHeight:1.6}}>{s.notes}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── TEAM WORKLOAD ───────────────────────────────────────────────────────────
function TeamWorkload({ scripts, videos }) {
  const team = [
    {name:"Maya R.",role:"Script Writer",color:"#A855F7",emoji:"✍️"},
    {name:"Jordan T.",role:"Video Editor",color:"#22C55E",emoji:"🎬"},
    {name:"Carlos V.",role:"Account Manager",color:"#3B82F6",emoji:"📋"},
    {name:"Alex M.",role:"Admin / Strategy",color:"#FF5C00",emoji:"⬛"},
  ];

  const getWorkload = (member) => {
    if (member.role === "Script Writer") {
      const active = scripts.filter(s => s.status !== "Published" && s.status !== "Approved" && s.status !== "Scheduled");
      const overdue = active.filter(s => s.due && s.due < "Mar 18");
      return { total: active.length, overdue: overdue.length, items: active };
    }
    if (member.role === "Video Editor") {
      const active = videos.filter(v => v.status !== "Published" && v.status !== "Scheduled");
      const overdue = active.filter(v => v.due && v.due < "Mar 18");
      return { total: active.length, overdue: overdue.length, items: active };
    }
    return { total: Math.floor(Math.random() * 3) + 2, overdue: 0, items: [] };
  };

  const glass = {
    background:'rgba(255,255,255,0.6)',backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)',
    border:'1px solid rgba(255,255,255,0.65)',borderRadius:18,
    boxShadow:'0 4px 24px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
  };

  return (
    <div>
      <PageTour steps={TOUR_STEPS.team}/>
      <div style={{...glass,padding:'28px 32px',marginBottom:24,background:'linear-gradient(135deg, rgba(255,255,255,0.75) 0%, rgba(252,198,18,0.08) 100%)',borderLeft:'3px solid var(--accent)',animation:'dashFadeInUp 0.5s cubic-bezier(0.16,1,0.3,1) both'}}>
        <h1 style={{font:'600 22px var(--fd)',color:'var(--text)',marginBottom:4}}>Team Workload</h1>
        <p style={{font:'400 13px var(--fb)',color:'var(--text2)',margin:0}}>Who's working on what right now</p>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))',gap:16}}>
        {team.map((m, idx) => {
          const wl = getWorkload(m);
          const load = wl.total >= 5 ? "heavy" : wl.total >= 3 ? "moderate" : "light";
          const loadColor = load === "heavy" ? "var(--red)" : load === "moderate" ? "var(--amber)" : "var(--green)";
          return (
            <div key={m.name} className="dash-card-hover" style={{...glass,padding:'22px',cursor:'default',animation:`dashFadeInUp 0.5s cubic-bezier(0.16,1,0.3,1) ${idx*80}ms backwards`}}>
              <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:16}}>
                <div style={{width:44,height:44,borderRadius:12,background:`${m.color}15`,display:'flex',alignItems:'center',justifyContent:'center',font:'600 16px var(--fd)',color:m.color}}>{m.name[0]}</div>
                <div style={{flex:1}}>
                  <div style={{font:'600 14px var(--fd)',color:'var(--text)'}}>{m.name}</div>
                  <div style={{font:'400 11px var(--fb)',color:'var(--text3)'}}>{m.role}</div>
                </div>
                <div style={{padding:'4px 10px',borderRadius:100,font:'600 10px var(--fd)',textTransform:'uppercase',letterSpacing:0.5,background:`${loadColor}15`,color:loadColor,border:`1px solid ${loadColor}30`}}>{load}</div>
              </div>
              <div style={{display:'flex',gap:12,marginBottom:14}}>
                <div style={{flex:1,background:'rgba(255,255,255,0.5)',borderRadius:10,padding:'10px 12px',textAlign:'center'}}>
                  <div style={{font:'600 22px var(--fd)',color:'var(--text)'}}>{wl.total}</div>
                  <div style={{font:'400 10px var(--fb)',color:'var(--text3)',textTransform:'uppercase',letterSpacing:0.5}}>Active</div>
                </div>
                <div style={{flex:1,background:wl.overdue>0?'rgba(217,79,92,0.08)':'rgba(255,255,255,0.5)',borderRadius:10,padding:'10px 12px',textAlign:'center'}}>
                  <div style={{font:'600 22px var(--fd)',color:wl.overdue>0?'var(--red)':'var(--text)'}}>{wl.overdue}</div>
                  <div style={{font:'400 10px var(--fb)',color:'var(--text3)',textTransform:'uppercase',letterSpacing:0.5}}>Overdue</div>
                </div>
              </div>
              {/* Capacity bar */}
              <div style={{marginBottom:8}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                  <span style={{font:'400 10px var(--fb)',color:'var(--text3)'}}>Capacity</span>
                  <span style={{font:'500 10px var(--fd)',color:loadColor}}>{Math.min(wl.total * 20, 100)}%</span>
                </div>
                <div style={{height:4,background:'rgba(0,0,0,0.06)',borderRadius:4,overflow:'hidden'}}>
                  <div style={{height:'100%',width:`${Math.min(wl.total*20,100)}%`,background:loadColor,borderRadius:4,transition:'width 0.5s ease'}}/>
                </div>
              </div>
              {wl.items.length > 0 && (
                <div style={{borderTop:'1px solid var(--border)',paddingTop:10,marginTop:4}}>
                  {wl.items.slice(0,3).map((item,i)=>(
                    <div key={i} style={{display:'flex',alignItems:'center',gap:8,padding:'5px 0',fontSize:11,color:'var(--text2)'}}>
                      <span>{m.emoji}</span>
                      <span style={{flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{item.client||item.title} — {item.type||item.title}</span>
                      {item.due && item.due < "Mar 18" && <span style={{color:'var(--red)',fontWeight:600,fontSize:9}}>OVERDUE</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── UNIFIED CONTENT PIPELINE (KANBAN) ────────────────────────────────────────
function ContentPipeline({ scripts, videos, onAdvanceVideo, onUpdateScript, showToast }) {
  const [clientFilter, setClientFilter] = useState("all");
  const [dragging, setDragging] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [detailModal, setDetailModal] = useState(null);
  const [didDrag, setDidDrag] = useState(false);
  const [dragOver, setDragOver] = useState(null);

  const PIPELINE_STAGES = ["Scripting","Editing","Review","Approved","Scheduled","Published"];
  const STAGE_ICONS = {Scripting:"✍️",Editing:"🎬",Review:"👁️",Approved:"✅",Scheduled:"📸",Published:"🎉"};

  const allItems = [
    ...scripts.map(s => {
      const stageMap = {"Assigned":"Scripting","In Progress":"Scripting","Needs Revision":"Scripting","Submitted":"Review",
        "Scripting":"Scripting","Editing":"Editing","Review":"Review","Approved":"Approved","Scheduled":"Scheduled","Published":"Published"};
      return {
        id:`s-${s.id}`, sourceId:s.id, type:"script", client:s.client, title:s.type,
        status: stageMap[s.status] || "Scripting",
        due:s.due, priority:s.priority, thumb:"✍️", source:s,
      };
    }),
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

  const moveItem = (item, targetStage) => {
    if (item.status === targetStage) return;
    if (item.type === "video") {
      onAdvanceVideo(item.sourceId, targetStage);
    } else {
      onUpdateScript(item.sourceId, targetStage, item.source.draft);
    }
    showToast(STAGE_ICONS[targetStage], "Moved to " + targetStage, item.title);
  };

  // Drag handlers
  const handleDragStart = (e, item) => {
    setDragging(item.id);
    setDidDrag(true);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", item.id);
    if (e.target) e.target.style.opacity = "0.5";
  };
  const handleDragEnd = (e) => {
    setDragging(null);
    setDragOver(null);
    if (e.target) e.target.style.opacity = "1";
    setTimeout(()=>setDidDrag(false),100);
  };
  const handleCardClick = (item) => {
    if (didDrag) return;
    setSelectedCard(selectedCard===item.id?null:item.id);
  };
  const handleColumnDragOver = (e, stage) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOver(stage);
  };
  const handleColumnDragLeave = () => {
    setDragOver(null);
  };
  const handleColumnDrop = (e, stage) => {
    e.preventDefault();
    setDragOver(null);
    const itemId = e.dataTransfer.getData("text/plain") || dragging;
    const item = allItems.find(i => i.id === itemId);
    if (item) moveItem(item, stage);
    setDragging(null);
  };

  const inScripting = filtered.filter(i=>i.status==="Scripting").length;
  const inEditing = filtered.filter(i=>i.status==="Editing").length;
  const inReview = filtered.filter(i=>i.status==="Review").length;
  const completed = filtered.filter(i=>i.status==="Published"||i.status==="Scheduled").length;

  return (
    <div>
      <PageTour steps={TOUR_STEPS.pipeline}/>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))',gap:12,marginBottom:20}}>
        {[{label:"Scripting",val:inScripting,color:"var(--text3)"},{label:"Editing",val:inEditing,color:"var(--blue)"},{label:"In Review",val:inReview,color:"var(--amber)"},{label:"Completed",val:completed,color:"var(--green)"}].map((s,i)=>(
          <div key={s.label} className="dash-card-hover" style={{...glass,padding:'18px 16px',animation:`dashFadeInUp 0.5s cubic-bezier(0.16,1,0.3,1) ${i*60}ms backwards`}}>
            <div style={{font:'500 10px var(--fd)',textTransform:'uppercase',letterSpacing:1.2,color:'var(--text3)',marginBottom:6}}>{s.label}</div>
            <div style={{font:'600 28px var(--fd)',color:s.color}}>{s.val}</div>
          </div>
        ))}
      </div>

      <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
        <span style={{font:'600 13px var(--fd)',color:'var(--text)'}}>Filter:</span>
        <button className={`action-btn ${clientFilter==="all"?"accent":""}`} onClick={()=>setClientFilter("all")}>All Clients</button>
        {allClients.map(c=>(
          <button key={c} className={`action-btn ${clientFilter===c?"accent":""}`} onClick={()=>setClientFilter(c)}>{c}</button>
        ))}
      </div>

      <div style={{font:'400 11px var(--fb)',color:'var(--text3)',marginBottom:10,display:'flex',alignItems:'center',gap:6}}>
        <span>↔</span> Drag cards between columns to move them
      </div>

      <div className="kanban-scroll">
        <div className="kanban" style={{gap:14}}>
          {PIPELINE_STAGES.map(stage => {
            const stageItems = filtered.filter(i=>i.status===stage);
            const isOver = dragOver === stage;
            return (
              <div key={stage} style={{width:220}}
                onDragOver={e=>handleColumnDragOver(e,stage)}
                onDragLeave={handleColumnDragLeave}
                onDrop={e=>handleColumnDrop(e,stage)}>
                <div style={{...glass,borderRadius:'14px 14px 0 0',padding:'12px 14px',borderBottom:'none',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <div style={{display:'flex',alignItems:'center',gap:6}}>
                    <span style={{fontSize:14}}>{STAGE_ICONS[stage]}</span>
                    <span style={{font:'600 11px var(--fd)',textTransform:'uppercase',letterSpacing:0.8,color:'var(--text)'}}>{stage}</span>
                  </div>
                  <span style={{font:'600 11px var(--fd)',color:'var(--text3)',background:'var(--accent-dim)',padding:'2px 8px',borderRadius:20}}>{stageItems.length}</span>
                </div>
                <div style={{
                  background: isOver ? 'rgba(252,198,18,0.12)' : 'rgba(255,255,255,0.35)',
                  border: isOver ? '2px dashed var(--accent)' : '1px solid rgba(255,255,255,0.5)',
                  borderRadius:'0 0 14px 14px',padding:8,minHeight:200,
                  display:'flex',flexDirection:'column',gap:8,backdropFilter:'blur(10px)',
                  transition:'all 0.2s ease',
                }}>
                  {stageItems.map(item => (
                    <div key={item.id}
                      draggable
                      onDragStart={e=>handleDragStart(e,item)}
                      onDragEnd={handleDragEnd}
                      onClick={()=>handleCardClick(item)}
                      className="dash-card-hover" style={{
                      background: dragging===item.id ? 'rgba(252,198,18,0.15)' : selectedCard===item.id ? 'rgba(252,198,18,0.08)' : 'rgba(255,255,255,0.85)',
                      border: dragging===item.id ? '1px solid var(--accent)' : selectedCard===item.id ? '1px solid var(--accent)' : '1px solid rgba(0,0,0,0.06)',
                      borderRadius:12,padding:'12px 14px',
                      cursor:'grab',backdropFilter:'blur(8px)',boxShadow:'var(--shadow-sm)',
                      transition:'all 0.15s ease',
                      userSelect:'none',
                    }}>
                      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                        <span style={{fontSize:16,cursor:'grab'}}>⠿</span>
                        <span style={{fontSize:14}}>{item.thumb}</span>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{font:'500 12px var(--fd)',color:'var(--text)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{item.title}</div>
                          <div style={{font:'400 10px var(--fb)',color:'var(--text3)',marginTop:1}}>{item.client}</div>
                        </div>
                      </div>
                      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                        <span style={{font:'500 10px var(--fb)',color:item.due&&item.due<"Mar 18"?'var(--red)':item.due&&item.due<="Mar 19"?'var(--amber)':'var(--text3)'}}>{item.due&&item.due<"Mar 18"?"⚠ OVERDUE":"Due "+item.due}</span>
                        <Badge type={item.type==="script"?"blue":"purple"}>{item.type==="script"?"Script":"Video"}</Badge>
                      </div>
                      {item.priority==="high" && <div style={{width:'100%',height:2,background:'var(--red)',borderRadius:2,marginTop:6,opacity:0.6}}/>}
                      {/* Expanded inline */}
                      {selectedCard===item.id && (
                        <div style={{marginTop:10,paddingTop:10,borderTop:'1px solid var(--border)'}} onClick={e=>e.stopPropagation()}>
                          <div style={{font:'400 11px var(--fb)',color:'var(--text2)',marginBottom:4}}>{item.type==="script"?"Maya R.":"Jordan T."} · {item.due}</div>
                          <div style={{display:'flex',gap:4,marginTop:6}}>
                            <StatusBadge status={item.status} options={["Scripting","Editing","Review","Approved","Scheduled","Published"]} onChange={(s)=>{moveItem(item,s);setSelectedCard(null);}}/>
                            <button className="btn" style={{flex:1,padding:'5px 8px',fontSize:10}} onClick={()=>{setDetailModal(item);setSelectedCard(null);}}>Details</button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {stageItems.length===0 && (
                    <div style={{padding:'24px 8px',textAlign:'center',font:'400 11px var(--fb)',color: isOver ? 'var(--accent)' : 'var(--text3)',opacity:0.6,transition:'color 0.2s'}}>
                      {isOver ? "Drop here" : "No items"}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail Modal */}
      {detailModal && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',backdropFilter:'blur(4px)',zIndex:300,display:'flex',alignItems:'center',justifyContent:'center',padding:20}} onClick={()=>setDetailModal(null)}>
          <div style={{background:'rgba(255,255,255,0.97)',backdropFilter:'blur(30px)',borderRadius:18,border:'1px solid var(--border2)',width:'100%',maxWidth:560,padding:'28px 24px',boxShadow:'0 20px 60px rgba(0,0,0,0.15)',maxHeight:'85vh',overflowY:'auto',animation:'slideUp 0.2s ease'}} onClick={e=>e.stopPropagation()}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
              <div>
                <div style={{font:'700 20px var(--fd)',color:'var(--text)'}}>{detailModal.title}</div>
                <div style={{font:'400 13px var(--fb)',color:'var(--text2)',marginTop:4}}>{detailModal.client} · {detailModal.type==="script"?"Script":"Video"}</div>
              </div>
              <button style={{background:'none',border:'none',fontSize:18,color:'var(--text3)',cursor:'pointer'}} onClick={()=>setDetailModal(null)}>✕</button>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginBottom:20}}>
              <div style={{padding:'12px',background:'var(--surface2)',borderRadius:10,border:'1px solid var(--border)'}}>
                <div style={{font:'400 9px var(--fd)',color:'var(--text3)',textTransform:'uppercase',letterSpacing:0.5,marginBottom:2}}>Status</div>
                <StatusBadge status={detailModal.status} options={["Scripting","Editing","Review","Approved","Scheduled","Published"]} onChange={(s)=>{moveItem(detailModal,s);setDetailModal(null);}}/>
              </div>
              <div style={{padding:'12px',background:'var(--surface2)',borderRadius:10,border:'1px solid var(--border)'}}>
                <div style={{font:'400 9px var(--fd)',color:'var(--text3)',textTransform:'uppercase',letterSpacing:0.5,marginBottom:2}}>Assigned</div>
                <div style={{font:'500 13px var(--fb)',color:'var(--text)'}}>{detailModal.type==="script"?"Maya R.":"Jordan T."}</div>
              </div>
              <div style={{padding:'12px',background:'var(--surface2)',borderRadius:10,border:'1px solid var(--border)'}}>
                <div style={{font:'400 9px var(--fd)',color:'var(--text3)',textTransform:'uppercase',letterSpacing:0.5,marginBottom:2}}>Due</div>
                <div style={{font:'500 13px var(--fb)',color:detailModal.due&&detailModal.due<"Mar 18"?'var(--red)':'var(--text)'}}>{detailModal.due}</div>
              </div>
            </div>
            {detailModal.source?.draft && (
              <div style={{marginBottom:16}}>
                <div style={{font:'600 11px var(--fd)',textTransform:'uppercase',letterSpacing:0.8,color:'var(--text3)',marginBottom:8}}>Script</div>
                <div style={{background:'var(--surface2)',border:'1px solid var(--border)',borderRadius:10,padding:'14px 16px',font:'400 12px var(--fb)',color:'var(--text)',lineHeight:1.7,whiteSpace:'pre-wrap'}}>{detailModal.source.draft}</div>
              </div>
            )}
            {!detailModal.source?.draft && (
              <div style={{marginBottom:16}}>
                <div style={{font:'600 11px var(--fd)',textTransform:'uppercase',letterSpacing:0.8,color:'var(--text3)',marginBottom:8}}>Details</div>
                <div style={{font:'400 13px var(--fb)',color:'var(--text2)',lineHeight:1.6}}>
                  {detailModal.type==="script" ? "Script in progress. Assigned to Maya R. for drafting." : "Video in "+detailModal.status.toLowerCase()+". Assigned to Jordan T."}
                </div>
              </div>
            )}
            <div style={{display:'flex',gap:8,marginBottom:16}}>
              <button className="btn primary" style={{flex:1}} onClick={()=>{moveItem(detailModal,detailModal.status==="Scripting"?"Editing":detailModal.status==="Editing"?"Review":"Approved");setDetailModal(null);}}>Advance →</button>
              <button className="btn" style={{flex:1}} onClick={()=>setDetailModal(null)}>Close</button>
            </div>
            <CommentThread itemId={`detail-${detailModal.id}`} showToast={showToast}/>
          </div>
        </div>
      )}
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
    showToast("✓","Approved!","Content approved and moving to production");fireConfetti();
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
      <PageTour steps={TOUR_STEPS.clientContent}/>
      <div className="client-hero">
        <div style={{fontFamily:"var(--fd)",fontSize:18,fontWeight:800}}>Desert Sun Realty</div>
        <div style={{fontSize:12,color:"var(--text2)",marginTop:3}}>Your content dashboard</div>
        <div style={{display:"flex",alignItems:"center",gap:8,marginTop:10,flexWrap:"wrap"}}>
          <span style={{fontFamily:"var(--fd)",fontSize:12,fontWeight:700,color:"var(--accent)"}}>Platinum Plan</span>
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

      {/* Video Gallery — completed content */}
      {items.filter(i=>i.status==="Published"||i.status==="Approved").length > 0 && (
        <div className="card">
          <div className="card-title">Your Videos</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))',gap:10}}>
            {items.filter(i=>i.status==="Published"||i.status==="Approved").map(d=>(
              <div key={d.id} className="dash-card-hover" style={{borderRadius:12,overflow:'hidden',border:'1px solid var(--border)',cursor:'pointer'}} onClick={()=>setSelectedItem(selectedItem===d.id?null:d.id)}>
                <div style={{height:120,background:'linear-gradient(135deg, #1a1a1a, #2d2d2d)',display:'flex',alignItems:'center',justifyContent:'center',position:'relative'}}>
                  <div style={{width:44,height:44,borderRadius:'50%',background:'rgba(255,255,255,0.15)',backdropFilter:'blur(8px)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,color:'white'}}>▶</div>
                  <div style={{position:'absolute',top:8,right:8}}><Badge type="green">{d.status}</Badge></div>
                  <div style={{position:'absolute',bottom:8,left:8,font:'500 10px var(--fd)',color:'rgba(255,255,255,0.8)',background:'rgba(0,0,0,0.5)',padding:'2px 8px',borderRadius:4}}>0:47</div>
                </div>
                <div style={{padding:'10px 12px'}}>
                  <div style={{font:'500 12px var(--fd)',color:'var(--text)',marginBottom:2}}>{d.title}</div>
                  <div style={{font:'400 10px var(--fb)',color:'var(--text3)'}}>{d.type}</div>
                </div>
              </div>
            ))}
          </div>
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
  const [platformTab, setPlatformTab] = useState("all");
  const myPosts = igPosts.filter(p=>p.client==="Desert Sun Realty");

  const allPosts = [
    ...myPosts.map(p=>({...p,platform:"Instagram"})),
    {id:101,client:"Desert Sun Realty",caption:"This Scottsdale listing sold in 48 hours. Here's why...",date:"Mar 16",thumb:"▶",status:"Published",platform:"TikTok",views:"12.4K",likes:840},
    {id:102,client:"Desert Sun Realty",caption:"POV: Your dream home has mountain views and a pool",date:"Mar 12",thumb:"▶",status:"Published",platform:"TikTok",views:"8.2K",likes:520},
    {id:103,client:"Desert Sun Realty",caption:"3 things to look for at every open house",date:"Mar 8",thumb:"▶",status:"Published",platform:"TikTok",views:"15.1K",likes:1100},
  ];

  const filtered = platformTab==="all" ? allPosts : allPosts.filter(p=>p.platform===platformTab);
  const platforms = [{key:"all",label:"All"},{key:"Instagram",label:"Instagram"},{key:"TikTok",label:"TikTok"}];

  return (
    <div>
      <PageTour steps={TOUR_STEPS.clientSocial}/>
      {/* Platform tabs */}
      <div style={{display:'flex',gap:4,marginBottom:16,borderBottom:'1px solid var(--border)'}}>
        {platforms.map(p=>(
          <button key={p.key} onClick={()=>setPlatformTab(p.key)} style={{
            padding:'10px 16px',border:'none',background:'none',cursor:'pointer',
            font:`${platformTab===p.key?600:400} 12px var(--fd)`,
            color:platformTab===p.key?'var(--accent)':'var(--text3)',
            borderBottom:platformTab===p.key?'2px solid var(--accent)':'2px solid transparent',
          }}>{p.label}</button>
        ))}
      </div>

      {/* Video gallery */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))',gap:12,marginBottom:16}}>
        {filtered.map(p=>(
          <div key={p.id} className="dash-card-hover" style={{
            background:'var(--surface)',border:'1px solid var(--border)',borderRadius:14,overflow:'hidden',cursor:'pointer',
            backdropFilter:'blur(12px)',boxShadow:'var(--shadow-sm)',
          }} onClick={()=>setSelectedPost(selectedPost===p.id?null:p.id)}>
            {/* Video preview area */}
            <div style={{height:140,background:'linear-gradient(135deg, #1a1a1a, #2a2a2a)',display:'flex',alignItems:'center',justifyContent:'center',position:'relative'}}>
              <div style={{width:48,height:48,borderRadius:'50%',background:'rgba(255,255,255,0.15)',backdropFilter:'blur(8px)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,color:'white',cursor:'pointer'}}>▶</div>
              <div style={{position:'absolute',top:8,left:8}}><Badge type={p.platform==="TikTok"?"blue":"purple"}>{p.platform}</Badge></div>
              <div style={{position:'absolute',top:8,right:8}}><Badge type={p.status==="Published"?"green":"amber"}>{p.status}</Badge></div>
              {p.views && <div style={{position:'absolute',bottom:8,right:8,font:'500 10px var(--fd)',color:'rgba(255,255,255,0.8)',background:'rgba(0,0,0,0.5)',padding:'2px 8px',borderRadius:4}}>{p.views} views</div>}
            </div>
            <div style={{padding:'12px 14px'}}>
              <div style={{font:'500 12px var(--fb)',color:'var(--text)',lineHeight:1.4,marginBottom:4,overflow:'hidden',textOverflow:'ellipsis',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical'}}>{p.caption}</div>
              <div style={{font:'400 10px var(--fb)',color:'var(--text3)'}}>{p.date}{p.likes?` · ${p.likes} likes`:""}</div>
            </div>
            {selectedPost===p.id && (
              <div style={{padding:'0 14px 14px',borderTop:'1px solid var(--border)',paddingTop:10}}>
                <div style={{font:'400 12px var(--fb)',color:'var(--text2)',lineHeight:1.6,marginBottom:8}}>{p.caption}</div>
                <div style={{display:'flex',gap:6}}>
                  <button className="btn" style={{flex:1,fontSize:11,padding:'6px 10px'}} onClick={(e)=>{e.stopPropagation();navigator.clipboard?.writeText(p.caption);}}>Copy Caption</button>
                  <button className="btn" style={{flex:1,fontSize:11,padding:'6px 10px'}} onClick={(e)=>{e.stopPropagation();}}>View Insights</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Performance */}
      <div className="card">
        <div className="card-title">Performance Across Platforms</div>
        <div className="stats-grid" style={{marginBottom:0}}>
          <div className="stat-card"><div className="stat-label">Instagram Reach</div><div className="stat-value" style={{fontSize:20}}>4,200</div><div className="stat-sub">avg per reel</div></div>
          <div className="stat-card"><div className="stat-label">TikTok Views</div><div className="stat-value" style={{fontSize:20}}>11.9K</div><div className="stat-sub">avg per video</div></div>
          <div className="stat-card"><div className="stat-label">Engagement Rate</div><div className="stat-value" style={{fontSize:20}}>6.8%</div><div className="stat-sub">across platforms</div></div>
          <div className="stat-card"><div className="stat-label">Followers Gained</div><div className="stat-value" style={{fontSize:20}}>+842</div><div className="stat-sub">this month</div></div>
        </div>
      </div>
    </div>
  );
}

function ClientInvoices({ showToast }) {
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoices, setInvoices] = useState([
    {id:1,month:"March 2025",amount:"$5,000",status:"Due Apr 1",paid:false,processing:false,items:[{name:"Platinum Plan — 20 videos/mo",amount:"$5,000"},{name:"Google Ads management",amount:"Included"},{name:"Strategy call + sales coaching",amount:"Included"}]},
    {id:2,month:"February 2025",amount:"$5,000",status:"Paid Feb 28",paid:true,processing:false,items:[{name:"Platinum Plan — 20 videos/mo",amount:"$5,000"},{name:"Ad spend pass-through",amount:"$1,200 (separate)"}]},
    {id:3,month:"January 2025",amount:"$5,000",status:"Paid Jan 31",paid:true,processing:false,items:[{name:"Platinum Plan — 20 videos/mo",amount:"$5,000"}]},
    {id:4,month:"December 2024",amount:"$5,000",status:"Paid Dec 31",paid:true,processing:false,items:[{name:"Platinum Plan — 20 videos/mo",amount:"$5,000"}]},
  ]);
  const handlePay = (id) => {
    setInvoices(p=>p.map(inv=>inv.id===id?{...inv,processing:true}:inv));
    setTimeout(()=>{
      setInvoices(p=>p.map(inv=>inv.id===id?{...inv,processing:false,paid:true,status:"Paid Mar 17"}:inv));
      showToast("✓","Payment Complete","Invoice has been paid");
    },2000);
  };
  return (
    <div className="card">
      <PageTour steps={TOUR_STEPS.clientInvoices}/>
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
              <div style={{fontSize:11,color:"var(--text3)",textTransform:"uppercase",letterSpacing:"0.8px",fontWeight:600,marginBottom:6}}>Invoice #{inv.id.toString().padStart(4,"0")}</div>
              <div className="row-item" style={{paddingTop:0}}><div className="row-main"><div className="row-title">Period</div><div className="row-sub">{inv.month}</div></div></div>
              {inv.items?.map((item,idx)=>(
                <div key={idx} className="row-item"><div className="row-main"><div className="row-title">{item.name}</div></div><div style={{fontFamily:"var(--fd)",fontSize:12,fontWeight:700}}>{item.amount}</div></div>
              ))}
              <div style={{borderTop:'1px solid var(--border)',paddingTop:8,marginTop:4,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span style={{font:'600 12px var(--fd)',color:'var(--text)'}}>Total</span>
                <span style={{font:'700 16px var(--fd)',color:'var(--text)'}}>{inv.amount}</span>
              </div>
              <div className="row-item"><div className="row-main"><div className="row-title">Status</div></div><Badge type={inv.paid?"green":"amber"}>{inv.paid?"Paid":"Due"}</Badge></div>
              <div style={{display:'flex',gap:6,marginTop:8}}>
                {!inv.paid && !inv.processing && <button className="btn primary" style={{flex:1}} onClick={()=>handlePay(inv.id)}>Pay Now</button>}
                {inv.paid && <button className="btn" style={{flex:1}} onClick={()=>showToast("✓","Downloaded","Receipt PDF downloaded")}>Download Receipt</button>}
                <button className="btn" style={{flex:1}} onClick={()=>showToast("✓","Sent","Invoice sent to email")}>Email Invoice</button>
              </div>
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
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({name:"",industry:"",plan:"Copper",ig:"",tone:"",audience:"",hashtags:"",colors:["#000000","#FFFFFF","#FFB800"]});
  const colors = ["#3B82F6","#A855F7","#22C55E","#FFB800","#FF5C00","#EF4444"];
  const steps = [{num:1,label:"Business Info"},{num:2,label:"Plan & Socials"},{num:3,label:"Brand Kit"}];

  const submit = () => {
    if(!form.name.trim()) return;
    const brandColor = colors[Math.floor(Math.random()*colors.length)];
    onAdd({
      id:Date.now(), name:form.name, industry:form.industry||"general", plan:form.plan,
      status:"onboarding", stage:"Onboarding", nextPost:"—", color:brandColor, videos:0,
      mrr:{Copper:1500,Gold:3000,Platinum:5000}[form.plan],
      brandKit:{colors:form.colors,tone:form.tone||"Professional and engaging",hashtags:(form.hashtags||"").split(",").map(h=>h.trim()).filter(Boolean),audience:form.audience||"General",ig:form.ig||"—"},
      metrics:{followers:0,gained:0,avgViews:0,avgLikes:0,engRate:0,topPost:"—"},
    });
    onClose();
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet" style={{maxWidth:520,margin:'0 auto'}} onClick={e=>e.stopPropagation()}>
        <div className="sheet-handle"/>
        <div className="sheet-title">New Client Onboarding</div>
        {/* Step indicator */}
        <div style={{display:'flex',gap:8,marginBottom:20}}>
          {steps.map(s=>(
            <div key={s.num} style={{flex:1,textAlign:'center'}}>
              <div style={{height:3,borderRadius:2,background:step>=s.num?'var(--accent)':'var(--border2)',marginBottom:6,transition:'background 0.2s'}}/>
              <span style={{font:`${step===s.num?600:400} 10px var(--fd)`,color:step>=s.num?'var(--accent)':'var(--text3)',textTransform:'uppercase',letterSpacing:0.8}}>{s.label}</span>
            </div>
          ))}
        </div>

        {step===1 && (<>
          <div className="form-group"><label className="form-label">Business Name *</label><input className="form-input" placeholder="e.g. Scottsdale Med Spa" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))}/></div>
          <div className="form-group"><label className="form-label">Industry</label><input className="form-input" placeholder="e.g. med spa, restaurant, law firm" value={form.industry} onChange={e=>setForm(p=>({...p,industry:e.target.value}))}/></div>
          <div className="form-group"><label className="form-label">Target Audience</label><input className="form-input" placeholder="e.g. Women 25-45, Phoenix area" value={form.audience} onChange={e=>setForm(p=>({...p,audience:e.target.value}))}/></div>
          <div className="form-actions">
            <button className="btn" onClick={onClose}>Cancel</button>
            <button className="btn primary" onClick={()=>form.name.trim()&&setStep(2)}>Next →</button>
          </div>
        </>)}

        {step===2 && (<>
          <div className="form-group"><label className="form-label">Plan</label>
            <div style={{display:'flex',gap:8}}>
              {["Copper","Gold","Platinum"].map(p=>(
                <button key={p} className={`action-btn ${form.plan===p?"accent":""}`} style={{flex:1,padding:'12px 8px',fontSize:12,fontWeight:600}} onClick={()=>setForm(f=>({...f,plan:p}))}>
                  <div>{p}</div>
                  <div style={{font:'400 10px var(--fb)',marginTop:2,color:'var(--text3)'}}>{p==="Copper"?"4 vids/mo":p==="Gold"?"8 vids/mo":"20 vids/mo"}</div>
                </button>
              ))}
            </div>
          </div>
          <div className="form-group"><label className="form-label">Instagram Handle</label><input className="form-input" placeholder="@theiraccount" value={form.ig} onChange={e=>setForm(p=>({...p,ig:e.target.value}))}/></div>
          <div className="form-actions">
            <button className="btn" onClick={()=>setStep(1)}>← Back</button>
            <button className="btn primary" onClick={()=>setStep(3)}>Next →</button>
          </div>
        </>)}

        {step===3 && (<>
          <div className="form-group"><label className="form-label">Brand Tone / Voice</label><input className="form-input" placeholder="e.g. Fun, casual, mouth-watering" value={form.tone} onChange={e=>setForm(p=>({...p,tone:e.target.value}))}/></div>
          <div className="form-group"><label className="form-label">Key Hashtags</label><input className="form-input" placeholder="#BrandName, #Industry, #Location (comma separated)" value={form.hashtags} onChange={e=>setForm(p=>({...p,hashtags:e.target.value}))}/></div>
          <div className="form-group"><label className="form-label">Brand Colors</label>
            <div style={{display:'flex',gap:8,alignItems:'center'}}>
              {form.colors.map((c,i)=>(
                <input key={i} type="color" value={c} onChange={e=>{const nc=[...form.colors];nc[i]=e.target.value;setForm(p=>({...p,colors:nc}));}} style={{width:36,height:36,borderRadius:8,border:'1px solid var(--border2)',cursor:'pointer',padding:2}}/>
              ))}
              <span style={{font:'400 10px var(--fb)',color:'var(--text3)'}}>Primary, Secondary, Accent</span>
            </div>
          </div>
          <div className="form-actions">
            <button className="btn" onClick={()=>setStep(2)}>← Back</button>
            <button className="btn primary" onClick={submit}>✅ Complete Onboarding</button>
          </div>
        </>)}
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
  admin:        [{label:"Dashboard",icon:"◆",view:"dashboard"},{label:"Pipeline",icon:"◎",view:"pipeline"},{label:"Library",icon:"▦",view:"library"},{label:"Scheduler",icon:"◫",view:"scheduler"},{label:"Shoots",icon:"▶",view:"shoots"},{label:"Calls",icon:"◉",view:"coaching"},{label:"Team",icon:"◈",view:"team"},{label:"Clients",icon:"▣",view:"clients"},{label:"Revenue",icon:"$",view:"revenue"},{label:"Expenses",icon:"−",view:"expenses"},{label:"Reports",icon:"▤",view:"reports"},{label:"Ads",icon:"◐",view:"ads"},{label:"Settings",icon:"⟐",view:"settings"}],
  sales:        [{label:"Pipeline",icon:"◎",view:"dashboard",badge:3},{label:"Comms",icon:"◉",view:"calls"},{label:"Lead Finder",icon:"◇",view:"finder"},{label:"Proposals",icon:"◫",view:"proposals"},{label:"Leads",icon:"◆",view:"leads"},{label:"Activity",icon:"▤",view:"activity"}],
  scriptwriter: [{label:"Queue",icon:"▤",view:"dashboard",badge:2},{label:"Templates",icon:"◫",view:"templates"},{label:"Done",icon:"✓",view:"completed"}],
  editor:       [{label:"Production",icon:"▶",view:"dashboard",badge:2},{label:"Upload",icon:"△",view:"upload"},{label:"Done",icon:"✓",view:"completed"}],
  client:       [{label:"Content",icon:"▶",view:"dashboard"},{label:"Instagram",icon:"◎",view:"instagram"},{label:"Ads",icon:"◐",view:"ads"},{label:"Invoices",icon:"▤",view:"invoices"},{label:"Team",icon:"◈",view:"team"}],
};
const TITLES = {admin:"Admin",sales:"Sales",scriptwriter:"Scripts",editor:"Production",client:"My Content"};

// ─── HELP CHATBOT ────────────────────────────────────────────────────────────
const HELP_KB = {
  dashboard:["Your command center. Shows MRR, active clients, content performance, and quick actions.","KPI cards link to deeper pages. The welcome hero shows your total revenue."],
  pipeline:["Drag-and-drop Kanban board for all content. 6 columns from Scripting to Published.","Click any card to see details, change status, or leave comments. Filter by client at the top."],
  library:["Central hub for all finished videos, raw footage, and photos.","Filter by type. Click to see specs, download, share links, or reuse content."],
  scheduler:["Multi-platform post scheduler for Instagram, TikTok, and Facebook.","Peak time indicators help you post when engagement is highest. Publish now or schedule for later."],
  shoots:["Schedule and track filming sessions. Set crew, location, and notes.","Confirm shoots, reschedule, or message the crew directly."],
  coaching:["Track all coaching sessions — camera coaching, strategy calls, sales coaching, and weekly 1:1s.","Sabrina's weekly team meetings show here too."],
  team:["See who's working on what. Capacity bars show workload at a glance.","Red = overloaded, amber = busy, green = available."],
  clients:["Full 6-tab detail for each client: Overview, Content, Ads, Shoots, Analytics, Brand Kit.","Click any field to edit inline. Status badges are clickable dropdowns."],
  revenue:["Agency financials — MRR by client, profit margin, plan distribution.","Revenue pulls from client plans. Expenses feed from the Expenses page."],
  expenses:["Add, edit, and delete expenses. QuickBooks syncs automatically.","Click any dollar amount to edit inline. Toggle recurring vs one-time."],
  reports:["Generate monthly performance reports for any client with one click.","Reports show videos delivered, follower growth, engagement, ad ROI. Download PDF or email to client."],
  ads:["Track Facebook, Instagram, and Google Ads campaigns.","See spend, impressions, CTR, conversions, and ROAS. Create new campaigns with the + button."],
  calls:["Communication hub — calls, texts, and emails in one place.","Call history shows outcomes. Texts have threaded conversations. Emails have full bodies with open tracking."],
  finder:["Scan Arizona businesses to find prospects with weak social media.","Score-based leads — Hot (85+), Warm (65+), Cool. One-click add to pipeline."],
  proposals:["Create and track client proposals with plan selection and pricing.","See if prospects opened your proposal."],
  templates:["Reusable script templates by industry.","Copy any template and customize it for your client. Usage counts show popularity."],
};

function HelpChatbot({ currentView, currentRole }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(()=>{messagesEndRef.current?.scrollIntoView({behavior:'smooth'});},[messages]);
  useEffect(()=>{if(open)setTimeout(()=>inputRef.current?.focus(),200);},[open]);

  const getResponse = (text) => {
    const q = text.toLowerCase();
    // Page-specific
    const pageKB = HELP_KB[currentView];
    if (pageKB && (q.includes("this page")||q.includes("what is this")||q.includes("how do i")||q.includes("help")||q.includes("what can"))) return pageKB.join(" ");
    // Feature lookups
    if (q.includes("pipeline")||q.includes("kanban")) return "The Pipeline is a drag-and-drop Kanban board. Drag cards between columns to change status. Click any card for details. Filter by client at the top.";
    if (q.includes("client")||q.includes("customer")) return "Go to Clients in the sidebar. Click any client for a 6-tab detail page: Overview, Content, Ads, Shoots, Analytics, Brand Kit. You can edit names, MRR, and industry inline.";
    if (q.includes("shoot")||q.includes("filming")) return "Shoots are in the sidebar. Schedule filming sessions with date, time, location, and crew. Confirm or reschedule from the detail view.";
    if (q.includes("revenue")||q.includes("money")||q.includes("mrr")) return "Revenue page shows your full financials — MRR by client, profit/loss, plan distribution. Expenses are tracked separately and sync with QuickBooks.";
    if (q.includes("expense")||q.includes("cost")) return "Go to Expenses in the sidebar. Add new expenses, edit amounts inline, and sync with QuickBooks. Recurring vs one-time breakdown at the top.";
    if (q.includes("report")) return "Reports page lets you generate monthly client performance reports. Select a client, click Generate, and get a full report with videos, followers, engagement, and ROI. Download as PDF.";
    if (q.includes("ad")||q.includes("campaign")||q.includes("facebook")||q.includes("google")) return "Ads page tracks all campaigns across Facebook, Instagram, and Google Ads. See spend, impressions, CTR, conversions, and ROAS.";
    if (q.includes("lead")||q.includes("prospect")) return "Lead Finder scans for Arizona businesses needing content. Sales Pipeline tracks leads through stages. Comms hub handles calls, texts, and emails.";
    if (q.includes("script")||q.includes("writing")) return "Script Writer role has a queue with AI tools. Generate content ideas per client, use templates, or write from scratch. Scripts follow HOOK/SETUP/BODY/CTA format.";
    if (q.includes("video")||q.includes("edit")||q.includes("editor")) return "Video Editor role shows the production queue with file specs, edit checklist, and session timer. Track editing time and send to review when done.";
    if (q.includes("message")||q.includes("chat")||q.includes("tag")) return "Messages are in the sidebar. Type @ to tag people, projects, shoots, or campaigns. Tags show as highlighted pills with rich preview cards.";
    if (q.includes("dark mode")||q.includes("theme")) return "Go to Settings and scroll to Appearance. Toggle dark mode with the switch. The entire app switches themes.";
    if (q.includes("search")||q.includes("find")) return "Press Cmd+K (or click the search button in the topbar) to search across clients, scripts, videos, and leads.";
    if (q.includes("plan")||q.includes("copper")||q.includes("gold")||q.includes("platinum")) return "Three plans: Copper ($1,500/mo, 4 videos), Gold ($3,000/mo, 8 videos), Platinum ($5,000/mo, 20 videos). Each includes different levels of shoots, ads, coaching, and management.";
    if (q.includes("role")||q.includes("switch")) return "Click the role button at the bottom of the sidebar to switch between Admin, Sales Rep, Script Writer, Video Editor, and Client views.";
    if (q.includes("approval")||q.includes("approve")) return "When content reaches Review status, clients see it in their portal. They can read the script and either Approve (with confetti!) or Request Changes with notes.";
    if (q.includes("comment")) return "Comments are available on pipeline items, videos, shoots, and calendar posts. Type @ to tag team members. Comments show author and timestamp.";
    if (q.includes("invoice")||q.includes("payment")||q.includes("billing")) return "Client Invoices show in the client portal. Each invoice has line items, Pay Now with processing animation, and Download Receipt for paid invoices.";
    if (q.includes("calendar")||q.includes("content calendar")) return "Content Calendar has Grid and List views. Generate with AI or add posts manually. Click any post for full detail — edit script, generate captions, assign team, change status.";
    if (q.includes("hello")||q.includes("hi")||q.includes("hey")) return "Hey! I'm here to help you navigate the Media4You platform. Ask me anything — how to use a feature, where to find something, or what a page does.";
    return "I can help with any part of the platform! Try asking about: Pipeline, Clients, Shoots, Revenue, Ads, Scripts, Reports, or any specific feature. You can also ask 'What is this page?' for help with wherever you are.";
  };

  const send = (text) => {
    if(!text.trim())return;
    const userMsg = {role:"user",content:text.trim()};
    const botMsg = {role:"assistant",content:getResponse(text)};
    setMessages(p=>[...p,userMsg,botMsg]);
    setInput("");
    const followUps = ["What is this page?","How do I switch roles?","How do plans work?","How do I approve content?"];
    setSuggestions(followUps.filter(q=>q.toLowerCase()!==text.toLowerCase()).slice(0,3));
  };

  return (<>
    {!open && (
      <button onClick={()=>setOpen(true)} style={{
        position:'fixed',bottom:20,right:20,zIndex:10001,width:52,height:52,borderRadius:'50%',
        background:'linear-gradient(135deg,var(--accent),var(--accent2))',border:'none',cursor:'pointer',
        boxShadow:'0 4px 20px rgba(252,198,18,0.35)',display:'flex',alignItems:'center',justifyContent:'center',
        transition:'transform 0.2s',
      }} onMouseEnter={e=>e.currentTarget.style.transform='scale(1.08)'} onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
      </button>
    )}
    {open && (
      <div style={{position:'fixed',bottom:20,right:20,zIndex:10002,width:380,maxWidth:'calc(100vw - 40px)',height:500,maxHeight:'calc(100vh - 100px)',background:'rgba(255,255,255,0.97)',backdropFilter:'blur(30px)',borderRadius:16,border:'1px solid var(--border2)',boxShadow:'0 20px 60px rgba(0,0,0,0.15)',display:'flex',flexDirection:'column',overflow:'hidden',animation:'slideUp 0.2s ease'}}>
        <div style={{padding:'16px 18px',background:'linear-gradient(135deg,#1a1a1a,#2a2a2a)',display:'flex',alignItems:'center',gap:10,flexShrink:0}}>
          <div style={{width:32,height:32,borderRadius:'50%',background:'linear-gradient(135deg,var(--accent),var(--accent2))',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontSize:14}}>◆</div>
          <div style={{flex:1}}><div style={{font:'600 15px var(--fd)',color:'white'}}>Media4You Assistant</div><div style={{font:'400 11px var(--fb)',color:'rgba(255,255,255,0.6)'}}>Ask me anything</div></div>
          <button onClick={()=>setOpen(false)} style={{width:32,height:32,borderRadius:8,background:'rgba(255,255,255,0.1)',border:'none',color:'rgba(255,255,255,0.7)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16}}>✕</button>
        </div>
        <div style={{flex:1,overflowY:'auto',padding:16,display:'flex',flexDirection:'column',gap:10,background:'var(--bg)'}}>
          {messages.length===0 && (
            <div style={{textAlign:'center',padding:'20px 8px'}}>
              <div style={{font:'600 16px var(--fd)',color:'var(--text)',marginBottom:6}}>Welcome!</div>
              <div style={{font:'400 13px var(--fb)',color:'var(--text2)',marginBottom:16}}>Ask me how to use any feature, or try these:</div>
            </div>
          )}
          {messages.map((m,i)=>(
            <div key={i} style={{display:'flex',justifyContent:m.role==="user"?'flex-end':'flex-start',gap:8}}>
              {m.role==="assistant"&&<div style={{width:24,height:24,borderRadius:'50%',background:'linear-gradient(135deg,var(--accent),var(--accent2))',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontSize:10,flexShrink:0,marginTop:2}}>◆</div>}
              <div style={{maxWidth:'80%',padding:'10px 14px',borderRadius:m.role==="user"?'14px 14px 4px 14px':'14px 14px 14px 4px',background:m.role==="user"?'linear-gradient(135deg,var(--accent),var(--accent2))':'var(--surface)',color:m.role==="user"?'white':'var(--text)',font:'400 13px/1.6 var(--fb)',border:m.role==="user"?'none':'1px solid var(--border)'}}>{m.content}</div>
            </div>
          ))}
          {suggestions.length>0&&(
            <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
              {messages.length>0&&<span style={{font:'600 10px var(--fd)',color:'var(--text3)',textTransform:'uppercase',letterSpacing:'0.05em',width:'100%',marginBottom:2}}>Try asking:</span>}
              {suggestions.map((q,i)=>(
                <button key={i} onClick={()=>send(q)} style={{padding:'6px 12px',borderRadius:20,background:'none',border:'1px solid rgba(252,198,18,0.3)',color:'var(--accent)',cursor:'pointer',font:'400 12px var(--fb)',transition:'all 0.15s'}}
                  onMouseEnter={e=>e.currentTarget.style.background='var(--accent-dim)'} onMouseLeave={e=>e.currentTarget.style.background='none'}>{q}</button>
              ))}
            </div>
          )}
          {messages.length===0&&(
            <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
              {["What is this page?","How do I use the pipeline?","How do plans work?","How do I switch roles?","How do I approve content?","How do I find new leads?"].map((q,i)=>(
                <button key={i} onClick={()=>send(q)} style={{padding:'6px 12px',borderRadius:20,background:'none',border:'1px solid rgba(252,198,18,0.3)',color:'var(--accent)',cursor:'pointer',font:'400 12px var(--fb)'}}
                  onMouseEnter={e=>e.currentTarget.style.background='var(--accent-dim)'} onMouseLeave={e=>e.currentTarget.style.background='none'}>{q}</button>
              ))}
            </div>
          )}
          <div ref={messagesEndRef}/>
        </div>
        <form onSubmit={e=>{e.preventDefault();send(input);}} style={{padding:'12px 14px',borderTop:'1px solid var(--border)',display:'flex',gap:8,background:'rgba(255,255,255,0.97)',flexShrink:0}}>
          <input ref={inputRef} value={input} onChange={e=>setInput(e.target.value)} placeholder="Ask me anything..." style={{flex:1,height:40,padding:'0 14px',border:'1px solid var(--border2)',borderRadius:10,font:'400 13px var(--fb)',color:'var(--text)',outline:'none',background:'var(--surface2)'}}
            onFocus={e=>e.target.style.borderColor='var(--accent)'} onBlur={e=>e.target.style.borderColor='var(--border2)'}/>
          <button type="submit" disabled={!input.trim()} style={{width:40,height:40,borderRadius:10,border:'none',background:input.trim()?'linear-gradient(135deg,var(--accent),var(--accent2))':'var(--border2)',color:input.trim()?'white':'var(--text3)',cursor:input.trim()?'pointer':'default',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22,2 15,22 11,13 2,9"/></svg>
          </button>
        </form>
      </div>
    )}
  </>);
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const isEmbed = new URLSearchParams(window.location.search).has('embed');

  // Hash-based routing: #role/view (e.g. #admin/pipeline)
  const parseHash = () => {
    const h = window.location.hash.replace("#","").split("/");
    return { role: h[0] || "admin", view: h[1] || "dashboard" };
  };
  const initHash = parseHash();
  const [role, setRole]           = useState(initHash.role);
  const [view, setView]           = useState(initHash.view);
  const [panel, setPanel]         = useState(null);
  const [panelData, setPanelData] = useState(null);
  const [sheetOpen, setSheet]     = useState(false);
  const [darkMode, setDarkMode]   = useState(false);

  // Sync hash on view/role change
  useEffect(() => { window.location.hash = `${role}/${view}`; }, [role, view]);
  // Listen for back/forward
  useEffect(() => {
    const onHash = () => { const h = parseHash(); setRole(h.role); setView(h.view); setPanel(null); };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  const [autoSelectClient, setAutoSelectClient] = useState(null);
  const [expenses, setExpenses] = useState([
    {id:1,category:"Team Payroll",amount:8500,recurring:true,note:"Maya, Jordan, Carlos — monthly salaries"},
    {id:2,category:"Ad Spend (pass-through)",amount:Math.round(AD_CAMPAIGNS.reduce((s,c)=>s+c.budget,0)*0.7),recurring:true,note:"Client ad budgets managed by M4Y"},
    {id:3,category:"Software & Tools",amount:420,recurring:true,note:"Adobe Creative Cloud, Canva Pro, Later, Metricool"},
    {id:4,category:"Equipment & Gear",amount:300,recurring:false,note:"Camera rentals, drone maintenance, lighting"},
    {id:5,category:"Office & Misc",amount:200,recurring:true,note:"Coworking space, supplies, misc"},
    {id:6,category:"Zoom Pro",amount:15,recurring:true,note:"Video call platform for client meetings"},
    {id:7,category:"Cloud Storage",amount:50,recurring:true,note:"Google Drive + Dropbox for raw footage"},
  ]);

  useEffect(() => { document.documentElement.classList.toggle("dark", darkMode); }, [darkMode]);
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
  const [threads, setThreads]     = useState(THREADS_BY_ROLE[initHash.role]||THREADS_BY_ROLE.admin);

  const roleInfo = ROLES.find(r=>r.key===role);
  const unreadNotifs = notifs.filter(n=>n.unread).length;
  const unreadMsgs = threads.reduce((s,t)=>s+t.unread,0);

  const showToast = (icon,text,sub="") => { setToast({icon,text,sub}); setTimeout(()=>setToast(null),2500); };
  const switchRole = (r) => { setRole(r);setView("dashboard");setPanel(null);setPanelData(null);setSubView(null);setSelScript(null);setSheet(false);setThreads(THREADS_BY_ROLE[r]||THREADS_BY_ROLE.admin); };
  const navTo = (v) => { setView(v);setPanel(null);setSubView(null);setSelScript(null); };
  const openPanel = (p,data=null) => { setPanel(p);setPanelData(data); };
  const closePanel = () => { setPanel(null);setPanelData(null); };

  const advanceVideo = (id, directStatus) => setVideos(p=>p.map(v=>v.id===id?{...v,status:directStatus||STATUS_FLOW[v.status]||v.status}:v));
  const scheduleVideo = (id) => {
    const v = videos.find(v=>v.id===id);
    setVideos(p=>p.map(v=>v.id===id?{...v,status:"Scheduled"}:v));
    if(v) setIgPosts(p=>[...p,{id:Date.now(),client:v.client,caption:`New content from ${v.client}...`,date:"TBD",thumb:v.thumb,status:"Scheduled"}]);
  };
  const updateScript = (id,status,draft) => setScripts(p=>p.map(s=>s.id===id?{...s,status,draft}:s));
  const addScriptFromIdea = (clientName, ideaTitle, draft) => {
    setScripts(p=>[...p,{id:Date.now(),client:clientName,type:ideaTitle,due:"TBD",priority:"med",status:"In Progress",draft}]);
  };
  const addClient = (c) => { setClients(p=>[...p,c]); showToast("✓","Client added",c.name+" is now onboarding"); };
  const addLead = (l) => { setLeads(p=>({...p,"New":[...p["New"],l]})); showToast("✓","Lead added",l.name+" added to pipeline"); };
  const sendMessage = (idx,text) => setThreads(p=>p.map((t,i)=>i===idx?{...t,unread:0,last:text,messages:[...t.messages,{id:Date.now(),from:"Me",mine:true,text,time:"Just now"}]}:t));

  const topbarActionLabel = {admin:"+ Client",sales:"+ Lead",scriptwriter:"✨ AI",editor:"+ Upload",client:"Contact"}[role];
  const topbarAction = () => {
    if(role==="admin") setModal("add-client");
    else if(role==="sales") setModal("add-lead");
    else if(role==="scriptwriter") showToast("●","AI Draft","Select a script first");
    else if(role==="editor") navTo("upload");
    else if(role==="client") openPanel("messages");
  };

  const currentTitle = panel==="notifs"?"Notifications":panel==="messages"?"Messages":TITLES[role];

  const renderMain = () => {
    if(selScript!==null && role==="scriptwriter") return <ScriptEditor script={scripts[selScript]} onBack={()=>setSelScript(null)} onUpdate={updateScript} showToast={showToast}/>;
    if(subView?.type==="client-detail") return null; // handled in panels

    if(role==="admin"){
      if(view==="dashboard") return <AdminDashboard clients={clients} onNav={navTo} onOpenIdeas={(c)=>openPanel("ideas",c)} onOpenCalendar={()=>openPanel("calendar")} onOpenClientDetail={(c)=>{setAutoSelectClient(c);navTo("clients");}} showToast={showToast}/>;
      if(view==="pipeline")  return <ContentPipeline scripts={scripts} videos={videos} onAdvanceVideo={advanceVideo} onUpdateScript={updateScript} showToast={showToast}/>;
      if(view==="library")   return <ContentLibrary showToast={showToast}/>;
      if(view==="scheduler") return <PlatformScheduler showToast={showToast}/>;
      if(view==="shoots")    return <ShootCalendar shoots={INIT_SHOOTS} showToast={showToast} onOpenMessages={()=>openPanel("messages")}/>;
      if(view==="coaching")  return <CoachingTracker sessions={INIT_COACHING} showToast={showToast}/>;
      if(view==="team")      return <TeamWorkload scripts={scripts} videos={videos}/>;
      if(view==="clients")   return <AdminClients clients={clients} showToast={showToast} onOpenIdeas={(c)=>openPanel("ideas",c)} autoSelect={autoSelectClient} onClearAutoSelect={()=>setAutoSelectClient(null)} onUpdateClient={(id,updates)=>setClients(p=>p.map(c=>c.id===id?{...c,...updates}:c))} onOpenMessages={()=>openPanel("messages")}/>;
      if(view==="revenue")   return <AdminRevenue clients={clients} expenses={expenses}/>;
      if(view==="expenses")  return <AdminExpenses expenses={expenses} setExpenses={setExpenses} showToast={showToast}/>;
      if(view==="reports")   return <ClientReportGenerator clients={clients} showToast={showToast}/>;
      if(view==="ads")       return <AdminAds showToast={showToast}/>;
      if(view==="settings")  return <AdminSettings showToast={showToast} darkMode={darkMode} setDarkMode={setDarkMode}/>;
    }
    if(role==="sales"){
      if(view==="dashboard") return <SalesDashboard leads={leads} onOpenOutreach={()=>openPanel("outreach")} showToast={showToast} onOpenComms={()=>navTo("calls")}/>;
      if(view==="calls")     return <SalesCalls showToast={showToast}/>;
      if(view==="finder")    return <LeadFinder onAddLead={addLead} showToast={showToast} onOpenOutreach={()=>openPanel("outreach")}/>;
      if(view==="proposals") return <ProposalGenerator showToast={showToast}/>;
      if(view==="leads")     return <SalesLeadsList leads={leads} showToast={showToast} onOpenComms={()=>navTo("calls")}/>;
      if(view==="activity")  return <SalesActivity/>;
    }
    if(role==="scriptwriter"){
      if(view==="dashboard") return <ScriptQueue scripts={scripts} onSelect={setSelScript} onOpenIdeas={(c)=>openPanel("ideas",c)} clients={clients} showToast={showToast}/>;
      if(view==="templates") return <ScriptTemplates showToast={showToast}/>;
      if(view==="completed") return <ScriptCompleted scripts={scripts}/>;
    }
    if(role==="editor"){
      if(view==="dashboard") return <EditorProduction videos={videos} onAdvance={advanceVideo} showToast={showToast}/>;
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
    return <div className="empty"><div className="empty-icon">◇</div><div className="empty-title">No content here yet</div></div>;
  };

  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Cmd+K shortcut
  useEffect(()=>{
    const handler = (e)=>{ if((e.metaKey||e.ctrlKey)&&e.key==="k"){e.preventDefault();setSearchOpen(p=>!p);} };
    window.addEventListener("keydown",handler);
    return ()=>window.removeEventListener("keydown",handler);
  },[]);

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
            <span className="sidebar-link-icon">◯</span>
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
        {!isEmbed && <SidebarContent />}

        {/* ═══ MOBILE SIDEBAR ═══ */}
        {!isEmbed && sidebarMobileOpen && <div className="mobile-sidebar-overlay" onClick={()=>setSidebarMobileOpen(false)}/>}
        {!isEmbed && sidebarMobileOpen && <SidebarContent mobile />}

        {/* ═══ MAIN AREA ═══ */}
        <div className="main-area" style={isEmbed ? {marginLeft:0} : undefined}>

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
                  <button onClick={()=>setSearchOpen(true)} style={{display:'flex',alignItems:'center',gap:8,padding:'6px 12px',borderRadius:100,border:'1px solid var(--border)',background:'rgba(255,255,255,0.5)',font:'400 12px var(--fb)',color:'var(--text3)',cursor:'pointer',backdropFilter:'blur(8px)'}}>
                    🔍 <span style={{font:'400 11px monospace',color:'var(--text3)'}}>⌘K</span>
                  </button>
                  <div className="topbar-divider"/>
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
              <NotificationsPanel notifs={notifs} onClear={()=>setNotifs(p=>p.map(n=>({...n,unread:false})))} onRead={(id)=>setNotifs(p=>p.map(n=>n.id===id?{...n,unread:false}:n))} onNavigate={(v)=>{navTo(v);closePanel();}}/>
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
          {/* client-detail panel now redirects to full Clients page */}
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

        {searchOpen && <GlobalSearch clients={clients} scripts={scripts} videos={videos} leads={leads} onClose={()=>setSearchOpen(false)} onNavigate={navTo} showToast={showToast}/>}
        {modal==="add-client"&&<AddClientModal onClose={()=>setModal(null)} onAdd={addClient}/>}
        {modal==="add-lead"  &&<AddLeadModal   onClose={()=>setModal(null)} onAdd={addLead}/>}
        <HelpChatbot currentView={view} currentRole={role}/>
        <Toast toast={toast}/>
      </div>
    </>
  );
}
