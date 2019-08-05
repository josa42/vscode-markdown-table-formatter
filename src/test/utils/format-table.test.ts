
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
      ...Array(rows).fill('|   Foo  '.repeat(colums) + '|'),
      ''
    ].join('\n')

    assert.deepEqual(formatTable(input), output)
  });

  it('should format tables correct with empty first column (issue: #6)', () => {
    const input = [
      '| Supported in following Version   | Minimum Version Supported |',
      '|------------------------------------------|---------------------------|',
      '|                                          | Win32/64 (inc. Windows 7, Windows 8 Pro)   |',
      '|                                          | Android 4.1                          |'
    ].join('\n')

    const output = [
      '| Supported in following Version | Minimum Version Supported                |',
      '|--------------------------------|------------------------------------------|',
      '|                                | Win32/64 (inc. Windows 7, Windows 8 Pro) |',
      '|                                | Android 4.1                              |',
      ''
    ].join('\n')


    assert.deepEqual(formatTable(input), output)
  });

});
