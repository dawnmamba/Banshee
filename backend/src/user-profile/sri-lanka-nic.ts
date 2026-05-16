/** Old: 9 digits + V/X; new: 12 digits */
export const SRI_LANKA_NIC_PATTERN = /^(\d{9}[vVxX]|\d{12})$/;

export function isValidSriLankaNic(nic: string): boolean {
  return SRI_LANKA_NIC_PATTERN.test(nic.trim());
}
