
import * as assert from 'assert';
import formatTable from '../../utils/format-table';


describe('format-table', () => {

  it('should format a markdown table', () => {
    const input = [
      '| Header 1 |   Header 2   | Header 3|H|',
      '| --- | --- | :---: | :---: |',
      '| aaa |bbb| cccc | ddddd |',
      '   |   eee |fff',
      '|  |   |   eee |fff',
      '| | | |'
    ].join('\n')

    const output = [
      '| Header 1 | Header 2 | Header 3 |   H   |',
      '|----------|----------|:--------:|:-----:|',
      '| aaa      | bbb      |   cccc   | ddddd |',
      '| eee      | fff      |          |       |',
      '|          |          |    eee   |  fff  |',
      '|          |          |          |       |',
      ''
    ].join('\n');

    assert.deepEqual(formatTable(input), output)
  });

  it('should format a large markdown table', () => {
    const rows = 10_000
    const colums = 200

    const input = [
      '| Header '.repeat(colums) + '|',
      '|:-:'.repeat(colums) + '|',
      ...Array(rows).fill('| Foo '.repeat(colums) + '|')
    ].join('\n')

    const output = [
      '| Header '.repeat(colums) + '|',
      '|:------:'.repeat(colums) + '|',
      ...Array(10000).fill('|   Foo  '.repeat(colums) + '|'),
      ''
    ].join('\n')

    assert.deepEqual(formatTable(input), output)
  });

});
