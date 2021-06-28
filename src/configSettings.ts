import * as vscode from "vscode";
import { StockConfig, StockResource } from "./features";
import { Stock } from "./drawLayout";
import { twseApi, IndividualSecurities } from "./utils";

export class StockProvider implements vscode.TreeDataProvider<Stock> {
  public _onDidChangeTreeData: vscode.EventEmitter<Stock | undefined | void> =
    new vscode.EventEmitter<Stock | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<Stock | undefined | void> =
    this._onDidChangeTreeData.event;
  private resource: StockResource;
  public removeTickerFlag: Boolean;

  constructor(resource: StockResource, removeTickerFlag: Boolean) {
    this.resource = resource;
    this.removeTickerFlag = removeTickerFlag;
  }

  getTreeItem(element: Stock): vscode.TreeItem {
    return element;
  }

  getChildren(): Promise<Array<Stock>> {
    return this.resource.getWatchingList(this.removeTickerFlag);
  }

  async addToList() {
    const res = await vscode.window.showInputBox({
      value: "",
      prompt:
        '輸入股票代號並使用"半形空白"添加多筆, e.g., 2002 2412, (目前只支援上市公司，興櫃/上櫃尚未支援)',
      placeHolder: "Add Stock to List",
    });

    if (res !== undefined) {
      const codeArray = res.split(/[ ]/);
      const newStock: { [key: string]: Array<string> } = {};
      for (const stock of codeArray) {
        let tempStock = stock.trim();
        if (stock !== "") {
          tempStock = "tse_" + tempStock + ".tw";

          newStock[tempStock] = [];
        }
      }
      const result = await twseApi(newStock);
      const insertStockObj: { [key: string]: number } = {};
      result.forEach((stockInfo) => {
        if (stockInfo) {
          insertStockObj[stockInfo.list.searchTicker] = stockInfo.list.now;
        }
      });
      this.resource.updateConfig(insertStockObj);
      this._onDidChangeTreeData.fire();
    }
  }

  removeFromList(stock: { list: IndividualSecurities }) {
    const { list } = stock;
    this.resource.removeConfig(list.searchTicker);
    this._onDidChangeTreeData.fire();
  }
}
