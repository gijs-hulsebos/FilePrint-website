import { createAudioEngine } from "./audio-legacy.js";
import {
  compileFingerprint,
  drawFingerprintTile,
  renderRecursiveScene,
} from "./visual-legacy.js";
import type { NoteInput } from "./tags";

// Typed boundaries around the preserved JavaScript numerical kernels.
export interface VisualParams {
  identityHex: string;
  geometrySignature: number;
  cycleDuration: number;
  topologyName: string;
  palette: { name: string; bg: string };
  [key: string]: unknown;
}
export const compileVisual = compileFingerprint as unknown as (
  input: NoteInput,
  mapping?: undefined,
  tag?: string,
) => VisualParams;
export const drawTile = drawFingerprintTile as unknown as (
  context: CanvasRenderingContext2D,
  params: VisualParams,
) => void;
export const drawScene = renderRecursiveScene as unknown as (
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  phase: number,
  params: VisualParams,
  transparent: boolean,
  copies: number,
  tile: HTMLCanvasElement,
  scale?: number,
) => void;
export const audioEngine = createAudioEngine as unknown as (tag: string) => {
  profile: Record<string, unknown>;
  notes: { bass: number; melody: number }[];
  schedule(
    context: OfflineAudioContext,
    duration: number,
    destination: AudioNode,
  ): void;
};
