<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
<title>Fitbit Clock Maker</title>
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet">
<style>
* { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
:root {
  --bg: #f0f4ff; --white: #fff;
  --primary: #3b5bdb; --primary-light: #e8edff; --primary-dark: #2f49b8;
  --success: #2f9e44; --success-light: #ebfbee;
  --warn: #e67700; --warn-light: #fff9e6;
  --danger: #c92a2a; --danger-light: #fff5f5;
  --text: #1a1a2e; --muted: #6b7280; --border: #dde3f5;
  --radius: 20px; --shadow: 0 8px 32px rgba(59,91,219,0.14);
}
html, body { height: 100%; }
body {
  font-family: 'Nunito', sans-serif;
  background: var(--bg);
  color: var(--text);
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 16px 80px;
  overflow-x: hidden;
}

/* ── Progress ── */
.prog-wrap { width: 100%; max-width: 480px; padding: 28px 0 0; display: flex; flex-direction: column; align-items: center; gap: 10px; }
.dots { display: flex; gap: 7px; align-items: center; }
.dot { width: 9px; height: 9px; border-radius: 50%; background: var(--border); transition: all 0.3s; }
.dot.active { background: var(--primary); width: 26px; border-radius: 5px; }
.dot.done { background: var(--success); }
.prog-label { font-size: 12px; font-weight: 700; color: var(--muted); }

/* ── Card ── */
.card {
  width: 100%; max-width: 480px;
  background: var(--white);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 32px 24px;
  margin-top: 16px;
  animation: up 0.3s ease;
}
@keyframes up { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
.card-icon { font-size: 44px; text-align: center; display: block; margin-bottom: 12px; }
.card h2 { font-size: 22px; font-weight: 900; text-align: center; line-height: 1.25; margin-bottom: 6px; }
.card .sub { font-size: 13px; color: var(--muted); text-align: center; line-height: 1.5; margin-bottom: 22px; }

/* ── Inputs ── */
.field { margin-bottom: 14px; }
.field label { font-size: 11px; font-weight: 800; color: var(--muted); text-transform: uppercase; letter-spacing: 0.8px; display: block; margin-bottom: 6px; }
.field input[type=text], .field input[type=password] {
  width: 100%; padding: 14px 16px;
  border: 2px solid var(--border); border-radius: 12px;
  font-family: 'Nunito', sans-serif; font-size: 15px; font-weight: 700;
  color: var(--text); background: var(--bg);
  outline: none; transition: border-color 0.2s;
  -webkit-appearance: none;
}
.field input:focus { border-color: var(--primary); background: white; }
.field-hint { font-size: 11px; color: var(--muted); margin-top: 5px; line-height: 1.4; }
.field-hint a { color: var(--primary); }

/* ── Upload zone ── */
.upload-zone {
  border: 3px dashed var(--border); border-radius: 14px;
  padding: 36px 20px; text-align: center;
  cursor: pointer; transition: all 0.2s;
  position: relative; background: var(--bg); margin-bottom: 8px;
}
.upload-zone.drag { border-color: var(--primary); background: var(--primary-light); }
.upload-zone input { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; }
.uz-icon { font-size: 36px; display: block; margin-bottom: 10px; }
.uz-main { font-size: 16px; font-weight: 800; margin-bottom: 3px; }
.uz-sub { font-size: 12px; color: var(--muted); }

/* ── Photo confirmed ── */
.photo-row {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 14px; background: var(--success-light);
  border-radius: 12px; border: 2px solid #b2f2bb; margin-bottom: 8px;
}
.photo-thumb { width: 48px; height: 48px; border-radius: 8px; object-fit: cover; flex-shrink: 0; }
.photo-info { flex: 1; }
.photo-name { font-size: 13px; font-weight: 800; }
.photo-ok { font-size: 11px; color: var(--success); font-weight: 700; }
.change-btn { font-size: 12px; color: var(--primary); font-weight: 700; cursor: pointer; text-decoration: underline; }

/* ── Option grid ── */
.opt-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 9px; margin-bottom: 8px; }
.opt { border: 2px solid var(--border); border-radius: 12px; padding: 14px 10px; text-align: center; cursor: pointer; transition: all 0.2s; background: white; }
.opt:active, .opt.sel { border-color: var(--primary); background: var(--primary-light); }
.opt-icon { font-size: 24px; display: block; margin-bottom: 5px; }
.opt-label { font-size: 13px; font-weight: 800; display: block; }
.opt-sub { font-size: 10px; color: var(--muted); display: block; margin-top: 2px; }

/* ── Format toggle ── */
.fmt-row { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px; }
.fmt { padding: 13px 10px; border: 2px solid var(--border); border-radius: 10px; font-family: 'Nunito', sans-serif; font-size: 13px; font-weight: 800; color: var(--text); text-align: center; cursor: pointer; transition: all 0.2s; background: white; border: none; }
.fmt.sel, .fmt:active { border: 2px solid var(--primary); background: var(--primary-light); color: var(--primary); }
.fmt-ex { font-size: 10px; color: var(--muted); display: block; margin-top: 2px; font-weight: 600; }

/* ── Toggle rows ── */
.tog-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 15px 16px; border: 2px solid var(--border); border-radius: 12px; margin-bottom: 9px; cursor: pointer; transition: all 0.2s;
}
.tog-row.on { border-color: var(--success); background: var(--success-light); }
.tog-left { display: flex; align-items: center; gap: 12px; }
.tog-icon { font-size: 20px; }
.tog-text { font-size: 13px; font-weight: 800; }
.tog-sub { font-size: 10px; color: var(--muted); margin-top: 1px; }
.tog-switch { width: 40px; height: 23px; border-radius: 12px; background: var(--border); position: relative; transition: background 0.2s; flex-shrink: 0; }
.tog-row.on .tog-switch { background: var(--success); }
.tog-switch::after { content:''; position:absolute; width:17px; height:17px; top:3px; left:3px; background:white; border-radius:50%; transition:transform 0.2s; box-shadow:0 1px 3px rgba(0,0,0,0.2); }
.tog-row.on .tog-switch::after { transform:translateX(17px); }

/* ── Watch preview ── */
.watch-wrap { display: flex; justify-content: center; margin: 4px 0 20px; }
.watch-outer { width: 130px; height: 158px; background: #1c1c1e; border-radius: 30px; padding: 5px; box-shadow: 0 0 0 2px #2a2a2a, 0 16px 32px rgba(0,0,0,0.5); position: relative; }
.watch-outer::after { content:''; position:absolute; right:-4px; top:50%; transform:translateY(-50%); width:3px; height:24px; background:#2a2a2a; border-radius:0 2px 2px 0; }
.watch-screen { width:100%; height:100%; border-radius:25px; overflow:hidden; position:relative; background:#000; }
#prev-img { width:100%; height:100%; object-fit:cover; display:none; }
.watch-ph { width:100%; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:5px; color:rgba(255,255,255,0.25); font-size:10px; font-weight:700; }
.time-ov { position:absolute; left:0; right:0; display:none; flex-direction:column; align-items:center; padding:10px 8px 8px; }
.time-ov.show { display:flex; }
#prev-time { font-family:'Nunito',sans-serif; font-weight:900; font-size:24px; color:white; text-shadow:0 2px 6px rgba(0,0,0,0.6); }
#prev-date { font-size:7px; color:rgba(255,255,255,0.75); font-weight:700; letter-spacing:1.5px; margin-top:2px; }

/* ── Buttons ── */
.btn { width:100%; padding:16px 20px; border:none; border-radius:12px; font-family:'Nunito',sans-serif; font-size:16px; font-weight:900; cursor:pointer; transition:all 0.2s; text-align:center; display:block; }
.btn:active { transform: scale(0.98); }
.btn-primary { background:var(--primary); color:white; box-shadow:0 4px 14px rgba(59,91,219,0.3); }
.btn-primary:disabled { opacity:0.35; cursor:not-allowed; transform:none; }
.btn-success { background:var(--success); color:white; box-shadow:0 4px 14px rgba(47,158,68,0.3); }
.btn-outline { background:var(--bg); color:var(--primary); border:2px solid var(--border); margin-top:9px; }
.btn-warn { background: var(--warn); color: white; box-shadow:0 4px 14px rgba(230,119,0,0.3); }
.btn-row { margin-top: 20px; display: flex; flex-direction: column; gap: 0; }

/* ── Section label ── */
.sec { font-size: 10px; font-weight: 800; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; margin-top: 18px; }

/* ── Info / notice boxes ── */
.notice { border-radius: 10px; padding: 12px 14px; font-size: 12px; font-weight: 700; line-height: 1.5; margin-bottom: 14px; }
.notice.info { background: var(--primary-light); color: var(--primary); border: 1.5px solid #b3c5ff; }
.notice.warn { background: var(--warn-light); color: var(--warn); border: 1.5px solid #ffd43b; }
.notice.success { background: var(--success-light); color: var(--success); border: 1.5px solid #b2f2bb; }
.notice.danger { background: var(--danger-light); color: var(--danger); border: 1.5px solid #ffc9c9; }

/* ── Build status ── */
.build-status { text-align: center; padding: 24px 0; }
.build-spinner { width: 48px; height: 48px; border: 4px solid var(--border); border-top-color: var(--primary); border-radius: 50%; margin: 0 auto 16px; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.build-msg { font-size: 16px; font-weight: 800; color: var(--text); margin-bottom: 6px; }
.build-sub { font-size: 12px; color: var(--muted); }
.build-timer { font-size: 28px; font-weight: 900; color: var(--primary); margin: 12px 0; font-variant-numeric: tabular-nums; }

/* ── Success steps ── */
.suc-steps { display: flex; flex-direction: column; gap: 10px; margin: 18px 0; }
.suc-step { display: flex; align-items: flex-start; gap: 12px; padding: 12px 14px; background: var(--bg); border-radius: 12px; }
.suc-n { width: 24px; height: 24px; background: var(--primary); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 900; flex-shrink: 0; }
.suc-t { font-size: 12px; font-weight: 700; line-height: 1.4; }
.suc-t span { color: var(--muted); font-weight: 600; }

.hidden { display: none !important; }

/* ── Repo link display ── */
.repo-pill { display: flex; align-items: center; gap: 8px; padding: 10px 14px; background: var(--bg); border-radius: 10px; border: 1.5px solid var(--border); font-size: 12px; font-weight: 700; word-break: break-all; }
.repo-pill .icon { font-size: 16px; flex-shrink: 0; }

/* ── Divider ── */
.divider { border: none; border-top: 1.5px solid var(--border); margin: 18px 0; }
</style>
</head>
<body>

<!-- Progress bar -->
<div class="prog-wrap">
  <div class="dots" id="dots"></div>
  <div class="prog-label" id="prog-label"></div>
</div>

<!-- ══ SCREEN 1: GitHub Setup ══════════════════════════════════════ -->
<div class="card" id="s1">
  <span class="card-icon">🔧</span>
  <h2>Connect to GitHub</h2>
  <p class="sub">This is a one-time setup. GitHub does the building for you — for free.</p>

  <div class="notice info">
    💡 You need a free GitHub account and a personal access token. The guide below explains exactly how to get both in about 3 minutes.
  </div>

  <div class="field">
    <label>Your GitHub Username</label>
    <input type="text" id="gh-user" placeholder="e.g. johndoe" value="matthope001-hub" autocomplete="off" autocorrect="off" autocapitalize="off">
    <div class="field-hint">Your GitHub username — already filled in for you!</div>
  </div>

  <div class="field">
    <label>Repository Name</label>
    <input type="text" id="gh-repo" placeholder="e.g. my-fitbit-clock" autocomplete="off" autocorrect="off" autocapitalize="off" value="my-fitbit-clock">
    <div class="field-hint">The name of your GitHub repository (you'll create it in the next step)</div>
  </div>

  <div class="field">
    <label>Personal Access Token</label>
    <input type="password" id="gh-token" placeholder="ghp_xxxxxxxxxxxxxxxxxxxx" autocomplete="off">
    <div class="field-hint">
      <a href="https://github.com/settings/tokens/new?scopes=repo&description=Fitbit+Clock+Builder" target="_blank">👆 Tap here to create your token</a> — select "repo" scope, click Generate, then paste it above. Token is stored only on your phone.
    </div>
  </div>

  <hr class="divider">

  <div class="notice warn">
    📋 <strong>Before tapping Next:</strong> Go to GitHub.com → New Repository → name it exactly what you typed above → keep it Public → click Create Repository. You only do this once!
  </div>

  <div class="btn-row">
    <button class="btn btn-primary" id="s1-next" disabled>Save & Continue →</button>
  </div>
</div>

<!-- ══ SCREEN 2: Upload Photo ══════════════════════════════════════ -->
<div class="card hidden" id="s2">
  <span class="card-icon">📸</span>
  <h2>Choose Your Photo</h2>
  <p class="sub">Pick any photo from your camera roll. Any size, any format.</p>

  <div class="upload-zone" id="upload-zone">
    <input type="file" id="photo-input" accept="image/*">
    <span class="uz-icon">🖼️</span>
    <div class="uz-main">Tap to choose a photo</div>
    <div class="uz-sub">From your camera roll or files</div>
  </div>

  <div class="photo-row hidden" id="photo-row">
    <img class="photo-thumb" id="photo-thumb" alt="">
    <div class="photo-info">
      <div class="photo-name" id="photo-name">photo.jpg</div>
      <div class="photo-ok">✓ Ready to use</div>
    </div>
    <span class="change-btn" id="change-photo">Change</span>
  </div>

  <div class="btn-row">
    <button class="btn btn-primary" id="s2-next" disabled>Next: Style It →</button>
    <button class="btn btn-outline" id="s2-back">← Back</button>
  </div>
</div>

<!-- ══ SCREEN 3: Style ═════════════════════════════════════════════ -->
<div class="card hidden" id="s3">
  <span class="card-icon">⌚</span>
  <h2>How Should It Look?</h2>
  <p class="sub">Tap to customize. Preview updates live.</p>

  <div class="watch-wrap">
    <div class="watch-outer">
      <div class="watch-screen">
        <div class="watch-ph" id="watch-ph">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="8"/><polyline points="12 6 12 12 16 14"/></svg>
          Preview
        </div>
        <img id="prev-img" alt="">
        <div class="time-ov" id="time-ov">
          <div id="prev-time">12:00</div>
          <div id="prev-date" class="hidden"></div>
        </div>
      </div>
    </div>
  </div>

  <div class="sec">Where should the time appear?</div>
  <div class="opt-grid" id="pos-grid">
    <div class="opt sel" data-v="bottom"><span class="opt-icon">⬇️</span><span class="opt-label">Bottom</span><span class="opt-sub">Most popular</span></div>
    <div class="opt" data-v="top"><span class="opt-icon">⬆️</span><span class="opt-label">Top</span><span class="opt-sub">Clean look</span></div>
    <div class="opt" data-v="center"><span class="opt-icon">⏺️</span><span class="opt-label">Center</span><span class="opt-sub">Classic</span></div>
    <div class="opt" data-v="none"><span class="opt-icon">🖼️</span><span class="opt-label">Photo only</span><span class="opt-sub">No time</span></div>
  </div>

  <div class="sec">Time format</div>
  <div class="fmt-row">
    <button class="fmt sel" data-f="12">12-hour<span class="fmt-ex">2:30 PM</span></button>
    <button class="fmt" data-f="24">24-hour<span class="fmt-ex">14:30</span></button>
  </div>

  <div class="sec">Show extras?</div>
  <div class="tog-row on" id="tog-date">
    <div class="tog-left"><span class="tog-icon">📅</span><div><div class="tog-text">Today's date</div><div class="tog-sub">e.g. FRI 18 APR</div></div></div>
    <div class="tog-switch"></div>
  </div>
  <div class="tog-row" id="tog-stats">
    <div class="tog-left"><span class="tog-icon">❤️</span><div><div class="tog-text">Steps &amp; heart rate</div><div class="tog-sub">Live fitness data</div></div></div>
    <div class="tog-switch"></div>
  </div>

  <div class="btn-row">
    <button class="btn btn-primary" id="s3-next">Build My Clock Face 🚀</button>
    <button class="btn btn-outline" id="s3-back">← Back</button>
  </div>
</div>

<!-- ══ SCREEN 4: Building ══════════════════════════════════════════ -->
<div class="card hidden" id="s4">
  <span class="card-icon">⚙️</span>
  <h2>Building Your Clock Face</h2>
  <p class="sub">GitHub is compiling your clock face in the cloud. This takes about 60–90 seconds.</p>

  <div class="build-status">
    <div class="build-spinner" id="spinner"></div>
    <div class="build-msg" id="build-msg">Uploading your photo…</div>
    <div class="build-sub" id="build-sub">Please keep this screen open</div>
    <div class="build-timer" id="build-timer">0:00</div>
  </div>

  <div class="notice info" id="build-steps-info">
    <strong>What's happening:</strong><br>
    1. Your photo is being uploaded to GitHub<br>
    2. GitHub is building the clock face<br>
    3. The .fba file will be ready to download
  </div>
</div>

<!-- ══ SCREEN 5: Done ══════════════════════════════════════════════ -->
<div class="card hidden" id="s5">
  <span class="card-icon">🎉</span>
  <h2>Your Clock Face is Ready!</h2>
  <p class="sub">Tap Download, then follow 3 simple steps to get it on your watch.</p>

  <button class="btn btn-success" id="download-fba">⬇ Download Clock Face (.fba)</button>

  <div class="suc-steps">
    <div class="suc-step">
      <div class="suc-n">1</div>
      <div class="suc-t">Go to <strong>gam.fitbit.com</strong> on your phone. <span>Sign in with your Fitbit account.</span></div>
    </div>
    <div class="suc-step">
      <div class="suc-n">2</div>
      <div class="suc-t">Tap <strong>Create → Clock Face</strong>, name it, then tap <strong>Upload .fba</strong> and choose the file you just downloaded. <span>Set Version to 1, check the box, tap Publish.</span></div>
    </div>
    <div class="suc-step">
      <div class="suc-n">3</div>
      <div class="suc-t">Tap <strong>Install on Device</strong> — the Fitbit app opens. Tap Install. <span>Your photo appears on your watch in about 30 seconds! 🎉</span></div>
    </div>
  </div>

  <div class="notice warn">
    💡 Want a different photo? Tap the button below to start over — the build only takes 60 seconds!
  </div>

  <button class="btn btn-outline" id="s5-restart">📸 Make Another Clock Face</button>
</div>

<!-- ══ SCREEN: Error ═══════════════════════════════════════════════ -->
<div class="card hidden" id="s-err">
  <span class="card-icon">😔</span>
  <h2>Something Went Wrong</h2>
  <p class="sub" id="err-msg">An unexpected error occurred.</p>
  <div class="notice danger" id="err-detail"></div>
  <div class="btn-row">
    <button class="btn btn-warn" id="err-retry">Try Again</button>
    <button class="btn btn-outline" id="err-setup">Start Over from Setup</button>
  </div>
</div>

<script>
// ── State ─────────────────────────────────────────────────────────
const STATE = {
  screen: 1,
  gh: { user: '', repo: '', token: '' },
  photoDataUrl: null,
  photoB64: null,
  cfg: { timePos: 'bottom', timeFormat: '12', showDate: true, showStats: false },
  buildRunId: null,
  fbaUrl: null,
};
const SCREENS = 5;
const LABELS = ['GitHub Setup','Choose Photo','Style It','Building…','Download'];

// ── Persist token/settings ────────────────────────────────────────
function save() {
  try { localStorage.setItem('fbc_gh', JSON.stringify(STATE.gh)); } catch(e){}
}
function load() {
  try {
    const d = JSON.parse(localStorage.getItem('fbc_gh') || '{"user":"matthope001-hub","repo":"my-fitbit-clock"}');
    STATE.gh = { ...STATE.gh, ...d };
    if (STATE.gh.user) document.getElementById('gh-user').value = STATE.gh.user;
    if (STATE.gh.repo) document.getElementById('gh-repo').value = STATE.gh.repo;
    if (STATE.gh.token) document.getElementById('gh-token').value = STATE.gh.token;
    validateS1();
  } catch(e){}
}

// ── Progress ──────────────────────────────────────────────────────
function renderProg(s) {
  const dots = document.getElementById('dots');
  const label = document.getElementById('prog-label');
  dots.innerHTML = '';
  for (let i=1; i<=SCREENS; i++) {
    const d = document.createElement('div');
    d.className = 'dot' + (i===s?' active': i<s?' done':'');
    dots.appendChild(d);
  }
  label.textContent = `Step ${s} of ${SCREENS} — ${LABELS[s-1]}`;
}

function goTo(s) {
  document.querySelectorAll('.card').forEach(c => c.classList.add('hidden'));
  const id = s === 'err' ? 's-err' : `s${s}`;
  document.getElementById(id).classList.remove('hidden');
  if (typeof s === 'number') { STATE.screen = s; renderProg(s); }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

renderProg(1);
load();

// ── Screen 1: GitHub setup ────────────────────────────────────────
function validateS1() {
  const u = document.getElementById('gh-user').value.trim();
  const r = document.getElementById('gh-repo').value.trim();
  const t = document.getElementById('gh-token').value.trim();
  document.getElementById('s1-next').disabled = !(u && r && t);
}
['gh-user','gh-repo','gh-token'].forEach(id =>
  document.getElementById(id).addEventListener('input', validateS1)
);
document.getElementById('s1-next').addEventListener('click', async () => {
  STATE.gh.user = document.getElementById('gh-user').value.trim();
  STATE.gh.repo = document.getElementById('gh-repo').value.trim();
  STATE.gh.token = document.getElementById('gh-token').value.trim();
  save();

  // Verify token works
  const btn = document.getElementById('s1-next');
  btn.textContent = 'Checking…'; btn.disabled = true;
  try {
    const res = await ghFetch(`repos/${STATE.gh.user}/${STATE.gh.repo}`);
    if (!res.ok && res.status !== 404) throw new Error(`GitHub error ${res.status}`);
    // If 404, repo doesn't exist yet — that's fine, we'll create files
    goTo(2);
  } catch(e) {
    showError('Could not connect to GitHub. Check your username and token.', e.message);
  }
  btn.textContent = 'Save & Continue →'; btn.disabled = false;
});

// ── Screen 2: Photo ───────────────────────────────────────────────
const uploadZone = document.getElementById('upload-zone');
const photoInput = document.getElementById('photo-input');

uploadZone.addEventListener('dragover', e => { e.preventDefault(); uploadZone.classList.add('drag'); });
uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('drag'));
uploadZone.addEventListener('drop', e => { e.preventDefault(); uploadZone.classList.remove('drag'); if(e.dataTransfer.files[0]) handlePhoto(e.dataTransfer.files[0]); });
photoInput.addEventListener('change', () => { if(photoInput.files[0]) handlePhoto(photoInput.files[0]); });
document.getElementById('change-photo').addEventListener('click', () => photoInput.click());
document.getElementById('s2-next').addEventListener('click', () => {
  document.getElementById('prev-img').src = STATE.photoDataUrl;
  document.getElementById('prev-img').style.display = 'block';
  document.getElementById('watch-ph').style.display = 'none';
  updatePreview();
  goTo(3);
});
document.getElementById('s2-back').addEventListener('click', () => goTo(1));

function handlePhoto(file) {
  if (!file.type.startsWith('image/')) return;
  document.getElementById('photo-name').textContent = file.name;
  const reader = new FileReader();
  reader.onload = e => {
    resizeImg(e.target.result, 368, 448, (dataUrl, b64) => {
      STATE.photoDataUrl = dataUrl;
      STATE.photoB64 = b64;
      document.getElementById('photo-thumb').src = dataUrl;
      document.getElementById('photo-row').classList.remove('hidden');
      document.getElementById('upload-zone').style.display = 'none';
      document.getElementById('s2-next').disabled = false;
    });
  };
  reader.readAsDataURL(file);
}

function resizeImg(src, w, h, cb) {
  const img = new Image();
  img.onload = () => {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const ctx = c.getContext('2d');
    const s = Math.max(w / img.width, h / img.height);
    ctx.drawImage(img, (w - img.width*s)/2, (h - img.height*s)/2, img.width*s, img.height*s);
    const dataUrl = c.toDataURL('image/png');
    cb(dataUrl, dataUrl.split(',')[1]);
  };
  img.src = src;
}

// ── Screen 3: Style ───────────────────────────────────────────────
document.querySelectorAll('#pos-grid .opt').forEach(o => o.addEventListener('click', () => {
  document.querySelectorAll('#pos-grid .opt').forEach(x => x.classList.remove('sel'));
  o.classList.add('sel');
  STATE.cfg.timePos = o.dataset.v;
  updatePreview();
}));
document.querySelectorAll('.fmt').forEach(b => b.addEventListener('click', () => {
  document.querySelectorAll('.fmt').forEach(x => x.classList.remove('sel'));
  b.classList.add('sel');
  STATE.cfg.timeFormat = b.dataset.f;
  updatePreview();
}));
document.getElementById('tog-date').addEventListener('click', function() {
  STATE.cfg.showDate = !STATE.cfg.showDate;
  this.classList.toggle('on', STATE.cfg.showDate);
  updatePreview();
});
document.getElementById('tog-stats').addEventListener('click', function() {
  STATE.cfg.showStats = !STATE.cfg.showStats;
  this.classList.toggle('on', STATE.cfg.showStats);
});
document.getElementById('s3-back').addEventListener('click', () => goTo(2));
document.getElementById('s3-next').addEventListener('click', startBuild);

function updatePreview() {
  const pos = STATE.cfg.timePos;
  const ov = document.getElementById('time-ov');
  const pd = document.getElementById('prev-date');
  if (pos === 'none') { ov.classList.remove('show'); return; }
  ov.classList.add('show');
  ov.style.bottom = pos==='top'?'auto': pos==='center'?'34%':'0';
  ov.style.top = pos==='top'?'0':'auto';
  ov.style.background = pos==='bottom'
    ? 'linear-gradient(to top,rgba(0,0,0,0.65) 0%,transparent 100%)'
    : pos==='top'
    ? 'linear-gradient(to bottom,rgba(0,0,0,0.65) 0%,transparent 100%)'
    : 'none';
  pd.classList.toggle('hidden', !STATE.cfg.showDate);
}

function tick() {
  const now = new Date(), h = now.getHours(), m = now.getMinutes().toString().padStart(2,'0');
  const t = document.getElementById('prev-time');
  if (t) t.textContent = STATE.cfg.timeFormat==='12' ? `${h%12||12}:${m} ${h<12?'AM':'PM'}` : `${h}:${m}`;
  const days=['SUN','MON','TUE','WED','THU','FRI','SAT'], mons=['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  const pd = document.getElementById('prev-date');
  if (pd) pd.textContent = `${days[now.getDay()]} ${now.getDate()} ${mons[now.getMonth()]}`;
}
setInterval(tick, 1000); tick();

// ── GitHub API ────────────────────────────────────────────────────
function ghFetch(path, opts={}) {
  return fetch(`https://api.github.com/${path}`, {
    ...opts,
    headers: {
      'Authorization': `Bearer ${STATE.gh.token}`,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
      ...(opts.headers || {})
    }
  });
}

async function ghPutFile(path, content, message, sha=null) {
  const body = { message, content };
  if (sha) body.sha = sha;
  const res = await ghFetch(`repos/${STATE.gh.user}/${STATE.gh.repo}/contents/${path}`, {
    method: 'PUT',
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `GitHub PUT failed (${res.status})`);
  }
  return res.json();
}

async function ghGetFileSha(path) {
  const res = await ghFetch(`repos/${STATE.gh.user}/${STATE.gh.repo}/contents/${path}`);
  if (res.status === 404) return null;
  const d = await res.json();
  return d.sha || null;
}

// ── Build flow ────────────────────────────────────────────────────
let buildTimer = null;
let buildSeconds = 0;

async function startBuild() {
  goTo(4);
  buildSeconds = 0;
  clearInterval(buildTimer);
  buildTimer = setInterval(() => {
    buildSeconds++;
    const m = Math.floor(buildSeconds/60).toString();
    const s = (buildSeconds%60).toString().padStart(2,'0');
    document.getElementById('build-timer').textContent = `${m}:${s}`;
  }, 1000);

  try {
    setMsg('Uploading your photo to GitHub…', 'Keep this screen open');
    await ensureWorkflowFiles();

    setMsg('Triggering the build…', 'GitHub is starting the compiler');
    await triggerBuild();

    setMsg('Building your clock face…', 'Usually takes 60–90 seconds');
    const fbaUrl = await pollForFba();

    clearInterval(buildTimer);
    STATE.fbaUrl = fbaUrl;
    setupDownload(fbaUrl);
    goTo(5);

  } catch(e) {
    clearInterval(buildTimer);
    showError('Build failed. Please check your GitHub setup and try again.', e.message);
  }
}

function setMsg(msg, sub) {
  document.getElementById('build-msg').textContent = msg;
  document.getElementById('build-sub').textContent = sub;
}

async function ensureWorkflowFiles() {
  const uuid = crypto.randomUUID();
  const cfg = STATE.cfg;

  // Build request JSON (triggers the workflow)
  const buildRequest = {
    timePos: cfg.timePos,
    timeFormat: cfg.timeFormat,
    showDate: cfg.showDate,
    showStats: cfg.showStats,
    appName: 'My Photo Clock',
    uuid,
    builtAt: new Date().toISOString()
  };

  // Upload workflow file (only if missing)
  const workflowSha = await ghGetFileSha('.github/workflows/build.yml');
  if (!workflowSha) {
    await ghPutFile(
      '.github/workflows/build.yml',
      btoa(WORKFLOW_YML),
      'Add Fitbit build workflow'
    );
    await ghPutFile(
      'scripts/generate-source.js',
      btoa(unescape(encodeURIComponent(GENERATE_JS))),
      'Add source generator script'
    );
    // Small pause to let GitHub process the workflow
    await sleep(3000);
  }

  // Upload photo
  setMsg('Uploading your photo…', 'Sending to GitHub');
  const photoSha = await ghGetFileSha('resources/photo.png');
  await ghPutFile(
    'resources/photo.png',
    STATE.photoB64,
    'Upload clock face photo',
    photoSha
  );

  // Upload build request (this triggers the workflow)
  const reqSha = await ghGetFileSha('build-request.json');
  await ghPutFile(
    'build-request.json',
    btoa(JSON.stringify(buildRequest, null, 2)),
    `Build clock face ${new Date().toISOString()}`,
    reqSha
  );
}

async function triggerBuild() {
  // Wait for workflow to be triggered by the push
  await sleep(5000);
}

async function pollForFba() {
  // Poll GitHub Actions runs until we find a completed one after our push
  const startTime = Date.now();
  const timeout = 5 * 60 * 1000; // 5 min max

  while (Date.now() - startTime < timeout) {
    await sleep(8000);

    // Get latest workflow runs
    const res = await ghFetch(
      `repos/${STATE.gh.user}/${STATE.gh.repo}/actions/runs?per_page=5`
    );
    if (!res.ok) continue;

    const data = await res.json();
    const runs = data.workflow_runs || [];

    // Find the most recent run
    const latest = runs[0];
    if (!latest) continue;

    if (latest.status === 'completed' && latest.conclusion === 'success') {
      setMsg('Build complete! Fetching your file…', 'Almost done!');

      // Try to get the FBA from the repo directly
      const fbaRes = await ghFetch(
        `repos/${STATE.gh.user}/${STATE.gh.repo}/contents/build/clockface.fba`
      );
      if (fbaRes.ok) {
        const fbaData = await fbaRes.json();
        return fbaData.download_url;
      }
    } else if (latest.status === 'completed' && latest.conclusion !== 'success') {
      throw new Error(`Build failed on GitHub. Check your repository's Actions tab for details.`);
    } else {
      // Still running
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setMsg('Building your clock face…', `GitHub is compiling • ${elapsed}s elapsed`);
    }
  }

  throw new Error('Build timed out after 5 minutes. Check GitHub Actions for details.');
}

function setupDownload(url) {
  document.getElementById('download-fba').onclick = async () => {
    const btn = document.getElementById('download-fba');
    btn.textContent = 'Downloading…'; btn.disabled = true;

    try {
      // Fetch via GitHub API to get base64 content
      const res = await ghFetch(
        `repos/${STATE.gh.user}/${STATE.gh.repo}/contents/build/clockface.fba`
      );
      const data = await res.json();
      const bytes = Uint8Array.from(atob(data.content.replace(/\s/g,'')), c => c.charCodeAt(0));
      const blob = new Blob([bytes], { type: 'application/octet-stream' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'my-photo-clock.fba';
      a.click();
      URL.revokeObjectURL(a.href);
    } catch(e) {
      alert('Download failed: ' + e.message);
    }

    btn.textContent = '⬇ Download Clock Face (.fba)'; btn.disabled = false;
  };
}

// ── Restart ───────────────────────────────────────────────────────
document.getElementById('s5-restart').addEventListener('click', () => {
  STATE.photoDataUrl = null; STATE.photoB64 = null;
  document.getElementById('upload-zone').style.display = '';
  document.getElementById('photo-row').classList.add('hidden');
  document.getElementById('s2-next').disabled = true;
  document.getElementById('prev-img').style.display = 'none';
  document.getElementById('watch-ph').style.display = '';
  goTo(2);
});

// ── Error ─────────────────────────────────────────────────────────
function showError(msg, detail='') {
  document.getElementById('err-msg').textContent = msg;
  document.getElementById('err-detail').textContent = detail;
  goTo('err');
}
document.getElementById('err-retry').addEventListener('click', () => goTo(3));
document.getElementById('err-setup').addEventListener('click', () => goTo(1));

// ── Utility ───────────────────────────────────────────────────────
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── Embedded file contents ────────────────────────────────────────
// These get uploaded to GitHub to set up the build system

const WORKFLOW_YML = `name: Build Fitbit Clock Face

on:
  push:
    paths:
      - 'build-request.json'
      - 'resources/photo.png'

jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - name: Install Fitbit SDK
        run: npm install --save-dev @fitbit/sdk@~6.2.0-pre.1 @fitbit/sdk-cli@~1.8.0-pre.10
      - name: Generate source files
        run: node scripts/generate-source.js
      - name: Build FBA
        run: npx fitbit-build
      - name: Copy to predictable filename
        run: cp build/*.fba build/clockface.fba
      - name: Commit result
        run: |
          git config user.name "Fitbit Builder"
          git config user.email "builder@fitbitforge.local"
          git add build/clockface.fba
          git commit -m "Built clock face [skip ci]" || echo "No changes"
          git push
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
      - uses: actions/upload-artifact@v4
        with:
          name: clockface-fba
          path: build/clockface.fba
          retention-days: 30
`;

const GENERATE_JS = `#!/usr/bin/env node
const fs = require('fs');
const crypto = require('crypto');
const req = JSON.parse(fs.readFileSync('build-request.json','utf8'));
const { timePos='bottom', timeFormat='12', showDate=true, showStats=false, appName='My Photo Clock', uuid=crypto.randomUUID() } = req;
const hasTime = timePos !== 'none';
['app','resources','build'].forEach(d => { if(!fs.existsSync(d)) fs.mkdirSync(d,{recursive:true}); });
fs.writeFileSync('package.json', JSON.stringify({
  name: appName.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,''),
  version:'1.0.0', private:true, appUUID:uuid, appType:'clockface',
  buildTargets:['rhea'],
  requestedPermissions: showStats ? ['access_activity','access_heart_rate'] : [],
  devDependencies:{'@fitbit/sdk':'~6.2.0-pre.1','@fitbit/sdk-cli':'~1.8.0-pre.10'}
},null,2));
const yT = timePos==='top'?'14%':timePos==='center'?'50%':'86%';
const yD = timePos==='top'?'21%':timePos==='center'?'57%':'92%';
fs.writeFileSync('app/index.js',
\`import clock from "clock";
\${showStats?'import { today } from "user-activity";\\nimport { HeartRateSensor } from "heart-rate";':''}
import { getElementById } from "document";
clock.granularity = "minutes";
\${hasTime?'const timeEl = getElementById("timeLabel");':''}
\${hasTime&&showDate?'const dateEl = getElementById("dateLabel");':''}
\${showStats?'const hrEl = getElementById("hrLabel");\\nconst stepsEl = getElementById("stepsLabel");\\nif(HeartRateSensor){const hrm=new HeartRateSensor();hrm.onreading=()=>{if(hrEl)hrEl.text="\\u2665 "+(hrm.heartRate||"--");};hrm.start();}':''}
const DAYS=["SUN","MON","TUE","WED","THU","FRI","SAT"];
const MONTHS=["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
clock.ontick=(evt)=>{
  const d=evt.date,h=d.getHours(),m=d.getMinutes().toString().padStart(2,"0");
  \${hasTime?(timeFormat==='12'?'timeEl.text=(h%12||12)+":"+m+(h<12?" AM":" PM");':'timeEl.text=h+":"+m;'):''}
  \${hasTime&&showDate?'dateEl.text=DAYS[d.getDay()]+" "+d.getDate()+" "+MONTHS[d.getMonth()];':''}
  \${showStats?'try{if(stepsEl)stepsEl.text="\\ud83d\\udc5f "+(today.adjusted.steps||0).toLocaleString();}catch(e){}':''}
};\`);
const ov=timePos==='bottom'?'x:0;y:72%;width:100%;height:28%;':timePos==='top'?'x:0;y:0;width:100%;height:28%;':'display:none;';
fs.writeFileSync('resources/index.view',\`<svg class="background">\\n  <image href="photo.png" x="0" y="0" width="100%" height="100%" />\\n\${showStats?'  <text id="hrLabel" class="stat" x="30%" y="7%" text-anchor="middle" />\\n  <text id="stepsLabel" class="stat" x="70%" y="7%" text-anchor="middle" />\\n':''}  \${hasTime?'<rect id="overlay" class="overlay" />\\n  <text id="timeLabel" class="time" x="50%" y="\'+yT+\'" text-anchor="middle" dominant-baseline="middle" />\\n':''}  \${hasTime&&showDate?'<text id="dateLabel" class="date" x="50%" y="\'+yD+\'" text-anchor="middle" dominant-baseline="middle" />\\n':''}  \\n</svg>\`);
fs.writeFileSync('resources/styles.css',\`.time{font-size:54;font-weight:bold;fill:white;}\\n.date{font-size:20;fill:white;opacity:0.85;letter-spacing:2;}\\n.stat{font-size:16;fill:white;opacity:0.85;}\\n.overlay{\${ov}fill:rgba(0,0,0,0.45);}\`);
console.log('Source files generated for: '+appName);
`;
</script>
</body>
</html>
