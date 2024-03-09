import { logger } from "./logger";

const historyKey = "jqHistory";

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
  if (!jqQuery || jqQuery === ".") {
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
