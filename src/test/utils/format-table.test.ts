
import * as assert from 'assert';
import {format} from '../../utils/format-table';


describe('format-table', () => {

  it('should reformat a markdown table', () => {
    const input = [
      '| Header 1 |   Header 2   | Header 3|H|',
      '| --- | --- | :---: | :---: |',
      '| aaa |bbb| cccc | ddd |',
      '   |   eee |fff',
      '|  |   |   eee |fff',
      '| | | |'
    ].join('\n')

    const output = [
      '| Header 1 | Header 2 | Header 3 |   H   |',
      '|----------|----------|:--------:|:-----:|',
      '| aaa      | bbb      |   cccc   |  ddd  |',
      '| eee      | fff      |          |       |',
      '|          |          |    eee   |  fff  |',
      '|          |          |          |       |',
      ''
    ].join('\n');

    assert.deepEqual(format(input), output)
  });

});
