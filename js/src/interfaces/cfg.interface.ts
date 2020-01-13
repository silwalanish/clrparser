export const EPSILON: string = '\u03B5';

/**
 * Represents a production in grammer.
 *
 * Example:
 * S -> aA can be represented as
 * ```js
 * {
 *  symbol: "S",
 *  produces: ["a", "A"]
 * }
 * ```
 *
 * @export
 * @interface Production
 */
export interface Production {
  /**
   * The non terminal whose production it is.
   *
   * @type {string}
   * @memberof Production
   */
  symbol: string;
  /**
   * The ordered array of symbols that are produced in the production.
   *
   * @type {string[]}
   * @memberof Production
   */
  produces: string[];
}

/**
 * A context free grammer defination.
 *
 * Example:
 * A CFG G=({S}, {a}, {
 *  S -> aS | S
 * }, S)
 * can be represented as:
 *
 * ```js
 * {
 *  nonTerminals: ["S"],
 *  terminals: ["a"],
 *  startSymbol: ["S"],
 *  productions: [
 *    {
 *      symbol: ["S"],
 *      produces: ["a", "S"]
 *    },
 *    {
 *      symbol: ["S"],
 *      produces: ["a"]
 *    },
 *    ...
 *  ]
 * }
 * ```
 *
 * @export
 * @interface CFGDefination
 */
export interface CFGDefination {
  /**
   * Set of non terminals of grammer.
   *
   * @type {string[]}
   * @memberof CFGDefination
   */
  nonTerminals: string[];
  /**
   * Set of terminals of grammer.
   *
   * @type {string[]}
   * @memberof CFGDefination
   */
  terminals: string[];
  /**
   * The start symbol of grammer.
   *
   * @type {string}
   * @memberof CFGDefination
   */
  startSymbol: string;
  /**
   * The array of productions of grammer.
   *
   * @type {Production[]}
   * @memberof CFGDefination
   */
  productions: Production[];
}
