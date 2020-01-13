import * as $ from 'jquery';

import { CFG } from './CFG';
import Parser from './Parser';
import LRClosure from './LRClosure';
import { drawGotoGraph } from './utils/graphs.utils';
import ParsingTable, { ConflictError } from './ParsingTable';
import { showParseLog, showParsingTable, showLRItemsTable } from './utils/parsing.utils';

/**
 * Process a CFG to create it's parsing table, goto graph and lr items table.
 *
 * @exports
 * @param {CFG} grammer The grammer to process
 */
export function processGrammer(grammer: CFG): void {
  LRClosure.COUNT = 0;
  let augmented = grammer.getAugmentedCFG();

  let parsingTable: ParsingTable;
  try {
    $('#processing-result').addClass('d-none');
    parsingTable = new ParsingTable(augmented);
  } catch (e) {
    if (e instanceof ConflictError) {
      $('#processing-result').text(`CONFLICT OCCURED: ${e.message}`);
    } else {
      $('#processing-result').text(`Error occured while processing grammer: ${e.message}`);
    }
    $('#processing-result').removeClass('d-none');

    console.log(e);
    
    return;
  }

  let parser = new Parser(parsingTable);

  drawGotoGraph($('#goto-graph')[0], parsingTable);

  let parsingTableCont = $('#parsing-table-cont');
  parsingTableCont.empty();
  showParsingTable(parsingTableCont[0], parsingTable);

  let lrItemsTableCont = $('#lr-items-cont');
  lrItemsTableCont.empty();
  showLRItemsTable(lrItemsTableCont[0], parsingTable.states);

  $('#parse-form').on('submit', e => {
    e.preventDefault();

    let text = $('#parse-input')
      .val()
      .toString()
      .trim();
    if (text.length > 0) {
      parseText(parser, text);
    }
  });

  $('#goto-graph-tab').tab('show');
}

/**
 * Parse a text using a parser and generate a parsing steps table.
 *
 * @exports
 * @param {Parser} parser The parser instance to use
 * @param {string} text The text to parse
 */
export function parseText(parser: Parser, text: string): void {
  let parseResult = $('#parse-result');

  if (parser.parse(text)) {
    parseResult.removeClass('alert-danger');
    parseResult.addClass('alert-success');
    parseResult.text(`Text: "${text}" accepted by grammer.`);
  } else {
    parseResult.removeClass('alert-success');
    parseResult.addClass('alert-danger');
    parseResult.text(`Text: "${text}" rejected by grammer.`);
  }
  parseResult.removeClass('d-none');

  let parseLogTableCont = $('#parsing-log-table-cont');
  parseLogTableCont.empty();
  showParseLog(parseLogTableCont[0], parser);
}
