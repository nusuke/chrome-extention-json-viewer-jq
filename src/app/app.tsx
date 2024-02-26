import { useState, createContext } from "react";
import { QueryInput } from "./feature/jq/queryInput";
import { JsonPreview } from "./feature/jsonPreview/jsonPreview";

type P = { targetJson: JSON };
export const App: React.FC<P> = (props) => {
  const appContextDefault = { json: props.targetJson };
  const [applicationState, setApplicationState] = useState(appContextDefault);
  const AppContext = createContext(appContextDefault);
  return (
    <AppContext.Provider value={applicationState}>
      <QueryInput changeHandle={setApplicationState} />
      <JsonPreview targetJson={props.targetJson} />
    </AppContext.Provider>
  );
};
