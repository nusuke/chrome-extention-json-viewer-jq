import { useEffect } from "react";
import { convertJSONToHTML } from "./convertJSONToHTML";
import { getSurroundCharactor, surroundParentheses } from "./parentheses";
import { messageType } from "../../../background";

type P = { targetJson: JSON };
export const JsonPreview: React.FC<P> = (props: P) => {
  useEffect(() => {
    chrome.runtime.sendMessage({
      type: messageType.load,
      text: JSON.stringify(props.targetJson),
    });
  }, []);
  const surruondChar = getSurroundCharactor(props.targetJson);

  return (
    <div className="jsonPreview">
      {surroundParentheses(convertJSONToHTML(props.targetJson), surruondChar)}
    </div>
  );
};
