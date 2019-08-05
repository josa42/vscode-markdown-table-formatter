import * as assert from 'assert';
import { before } from 'mocha';

import * as vscode from 'vscode';

describe('Extension', () => {

	before(() => {
		vscode.window.showInformationMessage('Start all tests.');
	});

	it('should do somethign', () => {
		assert.equal([1, 2, 3].indexOf(5), -1);
		assert.equal([1, 2, 3].indexOf(0), -1);
  });

});
