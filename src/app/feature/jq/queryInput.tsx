import { Dispatch, SetStateAction, useEffect, useState } from "react";

type P = {};
export const QueryInput: React.FC<P> = () => {
  const [jqQuery, setJqQuery] = useState(".");

  useEffect(() => {
    console.log(jqQuery);
    chrome.runtime
      .sendMessage({
        type: "query",
        text: jqQuery,
      })
      .then((res) => {
        console.log(res);
      });
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
