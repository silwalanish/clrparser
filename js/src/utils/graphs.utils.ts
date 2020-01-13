import { DataSet, Network, Options, FocusOptions } from 'vis-network';

import { IParsingTable } from '../interfaces/parsingTable.interface';

const NETWORK_OPTIONS: Options = {
  interaction: {
    hover: true,
    tooltipDelay: 0
  },
  edges: {
    arrows: 'to',
    arrowStrikethrough: false,
    dashes: true,
    color: {
      color: '#002b36',
      highlight: '#4ad415',
      hover: '#8be468'
    },
    font: {
      size: 20,
      align: 'top',
      vadjust: -5
    },
    selfReferenceSize: 30,
    shadow: true,
    physics: false
  },
  nodes: {
    color: {
      background: '#002b36',
      border: '#001b22',
      highlight: {
        background: '#4ad415',
        border: '#8be468'
      },
      hover: {
        background: '#8be468',
        border: '#8be468'
      }
    },
    font: {
      size: 18,
      color: '#eeeeee',
      align: 'left'
    },
    mass: 1.5,
    shape: 'box',
    shadow: true
  }
};

/**
 * Draws a goto graph of the parsing table.
 *
 * @export
 * @param {HTMLElement} container The HTML container to place the graph to.
 * @param {IParsingTable} parsingTable The parsing table whoses GOTO graph is to be drawn.
 */
export function drawGotoGraph(container: HTMLElement, parsingTable: IParsingTable): void {
  let nodes = new DataSet();
  parsingTable.states.forEach(state => {
    nodes.add({ id: state.name, label: state.name, title: state.formatProductionsHtml() });
  });

  let edges = new DataSet();

  for (let state in parsingTable.GOTO) {
    for (let entry in parsingTable.GOTO[state]) {
      let to = parsingTable.GOTO[state][entry];
      if (to) {
        edges.add({ from: state, to: to.name, label: entry });
      }
    }
  }

  let network = new Network(container, { nodes, edges }, NETWORK_OPTIONS);

  let tooltip = document.createElement('div');
  tooltip.classList.add('graph-tooltip', 'shadow-sm');
  container.appendChild(tooltip);

  network.on('showPopup', nodeId => {
    let canvasPos = network.getPositions([nodeId])[nodeId];
    let domPos = network.canvasToDOM(canvasPos);

    let node = nodes.get(nodeId);
    tooltip.innerHTML = node.title;

    tooltip.classList.add('show');
    tooltip.style.top = domPos.y + container.offsetTop + 'px';
    tooltip.style.left = domPos.x + container.offsetLeft + 'px';
  });

  network.on('hidePopup', () => {
    tooltip.classList.remove('show');
  });
}
