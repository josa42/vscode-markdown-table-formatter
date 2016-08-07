'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import extractTables from './utils/extract-tables'

const { reformat } = require('reformat-markdown-table')

const TABLE_EXP: RegExp = /((?:(?:[^\n]*?\|[^\n]*)\ *)?(?:\r?\n|^))((?:\|\ *(?::?-+:?|::)\ *|\|?(?:\ *(?::?-+:?|::)\ *\|)+)(?:\ *(?::?-+:?|::)\ *)?\ *\r?\n)((?:(?:[^\n]*?\|[^\n]*)\ *(?:\r?\n|$))+)/g;


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider('markdown', {
        provideDocumentFormattingEdits: function (document, options, token) {
            const result: vscode.TextEdit[] = [];

            const start = new vscode.Position(0, 0);
            const end = new vscode.Position(document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length);
            const range = new vscode.Range(start, end);

            let text = document.getText(range)
            
            const tables = extractTables(text)
            if (tables) {
                tables.forEach((table) => {
                    text = text.replace(TABLE_EXP, (substring: string) => reformat(table))
                    result.push(new vscode.TextEdit(range, text));
                })
            }

            return result;
        }
    }))
}

// this method is called when your extension is deactivated
export function deactivate() {}