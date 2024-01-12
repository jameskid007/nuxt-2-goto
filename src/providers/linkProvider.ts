'use strict';

import {
    DocumentLinkProvider as vsDocumentLinkProvider,
    TextDocument,
    ProviderResult,
    DocumentLink,
    Position,
    Range,
    Uri,
    TextLine
} from "vscode";

import { readFileSync } from "fs";
import Utils from "./common";

export default class LinkProvider implements vsDocumentLinkProvider {
    public provideDocumentLinks(doc: TextDocument): ProviderResult<DocumentLink[]> {
        let documentLinks: Array<DocumentLink> = [];
        let config = { quickJump: true, maxLinesCount: 666 };

        if (config.quickJump) {
            const reg = /<([^>\s]+)/g

            let linesCount = doc.lineCount <= config.maxLinesCount ? doc.lineCount : config.maxLinesCount;
            let index = 0;
            const componentsFile =  Utils.getComponentsFilePath(doc);

            let tags: Array<{ tag: string, line: TextLine }> = [];

            while (index < linesCount) {
                let line = doc.lineAt(index);
                let match;
                while ((match = reg.exec(line.text)) !== null) {
                    let tagName = match[1];
                    if (!tagName.startsWith('/')) {
                        tags.push({ tag: tagName, line: line });
                    }
                }
                index++;
            }

            if (tags.length) {
                tags.forEach(item => {
                    const componentsDeclaration = readFileSync(componentsFile.componentsFile, 'utf-8');
                    const tagName = Utils.getTag(item.tag)
                    const match = JSON.parse(componentsDeclaration);
                    if (match && match[tagName]) {
                        const path = match[tagName].description.replace('Auto imported from ', '').replaceAll('/', '\\');
                        let start = new Position(item.line.lineNumber, item.line.text.indexOf(item.tag));
                        let end = start.translate(0, item.tag.length);
                        let documentlink = new DocumentLink(new Range(start, end), Uri.file(`${componentsFile.workspaceFolder}\\${path}`));
                        documentLinks.push(documentlink);
                    };
                });
            }
        }

        return documentLinks;
    }
}
