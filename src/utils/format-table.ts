// Taken from: https://github.com/dbrockman/reformat-markdown-table

const ROW_IDX_HEADER = 0
const ROW_IDX_ALIGNMENT = 1

export default function formatTable(str: string): string {
  let table = splitStringToTable(str)

  table = fillInMissingColumns(table);

  table[ROW_IDX_ALIGNMENT] = table[ROW_IDX_ALIGNMENT].map((cell) => {
    return padHeaderSeparatorString(cell, 0);
  });

  const alignments = table[ROW_IDX_ALIGNMENT].map(getAlignment);
  const max_length_per_column = getMaxLengthPerColumn(table);

  return table.map((row: string[], row_index: number) => {
    return '|' + row.map((cell, column_index) => {
      var column_length = max_length_per_column[column_index];
      if (row_index === 1) {
        // Alignment, e.g.: ":------:"
        return padHeaderSeparatorString(cell, column_length + 2);
      }

      return ' ' + padStringWithAlignment(cell, column_length, alignments[column_index]) + ' ';
    }).join('|') + '|';
  }).join('\n');
}

function splitStringToTable(str: string): string[][] {
  return str.trim().split('\n')
    // trim space and "|", but respect empty first column
    // E.g. "| | Test a | Test b |"
    //   => "| Test a | Test b"
    .map((row) => row.replace(/^(\s*\|\s*|\s+)/, '').replace(/[\|\s]+$/, ''))
    // Split rows into columns
    .map((row) => {

      let inCode = false

      return row.split('')
        // Split by "|", but only if not inside inline-code
        // E.g. "| Command | `ls | grep foo` |"
        //  =>  [ "Command","`ls | grep foo`" ]
        .reduce((columns, c): string[] => {
          if (c === '`') {
            // Switch mode
            inCode = !inCode
          }

          if (c === '|' && !inCode) {
            // Add new Column
            columns.push('')

          } else {
            // Append char to current column
            columns[columns.length - 1] += c
          }

          return columns
        }, [''])
        // Trim space in columns
        .map(column => column.trim())
    })
}

function getMaxLengthPerColumn(table: string[][]): number[] {
  return table[ROW_IDX_HEADER].map((_: string, column_index: number) => {
    return getColumn(table, column_index).reduce((max, item) => {
      return Math.max(max, item.length);
    }, 0)
  });
}

function padHeaderSeparatorString(str: string, len: number): string {
  switch (getAlignment(str)) {
    case 'c': return ':' + '-'.repeat(Math.max(1, len - 2)) + ':';
    case 'r': return '-'.repeat(Math.max(1, len - 1)) + ':';
    case 'l':
    default: return '-'.repeat(Math.max(1, len));
  }
}

function getAlignment(str: string): string {
  if (str.endsWith(':')) {
    if (str.startsWith(':')) {
      return 'c'
    }

    return 'r';
  }

  return 'l';

}

function fillInMissingColumns(table: string[][]): string[][] {
  var max = table.reduce((max, item) => Math.max(max, item.length), 0);

  return table.map((row) => row.concat(Array(max - row.length).fill('')));
}

function getColumn(table: string[][], column_index: number): string[] {
  return table.map((row) => row[column_index]);
}

function padStringWithAlignment(str: string, len: number, alignment: string): string {
  switch (alignment) {
    case 'c': return padLeftAndRight(str, len);
    case 'r': return str.padStart(len);
    case 'l':
    default: return str.padEnd(len);
  }
}

function padLeftAndRight(str: string, len: number): string {
  const l = (len - str.length) / 2;
  return ' '.repeat(Math.ceil(l)) + str + ' '.repeat(Math.floor(l));
}

