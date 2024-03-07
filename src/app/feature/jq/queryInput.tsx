import { useEffect, useRef, useState } from "react";

type P = {
  initialJqQuery: string;
};
export const QueryInput: React.FC<P> = (props) => {
  const [jqQuery, setJqQuery] = useState<string>(props.initialJqQuery);
  const [jqQueryHistory, setJqQueryHistory] = useState<string[]>([]);
  const [historyKeyIndex, setHistoryKeyIndex] = useState(-1);
  const [suggestMode, setSuggestMode] = useState(false);
  const queryInputSuggestRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    chrome.storage.local.get("jqHistory").then((res) => {
      setJqQueryHistory(res["jqHistory"]);
    });
  }, []);

  // ↑↓で履歴をinput要素にセットする
  useEffect(() => {
    setJqQuery(jqQueryHistory[historyKeyIndex]);
  }, [historyKeyIndex]);

  useEffect(() => {
    suggestMode &&
      queryInputSuggestRef.current?.scrollIntoView({
        behavior: "instant",
        block: "start",
        inline: "nearest",
      });
  }, [jqQuery]);

  // Enterや送信ボタンでjq発火
  function onClickHandler() {
    return () => {
      setSuggestMode(false);

      chrome.runtime.sendMessage({
        type: "query",
        text: jqQuery,
      });
      setJqQueryHistory(Array.from(new Set([...jqQueryHistory, jqQuery])));

      const url = new URL(document.URL);
      url.searchParams.set("chromeExtentionJqQuery", jqQuery);
      history.pushState(null, "", url.toString());
    };
  }

  return (
    <form
      className="queryInput"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <div className="queryInputSearchBox">
        <input
          id="queryInputForm"
          type="text"
          placeholder="jq query. ex: keys"
          className="queryInputInput"
          onChange={(e) => {
            setJqQuery(e.currentTarget.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onClickHandler();
            }
            if (e.key === "ArrowUp") {
              setHistoryKeyIndex((s) =>
                s + 1 > jqQueryHistory.length ? 0 : s + 1
              );
              !suggestMode && setSuggestMode(true);
            }
            if (e.key === "ArrowDown") {
              setHistoryKeyIndex((s) => (s >= 0 ? s - 1 : 0));
            }
            if (e.ctrlKey && e.key === "r") {
              setSuggestMode((s) => !s);
            }
            if (e.key === "Escape") {
              setSuggestMode(false);
            }
          }}
          value={jqQuery}
        />
        <button className="queryInputShareButton" onClick={onClickHandler()}>
          Set URL
        </button>
      </div>

      {suggestMode && jqQueryHistory.length > 0 && (
        <ul className="queryInputSuggest">
          {jqQueryHistory.reverse().map((queryHistory) => (
            <li
              key={queryHistory}
              onClick={() => setJqQuery(queryHistory)}
              className={
                queryHistory === jqQuery ? "queryInputSuggest--active" : ""
              }
              ref={queryHistory === jqQuery ? queryInputSuggestRef : null}
            >
              {queryHistory}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
};
