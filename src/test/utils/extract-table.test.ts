
import * as assert from 'assert';
import extractTables from '../../utils/extract-tables';


describe('extractTables()', () => {

  it('should extract a markdown table', () => {
    const table = [
      '| Header 1 |   Header 2   | Header 3|H|',
      '| --- | --- | :---: | :---: |',
      '| aaa |bbb| cccc | ddddd |',
      '   |   eee |fff',
      '|  |   |   eee |fff',
      '| | | |'
    ].join('\n')

    assert.deepEqual(extractTables(table), [table])
  });

  it('should extract multiple large markdown tables', () => {
    const rows = 10_000
    const columns = 200

    const table = [
      '| Header '.repeat(columns) + '|',
      '|:-:'.repeat(columns) + '|',
      ...Array(rows).fill('| Foo '.repeat(columns) + '|'),
    ].join('\n')

    const input = [
      '# Header',
      '',
      table,
      '',
      table
    ].join("\n")

    assert.deepEqual(extractTables(input), [table, table])
  });

});
