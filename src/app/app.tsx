import { useState, createContext, useEffect } from "react";
import { QueryInput } from "./feature/jq/queryInput";
import { JsonPreview } from "./feature/jsonPreview/jsonPreview";
import { logger } from "../lib/logger";

type P = { targetJson: JSON; initialJqQuery: string };
export const App: React.FC<P> = (props) => {
  const [targetJSON, setTargetJson] = useState(props.targetJson);

  useEffect(() => {
    chrome.runtime.onMessage.addListener(function (request) {
      logger.debug(request);
      if (
        typeof request.filteredJSON === "string" ||
        typeof request.filteredJSON === "number"
      ) {
        setTargetJson(JSON.parse(JSON.stringify({ "": request.filteredJSON })));
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
      <QueryInput initialJqQuery={props.initialJqQuery} />
      <JsonPreview targetJson={targetJSON} />
    </>
  );
};
