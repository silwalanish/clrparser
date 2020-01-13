import { CFG } from './cfg';
import LRItem from './LRItem';
import { EPSILON } from './interfaces/cfg.interface';
import { formatItem, isSameItem } from './utils/lrItem.utils';

/**
 * Represents the closure given a set of [[LRItem]] and [[CFG]].
 *
 * @export
 * @class LRClosure
 */
export default class LRClosure {
  /**
   * The number of [[LRClosure]] instantiated. Used for naming the closures.
   * 
   * NOTE: Set this to `0` to start name for 0. Else the naming starts continues.
   *
   * @static
   * @type {number}
   * @memberof LRClosure
   */
  public static COUNT: number = 0;

  /**
   * The name of the closure.
   *
   * @private
   * @type {string}
   * @memberof LRClosure
   */
  private _name: string;

  /**
   * CFG to produce closures from.
   *
   * @private
   * @type {CFG}
   * @memberof LRClosure
   */
  private grammer: CFG;
  /**
   * The kernel of the closure.
   *
   * @private
   * @type {LRItem[]}
   * @memberof LRClosure
   */
  private kernel: LRItem[];
  /**
   * The list of [[LRItem]] in the closure.
   *
   * @private
   * @type {LRItem[]}
   * @memberof LRClosure
   */
  private _closure: LRItem[];

  /**
   * A flag to check if the closure is processed (i.e. GOTO has been generated for the closure)
   * 
   * Used while generating [[GotoMap]] in [[ParsingTable]]
   *
   * @type {boolean}
   * @memberof LRClosure
   */
  public processed: boolean;

  /**
   * Creates an instance of LRClosure.
   * 
   * @param {LRItem[]} item Kernel items.
   * @param {CFG} grammer CFG used to generate closure.
   * @memberof LRClosure
   */
  public constructor(item: LRItem[], grammer: CFG) {
    this.kernel = item;
    this.grammer = grammer;
    this._name = 'I' + LRClosure.COUNT++;

    this.processed = false;

    this.genClosure();
  }

  /**
   * Checks if the closure already has the [[LRItem]].
   *
   * @private
   * @param {LRItem} item
   * @returns {boolean}
   * @memberof LRClosure
   */
  private hasItem(item: LRItem): boolean {
    for (let i of this._closure) {
      if (isSameItem(i, item)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Add the [[LRItem]] to closure if not already.
   *
   * @private
   * @param {LRItem} item
   * @returns
   * @memberof LRClosure
   */
  private addItem(item: LRItem) {
    if (this.hasItem(item)) {
      return;
    }
    this._closure.push(item);
  }

  /**
   * Generates the closure for the kernel.
   *
   * @private
   * @memberof LRClosure
   */
  private genClosure() {
    this._closure = [...this.kernel];
    for (let item of this._closure) {
      let { production, dotPos, lookAhead } = item;

      let symbolAfterDot = production.produces[dotPos];
      if (this.grammer.isNonTerminal(symbolAfterDot)) {
        let remainingWord: string[] = production.produces.slice(dotPos + 1, production.produces.length);
        let firstOf: string[] = this.grammer.getFirstOf(remainingWord);
        let EPSILONPos: number = firstOf.indexOf(EPSILON);
        if (EPSILONPos >= 0) {
          firstOf.splice(EPSILONPos, 1);
          firstOf.push(...lookAhead);
        }

        this.grammer.getProduction(symbolAfterDot).forEach(prod => {
          this.addItem(new LRItem(prod, firstOf));
        });
      }
    }
  }

  /**
   * Gets all the reducing states(i.e. dot(`.`) at the end).
   *
   * @returns {LRItem[]} List of LRItem
   * @memberof LRClosure
   */
  public getReducingState(): LRItem[] {
    let reducingStates: LRItem[] = [];
    for (let item of this.closure) {
      if (item.dotPos === item.production.produces.length) {
        reducingStates.push(item);
      }
    }
    return reducingStates;
  }

  /**
   * Checks if the closure has the same kernel as the one provide.
   *
   * @param {LRItem[]} kernel
   * @returns {boolean} True if same kernel.
   * @memberof LRClosure
   */
  public isOfSameKernel(kernel: LRItem[]): boolean {
    for (let itemA of kernel) {
      let hasItem: boolean = false;
      for (let itemB of this.kernel) {
        if (isSameItem(itemA, itemB)) {
          hasItem = true;
        }
      }
      if (!hasItem) {
        return false;
      }
    }
    return true;
  }

  /**
   * Gets the string form of the closure.
   *
   * @returns {string} A string with closure's name and each item separated with newline(`\n`)
   * @memberof LRClosure
   */
  public formatProductions(): string {
    return `${this._name}: ${this._closure.reduce((acc, item) => acc + '\n' + formatItem(item), '')}`;
  }

  /**
   * Gets the HTML form of the closure.
   *
   * @returns {string} A `ul` with the items of closure(formated as string) as list items.
   * @memberof LRClosure
   */
  public formatProductionsHtml(): string {
    return `<ul class='list-group'>${this._closure.reduce(
      (acc, item) => acc + `<li class='list-group-item'>${formatItem(item)}</li>`,
      ''
    )}</ul>`;
  }

  /**
   * Get the name of the closure
   *
   * @readonly
   * @type {string}
   * @memberof LRClosure
   */
  public get name(): string {
    return this._name;
  }

  /**
   * Get the list of [[LRItem]] in the closure
   *
   * @readonly
   * @type {LRItem[]}
   * @memberof LRClosure
   */
  public get closure(): LRItem[] {
    return this._closure;
  }

  /**
   * A helper that returns the name of the closure.
   *
   * @returns {string}
   * @memberof LRClosure
   */
  public toString(): string {
    return this._name;
  }
}
