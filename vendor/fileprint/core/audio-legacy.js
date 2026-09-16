// Extracted from the supplied audio prototype; see docs/ALGORITHMS.md.
const pT = {
    C: 261.63,
    "C# / Db": 277.18,
    D: 293.66,
    "D# / Eb": 311.13,
    E: 329.63,
    F: 349.23,
    "F# / Gb": 369.99,
    G: 392,
    "G# / Ab": 415.3,
    A: 440,
    "A# / Bb": 466.16,
    B: 493.88,
  },
  th = {
    Major: [0, 2, 4, 5, 7, 9, 11],
    "Natural Minor": [0, 2, 3, 5, 7, 8, 10],
    "Harmonic Minor": [0, 2, 3, 5, 7, 8, 11],
    "Melodic Minor": [0, 2, 3, 5, 7, 9, 11],
    "Major Pentatonic": [0, 2, 4, 7, 9],
    "Minor Pentatonic": [0, 3, 5, 7, 10],
    Hirajoshi: [0, 2, 3, 7, 8],
    Akebono: [0, 2, 3, 7, 9],
    "In Sen": [0, 1, 5, 7, 10],
    "Egyptian Pentatonic": [0, 2, 5, 7, 10],
    Pelog: [0, 1, 3, 7, 8],
    "Whole Tone": [0, 2, 4, 6, 8, 10],
    Dorian: [0, 2, 3, 5, 7, 9, 10],
    "Dorian ♭2": [0, 1, 3, 5, 7, 9, 10],
    Lydian: [0, 2, 4, 6, 7, 9, 11],
    "Lydian Dominant": [0, 2, 4, 6, 7, 9, 10],
    Mixolydian: [0, 2, 4, 5, 7, 9, 10],
    Blues: [0, 3, 5, 6, 7, 10],
    Phrygian: [0, 1, 3, 5, 7, 8, 10],
    Locrian: [0, 1, 3, 5, 6, 8, 10],
    Altered: [0, 1, 3, 4, 6, 8, 10],
    Diminished: [0, 2, 3, 5, 6, 8, 9, 11],
    Enigmatic: [0, 1, 4, 6, 8, 10, 11],
    Prometheus: [0, 2, 4, 6, 9, 10],
    "Phrygian Dominant": [0, 1, 4, 5, 7, 8, 10],
    "Double Harmonic Major": [0, 1, 4, 5, 7, 8, 11],
    "Hungarian Minor": [0, 2, 3, 6, 7, 8, 11],
    "Romanian Minor": [0, 2, 3, 6, 7, 9, 10],
    Persian: [0, 1, 4, 5, 6, 8, 11],
    "Neapolitan Minor": [0, 1, 3, 5, 7, 8, 11],
  },
  Oo = {
    "Four-on-the-Floor (House)": {
      kick: [!0, !1, !1, !1, !0, !1, !1, !1, !0, !1, !1, !1, !0, !1, !1, !1],
      snare: [!1, !1, !1, !1, !0, !1, !1, !1, !1, !1, !1, !1, !0, !1, !1, !1],
      hihat: [!1, !1, !0, !1, !1, !1, !0, !1, !1, !1, !0, !1, !1, !1, !0, !1],
    },
    "Lo-Fi Lounge (Chilled)": {
      kick: [!0, !1, !1, !1, !1, !1, !1, !0, !1, !1, !0, !1, !1, !1, !1, !1],
      snare: [!1, !1, !1, !1, !0, !1, !1, !1, !1, !1, !1, !1, !0, !1, !0, !1],
      hihat: [!0, !0, !0, !0, !0, !0, !0, !0, !0, !0, !0, !0, !0, !0, !0, !0],
    },
    "Trap Accent (Double Time)": {
      kick: [!0, !1, !1, !1, !1, !1, !0, !1, !1, !1, !1, !1, !1, !0, !1, !1],
      snare: [!1, !1, !1, !1, !1, !1, !1, !1, !0, !1, !1, !1, !1, !1, !1, !1],
      hihat: [!0, !1, !0, !1, !0, !0, !0, !1, !0, !1, !0, !0, !0, !1, !0, !0],
    },
    "Dub Techno (Deep)": {
      kick: [!0, !1, !1, !1, !1, !1, !1, !1, !0, !1, !1, !1, !1, !1, !1, !1],
      snare: [!1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !0, !1, !1, !1],
      hihat: [!1, !1, !0, !1, !0, !1, !0, !1, !1, !1, !0, !1, !0, !1, !0, !1],
    },
    "Indie Chill (Dreamy)": {
      kick: [!0, !1, !1, !1, !0, !1, !1, !1, !1, !1, !0, !1, !1, !1, !1, !1],
      snare: [!1, !1, !1, !1, !0, !1, !1, !1, !1, !1, !1, !1, !0, !1, !1, !1],
      hihat: [!0, !1, !0, !1, !0, !1, !0, !1, !0, !1, !0, !1, !0, !1, !0, !1],
    },
    "Ambient Pulse (Minimalist)": {
      kick: [!0, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1],
      snare: [!1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1, !1],
      hihat: [!0, !1, !1, !1, !0, !1, !1, !1, !0, !1, !1, !1, !0, !1, !1, !1],
    },
    "Syncopated Groove": {
      kick: [!0, !1, !1, !0, !1, !1, !1, !1, !1, !0, !1, !1, !0, !1, !1, !1],
      snare: [!1, !1, !1, !1, !0, !1, !1, !0, !1, !1, !1, !1, !0, !1, !1, !1],
      hihat: [!0, !1, !0, !1, !0, !1, !0, !1, !0, !1, !0, !1, !0, !1, !0, !1],
    },
    "Blank (Custom Beat)": {
      kick: Array(16).fill(!1),
      snare: Array(16).fill(!1),
      hihat: Array(16).fill(!1),
    },
  },
  z1 = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"],
  j1 = [
    "Major",
    "Natural Minor",
    "Harmonic Minor",
    "Melodic Minor",
    "Major Pentatonic",
    "Minor Pentatonic",
    "Hirajoshi",
    "Akebono",
    "In Sen",
    "Egyptian Pentatonic",
    "Pelog",
    "Whole Tone",
    "Dorian",
    "Dorian ♭2",
    "Lydian",
    "Lydian Dominant",
    "Mixolydian",
    "Blues",
    "Phrygian",
    "Locrian",
    "Altered",
    "Diminished",
    "Enigmatic",
    "Prometheus",
    "Phrygian Dominant",
    "Double Harmonic Major",
    "Hungarian Minor",
    "Romanian Minor",
    "Persian",
    "Neapolitan Minor",
  ],
  U1 = [
    "Sustained Drone",
    "Off-Beat Pulse",
    "Walking Scale",
    "Octave Jump",
    "Staccato Pluck",
    "Heartbeat Doublet",
    "Organic Sub-Rumble",
    "Root Anchor",
  ],
  V1 = ["sine", "triangle", "sawtooth"],
  k1 = ["Four-on-the-Floor", "Lo-Fi", "Trap", "Ambient", "Syncopated", "Blank"],
  H1 = [
    "Drunken Walk",
    "Ascending Cascade",
    "Pendulum",
    "Fractal",
    "Question & Answer",
    "Sparse Stardust",
  ],
  B1 = [
    "Glass Pad",
    "Chime Bell",
    "Warm Tine",
    "Nylon Pluck",
    "Wooden Mallet",
    "Air Whistle",
  ];
function vf(w) {
  let M = 0;
  if (w.length === 0) return M;
  for (let fe = 0; fe < w.length; fe++) {
    const F = w.charCodeAt(fe);
    ((M = (M << 5) - M + F), (M |= 0));
  }
  return Math.abs(M);
}
const mT = (w) =>
    ({
      C: "C",
      "C#": "C# / Db",
      D: "D",
      "D#": "D# / Eb",
      E: "E",
      F: "F",
      "F#": "F# / Gb",
      G: "G",
      "G#": "G# / Ab",
      A: "A",
      "A#": "A# / Bb",
      B: "B",
    })[w] || w,
  hT = (w) =>
    ({
      "Sustained Drone": "Steady Drone",
      "Off-Beat Pulse": "Off-beat Pulse",
      "Walking Scale": "Walking Groove",
      "Octave Jump": "80s Synthwave",
      "Staccato Pluck": "Staccato Pluck",
      "Heartbeat Doublet": "The Heartbeat Doublet",
      "Organic Sub-Rumble": "Organic Sub-Rumble",
      "Root Anchor": "Root Anchor",
    })[w] || w,
  yT = (w) =>
    ({
      "Drunken Walk": "Drunken Walk",
      "Ascending Cascade": "Ascending Cascade",
      Pendulum: "Pendulum (Alternating)",
      Fractal: "Fractal (Self-Similar)",
      "Question & Answer": "Question & Answer",
      "Sparse Stardust": "Sparse Stardust",
    })[w] || w;
export function createAudioEngine(tag) {
  const h = tag,
    D = "";
  let X = "A",
    ke = "Minor Pentatonic",
    Xe = "triangle",
    qt = 350,
    vt = "Off-beat Pulse",
    je = Oo["Lo-Fi Lounge (Chilled)"],
    K = "Glass Pad",
    ce = 0.45,
    xt = "Ethereal Echoes",
    U = 42;
  const St = (v) => (vt = v),
    Qe = (v) => (Xe = v),
    At = (v) => (qt = v),
    J = (v) => (X = v),
    R = (v) => (ke = v),
    Te = () => {},
    dt = (v) => (je = v),
    Gt = (v) => (xt = v),
    ot = (v) => (K = v),
    le = (v) => (U = v),
    ge = (v) => (ce = v);
  const Zn = (y, h, D, Y) => {
      const V = y.createOscillator(),
        W = y.createGain();
      (V.connect(W),
        W.connect(Y),
        V.frequency.setValueAtTime(140, h),
        V.frequency.exponentialRampToValueAtTime(35, h + 0.1),
        W.gain.setValueAtTime(D, h),
        W.gain.exponentialRampToValueAtTime(0.001, h + 0.11),
        V.start(h),
        V.stop(h + 0.12));
    },
    wo = (y, h, D, Y, V) => {
      const W = y.createBufferSource();
      W.buffer = Y;
      const ue = y.createBiquadFilter();
      ((ue.type = "highpass"), (ue.frequency.value = 1200));
      const Z = y.createGain();
      (W.connect(ue),
        ue.connect(Z),
        Z.connect(V),
        Z.gain.setValueAtTime(D * 0.45, h),
        Z.gain.exponentialRampToValueAtTime(0.001, h + 0.16));
      const re = y.createOscillator(),
        me = y.createGain();
      (re.connect(me),
        me.connect(V),
        re.frequency.setValueAtTime(180, h),
        re.frequency.exponentialRampToValueAtTime(110, h + 0.08),
        me.gain.setValueAtTime(D * 0.4, h),
        me.gain.exponentialRampToValueAtTime(0.001, h + 0.08),
        W.start(h),
        W.stop(h + 0.18),
        re.start(h),
        re.stop(h + 0.09));
    },
    ml = (y, h, D, Y, V) => {
      const W = y.createBufferSource();
      W.buffer = Y;
      const ue = y.createBiquadFilter();
      ((ue.type = "bandpass"), (ue.frequency.value = 9500), (ue.Q.value = 2));
      const Z = y.createGain();
      (W.connect(ue),
        ue.connect(Z),
        Z.connect(V),
        Z.gain.setValueAtTime(D * 0.28, h),
        Z.gain.exponentialRampToValueAtTime(0.001, h + 0.045),
        W.start(h),
        W.stop(h + 0.055));
    },
    Mo = (y, h, D, Y, V, W, ue, Z = !1, re = !1) => {
      const me = y.createOscillator(),
        Ee = y.createOscillator(),
        Pe = y.createBiquadFilter(),
        He = y.createGain();
      me.type = re ? "sawtooth" : V;
      const Jt = re ? 30 + Co(W, vf(vt.toLowerCase())) * 20 : D;
      (me.frequency.setValueAtTime(Jt, h),
        (Ee.type = "sine"),
        Ee.frequency.setValueAtTime(Jt / 2, h),
        (Pe.type = "lowpass"));
      const Wn = re ? 75 : W;
      Pe.frequency.setValueAtTime(Wn, h);
      const Ue = Z ? Wn * 0.1 : re ? 35 : Math.max(40, Wn * 0.2);
      (Pe.frequency.exponentialRampToValueAtTime(
        Ue,
        h + (Z ? 0.08 : re ? 0.8 : 0.22),
      ),
        He.gain.setValueAtTime(0, h),
        He.gain.linearRampToValueAtTime(Y * 0.5, h + 0.01),
        Z
          ? (He.gain.exponentialRampToValueAtTime(Y * 0.05, h + 0.04),
            He.gain.exponentialRampToValueAtTime(0.001, h + 0.08))
          : re
            ? (He.gain.exponentialRampToValueAtTime(Y * 0.35, h + 0.4),
              He.gain.exponentialRampToValueAtTime(0.001, h + 0.9))
            : (He.gain.exponentialRampToValueAtTime(Y * 0.25, h + 0.18),
              He.gain.exponentialRampToValueAtTime(0.001, h + 0.28)),
        me.connect(Pe),
        Ee.connect(Pe),
        Pe.connect(He),
        He.connect(ue));
      const et = Z ? 0.09 : re ? 0.95 : 0.3;
      (me.start(h), me.stop(h + et), Ee.start(h), Ee.stop(h + et));
    },
    sa = (y, h, D, Y, V, W, ue) => {
      const Z = y.createOscillator(),
        re = y.createOscillator(),
        me = y.createOscillator(),
        Ee = y.createBiquadFilter(),
        Pe = y.createGain(),
        He = y.createDelay(1),
        Jt = y.createGain(),
        Wn = y.createGain();
      (He.delayTime.setValueAtTime(0.35, h),
        Jt.gain.setValueAtTime(W, h),
        Wn.gain.setValueAtTime(0.25, h),
        He.connect(Jt),
        Jt.connect(He));
      let Ue = 0.02,
        et = 0.35,
        Ct = 0.3,
        Lt = 0.7,
        xn = !1,
        Ei = !1;
      (V === "Glass Pad"
        ? ((Z.type = "sine"),
          Z.frequency.setValueAtTime(D, h),
          (re.type = "sine"),
          re.frequency.setValueAtTime(D * 2.003, h),
          (xn = !0),
          (Ee.type = "lowpass"),
          Ee.frequency.setValueAtTime(800, h),
          Ee.frequency.exponentialRampToValueAtTime(1200, h + 0.4),
          (Ue = 0.15),
          (et = 0.5),
          (Ct = 0.6),
          (Lt = 1.2))
        : V === "Chime Bell"
          ? ((Z.type = "triangle"),
            Z.frequency.setValueAtTime(D, h),
            (re.type = "sine"),
            re.frequency.setValueAtTime(D * 3.015, h),
            (xn = !0),
            (me.type = "sine"),
            me.frequency.setValueAtTime(D * 5, h),
            (Ei = !0),
            (Ee.type = "lowpass"),
            Ee.frequency.setValueAtTime(2500, h),
            (Ue = 0.005),
            (et = 0.2),
            (Ct = 0.1),
            (Lt = 0.8))
          : V === "Warm Tine"
            ? ((Z.type = "triangle"),
              Z.frequency.setValueAtTime(D, h),
              (re.type = "sine"),
              re.frequency.setValueAtTime(D * 2, h),
              (xn = !0),
              (Ee.type = "lowpass"),
              Ee.frequency.setValueAtTime(650, h),
              (Ue = 0.01),
              (et = 0.3),
              (Ct = 0.2),
              (Lt = 0.5))
            : V === "Nylon Pluck"
              ? ((Z.type = "sine"),
                Z.frequency.setValueAtTime(D, h),
                (re.type = "triangle"),
                re.frequency.setValueAtTime(D * 1.002, h),
                (xn = !0),
                (Ee.type = "lowpass"),
                Ee.frequency.setValueAtTime(1e3, h),
                Ee.frequency.exponentialRampToValueAtTime(150, h + 0.2),
                (Ue = 0.008),
                (et = 0.25),
                (Ct = 0.1),
                (Lt = 0.4))
              : V === "Wooden Mallet"
                ? ((Z.type = "triangle"),
                  Z.frequency.setValueAtTime(D, h),
                  (re.type = "sine"),
                  re.frequency.setValueAtTime(D * 4, h),
                  (xn = !0),
                  (Ee.type = "lowpass"),
                  Ee.frequency.setValueAtTime(1200, h),
                  Ee.frequency.exponentialRampToValueAtTime(80, h + 0.1),
                  (Ue = 0.002),
                  (et = 0.12),
                  (Ct = 0.01),
                  (Lt = 0.2))
                : V === "Air Whistle"
                  ? ((Z.type = "sine"),
                    Z.frequency.setValueAtTime(D, h),
                    (re.type = "sine"),
                    re.frequency.setValueAtTime(D * 3, h),
                    (xn = !0),
                    (Ee.type = "lowpass"),
                    Ee.frequency.setValueAtTime(1500, h),
                    (Ue = 0.06),
                    (et = 0.4),
                    (Ct = 0.5),
                    (Lt = 0.6))
                  : ((Z.type = "square"),
                    Z.frequency.setValueAtTime(D, h),
                    (Ee.type = "lowpass"),
                    Ee.frequency.setValueAtTime(1400, h),
                    (Ue = 0.02),
                    (et = 0.35),
                    (Ct = 0.3),
                    (Lt = 0.7)),
        Pe.gain.setValueAtTime(0, h),
        Pe.gain.linearRampToValueAtTime(Y * 0.35, h + Ue),
        Pe.gain.exponentialRampToValueAtTime(Y * 0.35 * Ct, h + Ue + et),
        Pe.gain.exponentialRampToValueAtTime(0.001, h + Ue + et + Lt),
        Z.connect(Ee),
        xn && re.connect(Ee),
        Ei && me.connect(Ee),
        Ee.connect(Pe),
        Pe.connect(ue),
        Pe.connect(He),
        He.connect(Wn),
        Wn.connect(ue));
      const vu = Ue + et + Lt;
      (Z.start(h),
        Z.stop(h + vu),
        xn && (re.start(h), re.stop(h + vu)),
        Ei && (me.start(h), me.stop(h + vu)));
    },
    Sn = (y) => {
      const D =
        {
          C: "C",
          "C#": "C# / Db",
          D: "D",
          "D#": "D# / Eb",
          E: "E",
          F: "F",
          "F#": "F# / Gb",
          G: "G",
          "G#": "G# / Ab",
          A: "A",
          "A#": "A# / Bb",
          B: "B",
        }[y] || y;
      return pT[D] || 440;
    },
    bi = (y) => {
      const h = Sn(X) / 4,
        D = th[ke];
      switch (vt) {
        case "Steady Drone":
        case "Sustained Drone":
          return y === 0 || y === 8 ? h : 0;
        case "Off-beat Pulse":
        case "Off-Beat Pulse":
          return y % 4 === 2 ? h : 0;
        case "Walking Groove":
        case "Walking Scale":
          if (y % 4 === 0) {
            const Y = (y / 4) % D.length,
              V = D[Y];
            return h * Math.pow(2, V / 12);
          }
          return 0;
        case "80s Synthwave":
        case "Octave Jump":
          if (y % 2 === 0) {
            const Y = y % 4 === 0 ? 1 : 2;
            return (h / 2) * Y;
          }
          return 0;
        case "Staccato Pluck":
          return y % 4 === 0 || y % 4 === 3 ? h : 0;
        case "The Heartbeat Doublet":
        case "Heartbeat Doublet":
          return y === 0 || y === 1 ? h : 0;
        case "Organic Sub-Rumble":
          return y % 8 === 0 ? h : 0;
        case "Root Anchor":
          return y === 0 ? h : 0;
        default:
          return 0;
      }
    },
    Co = (y, h) => {
      const D = Math.sin(y * 12.9898 + h * 78.233) * 43758.5453;
      return D - Math.floor(D);
    },
    gu = (y) => {
      const h = th[ke],
        D = Sn(X),
        Y = Co(y, U);
      switch (xt) {
        case "Ethereal Echoes":
        case "Sparse Echoes":
          if (
            (y === 0 ||
              y === 3 ||
              y === 6 ||
              y === 8 ||
              y === 11 ||
              y === 14) &&
            Y > 0.3
          ) {
            const V = Math.floor(Y * h.length),
              W = h[V];
            return D * Math.pow(2, W / 12);
          }
          return 0;
        case "Ascending Cascade":
          if (y % 2 === 0) {
            const V = Math.floor(y / 2) % h.length,
              W = h[V],
              ue = y >= 8 ? 2 : 1;
            return D * ue * Math.pow(2, W / 12);
          }
          return 0;
        case "Drunken Walk":
          if (y % 2 === 0) {
            const V = Math.floor(Co(Math.floor(y / 2), U + 10) * h.length),
              W = h[V];
            return D * Math.pow(2, W / 12);
          }
          return 0;
        case "Chime Plucks":
          if ((y % 4 === 1 || y % 4 === 3) && Y > 0.45) {
            const V = Math.floor(Y * h.length);
            return D * 2 * Math.pow(2, h[V] / 12);
          }
          return 0;
        case "Pendulum":
        case "Pendulum (Alternating)": {
          const W = Math.min(4, h.length - 1),
            ue = Math.min(2, h.length - 1);
          if (y % 2 === 0) {
            const re = Y < 0.15 ? ue : y % 4 === 0 ? 0 : W,
              me = h[re];
            return D * Math.pow(2, me / 12);
          }
          return 0;
        }
        case "Fractal":
        case "Fractal (Self-Similar)": {
          const V = y % 4,
            W = Math.floor(y / 4) % 3,
            ue = [0, 2, 4, 3],
            re = (ue[V % ue.length] + W * 2) % h.length,
            me = h[re];
          return y % 2 === 0 ? D * Math.pow(2, me / 12) : 0;
        }
        case "Question & Answer": {
          if (y < 7 && y % 2 === 0) {
            const V = Math.floor(Co(y, U + 5) * h.length),
              W = h[V];
            return D * 2 * Math.pow(2, W / 12);
          }
          if (y >= 7 && y <= 10) return 0;
          if (y > 10 && y % 2 === 0) {
            const V = Math.floor(Co(y, U + 15) % Math.max(1, h.length - 2)),
              W = h[V];
            return D * Math.pow(2, W / 12);
          }
          return 0;
        }
        case "Sparse Stardust": {
          if ((y === 0 || y === 5 || y === 10 || y === 14) && Y > 0.7) {
            const V = Math.floor(Co(y, U + 20) * h.length),
              W = h[V],
              ue = Y > 0.85 ? 3 : 2;
            return D * ue * Math.pow(2, W / 12);
          }
          return 0;
        }
        default:
          return 0;
      }
    };
  const Y =
      (h || "")
        .replace(/[\[\]"']/g, " ")
        .split(/[,\s]+/)
        .map((y) =>
          y
            .trim()
            .replace(/^#+/, "")
            .replace(/[)\]}>,;]+$/, ""),
        )
        .filter(Boolean)
        .sort((a, b) => b.split("/").length - a.split("/").length)[0] || "",
    V = Y
      ? Y.split("/")
          .map((y) => y.trim().toLowerCase())
          .filter(Boolean)
      : [],
    W = (V.slice(0, 2).join("/") || D || "default").toLowerCase(),
    ue = (V.slice(0, 3).join("/") || D || "default").toLowerCase(),
    Z = (V.slice(0, 4).join("/") || D || "default").toLowerCase(),
    re = (V.join("/") || D || "default").toLowerCase(),
    ps = (y, h) => {
      let D = (vf(y) ^ h) >>> 0;
      ((D = Math.imul(D ^ (D >>> 16), 2246822507)),
        (D = Math.imul(D ^ (D >>> 13), 3266489909)));
      return (D ^ (D >>> 16)) >>> 0;
    },
    me = ps(W, 0x243f6a88) % U1.length,
    Ee = ps(W, 0x85a308d3) % V1.length,
    Pe = ps(W, 0x13198a2e) % 12,
    He = ps(ue, 0x03707344) % z1.length,
    Jt = ps(ue, 0xa4093822) % j1.length,
    Wn = ps(Z, 0x299f31d0) % k1.length,
    Ue = k1[Wn],
    et =
      {
        "Four-on-the-Floor": "Four-on-the-Floor (House)",
        "Lo-Fi": "Lo-Fi Lounge (Chilled)",
        Trap: "Trap Accent (Double Time)",
        Ambient: "Ambient Pulse (Minimalist)",
        Syncopated: "Syncopated Groove",
        Blank: "Blank (Custom Beat)",
      }[Ue] || Ue,
    Ct = Oo[et],
    Lt = ps(Z, 0x082efa98),
    xn = ps(Z, 0xec4e6c89),
    Ei = ps(Z, 0x452821e6),
    vu = (y, h, D) =>
      h.map((Y, V) => {
        const Wn = Co(V, D);
        if (y === "kick") {
          if (V === 0) return !0;
          return Y ? Wn > 0.07 : Wn < 0.18;
        }
        if (y === "snare") {
          if (V === 4 || V === 12) return !0;
          return Y ? Wn > 0.08 : Wn < 0.11;
        }
        return Y ? Wn > 0.14 : Wn < 0.24;
      }),
    hl = {
      kick: vu("kick", Ct.kick, Lt),
      snare: vu("snare", Ct.snare, xn),
      hihat: vu("hihat", Ct.hihat, Ei),
    },
    nc = ps(re, 0x38d01377) % H1.length,
    ac = ps(re, 0xbe5466cf) % B1.length,
    lc = ps(re, 0x34e90c6c) % 100000,
    yc = ps(re, 0xc0ac29b7) % 71;
  St(hT(U1[me]));
  Qe(V1[Ee]);
  At([150, 190, 240, 300, 380, 470, 580, 700, 830, 970, 1100, 1200][Pe]);
  J(mT(z1[He]));
  R(j1[Jt]);
  Te(Ue);
  dt(hl);
  Gt(yT(H1[nc]));
  ot(B1[ac]);
  le(lc);
  ge(0.15 + yc / 100);
  const ee = (y) => {
    const h = y.sampleRate,
      D = y.createBuffer(1, h, y.sampleRate),
      Y = D.getChannelData(0),
      V = vf(
        ["kick", "snare", "hihat"]
          .map((W) => W + ":" + je[W].map((ue) => (ue ? 1 : 0)).join(""))
          .join("|"),
      );
    for (let W = 0; W < h; W++) Y[W] = Co(W, V) * 2 - 1;
    return D;
  };

  return {
    profile: {
      rootKey: X,
      scale: ke,
      bassPattern: vt,
      waveform: Xe,
      cutoff: qt,
      rhythm: je,
      melodyPattern: xt,
      synth: K,
      feedback: ce,
      melodySeed: U,
    },
    notes: Array.from({ length: 16 }, (_, step) => ({
      bass: bi(step),
      melody: gu(step),
    })),
    schedule(context, duration, destination) {
      const bass = context.createGain(),
        rhythm = context.createGain(),
        melody = context.createGain();
      bass.gain.value = 0.6;
      rhythm.gain.value = 0.5;
      melody.gain.value = 0.5;
      bass.connect(destination);
      rhythm.connect(destination);
      melody.connect(destination);
      const noise = ee(context),
        stepDuration = 60 / 119 / 4;
      let step = 0;
      for (
        let time = 0;
        time < duration;
        time += stepDuration, step = (step + 1) % 16
      ) {
        const b = bi(step),
          m = gu(step);
        if (b > 0)
          Mo(
            context,
            time,
            b,
            0.6,
            Xe,
            qt,
            bass,
            vt === "Staccato Pluck",
            vt === "Organic Sub-Rumble",
          );
        if (je.kick[step]) Zn(context, time, 0.5 * 0.95, rhythm);
        if (je.snare[step]) wo(context, time, 0.5 * 0.8, noise, rhythm);
        if (je.hihat[step]) ml(context, time, 0.5 * 0.65, noise, rhythm);
        if (m > 0) sa(context, time, m, 0.5, K, ce, melody);
      }
      // Binaural tones are mixed separately by the experience player.
    },
  };
}
