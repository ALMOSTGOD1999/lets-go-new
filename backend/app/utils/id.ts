import { init } from '@paralleldrive/cuid2'

/**
 * Generates a collision-resistant unique identifier (CUID) with a configurable length.
 * The default length is set to 24 characters if not specified.
 *
 * @param {number} [length=24] - The desired length of the generated CUID.
 * @returns {string} A unique identifier string with the specified length.
 */
export const cuid = (length: number = 24): string => init({ length })()
