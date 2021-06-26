import { ExtensionContext, commands, window } from "vscode";

import { StockProvider } from "./configSettings";
import { StockResource } from "./features";

export function activate(context: ExtensionContext) {
  const stockResource = new StockResource();
  const nodeProvider = new StockProvider(stockResource);

  setInterval(() => {
    nodeProvider._onDidChangeTreeData.fire();
  }, 2 * 1000);

  window.registerTreeDataProvider("twse-monitor", nodeProvider);

  context.subscriptions.push(
    commands.registerCommand("twse-monitor.add", () => {
      nodeProvider.addToList();
    }),
    commands.registerCommand("twse-monitor.item.remove", (stock) => {
      nodeProvider.removeFromList(stock);
    })
  ); // subscriptions
}

export function deactivate() {}
