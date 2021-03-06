import * as vscode from "vscode";
import { twseApi } from "./utils";
import { Stock } from "./drawLayout";
import { StockProvider } from "./configSettings";

export class StockResource {
  constructor() {}

  updateConfig(stocks: object) {
    const config = vscode.workspace.getConfiguration();
    const watchingList: StockConfig = Object.assign(
      {},
      config.get("twse-monitor", {}),
      stocks
    );
    config.update("twse-monitor", watchingList, true);
  }

  removeConfig(searchTicker: string) {
    const config = vscode.workspace.getConfiguration();
    const watchingList: StockConfig = Object.assign(
      {},
      config.get("twse-monitor", {})
    );
    delete watchingList[searchTicker];
    config.update("twse-monitor", watchingList, true);
    const stockResource = new StockResource();
    const nodeProvider = new StockProvider(stockResource, false);
    nodeProvider.removeTickerFlag = false;
  }

  async getWatchingList(removeTickerFlag: Boolean): Promise<Array<Stock>> {
    const config = vscode.workspace.getConfiguration().get("twse-monitor", {});
    const result = await twseApi(config);

    //Here we update now(jsonDataPrefix.z) price on settings.json
    const insertStockObj: { [key: string]: number } = {};
    result.forEach((stockInfo) => {
      if (stockInfo) {
        insertStockObj[stockInfo.list.searchTicker] = stockInfo.list.now;
      }
    });
    if(!removeTickerFlag)
    {
      this.updateConfig(insertStockObj);
    }
    return result;
  }
}

export interface StockConfig {
  [key: string]: Array<string>;
}
