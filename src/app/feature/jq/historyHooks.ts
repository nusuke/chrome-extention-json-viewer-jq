import { useCallback, useEffect, useState } from "react";
import {
  getHistory,
  remoevHistoryAll,
  removeHistory,
} from "../../../lib/queryHistoryFromLocalStrage";

export const useQueryHistory = (setJqQuery: any) => {
  const [jqQueryHistories, setJqQueryHistory] = useState<string[]>([]);
  const [historyKeyIndex, setHistoryKeyIndex] = useState(-1);
  const [suggestMode, setSuggestMode] = useState(false);
  const [selectedHistoryQuery, setSelectedHisotoryQuery] = useState<
    string | null
  >(null);

  // ↑↓で履歴をinput要素にセットする
  useEffect(() => {
    if (historyKeyIndex >= 0 && jqQueryHistories.length > historyKeyIndex) {
      setSelectedHisotoryQuery(jqQueryHistories[historyKeyIndex]);
    }
  }, [historyKeyIndex]);

  const updateHistoryFromLocalStrage = useCallback(async () => {
    const res = await getHistory();
    setJqQueryHistory(res ?? []);
  }, []);

  // 履歴を全て消す
  const allRemoveHisotryHandler = useCallback(async () => {
    if (confirm(`Delete all`)) {
      await remoevHistoryAll();
      window.location.reload();
    }
  }, []);

  const removeHisotryHandler = (queryHistory: string) => {
    if (confirm(`Can I delete the query "${queryHistory}"?`)) {
      removeHistory(queryHistory, jqQueryHistories);
      window.location.reload();
    }
  };

  const execQueryHistory = (query?: string) => {
    setJqQuery(query ?? selectedHistoryQuery);
  };

  return {
    updateHistoryFromLocalStrage,
    setSuggestMode,
    setHistoryKeyIndex,
    suggestMode,
    jqQueryHistories,
    allRemoveHisotryHandler,
    removeHisotryHandler,
    execQueryHistory,
    selectedHistoryQuery,
  };
};
