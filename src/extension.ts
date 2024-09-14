import * as vscode from "vscode";

let themeStatusBarItem: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
  var settings = vscode.workspace.getConfiguration();

  themeStatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100
  );
  themeStatusBarItem.text = "Current Theme: Default";
  themeStatusBarItem.show();
  context.subscriptions.push(themeStatusBarItem);

  function applyThemeBasedOnFileType() {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const fileExtension = editor.document.fileName.split(".").pop();
      if (fileExtension) {
        const config = vscode.workspace.getConfiguration(
          "switchtheme.files.association"
        );
        const theme = config[fileExtension];
        if (theme) {
          settings.update("workbench.colorTheme", theme, true).then(() => {
            themeStatusBarItem.text = `Current Theme: ${theme}`;
          });
        }
      }
    }
  }

  vscode.window.onDidChangeActiveTextEditor(applyThemeBasedOnFileType);
  vscode.workspace.onDidOpenTextDocument(() => {
    applyThemeBasedOnFileType();
  });

  vscode.workspace.onDidChangeConfiguration((e) => {
    if (e.affectsConfiguration("switchtheme.files.association")) {
      applyThemeBasedOnFileType();
    }
  });
}

export function deactivate() {}
