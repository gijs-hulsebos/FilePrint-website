import { compileVisual, drawTile, drawScene } from "../vendor/fileprint/core/engines";
import { canonicalTags } from "../vendor/fileprint/core/tags";
import { AudioPlayer } from "../vendor/fileprint/audio";

const $ = (id: string) => document.getElementById(id)!;
const canvas = $("fingerprint") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
const tile = document.createElement("canvas");
tile.width = tile.height = 512;
const input = $("tagInput") as HTMLInputElement;
const play = $("playButton") as HTMLButtonElement;
const motion = $("motionButton") as HTMLButtonElement;
const player = new AudioPlayer(.25);
const owner = {};
let tag = "#nature/fungi/mycelium";
let params: ReturnType<typeof compileVisual>;
let frame = 0, phase = 0, last = 0, visible = true, animated = true;
const reduced = matchMedia("(prefers-reduced-motion: reduce)");

function draw() {
  drawScene(ctx, canvas.width, canvas.height, phase % 1, params, false, 5, tile, 1);
}
function schedule() {
  cancelAnimationFrame(frame);
  last = 0;
  draw();
  if (!animated || !visible || document.hidden) return;
  const tick = (now: number) => {
    if (!last) last = now;
    if (now - last >= 1000 / 24) {
      phase += Math.min(now - last, 100) / 1000 / params.cycleDuration;
      last = now; draw();
    }
    frame = requestAnimationFrame(tick);
  };
  frame = requestAnimationFrame(tick);
}
function applyTag(value: unknown) {
  if (typeof value !== "string" || !value.trim() || value.length > 200 ||
      !/^#?[\p{L}\p{N}_-]+(?:\/[\p{L}\p{N}_-]+)*$/u.test(value.trim()) ||
      !/[\p{L}_-]/u.test(value)) {
    throw new Error("Use a tag such as #music/jazz/piano. No spaces; maximum 200 characters.");
  }
  const next = canonicalTags([value])[0];
  const nextParams = compileVisual({
    noteId: "Mycelium networks.md", path: "Mycelium networks.md", title: "Mycelium networks",
    tags: [next], parents: [], children: [], groups: [], labels: [],
    type: "", status: "", outgoingLinkCount: 0
  }, undefined, next);
  player.stop();
  params = nextParams; tag = next; input.value = next; phase = 0;
  drawTile(tile.getContext("2d")!, params);
  canvas.setAttribute("aria-label", "FilePrint fingerprint for " + tag);
  input.removeAttribute("aria-invalid");
  $("tagError").textContent = "";
  schedule();
  return { tag };
}
$("tagForm").addEventListener("submit", e => {
  e.preventDefault();
  try { applyTag(input.value); }
  catch (e) { $("tagError").textContent = (e as Error).message; input.setAttribute("aria-invalid", "true"); }
});
document.querySelectorAll<HTMLButtonElement>("[data-tag]").forEach(b => b.addEventListener("click", () => applyTag(b.dataset.tag)));
player.subscribe(() => {
  play.textContent = player.state === "loading" ? "Cancel" : player.state === "playing" ? "Stop sound" : "Play sound";
  play.setAttribute("aria-pressed", String(player.state === "playing"));
  $("audioStatus").textContent = player.state === "loading" ? "Generating audio…" : player.state === "playing" ? "Playing · 8.07 s loop" : "";
});
play.addEventListener("click", async () => {
  if (player.state !== "stopped") return player.stop();
  try { await player.play(tag, owner); }
  catch { $("audioStatus").textContent = "Audio could not start. Try again in a browser with Web Audio support."; }
});
($("volume") as HTMLInputElement).addEventListener("input", e => player.setVolume(Number((e.target as HTMLInputElement).value) / 100));
motion.addEventListener("click", () => {
  animated = !animated;
  motion.textContent = animated ? "Pause animation" : "Resume animation";
  motion.setAttribute("aria-pressed", String(animated)); schedule();
});
new IntersectionObserver(entries => { visible = entries.some(e => e.isIntersecting); schedule(); }).observe(canvas);
document.addEventListener("visibilitychange", () => { if (document.hidden) player.stop(); schedule(); });
reduced.addEventListener("change", schedule);
window.addEventListener("pagehide", () => { player.dispose(); cancelAnimationFrame(frame); });
$("copyPath").addEventListener("click", async () => {
  try { await navigator.clipboard.writeText(".obsidian/plugins/fileprint/"); $("copyStatus").textContent = "Folder path copied."; }
  catch { $("copyStatus").textContent = "Select and copy the path above."; }
});
applyTag(tag);
// Keep the reserved video space until the marketing video is supplied.
const video = document.querySelector<HTMLVideoElement>("#marketingVideo");
if (video?.dataset.src) { video.src = video.dataset.src; video.hidden = false; $("videoPlaceholder").hidden = true; }
const audioCanvas = $("audioCanvas") as HTMLCanvasElement;
const audioDraw = audioCanvas.getContext("2d")!;
const samples = new Uint8Array(2048);
let waveform = true, audioFrame = 0, audioVisible = true;
const beats = Array.from({length:16}, () => { const beat = document.createElement("span"); $("beats").append(beat); return beat; });
function drawAudio() {
  cancelAnimationFrame(audioFrame);
  const w = audioCanvas.width, h = audioCanvas.height;
  audioDraw.clearRect(0, 0, w, h);
  audioDraw.strokeStyle = "#303030"; audioDraw.lineWidth = 1; audioDraw.beginPath();
  for (let x = 0; x < w; x += 64) { audioDraw.moveTo(x,0); audioDraw.lineTo(x,h); }
  for (let y = 0; y <= h; y += h/4) { audioDraw.moveTo(0,y); audioDraw.lineTo(w,y); }
  audioDraw.stroke();
  const playing = player.state === "playing";
  if (playing) player.sample(samples, waveform); else samples.fill(waveform ? 128 : 0);
  audioDraw.strokeStyle = playing ? "#e2e2e2" : "#696969"; audioDraw.fillStyle = "#bcbcbc"; audioDraw.lineWidth = 2;
  if (waveform) {
    audioDraw.beginPath();
    for(let i=0;i<512;i++) { const x=i/511*w,y=h/2+Math.max(-1,Math.min(1,(samples[i]-128)/128*3))*h*.42; i ? audioDraw.lineTo(x,y) : audioDraw.moveTo(x,y); }
    audioDraw.stroke();
  } else {
    for(let i=0;i<128;i++) { const bin=Math.min(1023,Math.round(Math.pow(1024,i/127)-1)); const height=Math.max(1,samples[bin]/255*(h-8)); audioDraw.fillRect(i*w/128,h-height,w/128-3,height); }
  }
  beats.forEach((b,i)=>b.classList.toggle("active",playing && i===player.step));
  if(playing && audioVisible && !document.hidden) audioFrame=requestAnimationFrame(drawAudio);
}
$("displayMode").addEventListener("click",()=>{waveform=!waveform;$("displayMode").textContent=waveform?"Waveform":"Spectrum";audioCanvas.setAttribute("aria-label",waveform?"Live audio waveform":"Live audio spectrum");drawAudio();});
player.subscribe(drawAudio);
new IntersectionObserver(entries=>{audioVisible=entries.some(e=>e.isIntersecting);drawAudio();}).observe(audioCanvas);
document.addEventListener("visibilitychange",drawAudio);
window.addEventListener("pagehide",()=>cancelAnimationFrame(audioFrame));
drawAudio();
