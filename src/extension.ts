import { ExtensionContext, commands, window } from "vscode";

import { StockProvider } from "./configSettings";
import { StockResource } from "./features";

export function activate(context: ExtensionContext) {
  const stockResource = new StockResource();
  let removeTickerFlag: Boolean = false;
  const nodeProvider = new StockProvider(stockResource, removeTickerFlag);

  setInterval(() => {
    nodeProvider._onDidChangeTreeData.fire();
  }, 2 * 1000);

  window.registerTreeDataProvider("twse-monitor", nodeProvider);

  context.subscriptions.push(
    commands.registerCommand("twse-monitor.add", () => {
      nodeProvider.addToList();
    }),
    commands.registerCommand("twse-monitor.item.remove", (stock) => {
      removeTickerFlag = true;
      nodeProvider.removeFromList(stock);
    })
  ); // subscriptions
}

export function deactivate() {}
