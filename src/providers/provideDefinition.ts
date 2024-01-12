
const os = require('os')
const path = require('path')

import { readFileSync } from "fs";
import {
  Location, 
  Uri,
  DefinitionProvider, 
  Position,
  TextDocument
} from 'vscode'
import Utils from "./common";

export default class ProvideDefinitionClass implements DefinitionProvider {
  provideDefinition(document: TextDocument, position: Position) {
    const word        = document.getText(document.getWordRangeAtPosition(position)); // 单词
    const componentsFile = Utils.getComponentsFilePath(document);
    const componentsDeclaration = readFileSync(componentsFile.componentsFile, 'utf-8');
    const tagName = Utils.getTag(word)
    const match = JSON.parse(componentsDeclaration);

    if (match && match[tagName]) {
        const filePath = match[tagName].description.replace('Auto imported from ', '').replaceAll('/', '\\')
        let p = path.resolve(componentsFile.workspaceFolder, filePath)
          const platform = os.platform();
          if (platform === 'win32') {
            p = path.win32.normalize(p);
          } else {
            p = path.posix.normalize(p);
          }
        return new Location(Uri.file(p), new Position(0, 0));
    } 
  }
}
