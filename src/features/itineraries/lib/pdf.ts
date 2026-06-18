import { type Color, PDF, type PDFPage, rgb } from "@libpdf/core";

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
  const page = pdf.addPage({ size: "a4" });
  const logoPaths = await getLogoPaths();

  let y = buildHeader(page, logoPaths, itinerary);
  y = buildStatsRow(page, itinerary, y);
  if (itinerary.overview?.trim()) {
    y = buildOverview(page, itinerary.overview, y);
  }
  buildDayPlan(page, itinerary, y);
  // Faint watermark logo in the body
  stampLogo(page, logoPaths, 168, 268, 0.5, 0.04);
  buildFooter(page);

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
  page.drawText(itin.title, {
    x: M,
    y: 752,
    size: 24,
    font: "Helvetica-Bold",
    color: C.white,
    maxWidth: 360,
    lineHeight: 30,
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
function buildOverview(
  page: PDFPage,
  overview: string,
  startY: number,
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
  page.drawText("OVERVIEW", {
    x: M + 12,
    y,
    size: 10,
    font: "Helvetica-Bold",
    color: C.navy,
  });

  const estLines = Math.ceil(overview.length / 82);
  const boxH = Math.max(40, Math.min(estLines * 14 + 22, 90));
  const boxY = y - 18 - boxH;

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
  page.drawText(overview, {
    x: M + 14,
    y: boxY + boxH - 16,
    size: 9.5,
    color: C.ink,
    maxWidth: W - M * 2 - 28,
    lineHeight: 14,
  });

  return boxY - 14;
}

// ─── Day plan ─────────────────────────────────────────────────────────────────
function buildDayPlan(page: PDFPage, itin: Itinerary, startY: number): void {
  let y = startY - 20;
  const details = itin.dayDetails ?? [];
  const hasDetails = details.some((d) => d?.trim());

  page.drawRectangle({
    x: M,
    y: y - 14,
    width: 4,
    height: 18,
    color: C.orange,
    cornerRadius: 2,
  });
  page.drawText("DAY-BY-DAY PLAN", {
    x: M + 12,
    y,
    size: 10,
    font: "Helvetica-Bold",
    color: C.navy,
  });
  y -= 28;

  // Row height: 40px if there are any details (room for 1 detail line), 28px otherwise
  const ROW_H = hasDetails ? 40 : 28;
  const DOT_R = 10;
  const dotCx = M + DOT_R;
  const maxRows = Math.min(itin.days, hasDetails ? 7 : 9);

  for (let i = 0; i < maxRows; i++) {
    const rowY = y - i * (ROW_H + 4);
    if (rowY - ROW_H < 88) break;

    const accent = DAY_ACCENTS[i % DAY_ACCENTS.length];
    const rowBg = i % 2 === 0 ? C.soft : C.white;
    const detail = details[i]?.trim() || null;

    // Row background
    page.drawRectangle({
      x: M,
      y: rowY - ROW_H,
      width: W - M * 2,
      height: ROW_H,
      color: rowBg,
      borderColor: C.line,
      borderWidth: 0.5,
      cornerRadius: 4,
    });

    // Day dot (circle)
    const dotTopY = rowY - ROW_H / 2 - DOT_R;
    page.drawRectangle({
      x: dotCx - DOT_R,
      y: dotTopY,
      width: DOT_R * 2,
      height: DOT_R * 2,
      color: accent,
      cornerRadius: DOT_R,
    });
    page.drawText(String(i + 1), {
      x: dotCx - (i + 1 >= 10 ? 5.5 : 3),
      y: dotTopY + 3,
      size: 8,
      font: "Helvetica-Bold",
      color: C.white,
    });

    // Connector line between dots
    if (i < maxRows - 1) {
      page.drawLine({
        start: { x: dotCx, y: rowY - ROW_H },
        end: { x: dotCx, y: rowY - ROW_H - 4 },
        color: C.line,
        thickness: 1.5,
      });
    }

    // "Day N" label — upper half of row
    const labelY = hasDetails ? rowY - 12 : rowY - ROW_H / 2 + 4;
    page.drawText(`Day ${i + 1}`, {
      x: M + 28,
      y: labelY,
      size: 9.5,
      font: "Helvetica-Bold",
      color: accent,
    });

    if (detail) {
      // Detail text — lower half of row
      page.drawText(detail, {
        x: M + 28,
        y: rowY - ROW_H + 8,
        size: 8.5,
        color: C.ink,
        maxWidth: W - M - 70,
        lineHeight: 11,
      });
    } else {
      // Destination as subtle subtitle on same line
      page.drawText(itin.destination, {
        x: M + 86,
        y: labelY,
        size: 8.5,
        color: C.muted,
      });
    }
  }

  if (itin.days > maxRows) {
    const remainY = y - maxRows * (ROW_H + 4);
    if (remainY > 88) {
      page.drawText(`... and ${itin.days - maxRows} more days`, {
        x: M + 28,
        y: remainY + 4,
        size: 8.5,
        color: C.muted,
      });
    }
  }
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
