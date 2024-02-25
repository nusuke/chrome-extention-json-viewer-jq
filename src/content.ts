import { isJSON } from "./lib/isJson";
import { convertJSONToHTML } from "./lib/jsonViewer/convertJSONToHTML";
import {
  getSurroundCharactor,
  surroundParentheses,
} from "./lib/jsonViewer/parentheses";

(async () => {
  if (!isJSON(document)) {
    console.log("this document is not json.");
    return;
  }

  const targetElement = document.getElementsByTagName("pre");
  if (!targetElement) return;
  const jsonString = targetElement[0].innerText;
  if (!jsonString) return;

  let targetJson: JSON | undefined;
  try {
    targetJson = JSON.parse(jsonString);
  } catch (e) {
    console.error(e);
    return;
  }
  if (targetJson === undefined) return;
  await chrome.runtime.sendMessage({ type: "road", text: jsonString });

  targetElement[0].remove();

  const surruondChar = getSurroundCharactor(targetJson);
  // FIXME XSS
  document.body.innerHTML = surroundParentheses(
    convertJSONToHTML(targetJson),
    surruondChar
  );
})();
