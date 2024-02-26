import { Dispatch, SetStateAction, useEffect, useState } from "react";

type P = {
  changeHandle: Dispatch<SetStateAction<{ json: JSON }>>;
};
export const QueryInput: React.FC<P> = (props) => {
  const [jqQuery, setJqQuery] = useState(".");

  useEffect(() => {
    console.log(jqQuery);
    chrome.runtime.sendMessage({ type: "query", text: jqQuery });
  }, [jqQuery]);
  return (
    <>
      <input
        type="text"
        placeholder="jq query"
        className="queryInput"
        onChange={(e) => {
          setJqQuery(e.currentTarget.value);
        }}
        value={jqQuery}
      />
    </>
  );
};
