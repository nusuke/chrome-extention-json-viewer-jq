import { useEffect, useState } from "react";
import { useDebounce } from "./useDebuonce";

type P = {};
export const QueryInput: React.FC<P> = () => {
  const [jqQuery, setJqQuery] = useState(".");
  const debouncedInputText = useDebounce(jqQuery, 200);

  useEffect(() => {
    chrome.runtime.sendMessage({
      type: "query",
      text: jqQuery,
    });
  }, [debouncedInputText]);

  return (
    <>
      <input
        type="text"
        placeholder="jq query. ex: keys"
        className="queryInput"
        onChange={(e) => {
          setJqQuery(e.currentTarget.value);
        }}
        value={jqQuery}
      />
    </>
  );
};
