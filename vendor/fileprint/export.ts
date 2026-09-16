import { drawScene, type VisualParams } from "./core/engines";

/** Render one PFP, then copy its exact pixels. Never generate five variants. */
export function visualFrame(
  doc: Document,
  params: VisualParams,
  tile: HTMLCanvasElement,
  phase: number,
  copies: number,
  size = 512,
  output = doc.createElement("canvas"),
  single = doc.createElement("canvas"),
) {
  if (single.width !== size || single.height !== size)
    single.width = single.height = size;
  drawScene(
    single.getContext("2d")!,
    size,
    size,
    phase,
    params,
    false,
    1,
    tile,
    1,
  );
  if (output.width !== size * copies || output.height !== size) {
    output.width = size * copies;
    output.height = size;
  }
  const ctx = output.getContext("2d")!;
  for (let i = 0; i < copies; i++) ctx.drawImage(single, size * i, 0);
  return output;
}
export function png(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error("PNG encoding failed.")),
      "image/png",
    ),
  );
}
export function videoType() {
  return typeof MediaRecorder === "undefined"
    ? ""
    : ([
        "video/webm;codecs=vp9",
        "video/webm;codecs=vp8",
        "video/webm",
        "video/mp4",
      ].find((t) => MediaRecorder.isTypeSupported(t)) ?? "");
}
export async function video(
  doc: Document,
  params: VisualParams,
  tile: HTMLCanvasElement,
  copies: number,
  signal: AbortSignal,
): Promise<Blob> {
  const mimeType = videoType();
  if (!mimeType)
    throw new Error("This device has no supported local video encoder.");
  if (doc.hidden)
    throw new Error(
      "Keep Obsidian visible while exporting video, then try again.",
    );
  const canvas = visualFrame(doc, params, tile, 0, copies, 256);
  const single = doc.createElement("canvas");
  const stream = canvas.captureStream(30);
  const recorder = new MediaRecorder(stream, { mimeType });
  return new Promise((resolve, reject) => {
    const chunks: Blob[] = [];
    let timer: ReturnType<typeof setTimeout>;
    let failure: Error | undefined;
    const cleanup = () => {
      clearTimeout(timer);
      stream.getTracks().forEach((t) => t.stop());
      signal.removeEventListener("abort", abort);
      doc.removeEventListener("visibilitychange", hidden);
    };
    const abort = () => {
      clearTimeout(timer);
      failure ??= new Error("Export cancelled.");
      if (recorder.state !== "inactive") recorder.stop();
      else {
        cleanup();
        reject(failure);
      }
    };
    const hidden = () => {
      if (doc.hidden) abort();
    };
    signal.addEventListener("abort", abort, { once: true });
    doc.addEventListener("visibilitychange", hidden);
    recorder.ondataavailable = (event) => {
      if (event.data.size) chunks.push(event.data);
    };
    recorder.onerror = () => {
      failure = new Error("Video encoding failed.");
      abort();
    };
    recorder.onstop = () => {
      cleanup();
      failure ? reject(failure) : resolve(new Blob(chunks, { type: mimeType }));
    };
    if (signal.aborted || doc.hidden) {
      abort();
      return;
    }
    try {
      recorder.start();
    } catch (error) {
      cleanup();
      reject(error);
      return;
    }
    const start = performance.now();
    const tick = () => {
      const phase = (performance.now() - start) / (params.cycleDuration * 1000);
      if (phase >= 1) {
        recorder.stop();
        return;
      }
      visualFrame(doc, params, tile, phase, copies, 256, canvas, single);
      timer = setTimeout(tick, 1000 / 30);
    };
    tick();
  });
}
export function wav(buffer: AudioBuffer): Blob {
  const bytes = new ArrayBuffer(
      44 + buffer.length * buffer.numberOfChannels * 2,
    ),
    view = new DataView(bytes);
  const str = (offset: number, value: string) =>
    [...value].forEach((c, i) => view.setUint8(offset + i, c.charCodeAt(0)));
  str(0, "RIFF");
  view.setUint32(4, bytes.byteLength - 8, true);
  str(8, "WAVEfmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, buffer.numberOfChannels, true);
  view.setUint32(24, buffer.sampleRate, true);
  view.setUint32(28, buffer.sampleRate * buffer.numberOfChannels * 2, true);
  view.setUint16(32, buffer.numberOfChannels * 2, true);
  view.setUint16(34, 16, true);
  str(36, "data");
  view.setUint32(40, bytes.byteLength - 44, true);
  for (let c = 0; c < buffer.numberOfChannels; c++) {
    const samples = buffer.getChannelData(c);
    for (let i = 0; i < samples.length; i++) {
      const v = Math.max(-1, Math.min(1, samples[i]));
      view.setInt16(
        44 + (i * buffer.numberOfChannels + c) * 2,
        v < 0 ? v * 32768 : v * 32767,
        true,
      );
    }
  }
  return new Blob([bytes], { type: "audio/wav" });
}
