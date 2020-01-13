import LRItem from '../LRItem';
import { isSameProduction } from './cfg.utils';
import { isStringArrayEqual } from './array.utils';

/**
 * Formats the [[LRItem]] to string.
 *
 * @export
 * @param {LRItem} item LRItem to format.
 * @returns {string} The string form of LRItem.
 */
export function formatItem(item: LRItem): string {
  let { production, dotPos, lookAhead } = item;
  return (
    production.symbol +
    '->' +
    production.produces.reduce((acc, c, i) => {
      return acc + (dotPos === i ? '.' : '') + c;
    }, '') +
    (production.produces.length === dotPos ? '.' : '') +
    ', ' +
    lookAhead.join(' | ')
  );
}

/**
 * Checks if two [[LRItem]] are same.
 *
 * @export
 * @param {LRItem} itemA
 * @param {LRItem} itemB
 * @returns {boolean} Returns true if both are same.
 */
export function isSameItem(itemA: LRItem, itemB: LRItem): boolean {
  if (itemA.dotPos === itemB.dotPos) {
    return isSameProduction(itemA.production, itemB.production) && isStringArrayEqual(itemA.lookAhead, itemB.lookAhead);
  }
  return false;
}
