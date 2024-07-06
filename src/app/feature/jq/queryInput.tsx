import { useEffect, useRef, useState } from "react";
import { useQueryHistory } from "./historyHooks";
import DeleteIcon from "../../../icons/delete.svg";
import HistoryIcon from "../../../icons/history.svg";
import { messageType } from "../../../background";

type P = {
  initialJqQuery: string;
};
export const QueryInput: React.FC<P> = (props) => {
  const [jqQuery, setJqQuery] = useState<string>(props.initialJqQuery);

  const {
    updateHistoryFromLocalStrage,
    setSuggestMode,
    setHistoryKeyIndex,
    suggestMode,
    jqQueryHistories,
    allRemoveHisotryHandler,
    removeHisotryHandler,
    execQueryHistory,
    selectedHistoryQuery,
  } = useQueryHistory(setJqQuery);

  const queryInputSuggestRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    chrome.runtime.sendMessage({
      type: messageType.query,
      text: props.initialJqQuery,
    });

    updateHistoryFromLocalStrage();
  }, []);

  useEffect(() => {
    setSuggestMode(false);
  }, [props.initialJqQuery]);

  // jq発火
  const executeJq = async (jqQuery: string) => {
    setSuggestMode(false);
    await chrome.runtime.sendMessage({
      type: messageType.query,
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

  // 入力されるたびに実行
  useEffect(() => {
    executeJq(jqQuery);
  }, [jqQuery]);

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
                suggestMode ? execQueryHistory() : executeJq(jqQuery);

                setSuggestMode(false);
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
            className="queryInputDeleteButton"
            onClick={() => {
              executeJq(".");
            }}
            aria-label="reset input"
          >
            <DeleteIcon />
          </button>
        </div>
        <div className="queryInputButtonArea">
          <button
            className="queryInputShareButton"
            onClick={() => {
              executeJq(jqQuery);

              chrome.runtime.sendMessage({
                type: messageType.setHistory,
                text: jqQuery,
              });
            }}
          >
            Set URL
          </button>
          <button
            className="queryInputHistoryButton"
            onClick={() => setSuggestMode((s) => !s)}
            aria-label="history"
          >
            {suggestMode ? "×" : <HistoryIcon />}
          </button>
        </div>
      </div>

      {suggestMode && jqQueryHistories.length > 0 && (
        <ul className="queryInputSuggest">
          {jqQueryHistories.map((queryHistory) => (
            <li key={queryHistory} className="queryInputSuggestList">
              <button
                className={`${
                  queryHistory === selectedHistoryQuery
                    ? "queryInputSuggest--active"
                    : ""
                } queryInputSuggestButton`}
                onClick={execQueryHistory}
                ref={
                  queryHistory === selectedHistoryQuery
                    ? queryInputSuggestRef
                    : null
                }
              >
                {queryHistory}
              </button>
              <button
                className="queryInputSuggestRemoveButton"
                onClick={() => removeHisotryHandler(queryHistory)}
              >
                ×
              </button>
            </li>
          ))}
          <li>
            <button
              className="queryInputSuggestAllRemoveButton"
              onClick={allRemoveHisotryHandler}
            >
              all remove.
            </button>
          </li>
        </ul>
      )}
    </form>
  );
};
