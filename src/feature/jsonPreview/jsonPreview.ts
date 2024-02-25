import { convertJSONToHTML } from "./convertJSONToHTML";
import { getSurroundCharactor, surroundParentheses } from "./parentheses";
import jq from "jq-web/jq.asm.bundle.js";

export const jsonPreview = async () => {
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

  const jqQuery = ".contact";
  const res = jq.json(targetJson, jqQuery);
  console.log(res);
};
