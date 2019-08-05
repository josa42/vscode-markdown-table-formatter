'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {workspace} from 'vscode';
import extractTables from './utils/extract-tables'

import formatTable from './utils/format-table'
import * as escapeStringRegexp from 'escape-string-regexp'

let config = workspace.getConfiguration('markdownTableFormatter');
let enable: boolean = config.get<boolean>('enable', true);

workspace.onDidChangeConfiguration(e => {
  config = workspace.getConfiguration('markdownTableFormatter');
  enable = config.get<boolean>('enable', true);
});

export function activate(context: vscode.ExtensionContext) {

  context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider('markdown', {
    provideDocumentFormattingEdits(document, options, token) {

      if (!enable) {
        return
      }

      const result: vscode.TextEdit[] = [];

      const start = new vscode.Position(0, 0);
      const end = new vscode.Position(document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length);
      const range = new vscode.Range(start, end);

      let text = document.getText(range)

      const tables = extractTables(text)
      if (tables) {
        tables.forEach((table) => {
          var re = new RegExp(escapeStringRegexp(String(table)), 'g')
          text = text.replace(re, (substring: string) => formatTable(table))
        })
        result.push(new vscode.TextEdit(range, text));
      }

      return result;
    }
  }))
}

export function deactivate() {}
