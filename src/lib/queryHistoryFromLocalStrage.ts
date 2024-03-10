import { logger } from "./logger";

const historyKey = "jqHistory";
const HISTORY_MAX_SIZE = 300;
export const getHistory = async (): Promise<string[]> => {
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

export const addHistory = async (jqQuery: string, histories: string[]) => {
  // 空白やデフォルトは履歴に保持しない
  if (!jqQuery || jqQuery === "." || histories.length + 1 >= HISTORY_MAX_SIZE) {
    return;
  }
  try {
    await chrome.storage.local.set({
      [historyKey]: Array.from(new Set([...histories, jqQuery])),
    });
  } catch (e) {
    logger.debug(e);
  }
};

export const removeHistory = async (jqQuery: string, histories: string[]) => {
  if (!jqQuery) {
    return;
  }

  const res = histories.filter((h) => h !== jqQuery);
  try {
    await chrome.storage.local.set({
      [historyKey]: Array.from(new Set(res)),
    });
  } catch (e) {
    logger.debug(e);
  }
};

export const remoevHistoryAll = () => {
  chrome.storage.local.clear();
};
