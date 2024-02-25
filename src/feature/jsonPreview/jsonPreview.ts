import { convertJSONToHTML } from "./convertJSONToHTML";
import { getSurroundCharactor, surroundParentheses } from "./parentheses";
import jq from "jq-web/jq.asm.bundle.js";

export const jsonPreview = (targetJson: JSON) => {
  console.log(targetJson);
  chrome.runtime.sendMessage({ type: "road", text: targetJson });

  const surruondChar = getSurroundCharactor(targetJson);
  // FIXME XSS
  document.body.innerHTML = surroundParentheses(
    convertJSONToHTML(targetJson),
    surruondChar
  );

  console.log("jq", targetJson);
  const jqQuery = ".contact";
  const res = jq.json(targetJson, jqQuery);
  console.log(res);
};
