import { isJSON } from "./lib/isJson";

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

function convertJSONToHTML(json: JSON) {
  let html = "";

  for (const [key, value] of Object.entries(json)) {
    html += `<span class="jsonKey">${key}</span>`;
    if (typeof value === "object") {
      const surruondChar = getSurroundCharactor(value);
      html += `<span class="jsonMiddleKey">${surroundParentheses(
        convertJSONToHTML(value),
        surruondChar
      )}</span>`;
    } else {
      html += `<span class="jsonValue">${value}</span>`;
    }
  }
  return html;
}

type SurroundChars = { start: string; end: string };
function getSurroundCharactor(value: unknown): SurroundChars {
  if (Array.isArray(value)) {
    return { start: "[", end: "]" };
  } else if (typeof value === "object") {
    return { start: "{", end: "}" };
  } else {
    return { start: "", end: "" };
  }
}

function surroundParentheses(text: string, surroundChars: SurroundChars) {
  return `<span class="surroundChar--start">${surroundChars.start}</span><span class="jsonObject">${text}</span><span class="surroundChar--end">${surroundChars.end}</span>`;
}
