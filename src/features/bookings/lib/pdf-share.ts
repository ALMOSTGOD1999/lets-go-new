import { type Color, PDF, type PDFPage, rgb } from "@libpdf/core";

import type { Receipt, Voucher } from "#/features/bookings/data/schema";

type BookingContext = {
  id: number;
  tourId: number;
  clientId: number;
  adultCount: number;
  childCount: number;
  adultCost: number;
  childCost: number;
  adultGstPercent: number;
  childGstPercent: number;
  discountAmount: number;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string | null;
  tourName: string;
  tourStartDate: Date | string;
  tourEndDate: Date | string;
  subtotal: number;
  gstTotal: number;
  grossTotal: number;
  finalTotal: number;
  receivedAmount: number;
  balanceAmount: number;
  paymentStatus: string;
};

const COMPANY = {
  name: "Lets Go Tour And Travels",
  phone: "+919475682444",
  website: "www.exploerletsgo.com",
  email: "letsgotourandtravels1@gmail.com",
  address: "69, Municipality Complex, K.N. Road, Berhampore, Murshidabad",
};

const pageSize = { width: 595, height: 842 };
const margin = 42;
const colors = {
  ink: rgb(0.1, 0.13, 0.18),
  muted: rgb(0.36, 0.41, 0.48),
  line: rgb(0.86, 0.9, 0.94),
  blue: rgb(0.02, 0.31, 0.67),
  cyan: rgb(0.08, 0.64, 0.86),
  green: rgb(0.22, 0.72, 0.22),
  orange: rgb(0.96, 0.47, 0.16),
  red: rgb(0.87, 0.18, 0.08),
  soft: rgb(0.96, 0.98, 1),
  white: rgb(1, 1, 1),
};

export async function shareVoucherPdf(
  voucher: Voucher,
  context: BookingContext,
) {
  const blob = await createVoucherPdf(voucher, context);
  await shareOrDownload(blob, `voucher-${voucher.id}.pdf`, "Voucher PDF");
}

export async function shareReceiptPdf(
  receipt: Receipt,
  context: BookingContext,
) {
  const blob = await createReceiptPdf(receipt, context);
  await shareOrDownload(blob, `receipt-${receipt.id}.pdf`, "Receipt PDF");
}

async function createVoucherPdf(voucher: Voucher, context: BookingContext) {
  const pdf = PDF.create();
  pdf.setTitle(`Voucher ${voucher.bookingId || voucher.id}`);
  const page = pdf.addPage({ size: "a4" });
  await drawDocumentShell(page, "Travel Voucher", `Voucher #${voucher.id}`);

  let y = 682;
  drawClientAndTourBlocks(page, context, y);
  y -= 170;

  y = drawSection(page, "Voucher Details", y, [
    ["Booking ID", voucher.bookingId],
    ["Issue Date", formatDate(voucher.date)],
    ["Service Type", voucher.serviceType],
    ["Property / Name", voucher.propertyName],
    ["Address", voucher.address],
    ["Check-in", formatOptionalDate(voucher.checkinDate)],
    ["Check-out", formatOptionalDate(voucher.checkoutDate)],
    ["Sub-booking Type", voucher.subBookingType],
    ["Meal Plan", voucher.meal],
    ["Payment", voucher.payment],
    ["Confirmed By", voucher.confirmedBy],
    ["Service Contact", voucher.serviceContact],
    ["Confirmer Contact", voucher.confirmerContact],
  ]);

  drawSignature(page, y - 14, "Signature");
  drawFooter(page);
  return pdfToBlob(await pdf.save());
}

async function createReceiptPdf(receipt: Receipt, context: BookingContext) {
  const pdf = PDF.create();
  pdf.setTitle(`Receipt ${receipt.id}`);
  const page = pdf.addPage({ size: "a4" });
  await drawDocumentShell(page, "Payment Receipt", `Receipt #${receipt.id}`);

  let y = 682;
  drawClientAndTourBlocks(page, context, y, "Received From");
  y -= 170;

  y = drawSection(page, "Payment Details", y, [
    ["Receipt / Invoice No.", String(receipt.id)],
    ["Payment Date", formatDate(receipt.date)],
    ["Amount Received", formatCurrency(receipt.amount)],
    ["Payment Method", receipt.method],
    ["Method Info", receipt.methodInfo],
    ["Travellers", travellerCount(context)],
    ["Total Paid", formatCurrency(context.receivedAmount)],
    ["Due Amount", formatCurrency(Math.max(context.balanceAmount, 0))],
    ["Payment Status", titleCase(context.paymentStatus)],
  ]);

  y = drawSection(page, "Booking Summary", y - 8, [
    ["Subtotal", formatCurrency(context.subtotal)],
    ["GST Total", formatCurrency(context.gstTotal)],
    ["Gross Total", formatCurrency(context.grossTotal)],
    ["Discount", formatCurrency(context.discountAmount)],
    ["Final Total", formatCurrency(context.finalTotal)],
  ]);

  drawSignature(page, 76, "Signature");
  drawFooter(page);
  return pdfToBlob(await pdf.save());
}

async function drawDocumentShell(page: PDFPage, title: string, number: string) {
  drawTravelHeader(page, title, number);
  // y=791: SVG centre (~y=245) lands at PDF y=764 — same as company name baseline.
  // The active logo content sits at PDF y=742–786, squarely beside the company block.
  drawLogoPaths(page, await fetchLogoPaths(), 42, 791, 0.11, 0.95);
  drawLogoPaths(page, await fetchLogoPaths(), 158, 238, 0.52, 0.06);
  page.drawText(COMPANY.name, {
    x: 118,
    y: 764,
    size: 20,
    font: "Helvetica-Bold",
    color: colors.ink,
  });
  page.drawText(`${COMPANY.phone}  |  ${COMPANY.website}`, {
    x: 118,
    y: 744,
    size: 9.5,
    color: colors.muted,
  });
  page.drawText(COMPANY.email, {
    x: 118,
    y: 730,
    size: 9.5,
    color: colors.muted,
  });
  page.drawText(COMPANY.address, {
    x: 118,
    y: 716,
    size: 9.5,
    color: colors.muted,
    maxWidth: 270,
  });
}

function drawTravelHeader(page: PDFPage, title: string, number: string) {
  page.drawRectangle({
    x: 0,
    y: 790,
    width: pageSize.width,
    height: 52,
    color: colors.soft,
  });
  page.drawRectangle({
    x: 0,
    y: 790,
    width: pageSize.width,
    height: 7,
    color: colors.green,
  });
  page.drawRectangle({
    x: 178,
    y: 790,
    width: 170,
    height: 7,
    color: colors.cyan,
  });
  page.drawRectangle({
    x: 348,
    y: 790,
    width: 247,
    height: 7,
    color: colors.orange,
  });
  page.drawText(title.toUpperCase(), {
    x: 384,
    y: 760,
    size: 20,
    font: "Helvetica-Bold",
    color: colors.blue,
  });
  page.drawText(number, { x: 420, y: 738, size: 11, color: colors.muted });
}

function drawClientAndTourBlocks(
  page: PDFPage,
  context: BookingContext,
  y: number,
  clientHeading = "Client Details",
) {
  drawInfoCard(page, margin, y - 118, 244, 126, clientHeading, [
    ["Name", context.clientName],
    ["Email", context.clientEmail],
    ["Phone", context.clientPhone],
    ["Address", context.clientAddress],
  ]);
  drawInfoCard(page, 309, y - 118, 244, 126, "Tour Summary", [
    ["Tour", context.tourName],
    [
      "Travel Dates",
      `${formatDate(context.tourStartDate)} - ${formatDate(context.tourEndDate)}`,
    ],
    ["Travellers", travellerCount(context)],
    ["Total Amount", formatCurrency(context.finalTotal)],
    ["Balance Due", formatCurrency(Math.max(context.balanceAmount, 0))],
  ]);
}

function drawInfoCard(
  page: PDFPage,
  x: number,
  y: number,
  width: number,
  height: number,
  title: string,
  rows: Array<[string, unknown]>,
) {
  page.drawRectangle({
    x,
    y,
    width,
    height,
    color: rgb(0.99, 1, 1),
    borderColor: colors.line,
    borderWidth: 1,
    cornerRadius: 10,
  });
  page.drawText(title, {
    x: x + 14,
    y: y + height - 24,
    size: 12,
    font: "Helvetica-Bold",
    color: colors.blue,
  });
  let lineY = y + height - 44;
  for (const [label, value] of rows.filter(([, value]) => hasValue(value))) {
    page.drawText(`${label}:`, {
      x: x + 14,
      y: lineY,
      size: 8.5,
      color: colors.muted,
    });
    page.drawText(String(value), {
      x: x + 74,
      y: lineY,
      size: 9.5,
      color: colors.ink,
      maxWidth: width - 88,
      lineHeight: 11,
    });
    lineY -= 18;
  }
}

function drawSection(
  page: PDFPage,
  title: string,
  y: number,
  rows: Array<[string, unknown]>,
) {
  const visibleRows = rows.filter(([, value]) => hasValue(value));
  const rowHeight = 24;
  const tableWidth = pageSize.width - margin * 2;
  page.drawText(title, {
    x: margin,
    y,
    size: 14,
    font: "Helvetica-Bold",
    color: colors.blue,
  });
  let rowY = y - 32;
  for (const [index, [label, value]] of visibleRows.entries()) {
    page.drawRectangle({
      x: margin,
      y: rowY - 7,
      width: tableWidth,
      height: rowHeight,
      color: index % 2 === 0 ? rgb(0.98, 0.99, 1) : colors.white,
      borderColor: colors.line,
      borderWidth: 0.5,
    });
    page.drawText(label, {
      x: margin + 12,
      y: rowY,
      size: 9.5,
      font: "Helvetica-Bold",
      color: colors.muted,
    });
    page.drawText(String(value), {
      x: margin + 166,
      y: rowY,
      size: 10,
      color: colors.ink,
      maxWidth: tableWidth - 184,
      lineHeight: 12,
    });
    rowY -= rowHeight;
  }
  return rowY;
}

function drawSignature(page: PDFPage, y: number, label: string) {
  page.drawLine({
    start: { x: 370, y },
    end: { x: 535, y },
    color: colors.line,
    thickness: 1,
  });
  page.drawText(label, { x: 398, y: y - 16, size: 9.5, color: colors.muted });
}

function drawFooter(page: PDFPage) {
  page.drawLine({
    start: { x: margin, y: 42 },
    end: { x: pageSize.width - margin, y: 42 },
    color: colors.line,
  });
  page.drawText(`${COMPANY.name} | ${COMPANY.phone} | ${COMPANY.email}`, {
    x: margin,
    y: 24,
    size: 8.5,
    color: colors.muted,
    maxWidth: pageSize.width - margin * 2,
    alignment: "center",
  });
}

type SvgPath = { d: string; color: Color };
let logoPathPromise: Promise<SvgPath[]> | null = null;

function fetchLogoPaths() {
  logoPathPromise ??= fetch("/logo.svg")
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
  return logoPathPromise;
}

function drawLogoPaths(
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
    page.drawText(COMPANY.name, {
      x,
      y,
      size: 18,
      color: colors.green,
      opacity,
    });
  }
}

async function shareOrDownload(blob: Blob, filename: string, title: string) {
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

function pdfToBlob(bytes: Uint8Array) {
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  return new Blob([buffer], { type: "application/pdf" });
}

function hasValue(value: unknown) {
  return value !== null && value !== undefined && String(value).trim() !== "";
}

function travellerCount(context: BookingContext) {
  const adults = `${context.adultCount} adult${context.adultCount === 1 ? "" : "s"}`;
  const children = context.childCount
    ? `, ${context.childCount} child${context.childCount === 1 ? "" : "ren"}`
    : "";
  return `${adults}${children}`;
}

function formatCurrency(value: number) {
  return `INR ${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(value)}`;
}

function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(
    new Date(value),
  );
}

function formatOptionalDate(value: Date | string | null) {
  return value ? formatDate(value) : null;
}

function titleCase(value: string) {
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
}
