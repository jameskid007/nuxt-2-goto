'use strict';

import {
    HoverProvider as vsHoverProvider,
    TextDocument,
    Position,
    ProviderResult,
    Hover,
    MarkdownString,
} from "vscode";

import { existsSync, readFileSync } from "fs";
import Utils from "./common";

export default class HoverProvider implements vsHoverProvider {
    provideHover(doc: TextDocument, pos: Position): ProviderResult<Hover> {

        let linkRange = doc.getWordRangeAtPosition(pos);
        if (!linkRange) { return; }

        const componentsFile =  Utils.getComponentsFilePath(doc).componentsFile;
        if (existsSync(componentsFile)) {
            const componentsDeclaration = readFileSync(componentsFile, 'utf-8');
            const tagName = Utils.getTag(doc.getText(linkRange))
            const match = JSON.parse(componentsDeclaration);
            if (match && match[tagName]) {
                return new Hover(new MarkdownString(match[tagName]?.description));
            }
        }

        return null;
    }
}
