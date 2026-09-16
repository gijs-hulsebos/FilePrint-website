const canvas = document.querySelector('#fingerprint');
const ctx = canvas.getContext('2d');
const select = document.querySelector('#tagSelect');
const play = document.querySelector('#playButton');
let audioCtx, voices = [], timer;
function hash(s) { let h = 2166136261; for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; }
function random(seed) { return () => ((seed = (Math.imul(1664525, seed) + 1013904223) >>> 0) / 4294967296); }
function draw(tag) {
  const r = random(hash(tag)); ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save(); ctx.translate(380, 310);
  const arms = 5 + Math.floor(r() * 4);
  for (let ring = 0; ring < 22; ring++) {
    ctx.beginPath();
    for (let a = 0; a <= Math.PI * 2 + .04; a += .035) {
      const radius = 18 + ring * 10.6 + (Math.sin(a * arms + ring * .72) * 12 + Math.sin(a * (arms - 2) - ring * .31) * 7) * ring / 22;
      const x = Math.cos(a) * radius, y = Math.sin(a) * radius;
      if (a === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath(); ctx.strokeStyle = 'rgba(220,220,220,' + (.22 + ring * .024) + ')'; ctx.lineWidth = 1.3; ctx.stroke();
  }
  ctx.restore(); document.querySelector('#tagLabel').textContent = tag;
}
function stop() {
  clearTimeout(timer); voices.forEach(o => { try { o.stop(); } catch {} }); voices = [];
  play.textContent = 'Play sound'; play.setAttribute('aria-pressed', 'false');
}
play.addEventListener('click', async () => {
  if (voices.length) return stop();
  try {
    audioCtx ||= new (window.AudioContext || window.webkitAudioContext)();
    await audioCtx.resume();
    const r = random(hash(select.value)), root = 130 + r() * 80, scale = [1, 1.125, 1.25, 1.5, 1.667, 2];
    for (const delay of [0, .14, .29, .48]) {
      const o = audioCtx.createOscillator(), g = audioCtx.createGain(), t = audioCtx.currentTime + delay;
      o.type = 'sine'; o.frequency.value = root * scale[Math.floor(r() * scale.length)];
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.05, t + .03); g.gain.exponentialRampToValueAtTime(.001, t + .75);
      o.connect(g).connect(audioCtx.destination); o.start(t); o.stop(t + .8); voices.push(o);
    }
    play.textContent = 'Stop sound'; play.setAttribute('aria-pressed', 'true'); timer = setTimeout(stop, 1300);
  } catch { play.textContent = 'Audio unavailable'; }
});
select.addEventListener('change', () => { stop(); draw(select.value); });
document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
document.querySelector('#copyPath').addEventListener('click', async () => {
  const status = document.querySelector('#copyStatus');
  try { await navigator.clipboard.writeText('.obsidian/plugins/fileprint/'); status.textContent = 'Folder path copied.'; }
  catch { status.textContent = 'Select and copy the folder path above.'; }
});
draw(select.value);
