import jq from "jq-web/jq.wasm.js";
import { logger } from "./lib/logger";

type MessageType = {
  type: "road" | "query";
  text: string;
};
const key = "json";

chrome.runtime.onMessage.addListener(async (message: MessageType, sender) => {
  logger.debug("message 受信", message);
  if (!sender.tab?.id) return;
  if (message.type == "road") {
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
  } else if (message.type == "query") {
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

    // 履歴保存
    if (!jqQuery) return;

    const historyKey = "jqHistory";
    const histories = await getHistory(historyKey);

    try {
      await chrome.storage.local.set({
        [historyKey]: Array.from(new Set([...histories, jqQuery])),
      });
    } catch (e) {
      logger.debug(e);
    }
  }
});

const getHistory = async (historyKey: string): Promise<string[]> => {
  try {
    const historyData = await chrome.storage.local.get(historyKey);
    if (historyData && Array.isArray(historyData[historyKey])) {
      return historyData[historyKey] as string[];
    } else {
      return [];
    }
  } catch (e) {
    logger.debug(e);
    return [];
  }
};
