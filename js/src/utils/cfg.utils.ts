import { Production, EPSILON } from '../interfaces/cfg.interface';

/**
 * Formats a production to string.
 *
 * Example:
 * ```js
 * {
 *  symbol: "S",
 *  produces: ["a", "A"]
 * }
 * ```
 * is formated as `S->aA`
 *
 * @export
 * @param {Production} production Production to format.
 * @returns {string} The string form of production.
 */
export function formatProduction(production: Production): string {
  return (
    production.symbol +
    '->' +
    production.produces.reduce((acc, c) => {
      return acc + (c === EPSILON ? 'EPSILON' : c);
    }, '')
  );
}

/**
 * Checks if two productions are same.
 *
 * @export
 * @param {Production} productionA
 * @param {Production} productionB
 * @returns {boolean} Returns true if both are same production.
 */
export function isSameProduction(productionA: Production, productionB: Production): boolean {
  if (productionA.symbol === productionB.symbol) {
    return productionA.produces.join('') === productionB.produces.join('');
  }
  return false;
}

/**
 * Checks if the production is a epsilon production(i.e. A->&epsilon;).
 *
 * @export
 * @param {Production} production
 * @returns {boolean} Returns true if epsilon production
 */
export function isEpsilonProduction(production: Production): boolean {
  return production.produces.length === 1 && production.produces[0] === EPSILON;
}
