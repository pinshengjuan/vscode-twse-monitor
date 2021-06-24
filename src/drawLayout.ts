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
${alignListItem("公司", 6, true)}      ${info.name}\n
${alignListItem("代號", 6, true)}      ${info.ticker}\n
${alignListItem("漲停價", 6, true)}     ${info.highStop}\n
${alignListItem("跌停價", 6, true)}     ${info.lowStop}\n
${alignListItem("累積成交量", 6, true)}  ${info.totalVolume}\n
-----------------------------------------------------------------
${alignListItem("幅度", 6, true)}       ${info.changeRate}\n
${alignListItem("漲跌", 6, true)}       ${info.changeAmount}\n
${alignListItem("開盤", 6, true)}       ${info.todayOpen}\n
${alignListItem("昨收", 6, true)}       ${info.lastClose}\n
-----------------------------------------------------------------
${alignListItem("最高", 6, true)}       ${info.high}\n
${alignListItem("最低", 6, true)}       ${info.low}\n
-----------------------------------------------------------------
`);
    mdTooltip.appendCodeblock(
      `
 買量　  |　  買價　　|　  賣價　　|　賣量`,
      "javascript"
    );

    for (let i = 0; i < info.fiveBuyAmount.length; i++) {
      mdTooltip.appendCodeblock(
        ` ${alignListItem(
          info.fiveBuyAmount[i].toString(),
          6
        )} | ${alignListItem(info.fiveBuy[i].toString(), 8)} | ${alignListItem(
          info.fiveSell[i].toString(),
          8
        )} |  ${alignListItem(info.fiveSellAmount[i].toString(), 6)}`,
        "javascript"
      );
    }
    this.tooltip = mdTooltip;
  }
}
