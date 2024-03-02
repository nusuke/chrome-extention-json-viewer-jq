import { useEffect, useState } from "react";
import { useDebounce } from "./useDebuonce";

type P = {
  initialJqQuery: string;
};
export const QueryInput: React.FC<P> = (props) => {
  const [jqQuery, setJqQuery] = useState<string>(props.initialJqQuery);
  const debouncedInputText = useDebounce(jqQuery ?? "", 200);

  useEffect(() => {
    chrome.runtime.sendMessage({
      type: "query",
      text: jqQuery,
    });
  }, [debouncedInputText]);

  function onClickHandler() {
    return () => {
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
      <input
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
        }}
        value={jqQuery}
      />
      <button className="queryInputShareButton" onClick={onClickHandler()}>
        Set URL
      </button>
    </form>
  );
};
