
import * as assert from 'assert';
import formatTable from '../../utils/format-table';


describe('format-table', () => {

  it('should reformat a markdown table', () => {
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

});
