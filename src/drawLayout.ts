import * as vscode from "vscode";
import { IndividualSecurities, alignListItem } from "./utils";

export class Stock extends vscode.TreeItem {
  list: IndividualSecurities;
  constructor(info: IndividualSecurities) {
    super(
      // use template literals
      `${info.upDownSymbol} ${alignListItem(
        info.name,
        9,
        true //full width
      )} ${alignListItem(info.changeRate, 10)} ${info.now}`
    );
    this.list = info;

    const mdTooltip = new vscode.MarkdownString();
    mdTooltip.appendMarkdown(`
公司:             ${info.name}\n<h1>
代號:             ${info.ticker}\n
漲停:             ${info.highStop}\n
跌停:             ${info.lowStop}\n
累積成交量:        ${info.totalVolume}\n
-----------------------------------------------------------------
幅度:             ${info.changeRate}\n
漲跌:             ${info.changeAmount}\n
開盤:             ${info.todayOpen}\n
昨收:             ${info.lastClose}\n
-----------------------------------------------------------------
最高:             ${info.high}\n
最低:             ${info.low}\n
-----------------------------------------------------------------
`);
    mdTooltip.appendCodeblock(
      `
 買量 | 買價 | 賣價 | 賣量
-----|------|-----|-----`,
      "javascript"
    );

    for (let i = 0; i < info.fiveBuyAmount.length; i++) {
      mdTooltip.appendCodeblock(
        `${info.fiveBuyAmount[i]} | ${info.fiveBuy[i]} | ${info.fiveSell[i]} | ${info.fiveSellAmount[i]}`,
        "javascript"
      );
    }
    this.tooltip = mdTooltip;
  }
}
