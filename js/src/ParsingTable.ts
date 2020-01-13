import { CFG } from './CFG';
import LRItem from './LRItem';
import LRClosure from './LRClosure';
import { Production, EPSILON } from './interfaces/cfg.interface';
import { GotoMap, ActionMap, ActionType, ConflictType, IParsingTable } from './interfaces/parsingTable.interface';

/**
 * Error raised when conflict occurs
 *
 * @export
 * @class ConflictError
 * @extends {Error}
 */
export class ConflictError extends Error {
  /**
   * Creates an instance of ConflictError.
   *
   * @param {ConflictType} type Type of conflict that occurred.
   * @memberof ConflictError
   */
  constructor(type: ConflictType) {
    super(type);
  }
}

/**
 * Implementation of CLR(1) parsing table.
 *
 * @export
 * @class ParsingTable
 * @implements {IParsingTable}
 */
export default class ParsingTable implements IParsingTable {
  /**
   * The [[CFG]] used in parsing table.
   *
   * @type {CFG}
   * @memberof ParsingTable
   */
  public readonly grammer: CFG;

  public GOTO: GotoMap;
  public ACTION: ActionMap;
  public startState: LRClosure;

  public states: Array<LRClosure>;

  /**
   * Creates an instance of ParsingTable.
   *
   * @param {CFG} grammer The [[CFG]] whose parsing table to construct
   * @memberof ParsingTable
   */
  public constructor(grammer: CFG) {
    this.GOTO = {};
    this.grammer = grammer;
    this.states = new Array<LRClosure>();

    this.ACTION = {};

    this.genParsingTable();
  }

  /**
   * Checks and returns the [[LRClosure]] for the kernel if already exists, creates new [[LRClosure]] if not.
   *
   * @private
   * @param {LRItem[]} kernel
   * @returns {(LRClosure | null)}
   * @memberof ParsingTable
   */
  private getStateIfExists(kernel: LRItem[]): LRClosure | null {
    for (let state of this.states) {
      if (state.isOfSameKernel(kernel)) {
        return state;
      }
    }
    let len = this.states.push(new LRClosure(kernel, this.grammer));
    return this.states[len - 1];
  }

  /**
   * The goto function of parsing table.
   *
   * Example: `GOTO(I0, 'A') = I1`
   *
   * @throws {ReferenceError} If the symbol is not one of terminal or non terminal in the CFG.
   * @param {LRClosure} state The current state. `I0`
   * @param {string} symbol The input symbol in the CFG. `A`
   * @returns {(LRClosure | null)} The destination state. `I1`
   * @memberof ParsingTable
   */
  public goto(state: LRClosure, symbol: string): LRClosure | null {
    if (this.grammer.isTerminal(symbol) || this.grammer.isNonTerminal(symbol) || symbol === EPSILON) {
      if (this.GOTO[state.name] && this.GOTO[state.name].hasOwnProperty(symbol)) {
        return this.GOTO[state.name][symbol];
      }

      let kernel: LRItem[] = [];
      let hasKernel: boolean;

      for (let item of state.closure) {
        let { production, dotPos } = item;
        let gotoItemProduction: Production = {
          symbol: production.symbol,
          produces: []
        };
        let isKernel: boolean = false;

        let symbolAfterDot = production.produces[dotPos];
        if (symbolAfterDot === symbol) {
          gotoItemProduction.produces = production.produces;
          isKernel = true;
        }

        if (isKernel) {
          kernel.push(new LRItem(gotoItemProduction, item.lookAhead, dotPos + 1));
          hasKernel = true;
        }
      }

      if (!this.GOTO[state.name]) {
        this.GOTO[state.name] = {};
      }
      this.GOTO[state.name][symbol] = hasKernel ? this.getStateIfExists(kernel) : null;

      return this.GOTO[state.name][symbol];
    }
    throw new ReferenceError(`'${symbol}' doesn't belong to the grammer.`);
  }

  /**
   * Generates the [[GotoMap]] of the [[CFG]].
   *
   * @memberof ParsingTable
   */
  public genGoto() {
    this.startState = new LRClosure(
      this.grammer.getProduction(this.grammer.start).map(prod => new LRItem(prod, ['$'])),
      this.grammer
    );
    this.states.push(this.startState);

    let statesStack: LRClosure[] = [this.startState];
    while (statesStack.length > 0) {
      let stackTop = statesStack.pop();

      for (let symbol of [...this.grammer.nonTerms, ...this.grammer.terms]) {
        let state = this.goto(stackTop, symbol);
        if (state) {
          if (!state.processed) {
            statesStack.push(state);
          }
        }
      }

      stackTop.processed = true;
    }
  }

  /**
   * Generates the parsing table of [[CFG]]
   *
   * @memberof ParsingTable
   */
  public genParsingTable() {
    this.genGoto();

    this.states.forEach(state => {
      this.ACTION[state.name] = {};
      state.getReducingState().forEach(item => {
        item.lookAhead.forEach(lookAhead => {
          let action = this.ACTION[state.name][lookAhead];
          if (action && action.actionType === ActionType.REDUCE) {
            throw new ConflictError(ConflictType.RR);
          } else if (action && action.actionType === ActionType.SHIFT) {
            throw new ConflictError(ConflictType.SR);
          }

          if (lookAhead === '$' && item.production.symbol === this.grammer.start) {
            this.ACTION[state.name][lookAhead] = {
              actionType: ActionType.ACCEPT
            };
          } else {
            this.ACTION[state.name][lookAhead] = {
              actionType: ActionType.REDUCE,
              actionValue: item
            };
          }
        });
      });

      for (let term of this.grammer.terms) {
        let goto: LRClosure = this.GOTO[state.name][term];

        if (goto) {
          try {
            let action = this.ACTION[state.name][term];
            if (action.actionType === ActionType.REDUCE) {
              throw new ConflictError(ConflictType.SR);
            }
          } catch (e) {
            if (e instanceof ConflictError) {
              console.log(e);
              continue;
            }
          }

          this.ACTION[state.name][term] = {
            actionType: ActionType.SHIFT,
            actionValue: goto
          };
        }
      }
    });
  }
}
