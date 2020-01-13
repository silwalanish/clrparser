import { formatProduction } from './utils/cfg.utils';
import { Production } from './interfaces/cfg.interface';

/**
 * Represents a LR(1) Item
 *
 * @export
 * @class LRItem
 */
export default class LRItem {
  /**
   * The dot (ZERO based) position in the production. 
   *
   * @type {number}
   * @memberof LRItem
   */
  public dotPos: number;
  /**
   * The production for LR(1) item
   *
   * @type {Production}
   * @memberof LRItem
   */
  public production: Production;
  /**
   * The list of look ahead symbols.
   *
   * @type {string[]}
   * @memberof LRItem
   */
  public lookAhead: string[];

  /**
   * Creates an instance of LRItem.
   * 
   * @param {Production} production Production of LRItem
   * @param {string[]} lookAhead List of look ahead symbols
   * @param {number} [dotPos=0] Position of dot in production(Default = 0)
   * @memberof LRItem
   */
  public constructor(production: Production, lookAhead: string[], dotPos: number = 0) {
    this.lookAhead = lookAhead;
    this.production = production;
    this.dotPos = Math.floor(dotPos);
  }

  /**
   * A helper that returns the string form of the [[LRItem]]
   *
   * @returns {string}
   * @memberof LRItem
   */
  public toString(): string{
    return formatProduction(this.production);
  }
}
