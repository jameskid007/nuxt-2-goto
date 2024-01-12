import {
    HoverProvider as vsHoverProvider,
    TextDocument,
    workspace,
} from "vscode";

const path = require('path')
const os = require('os')

export default class Utils {
    // 把-连字符换成首字母大写名称
    static getTag(tagName: string) {
        const tag = tagName.split('-').map((o) => {
            return o.charAt(0).toUpperCase() + o.slice(1);
        }).join('')
        return tag
    }

    static getComponentsFilePath(doc: TextDocument) {
      const componentsFilePath = '.nuxt\\vetur\\tags.json';
      let workspaceFolder, componentsFile
      try {
         workspaceFolder = workspace.getWorkspaceFolder(doc.uri);
         componentsFile = path.resolve(`${workspaceFolder?.uri.fsPath}`, `${componentsFilePath}`);
          // 获取当前系统的平台
          const platform = os.platform();

          // 判断是否是 Windows
          if (platform === 'win32') {
            componentsFile = path.win32.normalize(componentsFile);
          } else {
            componentsFile = path.posix.normalize(componentsFile);
          }
      } catch(e) {
        console.log(e)
      }

      return {
        componentsFile,
        workspaceFolder: workspaceFolder?.uri.fsPath
      }
    }
}
