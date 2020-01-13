/**
 * The sub heading for the table.
 *
 * @export
 * @interface TableSubHeading
 */
export interface TableSubHeading {
  /**
   * The title to display for the sub heading.
   *
   * @type {string}
   * @memberof TableSubHeading
   */
  title: string;
  /**
   * The key in the data that contains the data for sub heading.
   *
   * @type {string}
   * @memberof TableSubHeading
   */
  key: string;
}

/**
 * The heading for the table.
 *
 * @export
 * @interface TableHeading
 */
export interface TableHeading {
  /**
   * The title to display for the heading.
   *
   * @type {string}
   * @memberof TableHeading
   */
  title: string;
  /**
   * The key in the data that contains the data for the heading.
   *
   * @type {string}
   * @memberof TableHeading
   */
  key: string;
  /**
   * The sub heading for the heading(if any).
   *
   * @type {TableSubHeading[]}
   * @memberof TableHeading
   */
  subHeading?: TableSubHeading[];
}

/**
 * Get's the maximum row a header can span.
 *
 * @param {TableHeading[]} headers The list heading for the table.
 * @returns Returns 1 if no sub heading exists, 2 otherwise.
 */
function getMaxRowSpan(headers: TableHeading[]) {
  let maxRowSpan: number = 1;
  headers.forEach(heading => {
    maxRowSpan = heading.subHeading ? 2 : 1;
  });

  return maxRowSpan;
}

/**
 * Generates the heading for the HTMLTable.
 *
 * @param {TableHeading[]} headers List of heading for the table.
 * @returns {HTMLTableSectionElement} The `thead` element for the header with all the headings.
 */
function generateHead(headers: TableHeading[]): HTMLTableSectionElement {
  let maxRowSpan = getMaxRowSpan(headers);

  let tableHead = document.createElement('thead');
  let headingTR = document.createElement('tr');
  headingTR.className = 'heading';

  let subHeadingTR = document.createElement('tr');
  subHeadingTR.className = 'subHeading';

  headers.forEach(heading => {
    const { title, subHeading } = heading;
    let th = document.createElement('th');
    th.textContent = title;
    th.className = 'text-center text-muted';

    if (!subHeading) {
      th.rowSpan = maxRowSpan;
      th.className += ' align-middle';
    } else {
      th.colSpan = subHeading.length;
      subHeading.forEach(subHead => {
        let subHeadTh = document.createElement('th');
        subHeadTh.textContent = subHead.title;
        subHeadTh.className = 'text-center';

        subHeadingTR.appendChild(subHeadTh);
      });
    }
    headingTR.appendChild(th);
  });

  tableHead.appendChild(headingTR);
  tableHead.appendChild(subHeadingTR);

  return tableHead;
}

/**
 * Generates the cell value for a table cell.
 *
 * If value is a array, it generates a `ul` list, else a plain text.
 *
 * @param {*} value Value to insert in the cell.
 * @returns {HTMLTableDataCellElement} `td` element for the cell.
 */
function generateCellValue(value: any): HTMLTableDataCellElement {
  let td = document.createElement('td');
  td.classList.add('align-middle');

  if (Array.isArray(value)) {
    let ul = document.createElement('ul');
    ul.classList.add('text-left', 'list-group', 'list-group-flush');

    value.forEach(item => {
      let li = document.createElement('li');
      li.classList.add('list-group-item');
      li.textContent = item;

      ul.appendChild(li);
    });

    td.appendChild(ul);
  } else {
    td.textContent = value;
  }

  return td;
}

/**
 * Generates the body for the HTMLTable.
 *
 * @param {TableHeading[]} headers List of headings
 * @param {any[]} body Array of rows data.
 * @returns The `tbody` element for the body with all the rows.
 */
function generateBody(headers: TableHeading[], body: any[]) {
  let tableBody = document.createElement('tbody');

  body.forEach(row => {
    let rowTR = document.createElement('tr');
    rowTR.className = 'text-center';
    headers.forEach(heading => {
      const { key, subHeading } = heading;

      if (subHeading) {
        subHeading.forEach(subHead => {
          rowTR.appendChild(generateCellValue(row[subHead.key]));
        });
      } else {
        rowTR.appendChild(generateCellValue(row[key]));
      }
    });
    tableBody.appendChild(rowTR);
  });

  return tableBody;
}

/**
 * Generates a HTMLTable with given headings and data.
 *
 * @export
 * @param {TableHeading[]} headers List of headings
 * @param {any[]} body Rows of data
 * @returns The HTMLTable with the data and headings.
 */
export default function generateTable(headers: TableHeading[], body: any[]) {
  let htmlTable: HTMLTableElement = document.createElement('table');
  htmlTable.className = 'table table-bordered';

  htmlTable.appendChild(generateHead(headers));
  htmlTable.appendChild(generateBody(headers, body));

  return htmlTable;
}
