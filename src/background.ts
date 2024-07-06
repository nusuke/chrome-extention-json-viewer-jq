import jq from "jq-web/jq.wasm.js";
import { logger } from "./lib/logger";
import { getHistory, addHistory } from "./lib/queryHistoryFromLocalStrage";

export const messageType = {
  load: "load",
  query: "query",
  setHistory: "setHistory",
} as const;
type MessageType = {
  type: keyof typeof messageType;
  text: string;
};
const key = "json";

chrome.runtime.onMessage.addListener(async (message: MessageType, sender) => {
  logger.debug("message 受信", message);
  if (!sender.tab?.id) return;
  if (message.type == messageType.load) {
    const text = message.text;
    try {
      const json = JSON.parse(text);

      await chrome.scripting.insertCSS({
        files: ["style.css"],
        target: { tabId: sender.tab.id },
      });

      await chrome.storage.session.set({ [key]: JSON.stringify(json) });
    } catch (e) {
      console.error(e);
    }
  } else if (message.type == messageType.query) {
    // jq filtering
    const jqQuery = message.text;
    try {
      const json = JSON.parse(
        JSON.parse(JSON.stringify(await chrome.storage.session.get(key))).json
      );

      const res = jq.json(json, jqQuery);
      logger.debug("jq result:", res);

      const [tab] = await chrome.tabs.query({
        active: true,
        lastFocusedWindow: true,
      });
      if (!tab.id) return;

      chrome.tabs.sendMessage(tab.id, {
        filteredJSON: res,
      });
    } catch (e) {
      logger.debug(e);
    }
  } else if (message.type === messageType.setHistory) {
    const jqQuery = message.text;
    // 履歴保存
    if (jqQuery) {
      const histories = await getHistory();
      await addHistory(jqQuery, histories);
    }
  } else {
    console.error("unknown type message", message.type);
  }
});
