import { convertJSONToHTML } from "./convertJSONToHTML";
import { getSurroundCharactor, surroundParentheses } from "./parentheses";

export const jsonPreview = (targetJson: JSON) => {
  chrome.runtime.sendMessage({ type: "road", text: targetJson });

  const surruondChar = getSurroundCharactor(targetJson);
  // FIXME XSS
  document.body.innerHTML = surroundParentheses(
    convertJSONToHTML(targetJson),
    surruondChar
  );
};
