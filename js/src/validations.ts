import { formatProduction } from './utils/cfg.utils';
import { Production } from './interfaces/cfg.interface';

/**
 * Focus the input element whose id is given.
 *
 * @export
 * @param {string} id Id of input field
 */
export function setFocus(id: string): void {
  let inputElem = document.getElementById(id) as HTMLInputElement;
  inputElem.focus();
}

/**
 * Clears the error for the input id.
 *
 * Note: the error label has a id with `-error` appended to input's id
 *
 * @export
 * @param {string} id Id of input field
 */
export function clearError(id: string): void {
  setError(id, '');
}

/**
 * Set's error of input field with message provided.
 *
 * @export
 * @param {string} id Id of input field
 * @param {string} msg Error message
 */
export function setError(id: string, msg: string): void {
  let errorElem = document.getElementById(id + '-error');
  errorElem.textContent = msg;

  setFocus(id);
}

/**
 * Validate and parse value of input field as json.
 * Set's error to field if can not parse.
 *
 * @export
 * @param {string} id Id of input field
 * @returns {*} Parsed JSON value
 */
export function validateAndParse(id: string): any {
  let inputElem = document.getElementById(id) as HTMLInputElement;

  let parsed;
  let value = inputElem.value.trim();
  try {
    clearError(id);
    if (value.length <= 0) {
      throw new Error();
    }
    parsed = JSON.parse(value);
  } catch (e) {
    setError(id, 'Please enter valid value.');

    console.log(e);
    return false;
  }

  return parsed;
}

/**
 * Validates if the provide terminals are valid i.e. Array
 *
 * @export
 * @param {*} terminals Terminals to validate.
 * @returns {boolean} True if terminals are Array.
 */
export function validateTerminals(terminals: any): boolean {
  if (!(terminals instanceof Array)) {
    setError('terminals-input', 'Terminals must be a valid array of strings. e.g. ["c", "d"]');
    return false;
  }

  return true;
}

/**
 * Validates if the provide non terminals are valid i.e. Array
 *
 * @export
 * @param {*} nonTerminals Non terminals to validate.
 * @returns {boolean} True if terminals are Array.
 */
export function validateNonTerminals(nonTerminals): boolean {
  if (!(nonTerminals instanceof Array)) {
    setError('non-terminals-input', 'Non terminals must be a valid array of strings. e.g. ["S", "C"]');
    return false;
  }

  return true;
}

/**
 * Validates if start symbol is a string and it belongs to the set of non terminals.
 *
 * @export
 * @param {*} startSymbol Start symbol.
 * @param {*} nonTerminals Set of non terminals.
 * @returns {boolean} True if staisfies
 */
export function validateStartTerminal(startSymbol: any, nonTerminals: string[]): boolean {
  if (!(typeof startSymbol == 'string')) {
    setError('start-terminal-input', 'Start symbol must be a valid string e.g "S".');
    return false;
  }

  if (nonTerminals.indexOf(startSymbol) < 0) {
    setError('start-terminal-input', 'Start symbol must be a non terminal.');
    return false;
  }

  return true;
}

/**
 * Validates if all productions start with non terminals(that belongs to the set of non terminals) 
 * and has productions that has symbols form set of terminals and non terminals only
 *
 * @export
 * @param {Production[]} productions Array of productions.
 * @param {string[]} nonTerminals Set of non terminals.
 * @param {string[]} terminals Set of terminals.
 * @returns {boolean} True if satisfies.
 */
export function validateProductions(productions: Production[], nonTerminals: string[], terminals: string[]): boolean {
  for (let prod of productions) {
    let { symbol, produces } = prod;

    if (nonTerminals.indexOf(symbol) < 0) {
      setError('productions-input', `${symbol} is not a non terminal but has a production ${formatProduction(prod)}.`);
      return false;
    } else if (terminals.indexOf(symbol) >= 0) {
      setError('productions-input', `${symbol} is a terminal but has a production ${formatProduction(prod)}.`);
      return false;
    }

    for (let c of produces) {
      if (terminals.indexOf(c) < 0 && nonTerminals.indexOf(c) < 0) {
        setError(
          'productions-input',
          `${c} is neither a terminal nor a non terminal found in ${formatProduction(prod)}.`
        );
        return false;
      }
    }
  }

  return true;
}
