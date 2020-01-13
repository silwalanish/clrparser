import 'bootstrap';
import * as $ from 'jquery';

import 'bootstrap/dist/css/bootstrap.min.css';

import { CFG } from './CFG';
import { processGrammer } from './webImpl';
import { validateAndParse, validateStartTerminal, validateProductions, validateNonTerminals } from './validations';

$('#grammer-form').on('submit', e => {
  e.preventDefault();

  let terminals = validateAndParse('terminals-input');
  let nonTerminals = validateAndParse('non-terminals-input');
  let startTerminal = validateAndParse('start-terminal-input');
  let productions = validateAndParse('productions-input');

  if (!validateNonTerminals(terminals)) {
    return;
  }

  if (!validateNonTerminals(nonTerminals)) {
    return;
  }

  if (!validateStartTerminal(startTerminal, nonTerminals)) {
    return;
  }

  if (!validateProductions(productions, nonTerminals, terminals)) {
    return;
  }

  let cfg = new CFG({
    terminals,
    productions,
    nonTerminals,
    startSymbol: startTerminal
  });

  processGrammer(cfg);
});

$('#productions-input').val(`[
  {
    "symbol": "S",
    "produces": ["C", "C"]
  },
  {
    "symbol": "C",
    "produces": ["c", "C"]
  },
  {
    "symbol": "C",
    "produces": ["d"]
  }
]`);

$('#productions-input-example').text(`# Example
# S = AA
# A = aA
# A = b
# is written as:
[
  {
    "symbol": "S",
    "produces": ["C", "C"]
  },
  {
    "symbol": "C",
    "produces": ["c", "C"]
  },
  {
    "symbol": "C",
    "produces": ["d"]
  }
]`);

let cfg = new CFG({
  nonTerminals: ['S', 'C'],
  terminals: ['c', 'd'],
  startSymbol: 'S',
  productions: [
    {
      symbol: 'S',
      produces: ['C', 'C']
    },
    {
      symbol: 'C',
      produces: ['c', 'C']
    },
    {
      symbol: 'C',
      produces: ['d']
    }
  ]
});

processGrammer(cfg);
