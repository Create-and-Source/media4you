import { useState, useRef, useEffect } from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

// ─── STYLES ───────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; -webkit-tap-highlight-color:transparent; }
  :root {
    --bg: #F0EDF5;
    --bg2: #EAE5F2;
    --surface: rgba(255,255,255,0.75);
    --surface2: rgba(255,255,255,0.55);
    --surface3: rgba(255,255,255,0.35);
    --border: rgba(180,160,210,0.25);
    --border2: rgba(180,160,210,0.4);
    --accent: #8B5E8B;
    --accent2: #B07FC0;
    --accent-dim: rgba(139,94,139,0.1);
    --accent-glow: rgba(139,94,139,0.2);
    --green: #5BA88A;
    --blue: #5B8DC8;
    --purple: #9B72B8;
    --red: #C86B7A;
    --amber: #C8A45B;
    --text: #2A1F3D;
    --text2: #7A6B8A;
    --text3: #B0A4BC;
    --shadow: 0 4px 24px rgba(100,70,140,0.10);
    --shadow-sm: 0 2px 12px rgba(100,70,140,0.08);
    --fd: 'Cormorant Garamond', serif;
    --fb: 'DM Sans', sans-serif;
    --bnav: 64px;
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
      radial-gradient(ellipse 80% 60% at 20% 10%, rgba(200,180,230,0.35) 0%, transparent 60%),
      radial-gradient(ellipse 60% 50% at 80% 80%, rgba(180,210,220,0.25) 0%, transparent 60%),
      radial-gradient(ellipse 50% 40% at 60% 30%, rgba(220,190,240,0.2) 0%, transparent 60%);
    pointer-events: none;
    z-index: 0;
  }

  .app { display:flex; flex-direction:column; height:100dvh; overflow:hidden; position:relative; z-index:1; }

  /* TOPBAR */
  .topbar {
    display:flex; align-items:center; justify-content:space-between;
    padding:0 16px; height:56px;
    background: rgba(255,255,255,0.8);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
    flex-shrink:0; gap:8px;
    box-shadow: 0 1px 20px rgba(100,70,140,0.06);
  }
  .t-left { display:flex; align-items:center; gap:8px; min-width:0; }
  .t-logo { font-family:var(--fd); font-size:19px; font-weight:700; white-space:nowrap; flex-shrink:0; letter-spacing:0.3px; color:var(--text); }
  .t-logo span { color:var(--accent); }
  .t-sep { color:var(--text3); flex-shrink:0; }
  .t-title { font-size:13px; font-weight:400; color:var(--text2); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; letter-spacing:0.2px; }
  .t-right { display:flex; align-items:center; gap:7px; flex-shrink:0; }
  .role-chip {
    display:flex; align-items:center; gap:6px; padding:5px 12px 5px 8px;
    background: var(--surface); border:1px solid var(--border2); border-radius:20px;
    cursor:pointer; font-size:11px; color:var(--text2); font-weight:500;
    backdrop-filter: blur(10px); box-shadow: var(--shadow-sm);
  }
  .chip-dot { width:7px; height:7px; border-radius:50%; flex-shrink:0; }
  .bell-btn {
    position:relative; width:34px; height:34px; border-radius:10px;
    border:1px solid var(--border2);
    background: var(--surface);
    backdrop-filter: blur(10px);
    display:flex; align-items:center; justify-content:center; font-size:15px; cursor:pointer; flex-shrink:0;
    box-shadow: var(--shadow-sm);
  }
  .bell-dot { position:absolute; top:6px; right:6px; width:6px; height:6px; border-radius:50%; background:var(--red); border:1.5px solid white; }
  .top-action-btn {
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    border:none; color:white; font-size:11px; font-weight:600; font-family:var(--fb);
    padding:0 14px; height:34px; border-radius:20px; cursor:pointer; white-space:nowrap;
    box-shadow: 0 4px 14px rgba(139,94,139,0.35); letter-spacing:0.2px;
  }

  /* CONTENT */
  .content { flex:1; overflow-y:auto; padding:14px; padding-bottom:calc(var(--bnav) + 14px); }

  /* BOTTOM NAV */
  .bnav {
    position:fixed; bottom:0; left:0; right:0; height:var(--bnav);
    background: rgba(255,255,255,0.85);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border-top:1px solid var(--border);
    display:flex; align-items:stretch; z-index:100;
    padding-bottom:env(safe-area-inset-bottom);
    box-shadow: 0 -4px 20px rgba(100,70,140,0.07);
  }
  .bnav-item { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:3px; padding:8px 2px; cursor:pointer; position:relative; }
  .bnav-icon { font-size:18px; line-height:1; }
  .bnav-label { font-size:9px; color:var(--text3); font-weight:500; text-transform:uppercase; letter-spacing:0.6px; transition:color 0.15s; }
  .bnav-item.active .bnav-label { color:var(--accent); }
  .bnav-item.active::after { content:''; position:absolute; top:0; left:25%; right:25%; height:2px; background:linear-gradient(90deg,var(--accent),var(--accent2)); border-radius:0 0 3px 3px; }
  .bnav-badge { position:absolute; top:5px; right:calc(50% - 16px); background:var(--red); color:white; font-size:8px; font-weight:700; padding:1px 4px; border-radius:8px; min-width:14px; text-align:center; }

  /* OVERLAY / SHEETS */
  .overlay { position:fixed; inset:0; background:rgba(30,15,50,0.35); backdrop-filter:blur(4px); z-index:200; display:flex; align-items:flex-end; }
  .sheet {
    background: rgba(255,255,255,0.92);
    backdrop-filter: blur(30px);
    -webkit-backdrop-filter: blur(30px);
    border-radius:22px 22px 0 0; border:1px solid var(--border2); border-bottom:none;
    width:100%; padding:0 16px 32px; max-height:90dvh; overflow-y:auto;
    box-shadow: 0 -8px 40px rgba(100,70,140,0.15);
  }
  .sheet-handle { width:36px; height:4px; background:var(--text3); border-radius:2px; margin:14px auto 18px; opacity:0.4; }
  .sheet-title { font-family:var(--fd); font-size:20px; font-weight:600; color:var(--text); margin-bottom:4px; }
  .sheet-sub { font-size:12px; color:var(--text2); margin-bottom:16px; }

  /* FULL SCREEN PANELS */
  .full-panel { position:fixed; inset:0; top:56px; background:var(--bg); z-index:150; display:flex; flex-direction:column; animation:slideUp 0.22s ease; }
  .full-panel-scroll { flex:1; overflow-y:auto; padding:14px; padding-bottom:calc(var(--bnav)+14px); }
  @keyframes slideUp { from { transform:translateY(10px); opacity:0; } to { transform:translateY(0); opacity:1; } }

  /* AI COMPONENTS */
  .ai-btn {
    display:flex; align-items:center; gap:12px; padding:14px 16px;
    background: linear-gradient(135deg, rgba(139,94,139,0.08), rgba(176,127,192,0.06));
    border:1px solid rgba(139,94,139,0.25); border-radius:14px;
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
    background: linear-gradient(135deg, rgba(139,94,139,0.07), rgba(176,127,192,0.05));
    border:1px solid rgba(139,94,139,0.2); border-radius:12px; margin-bottom:12px;
  }
  .ai-loading-text { font-size:13px; color:var(--accent); font-weight:500; }
  .ai-loading-sub { font-size:11px; color:var(--text2); margin-top:2px; }

  /* IDEA CARDS */
  .idea-card {
    background: var(--surface); border:1px solid var(--border); border-radius:14px;
    padding:14px 16px; margin-bottom:8px; cursor:pointer; transition:all 0.18s;
    backdrop-filter: blur(12px); box-shadow: var(--shadow-sm);
  }
  .idea-card:active { border-color:var(--accent2); box-shadow:0 4px 20px rgba(139,94,139,0.15); }
  .idea-card-header { display:flex; align-items:flex-start; gap:10px; margin-bottom:6px; }
  .idea-num { font-family:var(--fd); font-size:11px; font-weight:700; color:var(--accent); background:var(--accent-dim); padding:2px 8px; border-radius:20px; flex-shrink:0; border:1px solid rgba(139,94,139,0.2); }
  .idea-title { font-size:14px; font-weight:600; color:var(--text); line-height:1.3; font-family:var(--fd); }
  .idea-desc { font-size:12px; color:var(--text2); line-height:1.6; margin-bottom:8px; }
  .idea-footer { display:flex; align-items:center; gap:8px; }
  .idea-tag { font-size:10px; color:var(--text2); background:var(--surface2); border:1px solid var(--border); padding:2px 9px; border-radius:20px; }
  .idea-script-btn { margin-left:auto; padding:6px 14px; background:linear-gradient(135deg,var(--accent),var(--accent2)); border:none; color:white; font-size:11px; font-weight:600; font-family:var(--fb); border-radius:20px; cursor:pointer; box-shadow:0 3px 10px rgba(139,94,139,0.3); }

  /* CALENDAR */
  .cal-week { display:grid; grid-template-columns:repeat(7,1fr); gap:4px; margin-bottom:4px; }
  .cal-day-label { text-align:center; font-size:9px; color:var(--text3); font-weight:600; text-transform:uppercase; padding:4px 0; }
  .cal-day { aspect-ratio:1; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:500; color:var(--text3); background:var(--surface2); cursor:pointer; position:relative; border:1px solid var(--border); backdrop-filter:blur(8px); }
  .cal-day.has-post { background:var(--accent-dim); border-color:rgba(139,94,139,0.35); color:var(--accent); }
  .cal-day.today { border-color:var(--accent2); color:var(--text); font-weight:700; }
  .cal-post-dot { position:absolute; bottom:3px; left:50%; transform:translateX(-50%); width:4px; height:4px; border-radius:50%; background:var(--accent); }
  .cal-post-item { display:flex; gap:10px; padding:10px 0; border-bottom:1px solid var(--border); }
  .cal-post-item:last-child { border-bottom:none; }
  .cal-post-date { font-family:var(--fd); font-size:13px; font-weight:700; color:var(--accent); min-width:42px; }
  .cal-post-info { flex:1; min-width:0; }
  .cal-post-title { font-size:12px; font-weight:500; color:var(--text); }
  .cal-post-client { font-size:10px; color:var(--text3); margin-top:1px; }

  /* CAPTION / OUTREACH RESULTS */
  .caption-result { background:rgba(255,255,255,0.6); border:1px solid var(--border2); border-radius:12px; padding:16px; margin-top:12px; backdrop-filter:blur(12px); box-shadow:var(--shadow-sm); }
  .caption-text { font-size:13px; color:var(--text); line-height:1.7; white-space:pre-wrap; }
  .caption-copy-btn { margin-top:10px; padding:8px 18px; background:var(--surface); border:1px solid var(--border2); color:var(--text2); font-size:12px; font-family:var(--fb); border-radius:20px; cursor:pointer; box-shadow:var(--shadow-sm); }
  .outreach-result { background:rgba(255,255,255,0.6); border:1px solid var(--border2); border-radius:12px; padding:16px; margin-top:12px; backdrop-filter:blur(12px); box-shadow:var(--shadow-sm); }
  .outreach-text { font-size:13px; color:var(--text); line-height:1.7; white-space:pre-wrap; }

  /* MESSAGING */
  .msg-panel { position:fixed; inset:0; top:56px; background:var(--bg); z-index:150; display:flex; flex-direction:column; animation:slideUp 0.2s ease; }
  .msg-top { padding:14px 16px; border-bottom:1px solid var(--border); background:rgba(255,255,255,0.8); backdrop-filter:blur(20px); flex-shrink:0; display:flex; align-items:center; justify-content:space-between; }
  .msg-thread-list { flex:1; overflow-y:auto; padding:14px; }
  .msg-thread-item { display:flex; gap:11px; padding:13px 14px; background:var(--surface); border:1px solid var(--border); border-radius:14px; margin-bottom:8px; cursor:pointer; backdrop-filter:blur(12px); box-shadow:var(--shadow-sm); transition:all 0.15s; }
  .msg-thread-item:active { box-shadow:0 4px 20px rgba(139,94,139,0.15); }
  .msg-thread-item.unread { border-left:3px solid var(--accent); }
  .chat-view { position:fixed; inset:0; top:56px; background:var(--bg); z-index:160; display:flex; flex-direction:column; animation:slideUp 0.15s ease; }
  .chat-header { padding:12px 14px; border-bottom:1px solid var(--border); background:rgba(255,255,255,0.8); backdrop-filter:blur(20px); display:flex; align-items:center; gap:10px; flex-shrink:0; }
  .chat-messages { flex:1; overflow-y:auto; padding:14px; display:flex; flex-direction:column; gap:10px; }
  .chat-msg { display:flex; gap:8px; max-width:85%; }
  .chat-msg.mine { align-self:flex-end; flex-direction:row-reverse; }
  .chat-bubble { padding:10px 14px; border-radius:16px; font-size:13px; line-height:1.5; }
  .chat-msg:not(.mine) .chat-bubble { background:rgba(255,255,255,0.85); border:1px solid var(--border); color:var(--text); border-radius:4px 16px 16px 16px; box-shadow:var(--shadow-sm); backdrop-filter:blur(8px); }
  .chat-msg.mine .chat-bubble { background:linear-gradient(135deg,var(--accent),var(--accent2)); color:white; border-radius:16px 4px 16px 16px; box-shadow:0 4px 14px rgba(139,94,139,0.3); }
  .chat-time { font-size:9px; color:var(--text3); margin-top:3px; text-align:right; }
  .chat-input-bar { padding:10px 14px; border-top:1px solid var(--border); background:rgba(255,255,255,0.8); backdrop-filter:blur(20px); display:flex; gap:8px; align-items:flex-end; flex-shrink:0; padding-bottom:calc(10px + env(safe-area-inset-bottom)); }
  .chat-input { flex:1; background:var(--surface2); border:1px solid var(--border2); border-radius:22px; padding:10px 16px; font-size:13px; color:var(--text); font-family:var(--fb); outline:none; resize:none; max-height:100px; line-height:1.4; }
  .chat-input:focus { border-color:var(--accent2); box-shadow:0 0 0 3px rgba(139,94,139,0.1); }
  .chat-send-btn { width:38px; height:38px; border-radius:50%; background:linear-gradient(135deg,var(--accent),var(--accent2)); border:none; color:white; font-size:16px; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0; box-shadow:0 4px 12px rgba(139,94,139,0.35); }

  /* NOTIFS */
  .notif-item { display:flex; gap:12px; padding:13px 14px; background:var(--surface); border:1px solid var(--border); border-radius:14px; margin-bottom:8px; cursor:pointer; backdrop-filter:blur(12px); box-shadow:var(--shadow-sm); transition:all 0.15s; }
  .notif-item.unread { border-left:3px solid var(--accent); background:rgba(255,255,255,0.85); }
  .notif-icon { font-size:20px; flex-shrink:0; width:32px; text-align:center; }
  .notif-text { font-size:13px; color:var(--text); line-height:1.4; }
  .notif-text strong { color:var(--accent); }
  .notif-time { font-size:10px; color:var(--text3); margin-top:4px; }
  .notif-unread-dot { width:7px; height:7px; border-radius:50%; background:var(--accent); flex-shrink:0; margin-top:5px; }

  /* FORMS */
  .form-group { margin-bottom:14px; }
  .form-label { font-size:11px; color:var(--text2); text-transform:uppercase; letter-spacing:0.8px; font-weight:600; margin-bottom:6px; display:block; }
  .form-input { width:100%; padding:11px 14px; background:rgba(255,255,255,0.65); border:1px solid var(--border2); border-radius:10px; color:var(--text); font-size:13px; font-family:var(--fb); outline:none; backdrop-filter:blur(8px); }
  .form-input:focus { border-color:var(--accent2); box-shadow:0 0 0 3px rgba(139,94,139,0.1); }
  .form-select { width:100%; padding:11px 14px; background:rgba(255,255,255,0.65); border:1px solid var(--border2); border-radius:10px; color:var(--text); font-size:13px; font-family:var(--fb); outline:none; }
  .form-textarea { width:100%; padding:11px 14px; background:rgba(255,255,255,0.65); border:1px solid var(--border2); border-radius:10px; color:var(--text); font-size:13px; font-family:var(--fb); outline:none; resize:none; min-height:80px; line-height:1.5; }
  .form-textarea:focus { border-color:var(--accent2); box-shadow:0 0 0 3px rgba(139,94,139,0.1); }
  .form-actions { display:flex; gap:8px; margin-top:18px; }

  /* BUTTONS */
  .btn { padding:10px 18px; border-radius:22px; border:1px solid var(--border2); background:rgba(255,255,255,0.6); color:var(--text2); font-size:13px; font-family:var(--fb); cursor:pointer; font-weight:500; transition:all 0.15s; backdrop-filter:blur(8px); }
  .btn:active { opacity:0.8; }
  .btn.primary { background:linear-gradient(135deg,var(--accent),var(--accent2)); border:none; color:white; font-weight:600; flex:1; text-align:center; box-shadow:0 4px 16px rgba(139,94,139,0.3); }
  .btn.full { width:100%; text-align:center; }
  .btn.danger { background:rgba(200,107,122,0.1); border-color:rgba(200,107,122,0.4); color:var(--red); }
  .btn.success { background:rgba(91,168,138,0.1); border-color:rgba(91,168,138,0.4); color:var(--green); }
  .btn.back { display:inline-flex; align-items:center; gap:6px; margin-bottom:12px; font-size:13px; }
  .action-btn { padding:5px 11px; border-radius:20px; border:1px solid var(--border2); background:rgba(255,255,255,0.5); color:var(--text2); font-size:10px; cursor:pointer; font-family:var(--fb); white-space:nowrap; transition:all 0.15s; }
  .action-btn.accent { background:var(--accent-dim); border-color:rgba(139,94,139,0.3); color:var(--accent); }
  .action-btn.green { background:rgba(91,168,138,0.1); border-color:rgba(91,168,138,0.35); color:var(--green); }
  .sheet-role-btn { display:flex; align-items:center; gap:12px; padding:14px 16px; border-radius:14px; border:1px solid var(--border); background:rgba(255,255,255,0.5); color:var(--text); font-size:14px; font-family:var(--fb); cursor:pointer; width:100%; margin-bottom:8px; transition:all 0.15s; text-align:left; backdrop-filter:blur(8px); }
  .sheet-role-btn.active { background:var(--accent-dim); border-color:rgba(139,94,139,0.35); }
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
  .badge-green { background:rgba(34,197,94,0.12); color:#22C55E; }
  .badge-amber { background:rgba(255,184,0,0.12); color:#FFB800; }
  .badge-blue { background:rgba(59,130,246,0.12); color:#3B82F6; }
  .badge-purple { background:rgba(168,85,247,0.12); color:#A855F7; }
  .badge-gray { background:rgba(153,153,168,0.1); color:#9999A8; }
  .badge-red { background:rgba(239,68,68,0.12); color:#EF4444; }
  .badge-orange { background:rgba(255,92,0,0.12); color:#FF5C00; }
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
  .ig-panel { background:linear-gradient(135deg,#1a0a2e 0%,#0d1117 100%); border:1px solid #2d1b4e; border-radius:10px; padding:14px 16px; margin-bottom:12px; }
  .ig-header { display:flex; align-items:center; gap:10px; margin-bottom:12px; }
  .ig-title { font-family:var(--fd); font-size:13px; font-weight:700; color:var(--text); }
  .ig-sub { font-size:10px; color:#9b59b6; }
  .ig-post { background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:8px; padding:10px 12px; margin-bottom:7px; display:flex; align-items:center; gap:10px; }
  .ig-post-thumb { width:36px; height:36px; border-radius:6px; background:rgba(255,255,255,0.06); display:flex; align-items:center; justify-content:center; font-size:16px; flex-shrink:0; }
  .ig-post-title { font-size:12px; font-weight:600; color:var(--text); }
  .ig-post-date { font-size:10px; color:#9b59b6; margin-top:1px; }
  .badge { display:inline-flex; align-items:center; padding:3px 10px; border-radius:20px; font-size:10px; font-weight:500; white-space:nowrap; letter-spacing:0.2px; }
  .badge-green  { background:rgba(91,168,138,0.12);  color:#3D8C72; border:1px solid rgba(91,168,138,0.25); }
  .badge-amber  { background:rgba(200,164,91,0.12);  color:#A07830; border:1px solid rgba(200,164,91,0.25); }
  .badge-blue   { background:rgba(91,141,200,0.12);  color:#3A6EA8; border:1px solid rgba(91,141,200,0.25); }
  .badge-purple { background:rgba(155,114,184,0.12); color:#7A4EA0; border:1px solid rgba(155,114,184,0.25); }
  .badge-gray   { background:rgba(160,140,180,0.1);  color:#8A7A9A; border:1px solid rgba(160,140,180,0.2); }
  .badge-red    { background:rgba(200,107,122,0.12); color:#A84858; border:1px solid rgba(200,107,122,0.25); }
  .badge-orange { background:rgba(139,94,139,0.1);   color:var(--accent); border:1px solid rgba(139,94,139,0.2); }

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
  .kanban-col-header { display:flex; align-items:center; justify-content:space-between; padding:9px 12px; background:rgba(255,255,255,0.5); border:1px solid var(--border); border-bottom:none; border-radius:12px 12px 0 0; backdrop-filter:blur(8px); }
  .kanban-col-title { font-size:10px; font-weight:600; font-family:var(--fd); color:var(--text2); text-transform:uppercase; letter-spacing:0.8px; }
  .kanban-col-count { font-size:10px; color:var(--text3); background:rgba(139,94,139,0.08); padding:1px 7px; border-radius:8px; border:1px solid var(--border); }
  .kanban-col-body { background:rgba(255,255,255,0.3); border:1px solid var(--border); border-radius:0 0 12px 12px; padding:8px; display:flex; flex-direction:column; gap:6px; min-height:160px; backdrop-filter:blur(6px); }
  .kanban-card { background:rgba(255,255,255,0.7); border:1px solid var(--border); border-radius:10px; padding:10px 12px; backdrop-filter:blur(8px); box-shadow:var(--shadow-sm); }
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

  .editor-wrap { background:rgba(255,255,255,0.6); border:1px solid var(--border2); border-radius:14px; padding:16px; backdrop-filter:blur(16px); box-shadow:var(--shadow-sm); }
  .editor-toolbar { display:flex; gap:6px; flex-wrap:wrap; margin-bottom:10px; }
  .editor-tool-btn { padding:6px 12px; border-radius:20px; border:1px solid var(--border2); background:rgba(255,255,255,0.5); color:var(--text2); font-size:11px; font-family:var(--fb); cursor:pointer; }
  .editor-tool-btn.ai { background:linear-gradient(135deg,rgba(139,94,139,0.1),rgba(176,127,192,0.08)); border-color:rgba(139,94,139,0.3); color:var(--accent); font-weight:600; }
  .editor-textarea { width:100%; background:transparent; border:none; outline:none; font-size:13px; color:var(--text); line-height:1.7; font-family:var(--fb); resize:none; min-height:180px; }

  .video-item { display:flex; align-items:center; gap:11px; padding:11px 0; border-bottom:1px solid var(--border); }
  .video-item:last-child { border-bottom:none; }
  .video-thumb { width:44px; height:32px; background:rgba(139,94,139,0.08); border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:16px; flex-shrink:0; border:1px solid var(--border); }
  .video-info { flex:1; min-width:0; }
  .video-title { font-size:12px; font-weight:500; color:var(--text); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .video-meta { font-size:10px; color:var(--text3); margin-top:2px; }

  .ig-panel { background:linear-gradient(135deg,rgba(100,50,140,0.12),rgba(60,80,140,0.08)); border:1px solid rgba(140,100,200,0.2); border-radius:16px; padding:16px; margin-bottom:12px; backdrop-filter:blur(16px); box-shadow:var(--shadow-sm); }
  .ig-header { display:flex; align-items:center; gap:10px; margin-bottom:12px; }
  .ig-title { font-family:var(--fd); font-size:15px; font-weight:600; color:var(--text); }
  .ig-sub { font-size:10px; color:var(--purple); }
  .ig-post { background:rgba(255,255,255,0.45); border:1px solid rgba(180,160,220,0.25); border-radius:10px; padding:10px 12px; margin-bottom:7px; display:flex; align-items:center; gap:10px; }
  .ig-post-thumb { width:36px; height:36px; border-radius:8px; background:rgba(139,94,139,0.1); display:flex; align-items:center; justify-content:center; font-size:16px; flex-shrink:0; }
  .ig-post-title { font-size:12px; font-weight:500; color:var(--text); }
  .ig-post-date { font-size:10px; color:var(--purple); margin-top:1px; }

  .client-hero { background:var(--surface); border:1px solid var(--border); border-radius:16px; padding:18px; margin-bottom:12px; position:relative; overflow:hidden; backdrop-filter:blur(16px); box-shadow:var(--shadow); }
  .client-hero::before { content:''; position:absolute; right:-30px; top:-30px; width:150px; height:150px; background:radial-gradient(circle,rgba(176,127,192,0.3),transparent 70%); pointer-events:none; }
  .deliverable-item { display:flex; align-items:center; gap:11px; padding:11px 0; border-bottom:1px solid var(--border); }
  .deliverable-item:last-child { border-bottom:none; }
  .deliverable-icon { font-size:20px; width:28px; text-align:center; flex-shrink:0; }
  .deliverable-info { flex:1; min-width:0; }
  .deliverable-title { font-size:12px; font-weight:500; color:var(--text); }
  .deliverable-sub { font-size:10px; color:var(--text3); margin-top:1px; }
  .progress-bar-wrap { background:rgba(139,94,139,0.1); border-radius:4px; height:4px; overflow:hidden; margin-top:6px; }
  .progress-bar { height:100%; border-radius:4px; }

  .call-item { display:flex; align-items:center; gap:11px; padding:11px 0; border-bottom:1px solid var(--border); }
  .call-item:last-child { border-bottom:none; }
  .call-time-block { background:var(--accent-dim); border:1px solid rgba(139,94,139,0.3); border-radius:10px; padding:6px 10px; text-align:center; flex-shrink:0; min-width:56px; }
  .call-time { font-family:var(--fd); font-size:13px; font-weight:700; color:var(--accent); }
  .call-day { font-size:9px; color:var(--accent); opacity:0.7; }

  .custom-tooltip { background:rgba(255,255,255,0.9); border:1px solid var(--border2); border-radius:10px; padding:8px 14px; backdrop-filter:blur(12px); box-shadow:var(--shadow); }
  .ct-label { font-size:10px; color:var(--text3); text-transform:uppercase; letter-spacing:0.5px; }
  .ct-value { font-family:var(--fd); font-size:18px; font-weight:600; color:var(--text); }

  .toast { position:fixed; top:64px; left:14px; right:14px; background:rgba(255,255,255,0.92); border:1px solid var(--border2); border-radius:14px; padding:12px 16px; z-index:400; display:flex; align-items:center; gap:10px; box-shadow:0 8px 40px rgba(100,70,140,0.2); animation:toastIn 0.2s ease; backdrop-filter:blur(20px); }
  @keyframes toastIn { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
  .toast-icon { font-size:18px; flex-shrink:0; }
  .toast-text { font-size:13px; font-weight:500; color:var(--text); }
  .toast-sub { font-size:11px; color:var(--text2); margin-top:2px; }

  .empty { text-align:center; padding:48px 20px; color:var(--text3); }
  .empty-icon { font-size:36px; margin-bottom:10px; opacity:0.6; }
  .empty-title { font-family:var(--fd); font-size:16px; color:var(--text2); margin-bottom:6px; font-weight:500; }

  ::-webkit-scrollbar { width:3px; height:3px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:rgba(139,94,139,0.2); border-radius:2px; }
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

const STATUS_FLOW = {"Raw Footage":"Editing","Editing":"Review","Review":"Approved","Approved":"Scheduled"};
const VID_STATUS_COLOR = {"Review":"amber","Editing":"blue","Raw Footage":"gray","Approved":"green","Scheduled":"purple"};

// ─── AI HELPER ────────────────────────────────────────────────────────────────
async function callClaude(prompt, systemPrompt = "") {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: systemPrompt || "You are an AI assistant for Media4You, a social media marketing agency in Arizona that produces short-form video content for local businesses. Be concise, punchy, and practical.",
      messages: [{ role: "user", content: prompt }]
    })
  });
  const data = await response.json();
  return data.content?.[0]?.text || "";
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
function ContentCalendar({ clients, onClose }) {
  const [calendar, setCalendar] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [selClient, setSelClient] = useState("all");

  const generate = async () => {
    setLoading(true);
    const targetClients = selClient === "all" ? clients.filter(c=>c.status==="active") : clients.filter(c=>c.name===selClient);
    try {
      const result = await callClaude(
        `Create a social media content calendar for April 2025 for these Arizona businesses managed by a marketing agency:
${targetClients.map(c=>`- ${c.name} (${c.industry}, ${c.plan} plan: ${c.plan==="Starter"?2:c.plan==="Growth"?4:8} posts/mo)`).join("\n")}

Return ONLY a JSON array (no markdown):
[{"date":"Apr X","client":"...","title":"...","type":"..."}]

Distribute posts evenly. Use realistic content types for each industry.`,
        "Return only valid JSON arrays, no markdown backticks, no extra text."
      );
      const parsed = JSON.parse(result.trim());
      setCalendar(parsed);
      setGenerated(true);
    } catch(e) {
      setCalendar([
        {date:"Apr 1", client:"Frost Barbershop",    title:"Spring Lineup Styles",          type:"Promotional"},
        {date:"Apr 3", client:"Desert Sun Realty",   title:"New Listing — Scottsdale",      type:"Listing"},
        {date:"Apr 5", client:"Sky Harbor Dental",   title:"Teeth Whitening Before/After",  type:"Before/After"},
        {date:"Apr 7", client:"Mesa Auto Detailing", title:"Spring Detail Special",         type:"Promotional"},
        {date:"Apr 10",client:"Cactus CrossFit",     title:"Member Transformation Story",   type:"Testimonial"},
        {date:"Apr 12",client:"Desert Sun Realty",   title:"Neighborhood Tour — Mesa",      type:"Educational"},
        {date:"Apr 15",client:"Frost Barbershop",    title:"Day in the Shop — Saturday",    type:"Behind Scenes"},
        {date:"Apr 17",client:"Sky Harbor Dental",   title:"Meet the Hygienist Team",       type:"Team Intro"},
      ]);
      setGenerated(true);
    }
    setLoading(false);
  };

  const filtered = selClient==="all" ? calendar : calendar.filter(p=>p.client===selClient);

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
              <div style={{fontSize:11,color:"var(--text3)",textTransform:"uppercase",letterSpacing:"1px",fontWeight:700}}>{filtered.length} posts scheduled</div>
              <button className="action-btn accent" onClick={generate}>↺ Regenerate</button>
            </div>
            {filtered.map((p,i)=>{
              const c = clients.find(cl=>cl.name===p.client);
              return (
                <div className="cal-post-item" key={i}>
                  <div className="cal-post-date">{p.date}</div>
                  <div className="cal-post-info">
                    <div className="cal-post-title">{p.title}</div>
                    <div className="cal-post-client">{p.client}</div>
                  </div>
                  <span className="badge badge-gray">{p.type}</span>
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
function AdminDashboard({ clients, onNav, onOpenIdeas, onOpenCalendar, showToast }) {
  const mrr = clients.reduce((s,c)=>s+c.mrr,0);
  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card"><div className="stat-label">Active Clients</div><div className="stat-value">{clients.filter(c=>c.status==="active").length}</div><div className="stat-sub">↑ +1 this month</div></div>
        <div className="stat-card"><div className="stat-label">MRR</div><div className="stat-value">${(mrr/1000).toFixed(1)}K</div><div className="stat-sub">↑ +$600 added</div></div>
        <div className="stat-card"><div className="stat-label">Videos MTD</div><div className="stat-value">23</div><div className="stat-sub">↑ +5 vs last mo</div></div>
        <div className="stat-card"><div className="stat-label">IG Scheduled</div><div className="stat-value">14</div><div className="stat-sub">Next: Mar 18</div></div>
      </div>
      <div className="card" style={{background:"linear-gradient(135deg,rgba(255,92,0,0.08),rgba(168,85,247,0.06))",borderColor:"rgba(255,92,0,0.3)"}}>
        <div style={{fontFamily:"var(--fd)",fontSize:12,fontWeight:700,color:"var(--accent)",marginBottom:10,textTransform:"uppercase",letterSpacing:"1px"}}>✨ AI Tools</div>
        <div onClick={onOpenCalendar} className="ai-btn">
          <div className="ai-btn-icon">📅</div>
          <div><div className="ai-btn-text">Content Calendar</div><div className="ai-btn-sub">Generate April posting schedule for all clients</div></div>
        </div>
        <div onClick={()=>onNav("clients")} className="ai-btn">
          <div className="ai-btn-icon">💡</div>
          <div><div className="ai-btn-text">Video Ideas</div><div className="ai-btn-sub">Generate ideas for a specific client</div></div>
        </div>
      </div>
      <div className="card">
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
          <div className="card-title" style={{margin:0}}>MRR Growth</div>
          <span style={{fontSize:12,fontWeight:700,color:"var(--green)"}}>+62% 6mo</span>
        </div>
        <ResponsiveContainer width="100%" height={110}>
          <AreaChart data={MRR_DATA} margin={{top:4,right:4,left:-20,bottom:0}}>
            <defs><linearGradient id="mg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#FF5C00" stopOpacity={0.3}/><stop offset="95%" stopColor="#FF5C00" stopOpacity={0}/></linearGradient></defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#26262F" vertical={false}/>
            <XAxis dataKey="month" tick={{fill:"#55555F",fontSize:10}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fill:"#55555F",fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`$${v/1000}K`}/>
            <Tooltip content={<CustomTooltip/>}/>
            <Area type="monotone" dataKey="mrr" stroke="#FF5C00" strokeWidth={2} fill="url(#mg)"/>
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="card">
        <div className="card-title">Clients — Tap for AI Ideas</div>
        {clients.map(c => (
          <div className="row-item" key={c.id} onClick={()=>onOpenIdeas(c)} style={{cursor:"pointer"}}>
            <div className="row-avatar" style={{background:`${c.color}20`,color:c.color}}>{c.name[0]}</div>
            <div className="row-main"><div className="row-title">{c.name}</div><div className="row-sub">{c.stage} · Next {c.nextPost}</div></div>
            <div className="row-right">
              <Badge type={c.plan==="Pro"?"purple":c.plan==="Growth"?"blue":"gray"}>{c.plan}</Badge>
              <span style={{fontSize:16,color:"var(--accent)"}}>💡</span>
            </div>
          </div>
        ))}
      </div>
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
            <CartesianGrid strokeDasharray="3 3" stroke="#26262F" vertical={false}/>
            <XAxis dataKey="month" tick={{fill:"#55555F",fontSize:10}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fill:"#55555F",fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`$${v/1000}K`}/>
            <Tooltip content={<CustomTooltip/>}/>
            <Area type="monotone" dataKey="mrr" stroke="#FF5C00" strokeWidth={2} fill="url(#mg2)"/>
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="card">
        <div className="card-title">Videos Produced</div>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={VIDEO_DATA} margin={{top:4,right:4,left:-20,bottom:0}}>
            <CartesianGrid strokeDasharray="3 3" stroke="#26262F" vertical={false}/>
            <XAxis dataKey="month" tick={{fill:"#55555F",fontSize:10}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fill:"#55555F",fontSize:10}} axisLine={false} tickLine={false}/>
            <Tooltip content={<CustomTooltip prefix=""/>}/>
            <Bar dataKey="videos" fill="#3B82F6" radius={[4,4,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function AdminSettings({ showToast }) {
  return (
    <div>
      <div className="card">
        <div className="card-title">Integrations</div>
        {[{name:"Meta / Instagram API",status:"Connected",icon:"📸"},{name:"Zoom",status:"Connected",icon:"🎥"},{name:"Stripe Billing",status:"Not connected",icon:"💳"},{name:"Twilio SMS",status:"Not connected",icon:"💬"}].map(i=>(
          <div className="row-item" key={i.name}>
            <div style={{fontSize:20,width:28,textAlign:"center",flexShrink:0}}>{i.icon}</div>
            <div className="row-main"><div className="row-title">{i.name}</div></div>
            <Badge type={i.status==="Connected"?"green":"gray"}>{i.status}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SALES VIEWS ──────────────────────────────────────────────────────────────
function SalesDashboard({ leads, onOpenOutreach, showToast }) {
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
                    <div className="kanban-card" key={l.id}>
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
    </div>
  );
}

function SalesCalls({ showToast }) {
  return (
    <div className="card">
      <div className="card-title">Scheduled Calls</div>
      {[{name:"Chandler Law Group",rep:"Jade",time:"2:00 PM",day:"Today",type:"Demo",status:"Confirmed"},{name:"Scottsdale Med Spa",rep:"Carlos",time:"4:30 PM",day:"Today",type:"Discovery",status:"Confirmed"},{name:"Sun Devil Gym",rep:"Jade",time:"10:00 AM",day:"Mar 19",type:"Proposal",status:"Pending"}].map((c,i)=>(
        <div className="call-item" key={i}>
          <div className="call-time-block"><div className="call-time">{c.time}</div><div className="call-day">{c.day}</div></div>
          <div className="row-main"><div className="row-title">{c.name}</div><div className="row-sub">{c.type} · {c.rep}</div></div>
          <div style={{display:"flex",flexDirection:"column",gap:4,alignItems:"flex-end"}}>
            <Badge type={c.status==="Confirmed"?"green":"amber"}>{c.status}</Badge>
            <button className="action-btn accent" onClick={()=>showToast("🎥","Joining Zoom","")}>Join</button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── SCRIPT VIEWS ─────────────────────────────────────────────────────────────
function ScriptQueue({ scripts, onSelect }) {
  return (
    <div>
      <div className="stats-grid" style={{marginBottom:12}}>
        <div className="stat-card"><div className="stat-label">In Queue</div><div className="stat-value">{scripts.length}</div><div className="stat-sub">2 due this week</div></div>
        <div className="stat-card"><div className="stat-label">Urgent</div><div className="stat-value">{scripts.filter(s=>s.priority==="high").length}</div><div className="stat-sub">High priority</div></div>
      </div>
      <div style={{fontSize:10,color:"var(--text3)",textTransform:"uppercase",letterSpacing:"1px",fontWeight:700,marginBottom:8}}>Tap to open — ✨ AI Draft inside</div>
      {scripts.map((s,i)=>(
        <div key={s.id} className="script-item" onClick={()=>onSelect(i)}>
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
      ))}
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
function EditorProduction({ videos, igPosts, onAdvance, onSchedule, onOpenCaption, showToast }) {
  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card"><div className="stat-label">In Queue</div><div className="stat-value">{videos.length}</div><div className="stat-sub">2 due this week</div></div>
        <div className="stat-card"><div className="stat-label">In Review</div><div className="stat-value">{videos.filter(v=>v.status==="Review").length}</div><div className="stat-sub">Awaiting approval</div></div>
        <div className="stat-card"><div className="stat-label">Published MTD</div><div className="stat-value">11</div><div className="stat-sub">4 clients</div></div>
        <div className="stat-card"><div className="stat-label">IG Scheduled</div><div className="stat-value">{igPosts.filter(p=>p.status==="Scheduled").length}</div><div className="stat-sub">Next: Mar 20</div></div>
      </div>
      <div className="card" style={{background:"linear-gradient(135deg,rgba(255,92,0,0.08),rgba(168,85,247,0.06))",borderColor:"rgba(255,92,0,0.3)"}}>
        <div style={{fontFamily:"var(--fd)",fontSize:12,fontWeight:700,color:"var(--accent)",marginBottom:10,textTransform:"uppercase",letterSpacing:"1px"}}>✨ AI Tools</div>
        <div className="ai-btn" onClick={onOpenCaption}>
          <div className="ai-btn-icon">📝</div>
          <div><div className="ai-btn-text">Caption Writer</div><div className="ai-btn-sub">Generate Instagram captions + hashtags</div></div>
        </div>
      </div>
      <div className="card">
        <div className="card-title">Production Queue</div>
        {videos.map(v=>(
          <div className="video-item" key={v.id}>
            <div className="video-thumb">{v.thumb}</div>
            <div className="video-info"><div className="video-title">{v.title}</div><div className="video-meta">{v.client} · {v.due}</div></div>
            <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4,flexShrink:0}}>
              <Badge type={VID_STATUS_COLOR[v.status]||"gray"}>{v.status}</Badge>
              {v.status!=="Approved"&&v.status!=="Scheduled"&&<button className="action-btn accent" onClick={()=>{onAdvance(v.id);showToast("🎬","Updated",`→ ${STATUS_FLOW[v.status]}`);}}>
                {v.status==="Raw Footage"?"Start Edit":v.status==="Editing"?"Send Review":"Approve"}
              </button>}
              {v.status==="Approved"&&<button className="action-btn green" onClick={()=>{onSchedule(v.id);showToast("📸","Scheduled on IG","");}}>→ IG</button>}
            </div>
          </div>
        ))}
      </div>
      <div className="ig-panel">
        <div className="ig-header"><span style={{fontSize:20}}>📸</span><div><div className="ig-title">Instagram Queue</div><div className="ig-sub">Publish via Meta API</div></div></div>
        {igPosts.map(p=><div className="ig-post" key={p.id}><div className="ig-post-thumb">{p.thumb}</div><div style={{flex:1}}><div className="ig-post-title">{p.client}</div><div className="ig-post-date">{p.date}</div></div><Badge type={p.status==="Scheduled"?"green":"amber"}>{p.status}</Badge></div>)}
        <button className="btn primary full" style={{marginTop:8}} onClick={()=>showToast("📸","Scheduled","Added to IG queue")}>+ Schedule Post</button>
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
function ClientContent({ showToast }) {
  const [items, setItems] = useState([
    {id:1,title:"Listing @ 4821 Cactus Rd",type:"Reel · Listing Tour",status:"Editing",  progress:65, thumb:"🏠"},
    {id:2,title:"Agent Intro — Meet Sarah", type:"Reel · Brand",       status:"Scheduled",progress:100,thumb:"👤"},
    {id:3,title:"Sold! 3901 Desert View",   type:"Story + Post",       status:"Published",progress:100,thumb:"✅"},
    {id:4,title:"Neighborhood Spotlight",   type:"Reel · Area Guide",  status:"Scripting",progress:20, thumb:"📍"},
  ]);
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
        <div className="stat-card"><div className="stat-label">Next Delivery</div><div className="stat-value">Mar 19</div><div className="stat-sub">Listing Showcase</div></div>
      </div>
      <div className="card">
        <div className="card-title">Your Content — March</div>
        {items.map(d=>(
          <div className="deliverable-item" key={d.id}>
            <div className="deliverable-icon">{d.thumb}</div>
            <div className="deliverable-info">
              <div className="deliverable-title">{d.title}</div>
              <div className="deliverable-sub">{d.type}</div>
              <div className="progress-bar-wrap"><div className="progress-bar" style={{width:`${d.progress}%`,background:d.status==="Published"?"var(--green)":d.status==="Scheduled"?"var(--blue)":"var(--accent)"}}/></div>
            </div>
            <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4,flexShrink:0}}>
              <Badge type={d.status==="Published"?"green":d.status==="Scheduled"?"blue":d.status==="Editing"?"amber":"gray"}>{d.status}</Badge>
              {d.status==="Editing"&&<button className="action-btn accent" onClick={()=>{setItems(p=>p.map(i=>i.id===d.id?{...i,status:"Approved",progress:100}:i));showToast("✅","Approved!","");}}>Approve</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ClientIG({ igPosts }) {
  const myPosts = igPosts.filter(p=>p.client==="Desert Sun Realty");
  return (
    <div>
      <div className="ig-panel">
        <div className="ig-header"><span style={{fontSize:20}}>📸</span><div><div className="ig-title">Instagram</div><div className="ig-sub">@desertsunrealtyaz</div></div></div>
        {myPosts.map(p=><div className="ig-post" key={p.id}><div className="ig-post-thumb">{p.thumb}</div><div style={{flex:1}}><div className="ig-post-title" style={{fontSize:11}}>{p.caption.substring(0,30)}...</div><div className="ig-post-date">{p.date}</div></div><Badge type={p.status==="Scheduled"?"green":"amber"}>{p.status}</Badge></div>)}
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
  return (
    <div className="card">
      <div className="card-title">Invoices</div>
      {[{month:"March 2025",amount:"$2,400",status:"Due Apr 1",paid:false},{month:"February 2025",amount:"$2,400",status:"Paid Feb 28",paid:true},{month:"January 2025",amount:"$2,400",status:"Paid Jan 31",paid:true}].map((inv,i)=>(
        <div className="row-item" key={i}>
          <div className="row-avatar" style={{background:inv.paid?"rgba(34,197,94,0.12)":"rgba(255,184,0,0.12)",color:inv.paid?"var(--green)":"var(--amber)"}}>{inv.paid?"✓":"!"}</div>
          <div className="row-main"><div className="row-title">{inv.month}</div><div className="row-sub">{inv.status}</div></div>
          <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
            <div style={{fontFamily:"var(--fd)",fontSize:14,fontWeight:800}}>{inv.amount}</div>
            {!inv.paid&&<button className="action-btn accent" onClick={()=>showToast("💳","Payment link sent","Check your email")}>Pay Now</button>}
          </div>
        </div>
      ))}
    </div>
  );
}

function ClientTeam({ showToast, onOpenMessages }) {
  return (
    <div>
      <div className="card">
        <div className="card-title">Your Dedicated Team</div>
        {[{name:"Maya R.",role:"Script Writer",color:"#A855F7",note:"Writing your March scripts"},{name:"Jordan T.",role:"Video Editor",color:"#22C55E",note:"Editing Listing Showcase"},{name:"Carlos V.",role:"Account Manager",color:"#3B82F6",note:"Your main point of contact"}].map(m=>(
          <div className="row-item" key={m.name}>
            <div className="row-avatar" style={{background:`${m.color}20`,color:m.color}}>{m.name[0]}</div>
            <div className="row-main"><div className="row-title">{m.name}</div><div className="row-sub">{m.role} · {m.note}</div></div>
            <button className="action-btn accent" onClick={onOpenMessages}>Message</button>
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
  admin:        [{label:"Dashboard",icon:"⬛",view:"dashboard"},{label:"Clients",icon:"👥",view:"clients"},{label:"Revenue",icon:"💰",view:"revenue"},{label:"Settings",icon:"⚙️",view:"settings"}],
  sales:        [{label:"Pipeline",icon:"📊",view:"dashboard",badge:3},{label:"Calls",icon:"🎥",view:"calls"},{label:"Leads",icon:"🎯",view:"leads"}],
  scriptwriter: [{label:"Queue",icon:"✍️",view:"dashboard",badge:2},{label:"Done",icon:"✅",view:"completed"}],
  editor:       [{label:"Production",icon:"🎬",view:"dashboard",badge:2},{label:"Done",icon:"✅",view:"completed"}],
  client:       [{label:"Content",icon:"📹",view:"dashboard"},{label:"Instagram",icon:"📸",view:"instagram"},{label:"Invoices",icon:"🧾",view:"invoices"},{label:"Team",icon:"👥",view:"team"}],
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
    else if(role==="editor") openPanel("caption");
    else showToast("📞","Contacting team","Your account manager will respond shortly");
  };

  const currentTitle = panel==="notifs"?"Notifications":panel==="messages"?"Messages":TITLES[role];

  const renderMain = () => {
    if(selScript!==null && role==="scriptwriter") return <ScriptEditor script={scripts[selScript]} onBack={()=>setSelScript(null)} onUpdate={updateScript} showToast={showToast}/>;
    if(subView?.type==="client-detail") return null; // handled in panels

    if(role==="admin"){
      if(view==="dashboard") return <AdminDashboard clients={clients} onNav={navTo} onOpenIdeas={(c)=>openPanel("ideas",c)} onOpenCalendar={()=>openPanel("calendar")} showToast={showToast}/>;
      if(view==="clients")   return <AdminDashboard clients={clients} onNav={navTo} onOpenIdeas={(c)=>openPanel("ideas",c)} onOpenCalendar={()=>openPanel("calendar")} showToast={showToast}/>;
      if(view==="revenue")   return <AdminRevenue clients={clients}/>;
      if(view==="settings")  return <AdminSettings showToast={showToast}/>;
    }
    if(role==="sales"){
      if(view==="dashboard") return <SalesDashboard leads={leads} onOpenOutreach={()=>openPanel("outreach")} showToast={showToast}/>;
      if(view==="calls")     return <SalesCalls showToast={showToast}/>;
      if(view==="leads")     return <div className="card"><div className="card-title">All Leads</div>{Object.entries(leads).flatMap(([s,items])=>items.map(l=>(<div className="row-item" key={l.id}><div className="row-avatar" style={{background:"var(--accent-dim)",color:"var(--accent)"}}>{l.name[0]}</div><div className="row-main"><div className="row-title">{l.name}</div><div className="row-sub">{l.source} · {l.rep}</div></div><div className="row-right"><div style={{fontFamily:"var(--fd)",fontSize:12,fontWeight:700,color:"var(--accent)"}}>{l.value}</div><Badge type="gray">{s}</Badge></div></div>)))}</div>;
    }
    if(role==="scriptwriter"){
      if(view==="dashboard") return <ScriptQueue scripts={scripts} onSelect={setSelScript}/>;
      if(view==="completed") return <ScriptCompleted scripts={scripts}/>;
    }
    if(role==="editor"){
      if(view==="dashboard") return <EditorProduction videos={videos} igPosts={igPosts} onAdvance={advanceVideo} onSchedule={scheduleVideo} onOpenCaption={()=>openPanel("caption")} showToast={showToast}/>;
      if(view==="completed") return <EditorCompleted videos={videos}/>;
    }
    if(role==="client"){
      if(view==="dashboard") return <ClientContent showToast={showToast}/>;
      if(view==="instagram") return <ClientIG igPosts={igPosts}/>;
      if(view==="invoices")  return <ClientInvoices showToast={showToast}/>;
      if(view==="team")      return <ClientTeam showToast={showToast} onOpenMessages={()=>openPanel("messages")}/>;
    }
    return <div className="empty"><div className="empty-icon">🚧</div><div className="empty-title">Coming soon</div></div>;
  };

  return (
    <>
      <style>{styles}</style>
      <div className="app">

        {/* TOPBAR */}
        <div className="topbar">
          <div className="t-left">
            <div className="t-logo">MEDIA<span>4</span>YOU</div>
            <div className="t-sep">·</div>
            <div className="t-title">{currentTitle}</div>
          </div>
          <div className="t-right">
            {panel ? (
              <button className="btn back" style={{margin:0,padding:"5px 12px",fontSize:12}} onClick={closePanel}>✕ Close</button>
            ) : (
              <>
                <div className="role-chip" onClick={()=>setSheet(true)}>
                  <div className="chip-dot" style={{background:roleInfo.color}}/>
                  {roleInfo.label}
                </div>
                <button className="bell-btn" onClick={()=>openPanel("notifs")}>
                  🔔{unreadNotifs>0&&<div className="bell-dot"/>}
                </button>
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
          <div className="content" style={{paddingBottom:"calc(var(--bnav)+14px)"}}>
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
        {panel==="calendar" && <ContentCalendar clients={clients} onClose={closePanel}/>}
        {panel==="caption" && <CaptionWriter onClose={closePanel} showToast={showToast}/>}
        {panel==="outreach" && <OutreachWriter onClose={closePanel} showToast={showToast}/>}

        {/* BOTTOM NAV */}
        <div className="bnav">
          {NAV_CONFIG[role].map(n=>(
            <div key={n.view} className={`bnav-item ${view===n.view&&!panel&&selScript===null?"active":""}`} onClick={()=>navTo(n.view)}>
              {n.badge&&<span className="bnav-badge">{n.badge}</span>}
              <span className="bnav-icon">{n.icon}</span>
              <span className="bnav-label">{n.label}</span>
            </div>
          ))}
          <div className={`bnav-item ${panel==="messages"?"active":""}`} onClick={()=>openPanel("messages")}>
            {unreadMsgs>0&&<span className="bnav-badge">{unreadMsgs}</span>}
            <span className="bnav-icon">💬</span>
            <span className="bnav-label">Messages</span>
          </div>
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
