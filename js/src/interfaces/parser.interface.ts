import { ActionEntry } from './parsingTable.interface';

/**
 * Represents a state of parser in a single pass.
 *
 * @export
 * @interface ParsingLog
 */
export interface ParsingLog {
  /**
   * The symbol at the top of the parsing stack at the start of the pass.
   *
   * @type {string}
   * @memberof ParsingLog
   */
  tos: string;
  /**
   * The parsing stack
   *
   * @type {string[]}
   * @memberof ParsingLog
   */
  stack: string[];
  /**
   * The action taken in the pass.
   *
   * @type {ActionEntry}
   * @memberof ParsingLog
   */
  action: ActionEntry;
  /**
   * The input buffer from the location of input buffer pointer to the end.
   *
   * @type {string}
   * @memberof ParsingLog
   */
  inputBuffer: string;
}
