import { type Color, layoutText, PDF, type PDFPage, rgb } from "@libpdf/core";

import type { Itinerary } from "#/features/itineraries/data/schema";

const COMPANY = {
  name: "Lets Go Tour And Travels",
  phone: "+919475682444",
  website: "www.exploreletsgo.com",
  email: "letsgotourandtravels1@gmail.com",
  address: "69, Municipality Complex, K.N. Road, Berhampore, Murshidabad",
};

const W = 595;
const M = 40;
const CONTENT_W = W - M * 2;
const BODY_BOTTOM = 70;

const C = {
  navy: rgb(0.04, 0.14, 0.36),
  teal: rgb(0.04, 0.62, 0.72),
  tealPale: rgb(0.88, 0.97, 1),
  orange: rgb(0.96, 0.47, 0.16),
  orangePale: rgb(1, 0.94, 0.88),
  green: rgb(0.11, 0.66, 0.44),
  gold: rgb(0.95, 0.75, 0.12),
  ink: rgb(0.1, 0.13, 0.18),
  muted: rgb(0.4, 0.45, 0.52),
  line: rgb(0.86, 0.9, 0.95),
  soft: rgb(0.97, 0.98, 1),
  white: rgb(1, 1, 1),
};

const DAY_ACCENTS: Color[] = [C.teal, C.orange, C.green, C.gold];

type SvgPath = { d: string; color: Color };
let logoCache: Promise<SvgPath[]> | null = null;

function getLogoPaths(): Promise<SvgPath[]> {
  logoCache ??= fetch("/logo.svg")
    .then((response) => response.text())
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
  for (const path of paths) {
    page.drawSvgPath(path.d, { x, y, scale, color: path.color, opacity });
  }

  if (!paths.length) {
    page.drawText(COMPANY.name, { x, y, size: 14, color: C.green, opacity });
  }
}

export async function shareItineraryPdf(itinerary: Itinerary) {
  const pdf = PDF.create();
  pdf.setTitle(`${itinerary.title} — Itinerary`);

  const logoPaths = await getLogoPaths();
  let pageNumber = 1;
  let page = pdf.addPage({ size: "a4" });
  let y = buildPageHeader(page, logoPaths, itinerary, pageNumber, false);
  y = drawSummaryCards(page, itinerary, y);

  const finishCurrentPage = () => {
    stampLogo(page, logoPaths, 430, 165, 0.12, 0.04);
    buildFooter(page, pageNumber);
  };

  const nextPage = () => {
    finishCurrentPage();
    pageNumber += 1;
    page = pdf.addPage({ size: "a4" });
    y = buildPageHeader(page, logoPaths, itinerary, pageNumber, true);
  };

  const ensureSpace = (neededHeight: number, continuationLabel: string) => {
    if (y - neededHeight >= BODY_BOTTOM) {
      return;
    }

    nextPage();
    y = drawSectionHeader(page, y, continuationLabel);
  };

  if (itinerary.overview?.trim()) {
    const overviewLines = getTextLines(
      itinerary.overview,
      "Helvetica",
      10,
      CONTENT_W - 24,
      15,
    );

    y = drawSectionHeader(page, y, "Overview");

    let lineIndex = 0;
    while (lineIndex < overviewLines.length) {
      const maxLines = getMaxLinesForBox(y, 15, 24);
      if (maxLines < 1) {
        nextPage();
        y = drawSectionHeader(page, y, "Overview (cont.)");
        continue;
      }

      const chunk = overviewLines.slice(lineIndex, lineIndex + maxLines);
      y = drawTextBox(page, {
        y,
        lines: chunk,
        fontSize: 10,
        lineHeight: 15,
        background: C.tealPale,
        border: C.teal,
        textColor: C.ink,
      });
      y -= 14;
      lineIndex += chunk.length;

      if (lineIndex < overviewLines.length) {
        nextPage();
        y = drawSectionHeader(page, y, "Overview (cont.)");
      }
    }
  }

  y = drawSectionHeader(page, y, "Day-by-Day Plan");

  for (let i = 0; i < itinerary.days; i++) {
    const accent = DAY_ACCENTS[i % DAY_ACCENTS.length];
    const detail = (itinerary.dayDetails ?? [])[i]?.trim() || "";
    const text = detail || `Destination: ${itinerary.destination}`;
    const lines = getTextLines(text, "Helvetica", 9.5, CONTENT_W - 32, 14);

    let lineIndex = 0;
    let continued = false;

    while (lineIndex < lines.length) {
      const title = continued ? `Day ${i + 1} (cont.)` : `Day ${i + 1}`;
      const maxLines = getMaxLinesForBox(y, 14, 38);

      if (maxLines < 1) {
        nextPage();
        y = drawSectionHeader(page, y, "Day-by-Day Plan (cont.)");
        continue;
      }

      const chunk = lines.slice(lineIndex, lineIndex + maxLines);
      const neededHeight = getDayCardHeight(chunk.length);
      ensureSpace(neededHeight, "Day-by-Day Plan (cont.)");

      y = drawDayCard(page, {
        y,
        title,
        lines: chunk,
        accent,
        muted: !detail,
      });
      y -= 10;

      lineIndex += chunk.length;
      continued = true;
    }
  }

  finishCurrentPage();

  const blob = pdfToBlob(await pdf.save());
  await triggerDownloadOrShare(
    blob,
    `itinerary-${itinerary.id}-${slugify(itinerary.title)}.pdf`,
    `${itinerary.title} — Itinerary`,
  );
}

function buildPageHeader(
  page: PDFPage,
  logoPaths: SvgPath[],
  itinerary: Itinerary,
  pageNumber: number,
  continued: boolean,
): number {
  page.drawRectangle({ x: 0, y: 834, width: W / 3, height: 8, color: C.green });
  page.drawRectangle({
    x: W / 3,
    y: 834,
    width: W / 3,
    height: 8,
    color: C.teal,
  });
  page.drawRectangle({
    x: (W * 2) / 3,
    y: 834,
    width: W / 3,
    height: 8,
    color: C.orange,
  });

  page.drawRectangle({ x: 0, y: 786, width: W, height: 42, color: C.soft });
  stampLogo(page, logoPaths, M, 832, 0.09, 1);

  page.drawText(COMPANY.name.toUpperCase(), {
    x: M + 62,
    y: 812,
    size: 12,
    font: "Helvetica-Bold",
    color: C.navy,
  });
  page.drawText(`${COMPANY.phone}  |  ${COMPANY.website}`, {
    x: M + 62,
    y: 798,
    size: 8.5,
    color: C.muted,
  });
  page.drawText(`Page ${pageNumber}`, {
    x: W - M - 60,
    y: 812,
    size: 9,
    font: "Helvetica-Bold",
    color: C.navy,
    maxWidth: 60,
    alignment: "right",
  });

  page.drawText(
    continued ? "TRAVEL ITINERARY (CONTINUED)" : "TRAVEL ITINERARY",
    {
      x: M,
      y: 764,
      size: 8,
      font: "Helvetica-Bold",
      color: C.orange,
    },
  );

  const titleWidth = CONTENT_W;
  let titleSize = 24;
  let titleLineHeight = 30;
  let titleLines = getTextLines(
    itinerary.title,
    "Helvetica-Bold",
    titleSize,
    titleWidth,
    titleLineHeight,
  );

  while (titleLines.length > 3 && titleSize > 18) {
    titleSize -= 2;
    titleLineHeight = titleSize + 6;
    titleLines = getTextLines(
      itinerary.title,
      "Helvetica-Bold",
      titleSize,
      titleWidth,
      titleLineHeight,
    );
  }

  const titleY = 738;
  page.drawText(itinerary.title, {
    x: M,
    y: titleY,
    size: titleSize,
    font: "Helvetica-Bold",
    color: C.navy,
    maxWidth: titleWidth,
    lineHeight: titleLineHeight,
  });

  const titleHeight = titleLines.length * titleLineHeight;
  const metaText = [
    itinerary.destination,
    `${itinerary.days} Days`,
    `${itinerary.nights} Nights`,
    itinerary.price != null
      ? `Price: INR ${Number(itinerary.price).toLocaleString("en-IN")}`
      : "Price: On Request",
  ].join("  •  ");

  const metaLines = getTextLines(metaText, "Helvetica", 10, CONTENT_W, 14);
  const metaY = titleY - titleHeight - 8;
  page.drawText(metaLines.map((line) => line.text).join("\n"), {
    x: M,
    y: metaY,
    size: 10,
    color: C.muted,
    maxWidth: CONTENT_W,
    lineHeight: 14,
  });

  const metaHeight = metaLines.length * 14;
  const dividerY = metaY - metaHeight - 8;
  page.drawRectangle({
    x: M,
    y: dividerY,
    width: CONTENT_W,
    height: 1,
    color: C.line,
  });

  return dividerY - 16;
}

function drawSummaryCards(
  page: PDFPage,
  itinerary: Itinerary,
  startY: number,
): number {
  const gap = 10;
  const cardW = (CONTENT_W - gap * 2) / 3;
  const cardH = 52;
  const y = startY - cardH;

  drawSummaryCard(page, {
    x: M,
    y,
    width: cardW,
    height: cardH,
    label: "Days",
    value: String(itinerary.days),
    accent: C.teal,
    background: C.tealPale,
  });

  drawSummaryCard(page, {
    x: M + cardW + gap,
    y,
    width: cardW,
    height: cardH,
    label: "Nights",
    value: String(itinerary.nights),
    accent: C.orange,
    background: C.orangePale,
  });

  drawSummaryCard(page, {
    x: M + (cardW + gap) * 2,
    y,
    width: cardW,
    height: cardH,
    label: "Price / Person",
    value:
      itinerary.price != null
        ? `INR ${Number(itinerary.price).toLocaleString("en-IN")}`
        : "On Request",
    accent: C.green,
    background: C.soft,
  });

  return y - 18;
}

function drawSummaryCard(
  page: PDFPage,
  options: {
    x: number;
    y: number;
    width: number;
    height: number;
    label: string;
    value: string;
    accent: Color;
    background: Color;
  },
) {
  const { x, y, width, height, label, value, accent, background } = options;

  page.drawRectangle({
    x,
    y,
    width,
    height,
    color: background,
    borderColor: C.line,
    borderWidth: 0.75,
    cornerRadius: 8,
  });
  page.drawRectangle({
    x,
    y: y + height - 4,
    width,
    height: 4,
    color: accent,
    cornerRadius: 8,
  });

  page.drawText(label.toUpperCase(), {
    x: x + 10,
    y: y + height - 17,
    size: 7.5,
    font: "Helvetica-Bold",
    color: accent,
  });
  page.drawText(value, {
    x: x + 10,
    y: y + 10,
    size: value.length > 14 ? 11 : 16,
    font: "Helvetica-Bold",
    color: C.ink,
    maxWidth: width - 20,
    lineHeight: 13,
  });
}

function drawSectionHeader(
  page: PDFPage,
  startY: number,
  title: string,
): number {
  const y = startY - 6;

  page.drawRectangle({
    x: M,
    y: y - 12,
    width: 4,
    height: 16,
    color: C.navy,
    cornerRadius: 2,
  });
  page.drawText(title.toUpperCase(), {
    x: M + 12,
    y,
    size: 10,
    font: "Helvetica-Bold",
    color: C.navy,
  });

  return y - 20;
}

function drawTextBox(
  page: PDFPage,
  options: {
    y: number;
    lines: Array<{ text: string }>;
    fontSize: number;
    lineHeight: number;
    background: Color;
    border: Color;
    textColor: Color;
  },
): number {
  const { y, lines, fontSize, lineHeight, background, border, textColor } =
    options;
  const height = Math.max(44, lines.length * lineHeight + 24);
  const boxY = y - height;

  page.drawRectangle({
    x: M,
    y: boxY,
    width: CONTENT_W,
    height,
    color: background,
    borderColor: border,
    borderWidth: 0.75,
    cornerRadius: 8,
  });
  page.drawText(lines.map((line) => line.text).join("\n"), {
    x: M + 12,
    y: boxY + height - 16,
    size: fontSize,
    color: textColor,
    maxWidth: CONTENT_W - 24,
    lineHeight,
  });

  return boxY;
}

function getDayCardHeight(lineCount: number): number {
  return Math.max(56, lineCount * 14 + 38);
}

function drawDayCard(
  page: PDFPage,
  options: {
    y: number;
    title: string;
    lines: Array<{ text: string }>;
    accent: Color;
    muted: boolean;
  },
): number {
  const { y, title, lines, accent, muted } = options;
  const height = getDayCardHeight(lines.length);
  const boxY = y - height;

  page.drawRectangle({
    x: M,
    y: boxY,
    width: CONTENT_W,
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
    y: y - 35,
    size: 9.5,
    color: muted ? C.muted : C.ink,
    maxWidth: CONTENT_W - 32,
    lineHeight: 14,
  });

  return boxY;
}

function buildFooter(page: PDFPage, pageNumber: number) {
  page.drawRectangle({
    x: M,
    y: 50,
    width: CONTENT_W,
    height: 1,
    color: C.line,
  });
  page.drawText(
    `${COMPANY.phone}  |  ${COMPANY.email}  |  ${COMPANY.website}`,
    {
      x: M,
      y: 32,
      size: 7.5,
      color: C.muted,
      maxWidth: CONTENT_W - 60,
    },
  );
  page.drawText(COMPANY.address, {
    x: M,
    y: 18,
    size: 7.5,
    color: C.muted,
    maxWidth: CONTENT_W - 60,
  });
  page.drawText(`Page ${pageNumber}`, {
    x: W - M - 40,
    y: 25,
    size: 8,
    font: "Helvetica-Bold",
    color: C.navy,
    maxWidth: 40,
    alignment: "right",
  });
}

function getMaxLinesForBox(
  currentY: number,
  lineHeight: number,
  chromeHeight: number,
): number {
  const available = currentY - BODY_BOTTOM - chromeHeight;
  return Math.floor(available / lineHeight);
}

function getTextLines(
  text: string,
  font: "Helvetica" | "Helvetica-Bold",
  size: number,
  maxWidth: number,
  lineHeight: number,
): Array<{ text: string }> {
  const normalized = normalizeText(text);
  if (!normalized) {
    return [{ text: "" }];
  }

  return layoutText(normalized, font, size, maxWidth, lineHeight).lines;
}

function normalizeText(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n")
    .trim();
}

function pdfToBlob(bytes: Uint8Array): Blob {
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  return new Blob([buffer], { type: "application/pdf" });
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
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .slice(0, 40);
}
