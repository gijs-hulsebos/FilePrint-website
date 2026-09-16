export function canonicalTags(values: readonly string[]): string[] {
  return [
    ...new Set(
      values
        .map(
          (value) =>
            "#" +
            value
              .trim()
              .replace(/^#+/, "")
              .split("/")
              .map((part) => part.trim())
              .filter(Boolean)
              .join("/")
              .toLocaleLowerCase("en-US"),
        )
        .filter((tag) => tag !== "#"),
    ),
  ].sort((a, b) => a.localeCompare(b, "en"));
}

export function selectTag(tags: readonly string[], preferredRoot = ""): string {
  const all = canonicalTags(tags);
  const root = canonicalTags([preferredRoot])[0];
  const preferred = root
    ? all.filter((tag) => tag === root || tag.startsWith(root + "/"))
    : [];
  return (
    (preferred.length ? preferred : all).sort(
      (a, b) =>
        b.split("/").length - a.split("/").length || a.localeCompare(b, "en"),
    )[0] ?? "#general/untagged"
  );
}

export function hierarchy(tag: string): string[] {
  const parts = tag.replace(/^#/, "").split("/");
  return parts.map((_, index) => "#" + parts.slice(0, index + 1).join("/"));
}

export interface NoteInput {
  noteId: string;
  path: string;
  title: string;
  tags: string[];
  parents: string[];
  children: string[];
  groups: string[];
  labels: string[];
  type: string;
  status: string;
  outgoingLinkCount: number;
}

export function metadataList(value: unknown): string[] {
  if (value == null || value === "") return [];
  if (Array.isArray(value))
    return [...new Set(value.flatMap(metadataList))].sort((a, b) =>
      a.localeCompare(b, "en"),
    );
  if (typeof value === "object") {
    const link = value as { path?: unknown };
    return typeof link.path === "string" ? metadataList(link.path) : [];
  }
  return [
    ...new Set(
      String(value)
        .split(/[\n;,]+/g)
        .map((item) =>
          item
            .trim()
            .replace(/^\[\[([^\]|]+)(?:\|[^\]]*)?\]\]$/, "$1")
            .replace(/\s+/g, " ")
            .toLocaleLowerCase("en-US"),
        )
        .filter(Boolean),
    ),
  ].sort((a, b) => a.localeCompare(b, "en"));
}

export interface EmbedOptions {
  tag?: string;
  mode: "banner" | "icon" | "audio" | "all";
}
export function parseEmbed(source: string): EmbedOptions {
  const options: EmbedOptions = { mode: "banner" };
  for (const line of source
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)) {
    const match = /^(tag|mode)\s*:\s*(.*?)\s*$/.exec(line);
    if (!match)
      throw new Error(
        "Use only tag: #your/nested/tag and mode: banner or icon.",
      );
    if (match[1] === "mode") {
      const mode = match[2] === "pfp" ? "icon" : match[2];
      if (
        mode !== "banner" &&
        mode !== "icon" &&
        mode !== "audio" &&
        mode !== "all"
      )
        throw new Error("Mode must be banner, icon, pfp, audio or all.");
      options.mode = mode;
    } else {
      const value = match[2].replace(/^['"]|['"]$/g, "");
      if (!value || /\s/.test(value) || !canonicalTags([value]).length)
        throw new Error("Provide one non-empty tag without spaces.");
      options.tag = canonicalTags([value])[0];
    }
  }
  return options;
}
