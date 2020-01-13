import { distinctElements } from './utils/array.utils';
import { formatProduction, isEpsilonProduction } from './utils/cfg.utils';
import { CFGDefination, Production, EPSILON } from './interfaces/cfg.interface';

/**
 * A representation context free grammer
 *
 * @export
 * @class CFG
 */
export class CFG {
  /**
   * Start Symbol
   *
   * @private
   * @type {string}
   * @memberof CFG
   */
  private startSymbol: string;
  /**
   * Set of terminals
   *
   * @private
   * @type {string[]}
   * @memberof CFG
   */
  private terminals: string[];
  /**
   * Set of non terminals
   *
   * @private
   * @type {string[]}
   * @memberof CFG
   */
  private nonTerminals: string[];
  /**
   * Array of productions.
   *
   * @private
   * @type {Production[]}
   * @memberof CFG
   */
  private productions: Production[];

  /**
   * Creates an instance of CFG.
   *
   * @param {CFGDefination} defination The FOUR-tuple of CFG
   * @memberof CFG
   */
  public constructor(defination: CFGDefination) {
    const { nonTerminals, terminals, startSymbol, productions } = defination;

    this.terminals = terminals;
    this.nonTerminals = nonTerminals;
    this.startSymbol = startSymbol;

    this.productions = productions.reduce((production, cur): Production[] => {
      if (this.nonTerminals.indexOf(cur.symbol) >= 0) {
        production.push(cur);
      } else {
        console.error(`${cur.symbol} is not in set of non terminals.
         Discarding production ${formatProduction(cur)}`);
      }

      return production;
    }, []);
  }

  /**
   * Checks if the symbol is a terminal of the CFG.
   *
   * @param {string} symbol
   * @returns {boolean}
   * @memberof CFG
   */
  public isTerminal(symbol: string): boolean {
    return this.terminals.indexOf(symbol) >= 0;
  }

  /**
   * Checks if the symbol is a non terminal of the CFG.
   *
   * @param {string} symbol
   * @returns {boolean}
   * @memberof CFG
   */
  public isNonTerminal(symbol: string): boolean {
    return this.nonTerminals.indexOf(symbol) >= 0;
  }

  /**
   * Gets the augmented CFG for the given CFG.
   *
   * @returns {CFG}
   * @memberof CFG
   */
  public getAugmentedCFG(): CFG {
    let productions: Production[] = JSON.parse(JSON.stringify(this.productions));
    productions.push({
      symbol: this.startSymbol + '_',
      produces: [this.startSymbol]
    });

    let augmentedCFG: CFG = new CFG({
      productions,
      terminals: [...this.terminals, '$'],
      startSymbol: this.startSymbol + '_',
      nonTerminals: [...this.nonTerminals, this.startSymbol + '_']
    });

    return augmentedCFG;
  }

  /**
   * Gets all the productions for the symbol.
   *
   * @param {string} symbol
   * @returns {Production[]}
   * @memberof CFG
   */
  public getProduction(symbol: string): Production[] {
    return this.productions.filter(prod => {
      return prod.symbol == symbol;
    });
  }

  /**
   * Returns the FIRSTOF the word.
   *
   * @param {string[]} word Ordered set of symbols of CFG
   * @returns {string[]}
   * @memberof CFG
   */
  public getFirstOf(word: string[]): string[] {
    if (word.length === 0) {
      return [EPSILON];
    }

    let i: number = 0;
    let firstOf: string[] = [];
    let symbol: string = word[i];

    if (this.isTerminal(symbol)) {
      firstOf.push(symbol);
    } else if (this.isNonTerminal(symbol)) {
      let firstOfSymbol: string[] = [];
      while (i < word.length) {
        let productions: Production[] = this.getProduction(symbol);

        for (let production of productions) {
          if (isEpsilonProduction(production)) {
            firstOfSymbol.push(EPSILON);
          } else {
            let produces: string[] = production.produces;
            for (let alpha of produces) {
              let firstOfAlpha = this.getFirstOf([alpha]);
              firstOfSymbol.push(...firstOfAlpha);
              if (firstOfAlpha.indexOf(EPSILON) < 0) {
                break;
              }
            }
          }
        }

        if (firstOfSymbol.indexOf(EPSILON) < 0) {
          break;
        }
        symbol = word[++i];
      }

      firstOf.push(...firstOfSymbol);
    } else {
      throw new ReferenceError(`'${symbol}' doesn't belong to the grammer.`);
    }

    return distinctElements(firstOf);
  }

  /**
   * Get the starting symbol of CFG.
   *
   * @readonly
   * @type {string}
   * @memberof CFG
   */
  public get start(): string {
    return this.startSymbol;
  }

  /**
   * Get the set of terminals of CFG.
   *
   * @readonly
   * @type {string[]}
   * @memberof CFG
   */
  public get terms(): string[] {
    return this.terminals;
  }

  /**
   * Get the set of non terminals of CFG.
   *
   * @readonly
   * @type {string[]}
   * @memberof CFG
   */
  public get nonTerms(): string[] {
    return this.nonTerminals;
  }
}
