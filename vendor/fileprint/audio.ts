import { audioEngine } from "./core/engines";
import { wav } from "./export";

export const WAVES = { delta: 2.5, theta: 6, alpha: 10, beta: 15, gamma: 40 };
export type Wave = keyof typeof WAVES;
export interface Experience {
  volume: number;
  muted: boolean;
  toneVolume: number;
  toneMuted: boolean;
  waves: Wave[];
}
export const EXPERIENCE: Experience = {
  volume: 0.35,
  muted: false,
  toneVolume: 0.35,
  toneMuted: false,
  waves: ["alpha"],
};
function tones(
  context: BaseAudioContext,
  destination: AudioNode,
  settings: Experience,
) {
  const nodes: {
    oscillator: OscillatorNode;
    panner: StereoPannerNode;
    gain: GainNode;
    wave: Wave;
  }[] = [];
  for (const wave of Object.keys(WAVES) as Wave[])
    for (const [frequency, pan] of [
      [150, -1],
      [150 + WAVES[wave], 1],
    ]) {
      const oscillator = context.createOscillator(),
        panner = context.createStereoPanner(),
        gain = context.createGain();
      oscillator.frequency.value = frequency;
      panner.pan.value = pan;
      gain.gain.value =
        settings.waves.includes(wave) && !settings.toneMuted
          ? (settings.toneVolume * 0.3 * 0.88) /
            Math.max(1, settings.waves.length)
          : 0;
      oscillator.connect(panner);
      panner.connect(gain);
      gain.connect(destination);
      oscillator.start();
      nodes.push({ oscillator, panner, gain, wave });
    }
  return nodes;
}

export const SAMPLE_RATE = 44100;
export const LOOP_FRAMES = Math.round(4 * 16 * (60 / 119 / 4) * SAMPLE_RATE);

/** Keep one warmed-up loop; blend its boundary over 5 ms to avoid a hard jump. */
export function loopSamples(rendered: Float32Array, length = LOOP_FRAMES) {
  const output = new Float32Array(rendered.subarray(length, length * 2));
  const fade = Math.min(
    Math.round(SAMPLE_RATE * 0.005),
    Math.floor(length / 4),
  );
  for (let i = 0; i < fade; i++) {
    const mix = (i + 1) / fade;
    const index = length - fade + i;
    output[index] = output[index] * (1 - mix) + output[0] * mix;
  }
  return output;
}

export async function renderLoop(tag: string): Promise<AudioBuffer> {
  const context = new OfflineAudioContext(2, LOOP_FRAMES * 2, SAMPLE_RATE);
  const master = context.createGain();
  master.gain.value = 0.88;
  master.connect(context.destination);
  audioEngine(tag).schedule(context, context.length / SAMPLE_RATE, master);
  const rendered = await context.startRendering();
  const buffer = new AudioBuffer({
    length: LOOP_FRAMES,
    numberOfChannels: 2,
    sampleRate: SAMPLE_RATE,
  });
  for (let channel = 0; channel < 2; channel++)
    buffer.copyToChannel(
      loopSamples(rendered.getChannelData(channel)),
      channel,
    );
  return buffer;
}

export class AudioPlayer {
  experience: Experience = { ...EXPERIENCE, waves: ["alpha"] };
  private toneNodes: ReturnType<typeof tones> = [];
  private analyser?: AnalyserNode;
  private started = 0;
  private context?: AudioContext;
  private source?: AudioBufferSourceNode;
  private gain?: GainNode;
  private generation = 0;
  private disposed = false;
  private pending?: Promise<AudioBuffer>;
  private cached?: { tag: string; buffer: AudioBuffer };
  private listeners = new Set<() => void>();
  owner?: object;
  state: "stopped" | "loading" | "playing" = "stopped";
  constructor(private volume: number) {
    this.experience.volume = volume;
  }
  setExperience(patch: Partial<Experience>) {
    Object.assign(this.experience, patch);
    this.volume = this.experience.muted ? 0 : this.experience.volume;
    if (this.context) {
      this.gain?.gain.setTargetAtTime(
        this.volume,
        this.context.currentTime,
        0.02,
      );
      for (const node of this.toneNodes)
        node.gain.gain.setTargetAtTime(
          this.experience.waves.includes(node.wave) &&
            !this.experience.toneMuted
            ? (this.experience.toneVolume * 0.3 * 0.88) /
                Math.max(1, this.experience.waves.length)
            : 0,
          this.context.currentTime,
          0.02,
        );
    }
    this.emit();
  }
  sample(data: Uint8Array<ArrayBuffer>, waveform: boolean) {
    if (waveform) this.analyser?.getByteTimeDomainData(data);
    else this.analyser?.getByteFrequencyData(data);
  }
  get step() {
    return this.context
      ? Math.floor((this.context.currentTime - this.started) / (60 / 119 / 4)) %
          16
      : -1;
  }
  async export(tag: string) {
    const settings = { ...this.experience, waves: [...this.experience.waves] };
    const music =
      this.cached?.tag === tag ? this.cached.buffer : await renderLoop(tag);
    const context = new OfflineAudioContext(2, music.length, music.sampleRate);
    const source = context.createBufferSource(),
      gain = context.createGain();
    source.buffer = music;
    gain.gain.value = settings.muted ? 0 : settings.volume;
    source.connect(gain);
    gain.connect(context.destination);
    source.start();
    tones(context, context.destination, settings);
    return wav(await context.startRendering());
  }
  subscribe(callback: () => void) {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }
  private emit() {
    for (const callback of this.listeners) callback();
  }
  setVolume(value: number) {
    this.experience.volume = value;
    this.volume = Math.max(0, Math.min(1, value));
    if (this.context && this.gain)
      this.gain.gain.setTargetAtTime(
        this.volume,
        this.context.currentTime,
        0.02,
      );
  }
  async play(tag: string, owner: object) {
    if (this.disposed) return;
    this.stop();
    const generation = this.generation;
    this.owner = owner;
    this.state = "loading";
    this.emit();
    // Resume directly inside the click gesture, before awaiting offline generation.
    try {
      const context = new AudioContext({ sampleRate: SAMPLE_RATE });
      this.context = context;
      context.onstatechange = () => {
        if (
          this.context === context &&
          this.state === "playing" &&
          context.state !== "running"
        )
          this.stop();
      };
      await context.resume();
      if (this.pending) await this.pending.catch(() => undefined);
      if (generation !== this.generation) return;
      if (this.cached?.tag !== tag) {
        const pending = renderLoop(tag);
        this.pending = pending;
        try {
          const buffer = await pending;
          if (generation !== this.generation || this.disposed) return;
          this.cached = { tag, buffer };
        } finally {
          if (this.pending === pending) this.pending = undefined;
        }
      }
      if (generation !== this.generation || this.disposed) return;
      const source = context.createBufferSource(),
        gain = context.createGain();
      source.buffer = this.cached.buffer;
      source.loop = true;
      gain.gain.setValueAtTime(0, context.currentTime);
      gain.gain.linearRampToValueAtTime(
        this.volume,
        context.currentTime + 0.025,
      );
      source.connect(gain);
      const analyser = context.createAnalyser();
      analyser.fftSize = 2048;
      gain.connect(analyser);
      analyser.connect(context.destination);
      this.analyser = analyser;
      this.toneNodes = tones(context, analyser, this.experience);
      this.source = source;
      this.gain = gain;
      source.start();
      this.started = context.currentTime;
      this.state = "playing";
      this.emit();
    } catch (error) {
      if (generation === this.generation) {
        this.stop();
        throw error;
      }
    }
  }
  stop(owner?: object) {
    if (owner && this.owner !== owner) return;
    this.generation++;
    for (const node of this.toneNodes) {
      try {
        node.oscillator.stop();
      } catch {}
      node.oscillator.disconnect();
      node.panner.disconnect();
      node.gain.disconnect();
    }
    this.toneNodes = [];
    this.analyser?.disconnect();
    this.analyser = undefined;
    if (this.source) {
      try {
        this.source.stop();
      } catch {}
      this.source.disconnect();
    }
    this.gain?.disconnect();
    const context = this.context;
    if (context) context.onstatechange = null;
    if (context && context.state !== "closed")
      void context.close().catch(() => undefined);
    this.context = undefined;
    this.source = undefined;
    this.gain = undefined;
    this.owner = undefined;
    this.state = "stopped";
    this.emit();
  }
  dispose() {
    this.disposed = true;
    this.stop();
    this.cached = undefined;
    this.listeners.clear();
  }
}
