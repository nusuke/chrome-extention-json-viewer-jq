import { useState, createContext, useEffect } from "react";
import { QueryInput } from "./feature/jq/queryInput";
import { JsonPreview } from "./feature/jsonPreview/jsonPreview";

type P = { targetJson: JSON };
export const App: React.FC<P> = (props) => {
  const [targetJSON, setTargetJson] = useState(props.targetJson);

  useEffect(() => {
    chrome.runtime.onMessage.addListener(function (request) {
      console.log(request);
      if (
        typeof request.filteredJSON === "string" ||
        typeof request.filteredJSON === "number"
      ) {
        setTargetJson(
          JSON.parse(
            JSON.stringify({ "jq result value =>": request.filteredJSON })
          )
        );
      } else {
        try {
          const json = JSON.parse(JSON.stringify(request.filteredJSON));
          setTargetJson(json ?? props.targetJson);
        } catch (e) {
          setTargetJson(props.targetJson);
        }
      }
    });
  }, []);

  return (
    <>
      <QueryInput />
      <JsonPreview targetJson={targetJSON} />
    </>
  );
};
