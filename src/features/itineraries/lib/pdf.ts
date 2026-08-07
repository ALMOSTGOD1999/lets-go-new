import { type Color, layoutText, PDF, type PDFPage, rgb } from "@libpdf/core";

import type { Itinerary } from "#/features/itineraries/data/schema";

// ─── Company ──────────────────────────────────────────────────────────────────
const COMPANY = {
  name: "Lets Go Tour And Travels",
  phone: "+919475682444",
  website: "www.exploreletsgo.com",
  email: "letsgotourandtravels1@gmail.com",
  address: "69, Municipality Complex, K.N. Road, Berhampore, Murshidabad",
};

// ─── Page dimensions ──────────────────────────────────────────────────────────
const W = 595; // A4 width pt
const M = 40; // left/right margin

// ─── Palette ──────────────────────────────────────────────────────────────────
const C = {
  navy: rgb(0.04, 0.14, 0.36),
  navyDeco: rgb(0.09, 0.24, 0.52),
  teal: rgb(0.04, 0.62, 0.72),
  tealPale: rgb(0.88, 0.97, 1.0),
  tealDeco: rgb(0.04, 0.42, 0.54),
  orange: rgb(0.96, 0.47, 0.16),
  orangePale: rgb(1.0, 0.94, 0.88),
  green: rgb(0.11, 0.66, 0.44),
  greenDeco: rgb(0.08, 0.38, 0.26),
  gold: rgb(0.95, 0.75, 0.12),
  ink: rgb(0.1, 0.13, 0.18),
  muted: rgb(0.4, 0.45, 0.52),
  line: rgb(0.86, 0.9, 0.95),
  soft: rgb(0.97, 0.98, 1.0),
  white: rgb(1, 1, 1),
  footerText: rgb(0.6, 0.7, 0.8),
};

const DAY_ACCENTS: Color[] = [
  C.teal,
  C.orange,
  C.green,
  C.gold,
  C.teal,
  C.orange,
  C.green,
  C.gold,
];

// ─── Logo ─────────────────────────────────────────────────────────────────────
type SvgPath = { d: string; color: Color };
let logoCache: Promise<SvgPath[]> | null = null;

function getLogoPaths(): Promise<SvgPath[]> {
  logoCache ??= fetch("/logo.svg")
    .then((r) => r.text())
    .then((svg) =>
      [
        ...svg.matchAll(
          /<path[\s\S]*?d="([\s\S]*?)"[\s\S]*?fill="rgb\((\d+),(\d+),(\d+)\)"/g,
        ),
      ].map(([, d, r, g, b]) => ({
        d: d.replace(/\s+/g, " ").trim(),
        color: rgb(Number(r) / 255, Number(g) / 255, Number(b) / 255),
      })),
    )
    .catch(() => []);
  return logoCache;
}

function stampLogo(
  page: PDFPage,
  paths: SvgPath[],
  x: number,
  y: number,
  scale: number,
  opacity: number,
) {
  for (const p of paths) {
    page.drawSvgPath(p.d, { x, y, scale, color: p.color, opacity });
  }
  if (!paths.length) {
    page.drawText(COMPANY.name, { x, y, size: 14, color: C.green, opacity });
  }
}

// ─── Public entry ─────────────────────────────────────────────────────────────
export async function shareItineraryPdf(itinerary: Itinerary) {
  const pdf = PDF.create();
  pdf.setTitle(`${itinerary.title} — Itinerary`);
  const logoPaths = await getLogoPaths();

  let page = pdf.addPage({ size: "a4" });
  let y = buildHeader(page, logoPaths, itinerary);
  y = buildStatsRow(page, itinerary, y);

  const finishPage = (targetPage: PDFPage) => {
    stampLogo(targetPage, logoPaths, 168, 268, 0.5, 0.04);
    buildFooter(targetPage);
  };

  const startContinuationPage = (section: "overview" | "day") => {
    finishPage(page);
    page = pdf.addPage({ size: "a4" });
    y = buildContinuationHeader(page, logoPaths, itinerary);
    y =
      section === "overview"
        ? buildOverviewSectionHeader(page, y, true)
        : buildDaySectionHeader(page, y, true);
  };

  if (itinerary.overview?.trim()) {
    const overviewLines = getTextLines(
      itinerary.overview,
      "Helvetica",
      9.5,
      W - M * 2 - 28,
      14,
    );

    let lineIndex = 0;
    y = buildOverviewSectionHeader(page, y, false);

    while (lineIndex < overviewLines.length) {
      const availableHeight = y - 60;
      const linesThatFit = Math.max(1, Math.floor((availableHeight - 26) / 14));
      const chunk = overviewLines.slice(lineIndex, lineIndex + linesThatFit);

      y = drawOverviewBox(page, chunk, y);
      lineIndex += chunk.length;

      if (lineIndex < overviewLines.length) {
        startContinuationPage("overview");
      }
    }
  }

  y = buildDaySectionHeader(page, y, false);

  for (let i = 0; i < itinerary.days; i++) {
    const accent = DAY_ACCENTS[i % DAY_ACCENTS.length];
    const detail = (itinerary.dayDetails ?? [])[i]?.trim() || "";
    const fallbackText = detail || itinerary.destination;
    const lines = getTextLines(
      fallbackText,
      "Helvetica",
      9,
      W - M * 2 - 32,
      13,
    );

    let lineIndex = 0;
    let isContinuation = false;

    while (lineIndex < lines.length || (!detail && !isContinuation)) {
      const availableHeight = y - 60;
      const title = isContinuation ? `Day ${i + 1} (cont.)` : `Day ${i + 1}`;
      const maxLines = detail
        ? Math.max(1, Math.floor((availableHeight - 44) / 13))
        : 1;
      const chunk = detail
        ? lines.slice(lineIndex, lineIndex + maxLines)
        : lines.slice(0, 1);
      const rowHeight = getDayCardHeight(chunk.length, detail.length > 0);

      if (y - rowHeight < 60) {
        startContinuationPage("day");
        continue;
      }

      y = drawDayCard(page, {
        title,
        lines: chunk,
        y,
        accent,
        muted: !detail,
      });
      y -= 10;

      if (!detail) {
        break;
      }

      lineIndex += chunk.length;
      isContinuation = true;
    }
  }

  finishPage(page);

  const blob = pdfToBlob(await pdf.save());
  await triggerDownloadOrShare(
    blob,
    `itinerary-${itinerary.id}-${slugify(itinerary.title)}.pdf`,
    `${itinerary.title} — Itinerary`,
  );
}

// ─── Header  (y 648 – 842) ────────────────────────────────────────────────────
// Layout (bottom → top in PDF coords):
//   648–790 : navy hero   (decorative circles ONLY here, never above 789)
//   790–834 : white company strip — logo + company name — NO design elements
//   834–842 : tri-colour stripe
function buildHeader(
  page: PDFPage,
  logoPaths: SvgPath[],
  itin: Itinerary,
): number {
  // ═══════════════════════════════════════════════════════════════════════
  // PHASE 1 — All background rectangles drawn first so nothing covers them
  // ═══════════════════════════════════════════════════════════════════════

  // Tri-colour top stripe (y 834–842)
  page.drawRectangle({ x: 0, y: 834, width: W, height: 8, color: C.green });
  page.drawRectangle({ x: 188, y: 834, width: 160, height: 8, color: C.teal });
  page.drawRectangle({
    x: 348,
    y: 834,
    width: 247,
    height: 8,
    color: C.orange,
  });

  // Company strip background (y 790–834) — will hold logo + text on top
  page.drawRectangle({ x: 0, y: 790, width: W, height: 44, color: C.soft });

  // Navy hero background (y 648–789)
  page.drawRectangle({ x: 0, y: 648, width: W, height: 142, color: C.navy });

  // Decorative circles — RIGHT side only, max top = y+h ≤ 788 (hero ceiling)
  page.drawRectangle({
    x: 448,
    y: 654,
    width: 132,
    height: 132,
    color: C.navyDeco,
    cornerRadius: 66,
  }); // 654+132=786 ✓
  page.drawRectangle({
    x: 494,
    y: 648,
    width: 84,
    height: 84,
    color: C.tealDeco,
    cornerRadius: 42,
  }); // 648+84=732 ✓
  page.drawRectangle({
    x: 398,
    y: 742,
    width: 46,
    height: 46,
    color: C.greenDeco,
    cornerRadius: 23,
  }); // 742+46=788 ✓

  // Chips background
  page.drawRectangle({
    x: M,
    y: 654,
    width: 130,
    height: 22,
    color: C.teal,
    cornerRadius: 4,
  });
  page.drawRectangle({
    x: M + 140,
    y: 654,
    width: 104,
    height: 22,
    color: C.orange,
    cornerRadius: 4,
  });
  if (itin.price != null) {
    page.drawRectangle({
      x: M + 254,
      y: 654,
      width: 160,
      height: 22,
      color: C.gold,
      cornerRadius: 4,
    });
  }

  // Tri-colour accent bar below hero (y 644–648)
  page.drawRectangle({ x: 0, y: 644, width: W / 3, height: 4, color: C.green });
  page.drawRectangle({
    x: W / 3,
    y: 644,
    width: W / 3,
    height: 4,
    color: C.teal,
  });
  page.drawRectangle({
    x: (W * 2) / 3,
    y: 644,
    width: W / 3,
    height: 4,
    color: C.orange,
  });

  // ═══════════════════════════════════════════════════════════════════════
  // PHASE 2 — Logo + all text drawn on top of every background rectangle
  // ═══════════════════════════════════════════════════════════════════════

  // Logo — origin y=836 + scale 0.10 puts active content in y=791–831,
  // which sits fully inside the company strip (y=790–834) and aligns the
  // logo centre (~SVG y=245 → PDF y=812) with the company name text.
  stampLogo(page, logoPaths, M, 836, 0.1, 1);

  // Company info — x offset matches logo width at the new scale
  page.drawText(COMPANY.name.toUpperCase(), {
    x: M + 68,
    y: 820,
    size: 12,
    font: "Helvetica-Bold",
    color: C.navy,
  });
  page.drawText(`${COMPANY.phone}  |  ${COMPANY.website}`, {
    x: M + 68,
    y: 806,
    size: 8.5,
    color: C.muted,
  });

  // Hero text
  page.drawText("TRAVEL ITINERARY", {
    x: M,
    y: 776,
    size: 8,
    font: "Helvetica-Bold",
    color: C.teal,
  });

  const titleWidth = 360;
  let titleSize = 24;
  let titleLineHeight = 30;
  let titleLines = getTextLines(
    itin.title,
    "Helvetica-Bold",
    titleSize,
    titleWidth,
    titleLineHeight,
  );

  while (titleLines.length > 2 && titleSize > 18) {
    titleSize -= 2;
    titleLineHeight = titleSize + 6;
    titleLines = getTextLines(
      itin.title,
      "Helvetica-Bold",
      titleSize,
      titleWidth,
      titleLineHeight,
    );
  }

  page.drawText(itin.title, {
    x: M,
    y: 752,
    size: titleSize,
    font: "Helvetica-Bold",
    color: C.white,
    maxWidth: titleWidth,
    lineHeight: titleLineHeight,
  });

  // Chip text
  page.drawText(itin.destination.substring(0, 18), {
    x: M + 8,
    y: 660,
    size: 9,
    color: C.white,
  });
  page.drawText(`${itin.days}D / ${itin.nights}N`, {
    x: M + 148,
    y: 660,
    size: 9,
    font: "Helvetica-Bold",
    color: C.white,
  });
  if (itin.price != null) {
    page.drawText(
      `INR ${Number(itin.price).toLocaleString("en-IN")} / person`,
      {
        x: M + 262,
        y: 660,
        size: 8.5,
        font: "Helvetica-Bold",
        color: C.navy,
      },
    );
  }

  return 634;
}

// ─── Stats row ────────────────────────────────────────────────────────────────
function buildStatsRow(page: PDFPage, itin: Itinerary, startY: number): number {
  const y = startY - 60;
  const gap = 10;
  const cardW = (W - M * 2 - gap * 2) / 3;
  const cardH = 52;

  drawStatCard(
    page,
    M,
    y,
    cardW,
    cardH,
    "DAYS",
    String(itin.days),
    C.teal,
    C.tealPale,
  );
  drawStatCard(
    page,
    M + cardW + gap,
    y,
    cardW,
    cardH,
    "NIGHTS",
    String(itin.nights),
    C.navy,
    C.soft,
  );
  const priceVal =
    itin.price != null
      ? `INR ${Number(itin.price).toLocaleString("en-IN")}`
      : "On Request";
  drawStatCard(
    page,
    M + (cardW + gap) * 2,
    y,
    cardW,
    cardH,
    "PRICE / PERSON",
    priceVal,
    C.orange,
    C.orangePale,
  );

  return y - 14;
}

function drawStatCard(
  page: PDFPage,
  x: number,
  y: number,
  w: number,
  h: number,
  label: string,
  value: string,
  accent: Color,
  bg: Color,
) {
  page.drawRectangle({
    x,
    y,
    width: w,
    height: h,
    color: bg,
    cornerRadius: 6,
    borderColor: C.line,
    borderWidth: 0.5,
  });
  page.drawRectangle({
    x,
    y: y + h - 4,
    width: w,
    height: 4,
    color: accent,
    cornerRadius: 4,
  });
  page.drawText(label, {
    x: x + 10,
    y: y + h - 16,
    size: 7,
    font: "Helvetica-Bold",
    color: accent,
  });
  page.drawText(value, {
    x: x + 10,
    y: y + 8,
    size: value.length > 12 ? 11 : 18,
    font: "Helvetica-Bold",
    color: C.ink,
    maxWidth: w - 20,
  });
}

// ─── Overview ─────────────────────────────────────────────────────────────────
function buildOverviewSectionHeader(
  page: PDFPage,
  startY: number,
  isContinuation: boolean,
): number {
  const y = startY - 20;

  page.drawRectangle({
    x: M,
    y: y - 14,
    width: 4,
    height: 18,
    color: C.teal,
    cornerRadius: 2,
  });
  page.drawText(isContinuation ? "OVERVIEW (CONT.)" : "OVERVIEW", {
    x: M + 12,
    y,
    size: 10,
    font: "Helvetica-Bold",
    color: C.navy,
  });

  return y - 18;
}

function drawOverviewBox(
  page: PDFPage,
  lines: Array<{ text: string }>,
  startY: number,
): number {
  const lineHeight = 14;
  const boxH = Math.max(40, lines.length * lineHeight + 20);
  const boxY = startY - boxH;

  page.drawRectangle({
    x: M,
    y: boxY,
    width: W - M * 2,
    height: boxH,
    color: C.tealPale,
    borderColor: C.teal,
    borderWidth: 0.5,
    cornerRadius: 6,
  });
  page.drawText(lines.map((line) => line.text).join("\n"), {
    x: M + 14,
    y: boxY + boxH - 16,
    size: 9.5,
    color: C.ink,
    maxWidth: W - M * 2 - 28,
    lineHeight,
  });

  return boxY - 14;
}

// ─── Day plan ─────────────────────────────────────────────────────────────────
function buildDaySectionHeader(
  page: PDFPage,
  startY: number,
  isContinuation: boolean,
): number {
  const y = startY - 20;

  page.drawRectangle({
    x: M,
    y: y - 14,
    width: 4,
    height: 18,
    color: C.orange,
    cornerRadius: 2,
  });
  page.drawText(
    isContinuation ? "DAY-BY-DAY PLAN (CONT.)" : "DAY-BY-DAY PLAN",
    {
      x: M + 12,
      y,
      size: 10,
      font: "Helvetica-Bold",
      color: C.navy,
    },
  );

  return y - 18;
}

function getDayCardHeight(lineCount: number, hasDetail: boolean): number {
  if (!hasDetail) {
    return 44;
  }

  return Math.max(60, 34 + lineCount * 13);
}

function drawDayCard(
  page: PDFPage,
  options: {
    title: string;
    lines: Array<{ text: string }>;
    y: number;
    accent: Color;
    muted: boolean;
  },
): number {
  const { title, lines, y, accent, muted } = options;
  const height = getDayCardHeight(lines.length, !muted);
  const boxY = y - height;

  page.drawRectangle({
    x: M,
    y: boxY,
    width: W - M * 2,
    height,
    color: C.white,
    borderColor: C.line,
    borderWidth: 0.75,
    cornerRadius: 8,
  });
  page.drawRectangle({
    x: M,
    y: boxY,
    width: 5,
    height,
    color: accent,
    cornerRadius: 8,
  });

  page.drawText(title, {
    x: M + 16,
    y: y - 18,
    size: 10,
    font: "Helvetica-Bold",
    color: accent,
  });

  page.drawText(lines.map((line) => line.text).join("\n"), {
    x: M + 16,
    y: y - 34,
    size: 9,
    color: muted ? C.muted : C.ink,
    maxWidth: W - M * 2 - 32,
    lineHeight: 13,
  });

  return boxY;
}

function getTextLines(
  text: string,
  font: "Helvetica" | "Helvetica-Bold",
  size: number,
  maxWidth: number,
  lineHeight: number,
): Array<{ text: string }> {
  return layoutText(normalizeText(text), font, size, maxWidth, lineHeight)
    .lines;
}

function normalizeText(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .trim();
}

// ─── Continuation page header (thinner, for pages beyond the first) ─────────
function buildContinuationHeader(
  page: PDFPage,
  logoPaths: SvgPath[],
  itin: Itinerary,
): number {
  // Company strip at the top
  page.drawRectangle({ x: 0, y: 790, width: W, height: 44, color: C.soft });
  page.drawRectangle({ x: 0, y: 834, width: W, height: 8, color: C.green });
  page.drawRectangle({ x: 188, y: 834, width: 160, height: 8, color: C.teal });
  page.drawRectangle({
    x: 348,
    y: 834,
    width: 247,
    height: 8,
    color: C.orange,
  });

  stampLogo(page, logoPaths, M, 836, 0.1, 1);
  page.drawText(COMPANY.name.toUpperCase(), {
    x: M + 68,
    y: 820,
    size: 12,
    font: "Helvetica-Bold",
    color: C.navy,
  });
  page.drawText(`${itin.title} — Continued`, {
    x: M + 68,
    y: 806,
    size: 8.5,
    color: C.muted,
  });

  return 772;
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function buildFooter(page: PDFPage) {
  page.drawRectangle({ x: 0, y: 0, width: W, height: 48, color: C.navy });
  page.drawRectangle({ x: 0, y: 46, width: W / 3, height: 3, color: C.green });
  page.drawRectangle({
    x: W / 3,
    y: 46,
    width: W / 3,
    height: 3,
    color: C.teal,
  });
  page.drawRectangle({
    x: (W * 2) / 3,
    y: 46,
    width: W / 3,
    height: 3,
    color: C.orange,
  });
  page.drawText(COMPANY.name.toUpperCase(), {
    x: M,
    y: 30,
    size: 9,
    font: "Helvetica-Bold",
    color: C.white,
  });
  page.drawText(
    `${COMPANY.phone}  |  ${COMPANY.email}  |  ${COMPANY.website}  |  ${COMPANY.address}`,
    { x: M, y: 12, size: 7, color: C.footerText, maxWidth: W - M * 2 },
  );
}

// ─── Utilities ────────────────────────────────────────────────────────────────
function pdfToBlob(bytes: Uint8Array): Blob {
  const buf = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buf).set(bytes);
  return new Blob([buf], { type: "application/pdf" });
}

async function triggerDownloadOrShare(
  blob: Blob,
  filename: string,
  title: string,
) {
  const file = new File([blob], filename, { type: "application/pdf" });
  if (navigator.canShare?.({ files: [file] })) {
    await navigator.share({ title, files: [file] });
    return;
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .slice(0, 40);
}
