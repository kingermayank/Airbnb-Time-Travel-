/**
 * Shared booking pricing: single source of truth for listing detail,
 * confirmation/payment, and securing arrival window.
 * All amounts computed in USD then converted to BTC for display.
 */

import type { Listing } from '../types/database';

export const BTC_RATE = 0.000012;

/** Fixed USD add-on when "Peace of mind" / insurance is selected */
export const INSURANCE_FEE_USD = 5;

export type DurationMultiplier = 0.5 | 1 | 4 | 9;

export interface BookingPricingInput {
  listing: Pick<
    Listing,
    | 'price_per_night'
    | 'service_fee_percent'
    | 'cleaning_fee'
    | 'occupancy_tax_percent'
  >;
  durationMultiplier: number;
  insuranceSelected?: boolean;
}

export interface BookingPricingResult {
  /** USD amounts (for createBooking and consistency) */
  baseFareUsd: number;
  serviceFeeUsd: number;
  cleaningFeeUsd: number;
  occupancyTaxUsd: number;
  insuranceUsd: number;
  totalUsd: number;
  /** BTC display values (same rate everywhere) */
  baseBtc: string;
  serviceBtc: string;
  cleaningBtc: string;
  occupancyTaxBtc: string;
  insuranceBtc: string;
  totalBtc: string;
}

function usdToBtc(usd: number): string {
  return (usd * BTC_RATE).toFixed(6);
}

/**
 * Compute booking pricing from listing, duration, and optional insurance.
 * Used by ListingDetailPage and ConfirmationPage so totals match.
 */
export function computeBookingPricing({
  listing,
  durationMultiplier,
  insuranceSelected = false,
}: BookingPricingInput): BookingPricingResult {
  const baseFareUsd = listing.price_per_night * durationMultiplier;
  const serviceFeeUsd = baseFareUsd * ((listing.service_fee_percent ?? 12) / 100);
  const cleaningFeeUsd = listing.cleaning_fee ?? 50;
  const occupancyTaxUsd = baseFareUsd * ((listing.occupancy_tax_percent ?? 8) / 100);
  const insuranceUsd = insuranceSelected ? INSURANCE_FEE_USD : 0;
  const totalUsd =
    baseFareUsd + serviceFeeUsd + cleaningFeeUsd + occupancyTaxUsd + insuranceUsd;

  return {
    baseFareUsd,
    serviceFeeUsd,
    cleaningFeeUsd,
    occupancyTaxUsd,
    insuranceUsd,
    totalUsd,
    baseBtc: usdToBtc(baseFareUsd),
    serviceBtc: usdToBtc(serviceFeeUsd),
    cleaningBtc: usdToBtc(cleaningFeeUsd),
    occupancyTaxBtc: usdToBtc(occupancyTaxUsd),
    insuranceBtc: usdToBtc(insuranceUsd),
    totalBtc: usdToBtc(totalUsd),
  };
}
