/**
 * Get's the distinct elements in a array of stings.
 *
 * Example:
 * ```js
 * let a = ['a', 'b', 'a'];
 * distinctElements(a); // Returns ['a', 'b']
 * ```
 * @export
 * @param {string[]} arrayA Input array
 * @returns {string[]} Array of strings with distinct elements from input array
 */
export function distinctElements(arrayA: string[]): string[] {
  let distinctArray: string[] = [];
  for (let a of arrayA) {
    if (distinctArray.indexOf(a) < 0) {
      distinctArray.push(a);
    }
  }
  return distinctArray;
}

/**
 * Checks if two array of strings are equal (i.e. have all same values).
 *
 * Example:
 * ```js
 * let a = ['A', 'B'];
 * let b = ['B', 'A'];
 * isStringArrayEqual(a, b); // Returns true
 * ```
 * @export
 * @param {string[]} arrayA
 * @param {string[]} arrayB
 * @returns {boolean} True if both have same values
 */
export function isStringArrayEqual(arrayA: string[], arrayB: string[]): boolean {
  if (arrayA.length === arrayB.length) {
    for (let a of arrayA) {
      if (arrayB.indexOf(a) < 0) {
        return false;
      }
    }
    return true;
  }
  return false;
}
