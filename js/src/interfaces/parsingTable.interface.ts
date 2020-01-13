import { CFG } from '../CFG';
import LRClosure from '../LRClosure';

/**
 * A entry of [[GotoMap]].
 * 
 * It is a key-value pair with grammer symbol as key and [[LRClosure]] as value where
 * value is the lr item to go to for associated lr item(i).
 * 
 * `GOTO(i, key) = value`
 *
 * @export
 * @interface GotoMapEntry
 */
export interface GotoMapEntry {
  [symbol: string]: LRClosure | null;
}

/**
 * The GOTO map for the lr items.
 * 
 * It is a key-value pair with state name as key and [[GotoMapEntry]] as value.
 *
 * Example:
 * `GOTO('i0', 'A') = 'i1'`
 * ```js
 * {
 *  "i0": {
 *    "A": LRClosure,
 *    ...
 *  }
 * }
 * ```
 * @export
 * @interface GotoMap
 */
export interface GotoMap {
  [stateName: string]: GotoMapEntry;
}

/**
 * Types of Conflict
 *
 * @export
 * @enum {number}
 */
export enum ConflictType {
  /**
   * Shift-Reduce conflict.
   */
  SR = 'SR CONFLICT',
  /**
   * Reduce-Reduce conflict.
   */
  RR = 'RR CONFLICT'
}

/**
 * Types of actions available.
 *
 * @export
 * @enum {string}
 */
export enum ActionType {
  /**
   * Represents SHIFT action. The parser performs a SHIFT action.
   */
  SHIFT = 'SHIFT',
  /**
   * Represents REDUCE action. The parser performs a REDUCE action.
   */
  REDUCE = 'REDUCE',
  /**
   * Represents ERROR action. The parser performs a ERROR action.
   */
  ERROR = 'ERROR',
  /**
   * Represents ACCEPT action. The parser performs a ACCEPT action.
   */
  ACCEPT = 'ACCEPT'
}

/**
 * Represents what kind of action to taken and the store value for action.
 *
 * @export
 * @interface ActionEntry
 */
export interface ActionEntry {
  /**
   * The type of action to take.
   *
   * @type {ActionType}
   * @memberof ActionEntry
   */
  actionType: ActionType;
  /**
   * The extra value associated to the action.
   *
   * @type {*}
   * @memberof ActionEntry
   */
  actionValue?: any;
}

/**
 * A entry of [[ActionMap]].
 *
 * It is a key-value pair with the grammer symbol as key and [[ActionEntry]] as value.
 * Represents what action to take when the parser sees the grammer symbol as input
 * in key for the state this entry is associated to.
 *
 * @export
 * @interface ActionMapEntry
 */
export interface ActionMapEntry {
  [symbol: string]: ActionEntry;
}

/**
 * The Action map for a state.
 *
 * It is a key-value pair with the state name as key and the [[ActionMapEntry]] as it's value.
 *
 * Example:
 * ```js
 * {
 *  "i0": {
 *    "a": ActionEntry,
 *    "A": ActionEntry
 *    ...
 *  }
 * }
 * ```
 * @export
 * @interface ActionMap
 */
export interface ActionMap {
  [stateName: string]: ActionMapEntry;
}

/**
 * A defination for a LR parsing table.
 *
 * @export
 * @interface IParsingTable
 */
export interface IParsingTable {
  /**
   * The starting LR item.
   *
   * @type {LRClosure}
   * @memberof IParsingTable
   */
  startState: LRClosure;
  /**
   * The list of all LR items.
   *
   * @type {LRClosure[]}
   * @memberof IParsingTable
   */
  states: LRClosure[];
  /**
   * The ACTION part of the parsing table.
   *
   * @type {ActionMap}
   * @memberof IParsingTable
   */
  ACTION: ActionMap;
  /**
   * The GOTO part of the parsing table.
   *
   * @type {GotoMap}
   * @memberof IParsingTable
   */
  GOTO: GotoMap;
  /**
   * The augmented grammer whose parsing table is being constructed.
   *
   * @type {CFG}
   * @memberof IParsingTable
   */
  grammer: CFG;
}
