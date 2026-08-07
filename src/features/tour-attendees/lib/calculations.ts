import type {
  PaymentStatus,
  TourAttendeeBilling,
} from "#/features/tour-attendees/data/schema";

type AttendeePricingInput = {
  adultCount: number;
  childCount: number;
  adultCost: number;
  childCost: number;
  adultGstPercent: number;
  childGstPercent: number;
  discountAmount: number;
  receivedAmount?: number | null;
};

export function calculateAttendeeBilling(
  attendee: AttendeePricingInput,
): TourAttendeeBilling {
  const adultBase = attendee.adultCost * attendee.adultCount;
  const childBase = attendee.childCost * attendee.childCount;
  const adultGstAmount = Math.round(
    (adultBase * attendee.adultGstPercent) / 100,
  );
  const childGstAmount = Math.round(
    (childBase * attendee.childGstPercent) / 100,
  );
  const subtotal = adultBase + childBase;
  const gstTotal = adultGstAmount + childGstAmount;
  const grossTotal = subtotal + gstTotal;
  const finalTotal = grossTotal - attendee.discountAmount;
  const receivedAmount = roundMoney(attendee.receivedAmount ?? 0);
  const balanceAmount = roundMoney(finalTotal - receivedAmount);

  return {
    adultBase,
    childBase,
    adultGstAmount,
    childGstAmount,
    subtotal,
    gstTotal,
    grossTotal,
    finalTotal,
    receivedAmount,
    balanceAmount,
    paymentStatus: getPaymentStatus(finalTotal, receivedAmount),
  };
}

function getPaymentStatus(
  finalTotal: number,
  receivedAmount: number,
): PaymentStatus {
  if (Math.abs(receivedAmount) < 0.005) {
    return "unpaid";
  }

  if (receivedAmount < finalTotal - 0.005) {
    return "partial";
  }

  if (Math.abs(receivedAmount - finalTotal) < 0.005) {
    return "paid";
  }

  return "overpaid";
}

function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}
