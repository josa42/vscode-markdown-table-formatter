// Taken from: https://github.com/dbrockman/reformat-markdown-table

export function format(str: string): string {
  var table = splitStringToTable(str),
    alignments: string[],
    max_length_per_column: number[];

  table[1] = table[1].map((cell) => {
    return padHeaderSeparatorString(cell, 0);
  });

  fillInMissingColumns(table);

  alignments = table[1].map(getAlignment);
  max_length_per_column = getMaxLengthPerColumn(table);

  return table.map((row: string[], row_index: number) => {
    return '|' + row.map((cell, column_index) => {
      var column_length = max_length_per_column[column_index];
      if (row_index === 1) {
        return padHeaderSeparatorString(cell, column_length + 2);
      }
      return ' ' + padStringWithAlignment(cell, column_length, alignments[column_index]) + ' ';
    }).join('|') + '|';
  }).join('\n') + '\n';
}

function splitStringToTable(str: string) {
  return trim(String(str)).split('\n').map((row) => {
    row = row.replace(/^[\s]+/, '').replace(/^\|/, '')
    row = row.replace(/[\|\s]+$/, '');
    return row.split('|').map(trim);
  });
}

function getMaxLengthPerColumn(table: string[][]): number[] {
  return table[0].map((_: string, column_index: number) => {
    return getMaxLength(getColumn(table, column_index));
  });
}

function getMaxLength(array: string[]): number {
  return array.reduce((max, item) => {
    return Math.max(max, item.length);
  }, 0);
}

function getMaxRowLength(array: string[][]) {
  return array.reduce((max, item) => {
    return Math.max(max, item.length);
  }, 0);
}

function padHeaderSeparatorString(str: string, len: number) {
  switch (getAlignment(str)) {
    case 'l': return repeatStr('-', Math.max(3, len));
    case 'c': return ':' + repeatStr('-', Math.max(3, len - 2)) + ':';
    case 'r': return repeatStr('-', Math.max(3, len - 1)) + ':';
  }
}

function getAlignment(str: string) {
  if (str[str.length - 1] === ':') {
    return str[0] === ':' ? 'c' : 'r';
  }
  return 'l';
}

function fillInMissingColumns(table: string[][]) {
  var max = getMaxRowLength(table);
  table.forEach((row, i) => {
    while (row.length < max) {
      row.push(i === 1 ? '---' : '');
    }
  });
}

function getColumn(table: string[][], column_index: number): string[] {
  return table.map((row: string[]) => {
    return row[column_index];
  });
}

function trim(str: string) {
  return str.trim();
}

function padStringWithAlignment(str: string, len: number, alignment: string) {
  switch (alignment) {
    case 'l': return padRight(str, len);
    case 'c': return padLeftAndRight(str, len);
    case 'r': return padLeft(str, len);
  }
}

function padLeft(str: string, len: number) {
  return getPadding(len - str.length) + str;
}

function padRight(str: string, len: number) {
  return str + getPadding(len - str.length);
}

function padLeftAndRight(str: string, len: number) {
  var l = (len - str.length) / 2;
  return getPadding(Math.ceil(l)) + str + getPadding(Math.floor(l));
}


function getPadding(len: number) {
  return repeatStr(' ', len);
}

function repeatStr(str: string, count: number) {
  return count > 0 ? Array(count + 1).join(str) : '';
}

