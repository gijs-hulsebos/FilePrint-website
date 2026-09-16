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
let frame = 0, phase = 0, last = 0, visible = true, animated = false;
const reduced = matchMedia("(prefers-reduced-motion: reduce)");

function draw() {
  drawScene(ctx, canvas.width, canvas.height, phase % 1, params, false, 1, tile, 1);
}
function schedule() {
  cancelAnimationFrame(frame);
  last = 0;
  draw();
  if (!animated || !visible || document.hidden || reduced.matches) return;
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
  $("tagLabel").textContent = tag;
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
  motion.textContent = animated ? "Pause animation" : "Animate";
  motion.setAttribute("aria-pressed", String(animated)); schedule();
});
new IntersectionObserver(entries => { visible = entries.some(e => e.isIntersecting); schedule(); if (!visible) player.stop(); }).observe(canvas);
document.addEventListener("visibilitychange", () => { if (document.hidden) player.stop(); schedule(); });
reduced.addEventListener("change", schedule);
window.addEventListener("pagehide", () => { player.dispose(); cancelAnimationFrame(frame); });
$("copyPath").addEventListener("click", async () => {
  try { await navigator.clipboard.writeText(".obsidian/plugins/fileprint/"); $("copyStatus").textContent = "Folder path copied."; }
  catch { $("copyStatus").textContent = "Select and copy the path above."; }
});
applyTag(tag);
// The video stays absent until a real source is supplied.
const video = document.querySelector<HTMLVideoElement>("#marketingVideo");
if (video?.dataset.src) { video.src = video.dataset.src; $("film").hidden = false; }
