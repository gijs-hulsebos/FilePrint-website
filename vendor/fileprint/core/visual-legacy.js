// Extracted from visual-fingerprint-v9; see docs/ALGORITHMS.md.
const ALGORITHM_VERSION = "visual-fingerprint-v9";
const TILE_SIZE = 512;
const MAX_PIXEL_RATIO = 1.5;
const TARGET_FRAME_MS = 1000 / 60 - 1;
const MAJOR_SLOT_COUNT = 16;
const SECONDARY_SLOT_COUNT = 24;
const SYMBOLS = [
  "Circle",
  "Triangle",
  "Square",
  "Diamond",
  "Hexagon",
  "Star",
  "Cross",
  "Arch",
  "Crescent",
  "Split Ring",
  "Shield",
  "Spiral",
];
const TOPOLOGIES = [
  "Radial Citadel",
  "Recursive Gate",
  "Branching Crown",
  "Interlocking Orbit",
  "Triangular Lattice",
  "Concentric Machine",
  "Spiral Fortress",
  "Axial Totem",
  "Fractal Bloom",
  "Split Monolith",
  "Hexagonal Nexus",
  "Recursive Labyrinth",
];
const CORES = [
  "Hollow Reactor",
  "Solid Nucleus",
  "Split Core",
  "Triple Chamber",
  "Nested Sigil",
  "Cross Core",
  "Orbital Core",
  "Fractured Core",
  "Crowned Core",
  "Inverted Core",
];
const CONNECTORS = [
  "Direct Bridges",
  "Stepped Paths",
  "Forked Arteries",
  "Orbital Links",
  "Braided Channels",
  "Angular Tunnels",
  "Radial Spokes",
  "Interlocking Hooks",
  "Recursive Ribs",
  "Alternating Gates",
];
const TERMINALS = [
  "Points",
  "Crowns",
  "Rings",
  "Blades",
  "Forks",
  "Nodes",
  "Shields",
  "Arches",
  "Split Tips",
  "Satellites",
];
const ACCENTS = [
  "Center Weighted",
  "Edge Weighted",
  "Alternating",
  "Three-Band",
  "Cardinal",
  "Diagonal",
  "Orbital",
  "Pulsed",
  "Mirrored",
  "Sparse Signature",
  "Dense Signature",
  "Asymmetric Marker",
];
const BACKGROUNDS = [
  "Cartesian lattice",
  "Radial lattice",
  "Diagonal field",
  "Orbital field",
  "Node field",
  "Cross lattice",
];
const LAYOUTS = [
  "Orbital",
  "Nested",
  "Radiant",
  "Quadrant",
  "Braided",
  "Concentric",
];
const PORTAL_NAMES = [
  "North-west",
  "North",
  "North-east",
  "West",
  "Centre",
  "East",
  "South-west",
  "South",
  "South-east",
];
const MAPPING_MODE_ORDER = [
  "level-1",
  "level-2",
  "level-3",
  "level-4",
  "deepest",
  "note",
];
const MAPPING_MODES = new Set(MAPPING_MODE_ORDER);
const DEFAULT_MAPPING = Object.freeze({
  foundation: "level-1",
  palette: "level-2",
  structure: "level-3",
  detail: "deepest",
});
const PALETTES = [
  {
    name: "Violet Signal",
    bg: "#06050a",
    primary: "#f5f2ff",
    secondary: "#8e63f1",
    accent: "#c4b1ff",
    border: "#8055e3",
    glow: "#7448de",
  },
  {
    name: "Crimson Archive",
    bg: "#160508",
    primary: "#fff0cf",
    secondary: "#d6a23b",
    accent: "#ffcf75",
    border: "#a9283e",
    glow: "#c14345",
  },
  {
    name: "Navy Current",
    bg: "#020b18",
    primary: "#dff8ff",
    secondary: "#26c8ef",
    accent: "#4388ff",
    border: "#1e66c6",
    glow: "#16bde4",
  },
  {
    name: "Emerald Circuit",
    bg: "#06110d",
    primary: "#e9ffe8",
    secondary: "#39d47f",
    accent: "#b9ef55",
    border: "#1b8b58",
    glow: "#51d984",
  },
  {
    name: "Amber Furnace",
    bg: "#160c04",
    primary: "#fff0cf",
    secondary: "#ffad32",
    accent: "#f06b20",
    border: "#a65317",
    glow: "#e98626",
  },
  {
    name: "Magenta Nocturne",
    bg: "#0d0410",
    primary: "#f9e7ff",
    secondary: "#e752d4",
    accent: "#a787ff",
    border: "#a43fbd",
    glow: "#d350d7",
  },
  {
    name: "Glacial Silver",
    bg: "#071017",
    primary: "#f4fbff",
    secondary: "#98c8e6",
    accent: "#c7d2dc",
    border: "#5481a0",
    glow: "#84bad9",
  },
  {
    name: "Teal Coral",
    bg: "#061313",
    primary: "#e5ffff",
    secondary: "#24bbae",
    accent: "#ff786c",
    border: "#328e89",
    glow: "#32bfb1",
  },
  {
    name: "Red Monolith",
    bg: "#080606",
    primary: "#ffffff",
    secondary: "#ea4040",
    accent: "#ff8989",
    border: "#9d2929",
    glow: "#df4141",
  },
  {
    name: "Indigo Voltage",
    bg: "#06071b",
    primary: "#eeefff",
    secondary: "#596cff",
    accent: "#2eb8ff",
    border: "#4452c7",
    glow: "#5770ff",
  },
  {
    name: "Sepia Manuscript",
    bg: "#19130d",
    primary: "#f3dfba",
    secondary: "#b9854d",
    accent: "#e0bd82",
    border: "#83603d",
    glow: "#b7834e",
  },
  {
    name: "Graphite",
    bg: "#090a0c",
    primary: "#f0f0f0",
    secondary: "#9da0a6",
    accent: "#cacdd2",
    border: "#686c73",
    glow: "#a5a8ad",
  },
];
const DEFAULT_INPUT = {
  noteId: "test-alpha",
  path: "",
  title: "Signal Archive",
  tags: ["#atlas/core/signal/echo"],
  parents: [],
  children: [],
  groups: [],
  labels: [],
  type: "Note",
  status: "",
  collisionNonce: "",
  outgoingLinkCount: 0,
};

function normalizeText(value) {
  return String(value == null ? "" : value)
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("en-US");
}

function splitList(value) {
  if (Array.isArray(value)) return value;
  if (value == null || value === "") return [];
  return String(value).split(/[\n,;]+/g);
}

function canonicalList(value, isTag) {
  const seen = new Set();
  const result = [];
  splitList(value).forEach((item) => {
    let normalized = normalizeText(item);
    if (isTag) {
      normalized = normalized.replace(/^#+/, "");
      normalized = normalized
        .split("/")
        .map((part) => part.trim())
        .filter(Boolean)
        .join("/");
      if (normalized) normalized = "#" + normalized;
    }
    if (normalized && !seen.has(normalized)) {
      seen.add(normalized);
      result.push(normalized);
    }
  });
  return result.sort((a, b) => a.localeCompare(b, "en"));
}

function canonicalizeInput(raw) {
  const safe = raw && typeof raw === "object" ? raw : {};
  const outgoing = Number.parseInt(safe.outgoingLinkCount, 10);
  return {
    algorithmVersion: ALGORITHM_VERSION,
    noteId: normalizeText(
      safe.noteId || safe.path || safe.title || "untitled-note",
    ),
    path: normalizeText(safe.path),
    title: normalizeText(safe.title || "untitled note"),
    tags: canonicalList(safe.tags, true),
    parents: canonicalList(safe.parents, false),
    children: canonicalList(safe.children, false),
    groups: canonicalList(safe.groups, false),
    labels: canonicalList(safe.labels, false),
    type: normalizeText(safe.type),
    status: normalizeText(safe.status),
    collisionNonce: normalizeText(safe.collisionNonce),
    outgoingLinkCount: Number.isFinite(outgoing) ? Math.max(0, outgoing) : 0,
  };
}

function canonicalSerialize(input) {
  return JSON.stringify({
    algorithmVersion: input.algorithmVersion,
    noteId: input.noteId,
    path: input.path,
    title: input.title,
    tags: input.tags,
    parents: input.parents,
    children: input.children,
    groups: input.groups,
    labels: input.labels,
    type: input.type,
    status: input.status,
    collisionNonce: input.collisionNonce,
    outgoingLinkCount: input.outgoingLinkCount,
  });
}

function deepestTag(tags) {
  if (!tags.length) return "#general/untagged";
  return tags.slice().sort((a, b) => {
    const depthA = a.split("/").length;
    const depthB = b.split("/").length;
    return depthB - depthA || a.localeCompare(b, "en");
  })[0];
}

function hierarchyKey(tag, depth) {
  const levels = tag.replace(/^#/, "").split("/").filter(Boolean);
  const selected = levels.slice(0, Math.min(depth, levels.length));
  while (selected.length < depth)
    selected.push(selected[selected.length - 1] || "general");
  return "#" + selected.join("/");
}

function normalizeMapping(mapping) {
  const source = mapping && typeof mapping === "object" ? mapping : {};
  const result = {};
  Object.keys(DEFAULT_MAPPING).forEach((key) => {
    const value = String(source[key] || DEFAULT_MAPPING[key]);
    result[key] = MAPPING_MODES.has(value) ? value : DEFAULT_MAPPING[key];
  });
  return result;
}

function mappingSeed(tag, input, mode) {
  if (mode === "deepest") return "deepest|" + tag;
  if (mode === "note")
    return (
      "note|" + input.noteId + "|" + input.path + "|" + input.title + "|" + tag
    );
  const match = /^level-(\d)$/.exec(mode);
  return mode + "|" + hierarchyKey(tag, match ? Number(match[1]) : 1);
}

// 4. Stable hashing
function stableHash(value) {
  const text = String(value);
  let hash = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  hash += hash << 13;
  hash ^= hash >>> 7;
  hash += hash << 3;
  hash ^= hash >>> 17;
  hash += hash << 5;
  return hash >>> 0;
}

function saltedHash(seedText, salt) {
  return stableHash(ALGORITHM_VERSION + "|" + salt + "|" + seedText);
}

function seededGenerator(seed) {
  let state = seed >>> 0;
  return function () {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function chooseIndex(seedText, salt, length) {
  return saltedHash(seedText, salt) % length;
}

function hex32(value) {
  return (value >>> 0).toString(16).padStart(8, "0");
}

function identity128(seedText, namespace) {
  const scope = namespace || "identity";
  return [
    saltedHash(seedText, scope + "-a-2f6e2b1"),
    saltedHash(seedText, scope + "-b-9d84c73"),
    saltedHash(seedText, scope + "-c-51a7e90"),
    saltedHash(seedText, scope + "-d-c3b468f"),
  ];
}

function hex128(words) {
  return words.map(hex32).join("");
}

// 5–7. Seeded parameters, palettes and bounded metadata slots
function aggregateMetadata(input) {
  const slots = Array.from({ length: SECONDARY_SLOT_COUNT }, () => ({
    count: 0,
    xor: 0,
    sum: 0,
    kinds: 0,
  }));
  const assignments = {
    parents: new Set(),
    children: new Set(),
    groups: new Set(),
    labels: new Set(),
    type: new Set(),
    status: new Set(),
  };
  const collections = [
    ["parents", input.parents],
    ["children", input.children],
    ["groups", input.groups],
    ["labels", input.labels],
    ["type", input.type ? [input.type] : []],
    ["status", input.status ? [input.status] : []],
  ];
  collections.forEach((entry, kindIndex) => {
    const kind = entry[0];
    entry[1].forEach((item) => {
      const slotIndex =
        saltedHash(item, "metadata-slot-" + kind) % SECONDARY_SLOT_COUNT;
      const digest = saltedHash(item, "metadata-value-" + kind);
      const slot = slots[slotIndex];
      slot.count += 1;
      slot.xor = (slot.xor ^ digest) >>> 0;
      slot.sum = (slot.sum + digest) >>> 0;
      slot.kinds |= 1 << kindIndex;
      assignments[kind].add(slotIndex + 1);
    });
  });
  return { slots, assignments };
}

// 8. Fingerprint compilation
function compileFingerprint(rawInput, mappingInput, activeTagInput) {
  const input = canonicalizeInput(rawInput);
  const mapping = normalizeMapping(mappingInput);
  const serialized = canonicalSerialize(input);
  const identityWords = identity128(serialized, "canonical-identity");
  const canonicalSeed = identityWords[0];
  const requestedTag = canonicalList([activeTagInput], true)[0] || "";
  const requestedTagIsAvailable =
    requestedTag &&
    input.tags.some(
      (tag) => tag === requestedTag || tag.startsWith(requestedTag + "/"),
    );
  const primaryTag = requestedTagIsAvailable
    ? requestedTag
    : deepestTag(input.tags);
  const level1Key = hierarchyKey(primaryTag, 1);
  const level2Key = hierarchyKey(primaryTag, 2);
  const level3Key = hierarchyKey(primaryTag, 3);
  const foundationSeed = mappingSeed(primaryTag, input, mapping.foundation);
  const paletteSeed = mappingSeed(primaryTag, input, mapping.palette);
  const structureSeed = mappingSeed(primaryTag, input, mapping.structure);
  const detailSeed = mappingSeed(primaryTag, input, mapping.detail);
  const mappingModeIndices = {
    foundation: MAPPING_MODE_ORDER.indexOf(mapping.foundation),
    palette: MAPPING_MODE_ORDER.indexOf(mapping.palette),
    structure: MAPPING_MODE_ORDER.indexOf(mapping.structure),
    detail: MAPPING_MODE_ORDER.indexOf(mapping.detail),
  };
  const completeNoteSeed =
    detailSeed +
    "|" +
    input.noteId +
    "|" +
    input.path +
    "|" +
    input.title +
    "|" +
    serialized;
  const topologyIndex = chooseIndex(
    foundationSeed,
    "topology-family",
    TOPOLOGIES.length,
  );
  const symbolIndex = chooseIndex(
    paletteSeed,
    "starting-symbol",
    SYMBOLS.length,
  );
  const paletteIndex = chooseIndex(
    paletteSeed,
    "palette-family",
    PALETTES.length,
  );
  const symmetryOptions = [3, 4, 5, 6, 8, 10, 12];
  const symmetry =
    symmetryOptions[
      chooseIndex(paletteSeed, "primary-symmetry", symmetryOptions.length)
    ];
  const backgroundIndex = chooseIndex(
    foundationSeed,
    "background-field",
    BACKGROUNDS.length,
  );
  const layoutIndex = chooseIndex(
    structureSeed,
    "structure-layout",
    LAYOUTS.length,
  );
  const connectorIndex = chooseIndex(
    structureSeed,
    "connector-grammar",
    CONNECTORS.length,
  );
  const coreIndex = chooseIndex(
    completeNoteSeed,
    "core-architecture",
    CORES.length,
  );
  const terminalIndex = chooseIndex(
    completeNoteSeed,
    "terminal-grammar",
    TERMINALS.length,
  );
  const accentIndex = chooseIndex(
    completeNoteSeed,
    "accent-distribution",
    ACCENTS.length,
  );
  const orientationStep = chooseIndex(foundationSeed, "orientation", 24);
  const portalIndex = chooseIndex(
    detailSeed,
    "recursive-portal",
    PORTAL_NAMES.length,
  );
  const portalGrid = [
    [-0.16, -0.16],
    [0, -0.18],
    [0.16, -0.16],
    [-0.18, 0],
    [0, 0],
    [0.18, 0],
    [-0.16, 0.16],
    [0, 0.18],
    [0.16, 0.16],
  ];
  const portal = portalGrid[portalIndex];
  const structureRandom = seededGenerator(
    saltedHash(structureSeed, "recursive-scale"),
  );
  // Keep adjacent recursive generations close enough to read as a descent,
  // while still allowing the seed to choose a compact or broad hierarchy.
  const scaleRatio = 0.33 + structureRandom() * 0.17;
  const cycleRandom = seededGenerator(saltedHash(detailSeed, "cycle-duration"));
  const cycleDuration = 6.5 + cycleRandom() * 2.5;
  const formulaRandom = seededGenerator(
    saltedHash(structureSeed + "|" + detailSeed, "continuous-formula-controls"),
  );
  const ringCount = 3 + Math.floor(formulaRandom() * 10);
  const twist = (formulaRandom() - 0.5) * Math.PI * 1.5;
  const detailDensity = 0.38 + formulaRandom() * 0.62;
  const strokeWeight = 0.75 + formulaRandom() * 2.25;
  const branchSpread = 0.42 + formulaRandom() * 0.58;
  const glowStrength = 0.22 + formulaRandom() * 0.78;
  const stableRandom = seededGenerator(
    saltedHash(detailSeed, "major-geometry"),
  );
  const majorSlots = [];
  for (let i = 0; i < MAJOR_SLOT_COUNT; i += 1) {
    majorSlots.push({
      radius: 0.19 + stableRandom() * 0.27,
      angle: stableRandom() * Math.PI * 2,
      size: 0.018 + stableRandom() * 0.048,
      rotation: stableRandom() * Math.PI * 2,
      colorIndex: Math.floor(stableRandom() * 3),
      shapeIndex: Math.floor(stableRandom() * SYMBOLS.length),
      weight: 0.55 + stableRandom() * 1.4,
    });
  }
  const metadata = aggregateMetadata(input);
  const geometryObject = {
    algorithmVersion: ALGORITHM_VERSION,
    noteId: input.noteId,
    title: input.title,
    tags: input.tags,
    mapping,
    identity128: hex128(identityWords),
    topologyIndex,
    symbolIndex,
    paletteIndex,
    symmetry,
    backgroundIndex,
    layoutIndex,
    orientationStep,
    mappingModeIndices,
    coreIndex,
    connectorIndex,
    terminalIndex,
    accentIndex,
    portalIndex,
    scaleRatio: scaleRatio.toFixed(8),
    ringCount,
    twist: twist.toFixed(8),
    detailDensity: detailDensity.toFixed(8),
    strokeWeight: strokeWeight.toFixed(8),
    branchSpread: branchSpread.toFixed(8),
    glowStrength: glowStrength.toFixed(8),
    majorSlots,
    secondarySlots: metadata.slots,
    type: input.type,
    status: input.status,
    outgoingLinkCount: input.outgoingLinkCount,
  };
  const structuralObject = {
    topologyIndex,
    symbolIndex,
    symmetry,
    coreIndex,
    connectorIndex,
    terminalIndex,
    orientationStep,
    accentIndex,
    paletteIndex,
    filledRatio: Math.round((0.25 + detailDensity * 0.5) * 10),
    branchingCount: symmetry,
  };
  const structuralWords = identity128(
    JSON.stringify(structuralObject),
    "structural-signature",
  );
  return {
    input,
    serialized,
    canonicalSeed,
    identityWords,
    identityHex: hex128(identityWords),
    geometrySignature: stableHash(JSON.stringify(geometryObject)),
    structuralSignature: hex128(structuralWords),
    primaryTag,
    level1Key,
    level2Key,
    level3Key,
    deepestKey: primaryTag,
    mapping,
    mappingModeIndices,
    foundationSeed,
    paletteSeed,
    structureSeed,
    detailSeed,
    topologyIndex,
    topologyName: TOPOLOGIES[topologyIndex],
    symbolIndex,
    symbolName: SYMBOLS[symbolIndex],
    paletteIndex,
    palette: PALETTES[paletteIndex],
    symmetry,
    backgroundIndex,
    backgroundName: BACKGROUNDS[backgroundIndex],
    layoutIndex,
    layoutName: LAYOUTS[layoutIndex],
    orientation: (orientationStep * Math.PI) / 12,
    coreIndex,
    coreName: CORES[coreIndex],
    connectorIndex,
    connectorName: CONNECTORS[connectorIndex],
    terminalIndex,
    terminalName: TERMINALS[terminalIndex],
    accentIndex,
    accentName: ACCENTS[accentIndex],
    portalIndex,
    portal,
    portalName: PORTAL_NAMES[portalIndex],
    scaleRatio,
    cycleDuration,
    ringCount,
    twist,
    detailDensity,
    strokeWeight,
    branchSpread,
    glowStrength,
    majorSlots,
    secondarySlots: metadata.slots,
    assignments: metadata.assignments,
  };
}

function clampNumber(value, minimum, maximum, fallback) {
  const numeric = Number(value);
  return Number.isFinite(numeric)
    ? Math.max(minimum, Math.min(maximum, numeric))
    : fallback;
}

function safeHexColor(value, fallback) {
  const text = String(value || "").trim();
  return /^#[0-9a-f]{6}$/i.test(text) ? text.toLowerCase() : fallback;
}

function applyDashboardOverrides(base, overrides) {
  const custom = overrides || {};
  const params = Object.assign({}, base, {
    palette: Object.assign({}, base.palette),
    portal: base.portal.slice(),
  });
  if (Object.prototype.hasOwnProperty.call(custom, "paletteIndex")) {
    const paletteIndex = Math.round(
      clampNumber(
        custom.paletteIndex,
        0,
        PALETTES.length - 1,
        base.paletteIndex,
      ),
    );
    params.paletteIndex = paletteIndex;
    params.palette = Object.assign({}, PALETTES[paletteIndex]);
  }
  if (Object.prototype.hasOwnProperty.call(custom, "symbolIndex")) {
    params.symbolIndex = Math.round(
      clampNumber(custom.symbolIndex, 0, SYMBOLS.length - 1, base.symbolIndex),
    );
    params.symbolName = SYMBOLS[params.symbolIndex];
  }
  if (Object.prototype.hasOwnProperty.call(custom, "topologyIndex")) {
    params.topologyIndex = Math.round(
      clampNumber(
        custom.topologyIndex,
        0,
        TOPOLOGIES.length - 1,
        base.topologyIndex,
      ),
    );
    params.topologyName = TOPOLOGIES[params.topologyIndex];
  }
  if (Object.prototype.hasOwnProperty.call(custom, "coreIndex")) {
    params.coreIndex = Math.round(
      clampNumber(custom.coreIndex, 0, CORES.length - 1, base.coreIndex),
    );
    params.coreName = CORES[params.coreIndex];
  }
  if (Object.prototype.hasOwnProperty.call(custom, "connectorIndex")) {
    params.connectorIndex = Math.round(
      clampNumber(
        custom.connectorIndex,
        0,
        CONNECTORS.length - 1,
        base.connectorIndex,
      ),
    );
    params.connectorName = CONNECTORS[params.connectorIndex];
  }
  if (Object.prototype.hasOwnProperty.call(custom, "terminalIndex")) {
    params.terminalIndex = Math.round(
      clampNumber(
        custom.terminalIndex,
        0,
        TERMINALS.length - 1,
        base.terminalIndex,
      ),
    );
    params.terminalName = TERMINALS[params.terminalIndex];
  }
  if (Object.prototype.hasOwnProperty.call(custom, "accentIndex")) {
    params.accentIndex = Math.round(
      clampNumber(custom.accentIndex, 0, ACCENTS.length - 1, base.accentIndex),
    );
    params.accentName = ACCENTS[params.accentIndex];
  }
  params.symmetry = Math.round(
    clampNumber(custom.symmetry, 2, 16, base.symmetry),
  );
  params.ringCount = Math.round(
    clampNumber(custom.ringCount, 1, 12, base.ringCount),
  );
  params.twist =
    (clampNumber(custom.twist, -180, 180, (base.twist * 180) / Math.PI) *
      Math.PI) /
    180;
  params.strokeWeight = clampNumber(
    custom.strokeWeight,
    0.5,
    4,
    base.strokeWeight,
  );
  params.detailDensity = clampNumber(
    custom.detailDensity,
    0.1,
    1,
    base.detailDensity,
  );
  params.branchSpread = clampNumber(
    custom.branchSpread,
    0.2,
    1,
    base.branchSpread,
  );
  params.scaleRatio = clampNumber(
    custom.scaleRatio,
    0.3,
    0.55,
    base.scaleRatio,
  );
  params.portal[0] = clampNumber(custom.portalX, -0.2, 0.2, base.portal[0]);
  params.portal[1] = clampNumber(custom.portalY, -0.2, 0.2, base.portal[1]);
  params.glowStrength = clampNumber(
    custom.glowStrength,
    0,
    1,
    base.glowStrength,
  );
  params.palette.bg = safeHexColor(custom.backgroundColor, params.palette.bg);
  params.palette.primary = safeHexColor(
    custom.primaryColor,
    params.palette.primary,
  );
  params.palette.secondary = safeHexColor(
    custom.secondaryColor,
    params.palette.secondary,
  );
  params.palette.accent = safeHexColor(
    custom.accentColor,
    params.palette.accent,
  );
  if (custom.accentColor) {
    params.palette.glow = params.palette.accent;
    params.palette.border = params.palette.accent;
  }
  const hasCustomColor = [
    "backgroundColor",
    "primaryColor",
    "secondaryColor",
    "accentColor",
  ].some((key) => Object.prototype.hasOwnProperty.call(custom, key));
  if (hasCustomColor) params.palette.name = base.palette.name + " · Custom";
  if (
    Object.prototype.hasOwnProperty.call(custom, "portalX") ||
    Object.prototype.hasOwnProperty.call(custom, "portalY")
  ) {
    params.portalName =
      "Custom " +
      params.portal[0].toFixed(2) +
      ", " +
      params.portal[1].toFixed(2);
  }
  params.geometrySignature = stableHash(
    JSON.stringify({
      base: base.geometrySignature,
      topologyIndex: params.topologyIndex,
      symbolIndex: params.symbolIndex,
      coreIndex: params.coreIndex,
      connectorIndex: params.connectorIndex,
      terminalIndex: params.terminalIndex,
      accentIndex: params.accentIndex,
      symmetry: params.symmetry,
      rings: params.ringCount,
      twist: params.twist.toFixed(8),
      stroke: params.strokeWeight.toFixed(4),
      detail: params.detailDensity.toFixed(4),
      spread: params.branchSpread.toFixed(4),
      scale: params.scaleRatio.toFixed(4),
      portal: params.portal.map((value) => value.toFixed(4)),
      glow: params.glowStrength.toFixed(4),
      paletteIndex: params.paletteIndex,
      colors: [
        params.palette.bg,
        params.palette.primary,
        params.palette.secondary,
        params.palette.accent,
      ],
    }),
  );
  params.structuralSignature = hex128(
    identity128(
      JSON.stringify({
        topologyIndex: params.topologyIndex,
        symbolIndex: params.symbolIndex,
        symmetry: params.symmetry,
        coreIndex: params.coreIndex,
        connectorIndex: params.connectorIndex,
        terminalIndex: params.terminalIndex,
        accentIndex: params.accentIndex,
        orientation: params.orientation.toFixed(6),
        paletteIndex: params.paletteIndex,
        branchingCount: params.symmetry,
      }),
      "structural-signature",
    ),
  );
  return params;
}

function structuralVector(params) {
  return [
    params.topologyIndex,
    params.symbolIndex,
    params.symmetry,
    params.coreIndex,
    params.connectorIndex,
    params.terminalIndex,
    Math.round((params.orientation * 12) / Math.PI),
    params.accentIndex,
    params.paletteIndex,
    Math.round((0.25 + params.detailDensity * 0.5) * 10),
    params.symmetry,
  ];
}

function visualDistance(first, second) {
  const a = structuralVector(first);
  const b = structuralVector(second);
  const weights = [5, 4, 3, 4, 4, 3, 2, 2, 2, 1, 2];
  let changed = 0;
  let total = 0;
  for (let index = 0; index < weights.length; index += 1) {
    total += weights[index];
    if (a[index] !== b[index]) changed += weights[index];
  }
  return changed / total;
}

function collisionVariant(rawInput, mapping, activeTag, attempt) {
  const source = rawInput && typeof rawInput === "object" ? rawInput : {};
  return compileFingerprint(
    Object.assign({}, source, {
      collisionNonce:
        "variant-" + Math.max(1, Math.round(Number(attempt) || 1)),
    }),
    mapping,
    activeTag,
  );
}

// 9. Offscreen fingerprint rendering
function rgba(hex, alpha) {
  const value = hex.replace("#", "");
  const int = Number.parseInt(
    value.length === 3
      ? value
          .split("")
          .map((c) => c + c)
          .join("")
      : value,
    16,
  );
  return (
    "rgba(" +
    ((int >> 16) & 255) +
    "," +
    ((int >> 8) & 255) +
    "," +
    (int & 255) +
    "," +
    alpha +
    ")"
  );
}

function rotatePoint(x, y, rotation) {
  const cosine = Math.cos(rotation);
  const sine = Math.sin(rotation);
  return [x * cosine - y * sine, x * sine + y * cosine];
}

function traceRegularPolygon(ctx, cx, cy, radius, sides, rotation) {
  ctx.beginPath();
  for (let index = 0; index < sides; index += 1) {
    const angle = rotation - Math.PI / 2 + (index * Math.PI * 2) / sides;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

function traceStar(ctx, cx, cy, radius, points, rotation) {
  ctx.beginPath();
  for (let index = 0; index < points * 2; index += 1) {
    const outer = index % 2 === 0;
    const localRadius = radius * (outer ? 1 : 0.43);
    const angle = rotation - Math.PI / 2 + (index * Math.PI) / points;
    const x = cx + Math.cos(angle) * localRadius;
    const y = cy + Math.sin(angle) * localRadius;
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

function tracePointList(ctx, cx, cy, radius, rotation, points) {
  ctx.beginPath();
  points.forEach((point, index) => {
    const rotated = rotatePoint(point[0] * radius, point[1] * radius, rotation);
    const x = cx + rotated[0];
    const y = cy + rotated[1];
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
}

function traceFamilyShape(ctx, cx, cy, radius, rotation, family) {
  const kind = family % SYMBOLS.length;
  if (kind === 0) {
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.closePath();
    return;
  }
  if (kind === 1) {
    traceRegularPolygon(ctx, cx, cy, radius, 3, rotation);
    return;
  }
  if (kind === 2) {
    traceRegularPolygon(ctx, cx, cy, radius, 4, rotation + Math.PI / 4);
    return;
  }
  if (kind === 3) {
    traceRegularPolygon(ctx, cx, cy, radius, 4, rotation);
    return;
  }
  if (kind === 4) {
    traceRegularPolygon(ctx, cx, cy, radius, 6, rotation + Math.PI / 6);
    return;
  }
  if (kind === 5) {
    traceStar(ctx, cx, cy, radius, 5, rotation);
    return;
  }
  if (kind === 6) {
    tracePointList(ctx, cx, cy, radius, rotation, [
      [-1, -0.2],
      [-0.3, -0.2],
      [-0.3, -1],
      [0.3, -1],
      [0.3, -0.2],
      [1, -0.2],
      [1, 0.2],
      [0.3, 0.2],
      [0.3, 1],
      [-0.3, 1],
      [-0.3, 0.2],
      [-1, 0.2],
    ]);
    return;
  }
  if (kind === 7) {
    tracePointList(ctx, cx, cy, radius, rotation, [
      [-1, 0.82],
      [-1, -0.05],
      [-0.72, -0.66],
      [0, -1],
      [0.72, -0.66],
      [1, -0.05],
      [1, 0.82],
      [0.44, 0.82],
      [0.44, 0.08],
      [0, -0.38],
      [-0.44, 0.08],
      [-0.44, 0.82],
    ]);
    return;
  }
  if (kind === 8) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation);
    ctx.beginPath();
    ctx.arc(0, 0, radius, -0.68 * Math.PI, 0.68 * Math.PI, false);
    ctx.arc(
      radius * 0.38,
      0,
      radius * 0.72,
      0.62 * Math.PI,
      -0.62 * Math.PI,
      true,
    );
    ctx.closePath();
    ctx.restore();
    return;
  }
  if (kind === 9) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation);
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0.24 * Math.PI, 1.76 * Math.PI, false);
    ctx.arc(0, 0, radius * 0.52, 1.76 * Math.PI, 0.24 * Math.PI, true);
    ctx.closePath();
    ctx.restore();
    return;
  }
  if (kind === 10) {
    tracePointList(ctx, cx, cy, radius, rotation, [
      [0, -1],
      [0.86, -0.62],
      [0.72, 0.38],
      [0, 1],
      [-0.72, 0.38],
      [-0.86, -0.62],
    ]);
    return;
  }
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotation);
  ctx.beginPath();
  const turns = 18;
  for (let index = 0; index <= turns; index += 1) {
    const t = index / turns;
    const angle = t * Math.PI * 2.4;
    const localRadius = radius * (0.12 + 0.78 * t);
    const x = Math.cos(angle) * localRadius;
    const y = Math.sin(angle) * localRadius;
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  for (let index = turns; index >= 0; index -= 1) {
    const t = index / turns;
    const angle = t * Math.PI * 2.4;
    const localRadius = radius * (0.02 + 0.62 * t);
    ctx.lineTo(Math.cos(angle) * localRadius, Math.sin(angle) * localRadius);
  }
  ctx.closePath();
  ctx.restore();
}

function drawBridge(ctx, x1, y1, x2, y2, width, color, alpha) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.max(1e-6, Math.hypot(dx, dy));
  const px = (-dy / length) * width;
  const py = (dx / length) * width;
  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x1 + px, y1 + py);
  ctx.lineTo(x2 + px, y2 + py);
  ctx.lineTo(x2 - px, y2 - py);
  ctx.lineTo(x1 - px, y1 - py);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function polarPoint(radius, angle) {
  return [Math.cos(angle) * radius, Math.sin(angle) * radius];
}

// A radial facet is the basic "memory cell" of the seal. Repeating exactly
// the same cell around the centre creates a legible anchor instead of noise.
function traceRadialFacet(ctx, innerRadius, outerRadius, angle, halfAngle) {
  const middleRadius = (innerRadius + outerRadius) * 0.5;
  const inner = polarPoint(innerRadius, angle);
  const left = polarPoint(middleRadius, angle - halfAngle);
  const outer = polarPoint(outerRadius, angle);
  const right = polarPoint(middleRadius, angle + halfAngle);
  ctx.beginPath();
  ctx.moveTo(inner[0], inner[1]);
  ctx.lineTo(left[0], left[1]);
  ctx.lineTo(outer[0], outer[1]);
  ctx.lineTo(right[0], right[1]);
  ctx.closePath();
}

function drawWidePath(ctx, points, width, color, alpha, closed) {
  if (!points.length) return;
  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let index = 1; index < points.length; index += 1)
    ctx.lineTo(points[index][0], points[index][1]);
  if (closed) ctx.closePath();
  ctx.stroke();
  ctx.restore();
}

function accentIsActive(accentIndex, index, count) {
  const middle = (count - 1) * 0.5;
  if (accentIndex === 0)
    return Math.abs(index - middle) <= Math.max(1, count * 0.18);
  if (accentIndex === 1) return index === 0 || index === count - 1;
  if (accentIndex === 2) return index % 2 === 0;
  if (accentIndex === 3) return index % 3 === 0;
  if (accentIndex === 4)
    return index % Math.max(1, Math.round(count / 4)) === 0;
  if (accentIndex === 5) return index % 4 === 1;
  if (accentIndex === 6) return index > count * 0.25 && index < count * 0.75;
  if (accentIndex === 7) return index % 4 < 2;
  if (accentIndex === 8)
    return (
      index === Math.floor(count * 0.25) || index === Math.ceil(count * 0.75)
    );
  if (accentIndex === 9) return index === (count * 7 + 3) % Math.max(1, count);
  if (accentIndex === 10) return index % 3 !== 1;
  return index === Math.floor(count * 0.68);
}

function topologyAnchors(topologyIndex, folds, radius, rotation) {
  const anchors = [];
  const pushPolar = (r, angle, role) =>
    anchors.push({
      x: Math.cos(angle) * r,
      y: Math.sin(angle) * r,
      angle,
      role: role || 0,
    });
  if (
    topologyIndex === 0 ||
    topologyIndex === 3 ||
    topologyIndex === 5 ||
    topologyIndex === 8 ||
    topologyIndex === 10
  ) {
    const count = topologyIndex === 10 ? 6 : folds;
    for (let index = 0; index < count; index += 1) {
      const angle = rotation + (index * Math.PI * 2) / count;
      const variation =
        topologyIndex === 3
          ? index % 2
            ? 0.78
            : 1
          : topologyIndex === 8
            ? 0.88 + (index % 3) * 0.06
            : 1;
      pushPolar(radius * variation, angle, index % 3);
    }
    return anchors;
  }
  if (topologyIndex === 1) {
    const span = radius * 0.9;
    [
      [-span, -span * 0.62],
      [0, -span],
      [span, -span * 0.62],
      [span, span * 0.62],
      [0, span],
      [-span, span * 0.62],
    ].forEach((point, index) =>
      anchors.push({
        x: point[0],
        y: point[1],
        angle: Math.atan2(point[1], point[0]),
        role: index % 2,
      }),
    );
    return anchors;
  }
  if (topologyIndex === 2) {
    const count = Math.max(5, Math.min(9, folds));
    for (let index = 0; index < count; index += 1) {
      const x = -radius + (index * radius * 2) / (count - 1);
      const y =
        -radius *
        (0.46 +
          0.46 * Math.cos((index * Math.PI * 2) / Math.max(3, count - 1)));
      anchors.push({ x, y, angle: -Math.PI / 2, role: index % 3 });
    }
    anchors.push({
      x: -radius * 0.68,
      y: radius * 0.72,
      angle: Math.PI * 0.72,
      role: 2,
    });
    anchors.push({
      x: radius * 0.68,
      y: radius * 0.72,
      angle: Math.PI * 0.28,
      role: 2,
    });
    return anchors;
  }
  if (topologyIndex === 4) {
    for (let side = 0; side < 3; side += 1) {
      const a = rotation - Math.PI / 2 + (side * Math.PI * 2) / 3;
      const b = rotation - Math.PI / 2 + ((side + 1) * Math.PI * 2) / 3;
      for (let step = 0; step < 2; step += 1) {
        const t = step * 0.5;
        anchors.push({
          x: (Math.cos(a) * (1 - t) + Math.cos(b) * t) * radius,
          y: (Math.sin(a) * (1 - t) + Math.sin(b) * t) * radius,
          angle: a,
          role: side,
        });
      }
    }
    return anchors;
  }
  if (topologyIndex === 6) {
    const count = Math.max(7, Math.min(12, folds + 2));
    for (let index = 0; index < count; index += 1) {
      const t = index / Math.max(1, count - 1);
      pushPolar(
        radius * (0.28 + 0.72 * t),
        rotation + t * Math.PI * 2.25,
        index % 3,
      );
    }
    return anchors;
  }
  if (topologyIndex === 7) {
    [
      [0, -radius],
      [0, -radius * 0.5],
      [0, radius * 0.5],
      [0, radius],
      [-radius * 0.7, 0],
      [radius * 0.7, 0],
      [-radius * 0.5, -radius * 0.5],
      [radius * 0.5, radius * 0.5],
    ].forEach((point, index) =>
      anchors.push({
        x: point[0],
        y: point[1],
        angle: Math.atan2(point[1], point[0]),
        role: index % 3,
      }),
    );
    return anchors;
  }
  if (topologyIndex === 9) {
    [
      [-radius, -radius * 0.66],
      [-radius, radius * 0.66],
      [-radius * 0.42, 0],
      [radius * 0.42, 0],
      [radius, -radius * 0.66],
      [radius, radius * 0.66],
    ].forEach((point, index) =>
      anchors.push({
        x: point[0],
        y: point[1],
        angle: Math.atan2(point[1], point[0]),
        role: index < 3 ? 0 : 1,
      }),
    );
    return anchors;
  }
  const turns = 9;
  for (let index = 0; index < turns; index += 1) {
    const ring = 1 + Math.floor(index / 2);
    const side = index % 4;
    const step = (radius * ring) / 5;
    const point =
      side === 0
        ? [step, -step]
        : side === 1
          ? [step, step]
          : side === 2
            ? [-step, step]
            : [-step, -step];
    anchors.push({
      x: point[0],
      y: point[1],
      angle: Math.atan2(point[1], point[0]),
      role: index % 3,
    });
  }
  return anchors;
}

function drawConnectorGrammar(
  ctx,
  fromX,
  fromY,
  toX,
  toY,
  width,
  color,
  alpha,
  grammar,
  index,
) {
  const dx = toX - fromX;
  const dy = toY - fromY;
  const length = Math.max(0.001, Math.hypot(dx, dy));
  const nx = -dy / length;
  const ny = dx / length;
  const midX = (fromX + toX) * 0.5;
  const midY = (fromY + toY) * 0.5;
  if (grammar === 0 || grammar === 6) {
    drawBridge(ctx, fromX, fromY, toX, toY, width, color, alpha);
    if (grammar === 6) {
      ctx.save();
      ctx.globalAlpha *= alpha;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(midX, midY, width * 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    return;
  }
  if (grammar === 1) {
    const points =
      Math.abs(dx) > Math.abs(dy)
        ? [
            [fromX, fromY],
            [midX, fromY],
            [midX, toY],
            [toX, toY],
          ]
        : [
            [fromX, fromY],
            [fromX, midY],
            [toX, midY],
            [toX, toY],
          ];
    drawWidePath(ctx, points, width * 2, color, alpha, false);
    return;
  }
  if (grammar === 2) {
    drawWidePath(
      ctx,
      [
        [fromX, fromY],
        [midX, midY],
        [toX + nx * width * 4, toY + ny * width * 4],
      ],
      width * 1.8,
      color,
      alpha,
      false,
    );
    drawWidePath(
      ctx,
      [
        [midX, midY],
        [toX - nx * width * 4, toY - ny * width * 4],
      ],
      width * 1.35,
      color,
      alpha * 0.8,
      false,
    );
    return;
  }
  if (grammar === 3 || grammar === 7) {
    const bend = (grammar === 7 ? 1 : 0.55) * (index % 2 ? -1 : 1);
    ctx.save();
    ctx.globalAlpha *= alpha;
    ctx.strokeStyle = color;
    ctx.lineWidth = width * 2;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.quadraticCurveTo(
      midX + nx * length * 0.32 * bend,
      midY + ny * length * 0.32 * bend,
      toX,
      toY,
    );
    ctx.stroke();
    ctx.restore();
    if (grammar === 7)
      drawWidePath(
        ctx,
        [
          [toX, toY],
          [toX - dx * 0.16 + nx * width * 3, toY - dy * 0.16 + ny * width * 3],
        ],
        width * 1.4,
        color,
        alpha,
        false,
      );
    return;
  }
  if (grammar === 4) {
    const offset = width * 2.4;
    drawWidePath(
      ctx,
      [
        [fromX + nx * offset, fromY + ny * offset],
        [midX - nx * offset, midY - ny * offset],
        [toX + nx * offset, toY + ny * offset],
      ],
      width * 1.2,
      color,
      alpha,
      false,
    );
    drawWidePath(
      ctx,
      [
        [fromX - nx * offset, fromY - ny * offset],
        [midX + nx * offset, midY + ny * offset],
        [toX - nx * offset, toY - ny * offset],
      ],
      width * 1.2,
      color,
      alpha,
      false,
    );
    return;
  }
  if (grammar === 5) {
    const bendX = fromX + dx * 0.58 + nx * length * 0.16 * (index % 2 ? -1 : 1);
    const bendY = fromY + dy * 0.58 + ny * length * 0.16 * (index % 2 ? -1 : 1);
    drawWidePath(
      ctx,
      [
        [fromX, fromY],
        [bendX, bendY],
        [toX, toY],
      ],
      width * 2,
      color,
      alpha,
      false,
    );
    return;
  }
  drawBridge(ctx, fromX, fromY, toX, toY, width, color, alpha);
  if (grammar === 8) {
    for (let rib = 1; rib <= 3; rib += 1) {
      const t = rib / 4;
      const x = fromX + dx * t;
      const y = fromY + dy * t;
      drawWidePath(
        ctx,
        [
          [x - nx * width * 3, y - ny * width * 3],
          [x + nx * width * 3, y + ny * width * 3],
        ],
        width,
        color,
        alpha * 0.8,
        false,
      );
    }
  } else if (grammar === 9) {
    for (let gate = 1; gate <= 2; gate += 1) {
      const t = gate / 3;
      const x = fromX + dx * t;
      const y = fromY + dy * t;
      const size = width * (gate % 2 ? 4 : 2.5);
      drawWidePath(
        ctx,
        [
          [x - nx * size, y - ny * size],
          [x + nx * size, y + ny * size],
        ],
        width * 1.2,
        color,
        alpha,
        false,
      );
    }
  }
}

function drawTerminalGrammar(
  ctx,
  x,
  y,
  angle,
  radius,
  palette,
  grammar,
  family,
  alpha,
) {
  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.lineWidth = radius * 0.22;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = palette.primary;
  ctx.fillStyle = palette.accent;
  if (grammar === 0) {
    traceRegularPolygon(ctx, x, y, radius, 3, angle + Math.PI / 2);
    ctx.fill();
    ctx.stroke();
  } else if (grammar === 1) {
    tracePointList(ctx, x, y, radius, angle, [
      [-1, 0.55],
      [-0.7, -0.5],
      [-0.28, 0.05],
      [0, -1],
      [0.28, 0.05],
      [0.7, -0.5],
      [1, 0.55],
    ]);
    ctx.stroke();
  } else if (grammar === 2) {
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.78, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.28, 0, Math.PI * 2);
    ctx.fill();
  } else if (grammar === 3) {
    traceRegularPolygon(ctx, x, y, radius, 4, angle);
    ctx.fill();
    ctx.stroke();
  } else if (grammar === 4 || grammar === 8) {
    const spread = grammar === 4 ? 0.85 : 0.52;
    drawWidePath(
      ctx,
      [
        [
          x - Math.cos(angle - spread) * radius,
          y - Math.sin(angle - spread) * radius,
        ],
        [x, y],
        [
          x - Math.cos(angle + spread) * radius,
          y - Math.sin(angle + spread) * radius,
        ],
      ],
      radius * 0.22,
      palette.primary,
      1,
      false,
    );
    if (grammar === 4)
      drawWidePath(
        ctx,
        [
          [x, y],
          [x + Math.cos(angle) * radius, y + Math.sin(angle) * radius],
        ],
        radius * 0.22,
        palette.primary,
        1,
        false,
      );
  } else if (grammar === 5) {
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.72, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  } else if (grammar === 6) {
    tracePointList(ctx, x, y, radius, angle + Math.PI / 2, [
      [0, -1],
      [0.86, -0.6],
      [0.68, 0.38],
      [0, 1],
      [-0.68, 0.38],
      [-0.86, -0.6],
    ]);
    ctx.fill();
    ctx.stroke();
  } else if (grammar === 7) {
    ctx.beginPath();
    ctx.arc(x, y, radius, Math.PI, Math.PI * 2);
    ctx.stroke();
    drawWidePath(
      ctx,
      [
        [x - radius, y],
        [x - radius, y + radius * 0.65],
        [x + radius, y + radius * 0.65],
        [x + radius, y],
      ],
      radius * 0.18,
      palette.primary,
      1,
      false,
    );
  } else {
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    for (let side = -1; side <= 1; side += 2) {
      ctx.beginPath();
      ctx.arc(
        x + Math.cos(angle + (side * Math.PI) / 2) * radius,
        y + Math.sin(angle + (side * Math.PI) / 2) * radius,
        radius * 0.22,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }
  }
  ctx.globalAlpha *= 0.78;
  traceFamilyShape(ctx, x, y, radius * 0.34, angle, family);
  ctx.fillStyle = palette.primary;
  ctx.fill();
  ctx.restore();
}

function drawCoreArchitecture(ctx, params, radius, rotation, strokeWidth) {
  const palette = params.palette;
  const family = params.symbolIndex;
  const core = params.coreIndex;
  ctx.save();
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.strokeStyle = palette.primary;
  ctx.fillStyle = palette.secondary;
  ctx.lineWidth = strokeWidth * 1.25;
  if (core === 0) {
    traceFamilyShape(ctx, 0, 0, radius, rotation, family);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.28, 0, Math.PI * 2);
    ctx.fill();
  } else if (core === 1) {
    traceFamilyShape(ctx, 0, 0, radius, rotation, family);
    ctx.fill();
    ctx.stroke();
  } else if (core === 2) {
    traceFamilyShape(ctx, -radius * 0.28, 0, radius * 0.72, rotation, family);
    ctx.fill();
    ctx.stroke();
    traceFamilyShape(
      ctx,
      radius * 0.28,
      0,
      radius * 0.72,
      rotation + Math.PI,
      family,
    );
    ctx.globalAlpha *= 0.7;
    ctx.fillStyle = palette.accent;
    ctx.fill();
    ctx.stroke();
  } else if (core === 3) {
    for (let index = 0; index < 3; index += 1) {
      const angle = rotation + (index * Math.PI * 2) / 3;
      traceFamilyShape(
        ctx,
        Math.cos(angle) * radius * 0.42,
        Math.sin(angle) * radius * 0.42,
        radius * 0.52,
        angle,
        family,
      );
      ctx.fillStyle = index === 1 ? palette.accent : palette.secondary;
      ctx.fill();
      ctx.stroke();
    }
  } else if (core === 4) {
    traceFamilyShape(ctx, 0, 0, radius, rotation, family);
    ctx.stroke();
    traceFamilyShape(
      ctx,
      0,
      0,
      radius * 0.55,
      rotation + Math.PI / Math.max(3, params.symmetry),
      (family + 3) % SYMBOLS.length,
    );
    ctx.fillStyle = palette.accent;
    ctx.fill();
    ctx.stroke();
  } else if (core === 5) {
    drawWidePath(
      ctx,
      [
        [-radius, 0],
        [radius, 0],
      ],
      strokeWidth * 2.6,
      palette.secondary,
      0.9,
      false,
    );
    drawWidePath(
      ctx,
      [
        [0, -radius],
        [0, radius],
      ],
      strokeWidth * 2.6,
      palette.secondary,
      0.9,
      false,
    );
    traceFamilyShape(ctx, 0, 0, radius * 0.58, rotation, family);
    ctx.fillStyle = palette.accent;
    ctx.fill();
    ctx.stroke();
  } else if (core === 6) {
    ctx.beginPath();
    ctx.ellipse(0, 0, radius, radius * 0.48, rotation, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(
      0,
      0,
      radius,
      radius * 0.48,
      rotation + Math.PI / 2,
      0,
      Math.PI * 2,
    );
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.34, 0, Math.PI * 2);
    ctx.fillStyle = palette.accent;
    ctx.fill();
  } else if (core === 7) {
    for (let index = 0; index < 4; index += 1) {
      const angle = rotation + (index * Math.PI) / 2;
      traceFamilyShape(
        ctx,
        Math.cos(angle) * radius * 0.38,
        Math.sin(angle) * radius * 0.38,
        radius * 0.62,
        angle,
        family,
      );
      ctx.globalAlpha = 0.78;
      ctx.fillStyle = index % 2 ? palette.accent : palette.secondary;
      ctx.fill();
      ctx.stroke();
    }
  } else if (core === 8) {
    traceFamilyShape(ctx, 0, radius * 0.18, radius * 0.82, rotation, family);
    ctx.fill();
    ctx.stroke();
    tracePointList(ctx, 0, -radius * 0.58, radius * 0.65, 0, [
      [-1, 0.5],
      [-0.55, -0.35],
      [0, 0.1],
      [0.55, -0.35],
      [1, 0.5],
    ]);
    ctx.stroke();
  } else {
    traceFamilyShape(ctx, 0, 0, radius, rotation + Math.PI, family);
    ctx.fillStyle = palette.accent;
    ctx.fill();
    ctx.stroke();
    ctx.globalCompositeOperation = "destination-out";
    traceFamilyShape(ctx, 0, radius * 0.12, radius * 0.42, rotation, family);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";
  }
  ctx.restore();
}

function drawAccentSignature(
  ctx,
  params,
  anchors,
  hubX,
  hubY,
  coreRadius,
  outerRadius,
  rotation,
  strokeWidth,
) {
  const palette = params.palette;
  const accent = params.accentIndex;
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = palette.accent;
  ctx.fillStyle = palette.accent;
  ctx.lineWidth = strokeWidth * 2.2;
  ctx.globalAlpha *= 0.78;
  if (accent === 0) {
    ctx.beginPath();
    ctx.arc(hubX, hubY, coreRadius * 1.34, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(hubX, hubY, coreRadius * 1.02, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";
  } else if (accent === 1) {
    for (let side = 0; side < 2; side += 1) {
      ctx.beginPath();
      ctx.arc(
        0,
        0,
        outerRadius * 1.04,
        rotation + side * Math.PI + 0.14,
        rotation + side * Math.PI + 1.12,
      );
      ctx.stroke();
    }
  } else if (accent === 2) {
    const points = anchors
      .filter((_anchor, index) => index % 2 === 0)
      .map((anchor) => [anchor.x * 0.82, anchor.y * 0.82]);
    if (points.length > 1)
      drawWidePath(ctx, points, strokeWidth * 2.2, palette.accent, 0.9, true);
  } else if (accent === 3) {
    for (let index = 0; index < 3; index += 1) {
      const angle = rotation + (index * Math.PI * 2) / 3;
      const start = polarPoint(coreRadius * 1.25, angle);
      const end = polarPoint(outerRadius * 0.9, angle);
      drawWidePath(
        ctx,
        [
          [hubX + start[0], hubY + start[1]],
          [end[0], end[1]],
        ],
        strokeWidth * 3.2,
        palette.accent,
        0.82,
        false,
      );
    }
  } else if (accent === 4) {
    for (let index = 0; index < 4; index += 1) {
      const angle = rotation + (index * Math.PI) / 2;
      const point = polarPoint(outerRadius * 0.72, angle);
      ctx.beginPath();
      ctx.arc(point[0], point[1], coreRadius * 0.18, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (accent === 5) {
    const direction = rotation + Math.PI / 4;
    const a = polarPoint(outerRadius * 0.88, direction);
    const b = polarPoint(outerRadius * 0.88, direction + Math.PI);
    drawWidePath(ctx, [a, b], strokeWidth * 3.4, palette.accent, 0.9, false);
    ctx.beginPath();
    ctx.arc(a[0], a[1], strokeWidth * 3.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(b[0], b[1], strokeWidth * 3.2, 0, Math.PI * 2);
    ctx.fill();
  } else if (accent === 6) {
    ctx.beginPath();
    ctx.ellipse(
      hubX,
      hubY,
      outerRadius * 0.82,
      outerRadius * 0.38,
      rotation + 0.36,
      0,
      Math.PI * 2,
    );
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(
      hubX,
      hubY,
      outerRadius * 0.82,
      outerRadius * 0.38,
      rotation - 0.36,
      0,
      Math.PI * 2,
    );
    ctx.globalAlpha *= 0.55;
    ctx.stroke();
  } else if (accent === 7) {
    for (let pulse = 0; pulse < 3; pulse += 1) {
      const radius = coreRadius * (1.3 + pulse * 0.42);
      ctx.beginPath();
      ctx.arc(
        hubX,
        hubY,
        radius,
        rotation + pulse * 0.45,
        rotation + pulse * 0.45 + Math.PI * (1.15 - pulse * 0.12),
      );
      ctx.lineWidth = strokeWidth * (3.2 - pulse * 0.55);
      ctx.stroke();
    }
  } else if (accent === 8) {
    const x = outerRadius * 0.72;
    const y = outerRadius * 0.42;
    drawWidePath(
      ctx,
      [
        [-x, -y],
        [-x, 0],
        [-x, y],
      ],
      strokeWidth * 3,
      palette.accent,
      0.88,
      false,
    );
    drawWidePath(
      ctx,
      [
        [x, -y],
        [x, 0],
        [x, y],
      ],
      strokeWidth * 3,
      palette.accent,
      0.88,
      false,
    );
  } else if (accent === 9) {
    const anchor = anchors[
      params.canonicalSeed % Math.max(1, anchors.length)
    ] || { x: outerRadius, y: 0, angle: 0 };
    traceFamilyShape(
      ctx,
      anchor.x * 0.78,
      anchor.y * 0.78,
      coreRadius * 0.34,
      anchor.angle,
      (params.symbolIndex + 5) % SYMBOLS.length,
    );
    ctx.fill();
    ctx.strokeStyle = palette.primary;
    ctx.stroke();
  } else if (accent === 10) {
    const count = Math.max(8, anchors.length + 2);
    for (let index = 0; index < count; index += 1) {
      const angle = rotation + (index * Math.PI * 2) / count;
      const point = polarPoint(outerRadius * 0.72, angle);
      ctx.beginPath();
      ctx.arc(
        point[0],
        point[1],
        strokeWidth * (index % 2 ? 1.8 : 2.8),
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }
  } else {
    const angle = rotation + 0.72;
    const point = polarPoint(outerRadius * 0.58, angle);
    traceRegularPolygon(
      ctx,
      point[0],
      point[1],
      coreRadius * 0.46,
      3,
      angle + Math.PI / 2,
    );
    ctx.fill();
    drawWidePath(
      ctx,
      [
        [hubX, hubY],
        [point[0], point[1]],
      ],
      strokeWidth * 3,
      palette.accent,
      0.9,
      false,
    );
  }
  ctx.restore();
}

function drawMetadataSignature(
  ctx,
  params,
  metadataSignature,
  hubX,
  hubY,
  coreRadius,
  outerRadius,
  rotation,
  strokeWidth,
) {
  const palette = params.palette;
  const relationCount =
    params.input.parents.length +
    params.input.children.length +
    params.input.groups.length +
    params.input.labels.length;
  const linkCount = Math.max(0, params.input.outgoingLinkCount);
  const linkTier =
    linkCount === 0 ? 0 : Math.min(7, 1 + Math.round(Math.log2(linkCount)));
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  for (let index = 0; index < 6; index += 1) {
    const nibble = (metadataSignature >>> (index * 4)) & 15;
    const angle = rotation + (index * Math.PI) / 3 + (nibble - 7.5) * 0.012;
    const radius = coreRadius * (1.42 + nibble / 28);
    const point = [
      hubX + Math.cos(angle) * radius,
      hubY + Math.sin(angle) * radius,
    ];
    const size = strokeWidth * (1.5 + (nibble % 4) * 0.52);
    ctx.globalAlpha = 0.62 + (nibble % 3) * 0.1;
    ctx.fillStyle = nibble & 1 ? palette.primary : palette.accent;
    ctx.strokeStyle = palette.primary;
    ctx.lineWidth = strokeWidth * 0.72;
    if (nibble & 2) {
      ctx.beginPath();
      ctx.arc(point[0], point[1], size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      traceRegularPolygon(
        ctx,
        point[0],
        point[1],
        size * 1.25,
        3 + (nibble % 3),
        angle,
      );
      ctx.fill();
    }
  }
  for (let index = 0; index < Math.min(6, relationCount); index += 1) {
    const angle =
      rotation +
      (index * Math.PI * 2) / Math.max(1, Math.min(6, relationCount));
    const point = polarPoint(outerRadius * 0.48, angle);
    traceFamilyShape(
      ctx,
      point[0],
      point[1],
      strokeWidth * 3.1,
      angle,
      (params.symbolIndex + index + 1) % SYMBOLS.length,
    );
    ctx.globalAlpha = 0.72;
    ctx.fillStyle = palette.secondary;
    ctx.fill();
  }
  for (let index = 0; index < linkTier; index += 1) {
    const angle = rotation + (index * Math.PI * 2) / Math.max(1, linkTier);
    ctx.globalAlpha = 0.72;
    ctx.strokeStyle = index % 2 ? palette.accent : palette.primary;
    ctx.lineWidth = strokeWidth * 1.4;
    ctx.beginPath();
    ctx.arc(
      0,
      0,
      outerRadius * (0.88 + index * 0.015),
      angle - 0.12,
      angle + 0.12,
    );
    ctx.stroke();
  }
  ctx.restore();
}

function drawMappingSignature(
  ctx,
  params,
  hubX,
  hubY,
  coreRadius,
  rotation,
  strokeWidth,
) {
  const palette = params.palette;
  const keys = ["foundation", "palette", "structure", "detail"];
  ctx.save();
  ctx.lineCap = "round";
  keys.forEach((key, lane) => {
    const count = Math.max(1, (params.mappingModeIndices[key] || 0) + 1);
    const angle = rotation + (lane * Math.PI) / 2;
    const endRadius = coreRadius * (1.52 + count * 0.11);
    const end = [
      hubX + Math.cos(angle) * endRadius,
      hubY + Math.sin(angle) * endRadius,
    ];
    drawWidePath(
      ctx,
      [
        [
          hubX + Math.cos(angle) * coreRadius * 1.04,
          hubY + Math.sin(angle) * coreRadius * 1.04,
        ],
        end,
      ],
      strokeWidth * 0.82,
      lane % 2 ? palette.secondary : palette.primary,
      0.64,
      false,
    );
    for (let mark = 0; mark < count; mark += 1) {
      const radius = coreRadius * (1.48 + mark * 0.11);
      const x = hubX + Math.cos(angle) * radius;
      const y = hubY + Math.sin(angle) * radius;
      const nx = -Math.sin(angle);
      const ny = Math.cos(angle);
      const size = strokeWidth * (2.4 + lane * 0.3);
      drawWidePath(
        ctx,
        [
          [x - nx * size, y - ny * size],
          [x + nx * size, y + ny * size],
        ],
        strokeWidth * 1.2,
        lane === 1 || lane === 3 ? palette.accent : palette.primary,
        0.86,
        false,
      );
    }
    traceRegularPolygon(
      ctx,
      end[0],
      end[1],
      coreRadius * (0.1 + count * 0.015),
      2 + count,
      angle + Math.PI / 2,
    );
    ctx.globalAlpha = 0.82;
    ctx.fillStyle = lane === 1 || lane === 3 ? palette.accent : palette.primary;
    ctx.fill();
  });
  ctx.restore();
}

function drawTopologyField(
  ctx,
  params,
  anchors,
  innerRadius,
  outerRadius,
  rotation,
  strokeWidth,
) {
  const topology = params.topologyIndex;
  const palette = params.palette;
  const folds = Math.max(3, Math.min(12, Math.round(params.symmetry)));
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = palette.secondary;
  ctx.fillStyle = palette.secondary;
  if (topology === 0) {
    anchors.forEach((anchor, index) => {
      traceRadialFacet(
        ctx,
        innerRadius,
        outerRadius,
        anchor.angle,
        Math.min(0.36, (Math.PI / folds) * 0.7),
      );
      ctx.globalAlpha = accentIsActive(
        params.accentIndex,
        index,
        anchors.length,
      )
        ? 0.82
        : 0.48;
      ctx.fillStyle = accentIsActive(params.accentIndex, index, anchors.length)
        ? palette.accent
        : palette.secondary;
      ctx.fill();
      ctx.lineWidth = strokeWidth;
      ctx.strokeStyle = palette.primary;
      ctx.stroke();
    });
  } else if (topology === 1) {
    const r = outerRadius;
    drawWidePath(
      ctx,
      [
        [-r, -r * 0.62],
        [-r, -r * 0.12],
        [0, -r * 0.88],
        [r, -r * 0.12],
        [r, -r * 0.62],
      ],
      strokeWidth * 4.2,
      palette.secondary,
      0.82,
      false,
    );
    drawWidePath(
      ctx,
      [
        [-r, r * 0.62],
        [-r, r * 0.12],
        [0, r * 0.88],
        [r, r * 0.12],
        [r, r * 0.62],
      ],
      strokeWidth * 4.2,
      palette.accent,
      0.72,
      false,
    );
    drawWidePath(
      ctx,
      [
        [-r * 0.55, 0],
        [0, -r * 0.34],
        [r * 0.55, 0],
        [0, r * 0.34],
        [-r * 0.55, 0],
      ],
      strokeWidth * 2.4,
      palette.primary,
      0.78,
      false,
    );
  } else if (topology === 2) {
    const crown = anchors.slice(0, -2).map((anchor) => [anchor.x, anchor.y]);
    crown.push(
      [outerRadius * 0.72, outerRadius * 0.74],
      [-outerRadius * 0.72, outerRadius * 0.74],
    );
    drawWidePath(ctx, crown, strokeWidth * 4.5, palette.secondary, 0.78, true);
    anchors.slice(0, -2).forEach((anchor, index) =>
      drawWidePath(
        ctx,
        [
          [0, outerRadius * 0.36],
          [anchor.x, anchor.y],
        ],
        strokeWidth * (index % 2 ? 2.1 : 3.2),
        index % 2 ? palette.accent : palette.primary,
        0.72,
        false,
      ),
    );
  } else if (topology === 3) {
    for (let orbit = 0; orbit < 3; orbit += 1) {
      ctx.globalAlpha = 0.62 + orbit * 0.09;
      ctx.strokeStyle = orbit === 1 ? palette.accent : palette.secondary;
      ctx.lineWidth = strokeWidth * (2.5 - orbit * 0.45);
      ctx.beginPath();
      ctx.ellipse(
        0,
        0,
        outerRadius * (1 - orbit * 0.12),
        outerRadius * (0.42 + orbit * 0.13),
        rotation + (orbit * Math.PI) / 3,
        0,
        Math.PI * 2,
      );
      ctx.stroke();
    }
  } else if (topology === 4) {
    const vertices = [0, 2, 4].map((index) => [
      anchors[index].x,
      anchors[index].y,
    ]);
    drawWidePath(
      ctx,
      vertices,
      strokeWidth * 4.2,
      palette.secondary,
      0.82,
      true,
    );
    const mids = [1, 3, 5].map((index) => [anchors[index].x, anchors[index].y]);
    drawWidePath(ctx, mids, strokeWidth * 2.5, palette.accent, 0.78, true);
    vertices.forEach((point) =>
      drawWidePath(
        ctx,
        [[0, 0], point],
        strokeWidth * 2,
        palette.primary,
        0.72,
        false,
      ),
    );
  } else if (topology === 5) {
    for (let ring = 1; ring <= 4; ring += 1) {
      const r = (outerRadius * ring) / 4;
      ctx.globalAlpha = ring % 2 ? 0.78 : 0.48;
      ctx.strokeStyle = ring === 3 ? palette.accent : palette.secondary;
      ctx.lineWidth = strokeWidth * (ring === 4 ? 3.5 : 2);
      ctx.beginPath();
      ctx.arc(
        0,
        0,
        r,
        rotation + ring * 0.16,
        rotation + Math.PI * (1.72 + ring * 0.08),
      );
      ctx.stroke();
    }
  } else if (topology === 6) {
    const points = anchors.map((anchor) => [anchor.x, anchor.y]);
    drawWidePath(ctx, points, strokeWidth * 5, palette.secondary, 0.82, false);
    drawWidePath(
      ctx,
      points.slice(2),
      strokeWidth * 1.7,
      palette.primary,
      0.9,
      false,
    );
  } else if (topology === 7) {
    const r = outerRadius;
    drawWidePath(
      ctx,
      [
        [0, -r],
        [0, r],
      ],
      strokeWidth * 5.5,
      palette.secondary,
      0.84,
      false,
    );
    drawWidePath(
      ctx,
      [
        [-r * 0.72, 0],
        [r * 0.72, 0],
      ],
      strokeWidth * 4,
      palette.accent,
      0.72,
      false,
    );
    drawWidePath(
      ctx,
      [
        [-r * 0.52, -r * 0.52],
        [r * 0.52, r * 0.52],
      ],
      strokeWidth * 2,
      palette.primary,
      0.7,
      false,
    );
  } else if (topology === 8) {
    anchors.forEach((anchor, index) => {
      ctx.save();
      ctx.translate(anchor.x * 0.56, anchor.y * 0.56);
      ctx.rotate(anchor.angle);
      ctx.globalAlpha = accentIsActive(
        params.accentIndex,
        index,
        anchors.length,
      )
        ? 0.82
        : 0.5;
      ctx.fillStyle = index % 2 ? palette.accent : palette.secondary;
      ctx.beginPath();
      ctx.ellipse(
        0,
        0,
        outerRadius * 0.47,
        outerRadius * 0.19,
        0,
        0,
        Math.PI * 2,
      );
      ctx.fill();
      ctx.strokeStyle = palette.primary;
      ctx.lineWidth = strokeWidth;
      ctx.stroke();
      ctx.restore();
    });
  } else if (topology === 9) {
    const r = outerRadius;
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = palette.secondary;
    ctx.beginPath();
    ctx.moveTo(-r, -r * 0.75);
    ctx.lineTo(-r * 0.18, -r * 0.48);
    ctx.lineTo(-r * 0.28, r * 0.52);
    ctx.lineTo(-r, r * 0.75);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = palette.accent;
    ctx.beginPath();
    ctx.moveTo(r, -r * 0.75);
    ctx.lineTo(r * 0.18, -r * 0.48);
    ctx.lineTo(r * 0.28, r * 0.52);
    ctx.lineTo(r, r * 0.75);
    ctx.closePath();
    ctx.fill();
    drawWidePath(
      ctx,
      [
        [0, -r * 0.72],
        [0, r * 0.72],
      ],
      strokeWidth * 2.2,
      palette.primary,
      0.9,
      false,
    );
  } else if (topology === 10) {
    const points = anchors.map((anchor) => [anchor.x, anchor.y]);
    drawWidePath(ctx, points, strokeWidth * 4, palette.secondary, 0.8, true);
    points.forEach((point, index) =>
      drawWidePath(
        ctx,
        [[0, 0], point],
        strokeWidth * (index % 2 ? 1.8 : 2.8),
        index % 2 ? palette.accent : palette.primary,
        0.7,
        false,
      ),
    );
  } else {
    const points = anchors.map((anchor) => [anchor.x, anchor.y]);
    drawWidePath(ctx, points, strokeWidth * 5, palette.secondary, 0.78, false);
    const reversed = points
      .slice()
      .reverse()
      .map((point, index) => [
        point[0] * (1 - index * 0.035),
        point[1] * (1 - index * 0.035),
      ]);
    drawWidePath(ctx, reversed, strokeWidth * 1.8, palette.accent, 0.82, false);
  }
  ctx.restore();
}

function complexPower(ratio, angle, exponent) {
  const magnitude = Math.pow(ratio, exponent);
  const turn = angle * exponent;
  return {
    x: magnitude * Math.cos(turn),
    y: magnitude * Math.sin(turn),
    magnitude,
    turn,
  };
}

function complexMultiply(value, point) {
  return {
    x: value.x * point.x - value.y * point.y,
    y: value.y * point.x + value.x * point.y,
  };
}

function recursiveTransform(params) {
  const ratio = Math.max(0.3, Math.min(0.55, params.scaleRatio));
  // A true memory-anchor zoom is perfectly centred and aligned: the child is
  // the same seal, not a nearby ornament. Focus choices alter the internal
  // seal orientation below, so the controls remain meaningful without drift.
  const angle = 0;
  const dx = 0;
  const dy = 0;
  const qx = ratio * Math.cos(angle);
  const qy = ratio * Math.sin(angle);
  const diagonal = (1 - qx) * (1 - qx) + qy * qy;
  const fixed = {
    x: ((1 - qx) * dx - qy * dy) / diagonal,
    y: (qy * dx + (1 - qx) * dy) / diagonal,
  };
  return { ratio, angle, fixed };
}

function drawMotifInstance(
  ctx,
  params,
  screenX,
  screenY,
  scale,
  rotation,
  unitX,
  unitY,
  alpha,
) {
  const palette = params.palette;
  const family = params.symbolIndex % SYMBOLS.length;
  const folds = Math.max(3, Math.min(12, Math.round(params.symmetry)));
  const layerValue = Math.max(3, Math.min(12, Math.round(params.ringCount)));
  const layerCount = 2 + Math.floor((layerValue - 3) / 2);
  const occupiedSlots = params.secondarySlots.filter(
    (metadataSlot) => metadataSlot.count,
  ).length;
  const metadataWeight = Math.min(1, occupiedSlots / 12);
  const relationCount =
    params.input.parents.length +
    params.input.children.length +
    params.input.groups.length +
    params.input.labels.length;
  const relationWeight = Math.min(1, relationCount / 10);
  const linkWeight = Math.min(
    1,
    Math.sqrt(Math.max(0, params.input.outgoingLinkCount) / 32),
  );
  const detailTier =
    params.detailDensity < 0.35
      ? 1
      : params.detailDensity < 0.55
        ? 2
        : params.detailDensity < 0.74
          ? 3
          : params.detailDensity < 0.91
            ? 4
            : 5;
  let metadataSignature = params.canonicalSeed >>> 0;
  params.secondarySlots.forEach((slot, index) => {
    const mixed =
      (slot.xor ^ slot.sum ^ Math.imul(slot.count + 1, 0x9e3779b1)) >>> 0;
    metadataSignature = (metadataSignature ^ Math.imul(mixed, index + 3)) >>> 0;
  });
  const noteIdentityUnit =
    saltedHash(
      params.input.noteId + "|" + params.input.path,
      "note-anchor-rotation",
    ) / 4294967296;
  const profileIdentityUnit =
    saltedHash(params.input.title, "profile-anchor-scale") / 4294967296;
  const identityTurn = (noteIdentityUnit - 0.5) * ((Math.PI * 2) / folds);
  const metadataTurn =
    (metadataSignature / 4294967296 - 0.5) * (Math.PI / folds);
  const profileScale = 0.82 + profileIdentityUnit * 0.32;
  const profileWidth = 0.9 + profileIdentityUnit * 0.24;
  const innerRadius = 0.1 + relationWeight * 0.07 + metadataWeight * 0.035;
  const foundationModeShift =
    (params.mappingModeIndices.foundation - 2.5) * 0.014;
  const outerRadius = Math.max(
    0.55,
    Math.min(
      0.86,
      0.58 +
        params.branchSpread * 0.18 +
        linkWeight * 0.06 +
        (profileIdentityUnit - 0.5) * 0.09 +
        foundationModeShift,
    ),
  );
  const moduleRadius =
    (0.058 + detailTier * 0.012 + params.strokeWeight * 0.002) *
    (0.86 + noteIdentityUnit * 0.26);
  const angleOffset =
    params.orientation * 0.22 +
    params.twist * 0.18 +
    params.portal[0] * 1.3 +
    params.portal[1] * 0.7 +
    identityTurn +
    metadataTurn;
  const strokeWidth = 0.006 + params.strokeWeight * 0.007;
  const coreRadius =
    (0.235 + relationWeight * 0.04 + metadataWeight * 0.03) * profileScale;
  const hubX = params.portal[0] * 0.52;
  const hubY = params.portal[1] * 0.52;

  ctx.save();
  ctx.translate(screenX, screenY);
  ctx.transform(
    unitX * scale * Math.cos(rotation),
    unitY * scale * Math.sin(rotation),
    -unitX * scale * Math.sin(rotation),
    unitY * scale * Math.cos(rotation),
    0,
    0,
  );
  ctx.transform(
    1,
    params.portal[1] * 0.28,
    params.portal[0] * 0.28,
    profileWidth,
    0,
    0,
  );
  ctx.globalAlpha = alpha;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.shadowColor = rgba(palette.glow, 0.14 + params.glowStrength * 0.62);
  ctx.shadowBlur = params.glowStrength * 9;

  const anchors = topologyAnchors(
    params.topologyIndex,
    folds,
    outerRadius,
    angleOffset,
  );
  if (params.glowStrength > 0) {
    ctx.save();
    ctx.globalAlpha = alpha * (0.1 + params.glowStrength * 0.18);
    ctx.strokeStyle = palette.glow;
    ctx.lineCap = "round";
    anchors.forEach((anchor, index) => {
      ctx.lineWidth =
        strokeWidth * (2.6 + params.glowStrength * 7 + (index % 2));
      ctx.beginPath();
      ctx.moveTo(hubX, hubY);
      ctx.lineTo(anchor.x * 0.86, anchor.y * 0.86);
      ctx.stroke();
    });
    ctx.restore();
  }
  drawTopologyField(
    ctx,
    params,
    anchors,
    innerRadius,
    outerRadius,
    angleOffset,
    strokeWidth,
  );
  drawAccentSignature(
    ctx,
    params,
    anchors,
    hubX,
    hubY,
    coreRadius,
    outerRadius,
    angleOffset,
    strokeWidth,
  );

  anchors.forEach((anchor, index) => {
    const activeAccent = accentIsActive(
      params.accentIndex,
      index,
      anchors.length,
    );
    const connectorColor = activeAccent
      ? palette.accent
      : index % 2
        ? palette.secondary
        : palette.primary;
    const startScale = 0.18 + (index % Math.max(1, layerCount)) * 0.035;
    drawConnectorGrammar(
      ctx,
      hubX + (anchor.x - hubX) * startScale,
      hubY + (anchor.y - hubY) * startScale,
      anchor.x * 0.9,
      anchor.y * 0.9,
      strokeWidth * (1.1 + layerValue * 0.035),
      connectorColor,
      activeAccent ? 0.92 : 0.66,
      params.connectorIndex,
      index,
    );
    drawTerminalGrammar(
      ctx,
      anchor.x,
      anchor.y,
      anchor.angle + params.twist * 0.08,
      moduleRadius * (activeAccent ? 1.16 : 1),
      palette,
      params.terminalIndex,
      family,
      activeAccent ? 0.96 : 0.76,
    );
  });

  // Layers are encoded as connected cross-ribs along the dominant paths.
  // Every dropdown value has a distinct visible rib count.
  const visibleLayerCount = layerValue - 2;
  for (let index = 0; index < visibleLayerCount; index += 1) {
    const anchor = anchors[index % Math.max(1, anchors.length)] || {
      x: outerRadius,
      y: 0,
    };
    const dx = anchor.x - hubX;
    const dy = anchor.y - hubY;
    const length = Math.max(0.001, Math.hypot(dx, dy));
    const nx = -dy / length;
    const ny = dx / length;
    const t = 0.3 + 0.5 * ((index + 1) / (visibleLayerCount + 1));
    const x = hubX + dx * t;
    const y = hubY + dy * t;
    const rib = strokeWidth * (5 + (index % 3) * 1.35);
    drawWidePath(
      ctx,
      [
        [x - nx * rib, y - ny * rib],
        [x + nx * rib, y + ny * rib],
      ],
      strokeWidth * 1.8,
      index % 2 ? palette.primary : palette.accent,
      0.86,
      false,
    );
  }

  if (detailTier >= 3 && anchors.length > 2) {
    const stride = detailTier >= 5 ? 1 : 2;
    for (let index = 0; index < anchors.length; index += stride) {
      const next = anchors[(index + 1) % anchors.length];
      const current = anchors[index];
      drawConnectorGrammar(
        ctx,
        current.x * 0.62,
        current.y * 0.62,
        next.x * 0.62,
        next.y * 0.62,
        strokeWidth * 0.7,
        palette.primary,
        0.34 + metadataWeight * 0.22,
        (params.connectorIndex + 3) % CONNECTORS.length,
        index,
      );
    }
  }

  // Symmetry is always visible, even in fixed topologies whose main anchor
  // count is architectural rather than radial.
  for (let index = 0; index < folds; index += 1) {
    const angle = angleOffset + (index * Math.PI * 2) / folds;
    const from = polarPoint(coreRadius * 1.05, angle);
    const to = polarPoint(coreRadius * (1.24 + layerCount * 0.045), angle);
    drawWidePath(
      ctx,
      [
        [hubX + from[0], hubY + from[1]],
        [hubX + to[0], hubY + to[1]],
      ],
      strokeWidth * (1.1 + (index % 2) * 0.35),
      accentIsActive(params.accentIndex, index, folds)
        ? palette.accent
        : palette.secondary,
      0.68,
      false,
    );
  }

  // Detail tiers add a coherent chain of embedded family marks instead of
  // noisy decoration, so all five values are easy to distinguish.
  ctx.save();
  for (let index = 0; index < detailTier; index += 1) {
    const angle = angleOffset + (index - (detailTier - 1) * 0.5) * 0.34;
    const radius = coreRadius * (1.58 + index * 0.24);
    const x = hubX + Math.cos(angle) * radius;
    const y = hubY + Math.sin(angle) * radius;
    traceFamilyShape(
      ctx,
      x,
      y,
      strokeWidth * (2.5 + index * 0.35),
      angle,
      family,
    );
    ctx.globalAlpha = alpha * (0.58 + index * 0.07);
    ctx.fillStyle = index % 2 ? palette.accent : palette.primary;
    ctx.fill();
  }
  ctx.restore();

  drawMappingSignature(
    ctx,
    params,
    hubX,
    hubY,
    coreRadius,
    angleOffset,
    strokeWidth,
  );
  drawMetadataSignature(
    ctx,
    params,
    metadataSignature,
    hubX,
    hubY,
    coreRadius,
    outerRadius,
    angleOffset,
    strokeWidth,
  );
  ctx.save();
  ctx.translate(hubX, hubY);
  drawCoreArchitecture(
    ctx,
    params,
    coreRadius,
    angleOffset + params.twist * 0.12,
    strokeWidth,
  );
  ctx.restore();
  ctx.shadowBlur = 0;
  ctx.restore();
}

function drawRecursiveCopy(
  ctx,
  viewportX,
  viewportY,
  viewportWidth,
  viewportHeight,
  phase,
  params,
  tile,
  contentScale,
) {
  const transform = recursiveTransform(params);
  const unit =
    Math.min(viewportWidth * 0.46, viewportHeight * 0.55) *
    Math.max(0.5, Math.min(2.2, Number(contentScale) || 1));
  const unitX = unit;
  const unitY = unit;
  const originX = viewportX + viewportWidth * 0.5;
  const originY = viewportY + viewportHeight * 0.5;
  const minimumPixels = 1.4;
  const maximumScale = 2.05;

  ctx.save();
  ctx.beginPath();
  ctx.rect(
    viewportX + 2,
    viewportY,
    Math.max(1, viewportWidth - 4),
    viewportHeight,
  );
  ctx.clip();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // Each integer level is the exact same motif under one repeated similarity transform.
  // Subtracting phase performs a mathematically continuous camera descent into the child.
  for (let level = -2; level <= 12; level += 1) {
    const exponent = level - phase;
    const power = complexPower(transform.ratio, transform.angle, exponent);
    if (power.magnitude > maximumScale) continue;
    const transformedFixed = complexMultiply(power, transform.fixed);
    const worldX = transform.fixed.x - transformedFixed.x;
    const worldY = transform.fixed.y - transformedFixed.y;
    const pixelSize = power.magnitude * Math.min(unitX, unitY);
    const smallFade = Math.max(
      0,
      Math.min(1, (pixelSize - minimumPixels) / 15),
    );
    const largeFade =
      power.magnitude > 1.05
        ? Math.max(0, 1 - (power.magnitude - 1.05) / 0.9)
        : 1;
    const alpha = smallFade * largeFade * (0.5 + params.detailDensity * 0.16);
    if (alpha <= 0.012) continue;
    const targetUnit = power.magnitude * unit;
    const drawSize = targetUnit / 0.42;
    ctx.save();
    ctx.translate(originX + worldX * unitX, originY + worldY * unitY);
    ctx.rotate(power.turn);
    ctx.globalAlpha = alpha;
    ctx.drawImage(tile, -drawSize * 0.5, -drawSize * 0.5, drawSize, drawSize);
    ctx.restore();
  }
  ctx.restore();
}

function renderRecursiveScene(
  ctx,
  width,
  height,
  phase,
  params,
  transparentBackground,
  copyCount,
  tile,
  contentScale,
) {
  ctx.clearRect(0, 0, width, height);
  if (!transparentBackground) {
    ctx.fillStyle = params.palette.bg;
    ctx.fillRect(0, 0, width, height);
  }

  const copies = Math.max(1, Math.round(copyCount || 1));
  const viewportWidth = width / copies;
  for (let index = 0; index < copies; index += 1) {
    // The centre fingerprint is the generated identity. The four peers are
    // exact synchronous copies, not separately generated variations.
    drawRecursiveCopy(
      ctx,
      index * viewportWidth,
      0,
      viewportWidth,
      height,
      phase,
      params,
      tile,
      contentScale,
    );
  }
}

function drawFingerprintTile(ctx, params) {
  ctx.clearRect(0, 0, TILE_SIZE, TILE_SIZE);
  const tileUnit = TILE_SIZE * 0.42;
  drawMotifInstance(
    ctx,
    params,
    TILE_SIZE * 0.5,
    TILE_SIZE * 0.5,
    1,
    0,
    tileUnit,
    tileUnit,
    1,
  );
}

function makeBaseTile(params) {
  const canvas = document.createElement("canvas");
  canvas.width = TILE_SIZE;
  canvas.height = TILE_SIZE;
  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) throw new Error("Canvas 2D is unavailable.");
  drawFingerprintTile(ctx, params);
  return canvas;
}

function createCachedTile(params) {
  return makeBaseTile(params);
}
// 10. True self-similar camera zoom.
function renderBannerToContext(
  ctx,
  width,
  height,
  phase,
  params,
  tile,
  transparentBackground,
) {
  renderRecursiveScene(
    ctx,
    width,
    height,
    phase,
    params,
    transparentBackground,
    5,
    tile,
  );
}

export {
  compileFingerprint,
  drawFingerprintTile,
  renderRecursiveScene,
  ALGORITHM_VERSION,
  TILE_SIZE,
};
