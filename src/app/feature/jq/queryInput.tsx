import { useEffect, useRef, useState } from "react";
import {
  getHistory,
  remoevHistoryAll,
  removeHistory,
} from "../../../lib/queryHistoryFromLocalStrage";

type P = {
  initialJqQuery: string;
};
export const QueryInput: React.FC<P> = (props) => {
  const [jqQuery, setJqQuery] = useState<string>(props.initialJqQuery);
  const [jqQueryHistories, setJqQueryHistory] = useState<string[]>([]);
  const [historyKeyIndex, setHistoryKeyIndex] = useState(-1);
  const [suggestMode, setSuggestMode] = useState(false);
  const queryInputSuggestRef = useRef<HTMLButtonElement>(null);

  const updateHistoryFromLocalStrage = async () => {
    const res = await getHistory();
    setJqQueryHistory(res ?? []);
  };

  useEffect(() => {
    chrome.runtime.sendMessage({
      type: "query",
      text: props.initialJqQuery,
    });

    updateHistoryFromLocalStrage();
  }, []);

  useEffect(() => {
    setSuggestMode(false);
  }, [props.initialJqQuery]);

  // ↑↓で履歴をinput要素にセットする
  useEffect(() => {
    if (historyKeyIndex >= 0 && jqQueryHistories.length > historyKeyIndex) {
      setJqQuery(jqQueryHistories[historyKeyIndex]);
    }
  }, [historyKeyIndex]);

  // Enterや送信ボタンでjq発火
  const executeJq = async (jqQuery: string) => {
    await chrome.runtime.sendMessage({
      type: "query",
      text: jqQuery,
    });

    if (jqQuery) {
      updateHistoryFromLocalStrage();
    }
    setJqQuery(jqQuery);
    const url = new URL(document.URL);
    url.searchParams.set("chromeExtentionJqQuery", jqQuery);
    history.pushState(null, "", url.toString());
  };

  return (
    <form
      className="queryInput"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <div className="queryInputSearchBox">
        <div className="queryInputSearchBoxInputWrapper">
          <input
            id="queryInputForm"
            type="text"
            placeholder="jq query. ex: keys"
            className="queryInputInput"
            autoComplete="off"
            onChange={(e) => {
              setJqQuery(e.currentTarget.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setSuggestMode(false);
                executeJq(jqQuery);
                e.preventDefault();
                e.stopPropagation();
              }
              if (e.key === "ArrowUp") {
                setHistoryKeyIndex((s) => (s >= 0 ? s - 1 : 0));
                !suggestMode && setSuggestMode(true);
              }
              if (e.key === "ArrowDown") {
                setHistoryKeyIndex((s) =>
                  s + 1 >= jqQueryHistories.length ? s : s + 1
                );
                !suggestMode && setSuggestMode(true);
              }
              if (e.ctrlKey && e.key === "r") {
                setSuggestMode((s) => !s);
              }
              if (e.key === "Escape") {
                setSuggestMode(false);
              }
            }}
            onBlur={() => {
              setSuggestMode(false);
            }}
            value={jqQuery}
          />
          <button
            className="queryInputHistoryButton"
            onClick={() => setSuggestMode((s) => !s)}
          >
            {suggestMode ? "×" : "history"}
          </button>
        </div>
        <button
          className="queryInputShareButton"
          onClick={() => executeJq(jqQuery)}
        >
          Set URL
        </button>
      </div>

      {suggestMode && jqQueryHistories.length > 0 && (
        <ul className="queryInputSuggest">
          {jqQueryHistories.map((queryHistory) => (
            <li key={queryHistory} className="queryInputSuggestList">
              <button
                className={`${
                  queryHistory === jqQuery ? "queryInputSuggest--active" : ""
                } queryInputSuggestButton`}
                onClick={() => {
                  executeJq(queryHistory);
                }}
                ref={queryHistory === jqQuery ? queryInputSuggestRef : null}
              >
                {queryHistory}
              </button>
              <button
                className="queryInputSuggestRemoveButton"
                onClick={() => {
                  if (confirm(`Can I delete the query "${queryHistory}"?`)) {
                    removeHistory(queryHistory, jqQueryHistories);
                    window.location.reload();
                  }
                }}
              >
                ×
              </button>
            </li>
          ))}
          <li>
            <button
              className="queryInputSuggestAllRemoveButton"
              onClick={async () => {
                if (confirm(`Delete all`)) {
                  await remoevHistoryAll();
                  window.location.reload();
                }
              }}
            >
              all remove.
            </button>
          </li>
        </ul>
      )}
    </form>
  );
};
