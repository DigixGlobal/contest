export function arrayify(sample) {
  if (sample === undefined) {
    return [];
  }
  return Array.isArray(sample) ? sample : [sample];
}
