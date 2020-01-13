import Parser from '../Parser';
import LRClosure from '../LRClosure';
import { formatItem } from './lrItem.utils';
import generateTable, { TableHeading } from './tables.utils';
import { IParsingTable, ActionType } from '../interfaces/parsingTable.interface';

/**
 * Creates a HTMLTable for all the lr items.
 *
 * @export
 * @param {HTMLElement} lrItemsTableContainer Container for HTMLTable.
 * @param {LRClosure[]} lrClosures The list of lr items.
 */
export function showLRItemsTable(lrItemsTableContainer: HTMLElement, lrClosures: LRClosure[]) {
  let headers: TableHeading[] = [
    {
      title: 'STATES',
      key: 'state'
    },
    {
      title: 'CLOSURE',
      key: 'closure'
    }
  ];

  let body = lrClosures.map(lrClosure => {
    return {
      state: lrClosure.name,
      closure: lrClosure.closure.map(item => {
        return formatItem(item);
      })
    };
  });

  lrItemsTableContainer.appendChild(generateTable(headers, body));
}

/**
 * Creates a HTMLTable for parsing table.
 *
 * @export
 * @param {HTMLElement} parsingTableContainer Container for HTMLTable.
 * @param {IParsingTable} parsingTable The parsing table instance.
 */
export function showParsingTable(parsingTableContainer: HTMLElement, parsingTable: IParsingTable) {
  let headers: TableHeading[] = [
    {
      title: 'STATES',
      key: 'stateName'
    },
    {
      title: 'ACTION',
      key: 'action',
      subHeading: parsingTable.grammer.terms.map(sym => {
        return { title: sym, key: sym };
      })
    },
    {
      title: 'GOTO',
      key: 'goto',
      subHeading: parsingTable.grammer.nonTerms.map(sym => {
        return { title: sym, key: sym };
      })
    }
  ];

  let body = parsingTable.states.map(state => {
    let actionMap = {};
    headers[1].subHeading.reduce((mapObj, { key }) => {
      let action = parsingTable.ACTION[state.name][key];
      mapObj[key] = action ? `${action.actionType} ${action.actionValue ? action.actionValue.toString() : ''}` : '-';
      return mapObj;
    }, actionMap);

    headers[2].subHeading.reduce((mapObj, { key }) => {
      let goto = parsingTable.GOTO[state.name][key];
      mapObj[key] = goto ? `${goto.name}` : '-';
      return mapObj;
    }, actionMap);

    return {
      ...actionMap,
      stateName: state.name
    };
  });

  parsingTableContainer.appendChild(generateTable(headers, body));
}

/**
 * Create a HTMLTable for the parse log of a string being parsed with the parser.
 *
 * @export
 * @param {HTMLElement} logCont Container for HTMLTable.
 * @param {Parser} parser The parser used for parsing.
 */
export function showParseLog(logCont: HTMLElement, parser: Parser) {
  let headers = [
    {
      title: 'Parsing Stack',
      key: 'stack'
    },
    {
      title: 'Top of Stack',
      key: 'tos'
    },
    {
      title: 'Input Buffer',
      key: 'inputBuffer'
    },
    {
      title: 'Action',
      key: 'action'
    }
  ];

  logCont.appendChild(
    generateTable(
      headers,
      parser.parseLog.map(log => {
        return {
          ...log,
          action: log.action
            ? log.action.actionType + (log.action.actionValue ? ' ' + log.action.actionValue.toString() : '')
            : ActionType.ERROR
        };
      })
    )
  );
}
