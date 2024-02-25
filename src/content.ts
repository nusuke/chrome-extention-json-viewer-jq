import { isJSON } from "./lib/isJson";

(async () => {
  if (!isJSON(document)) {
    return;
  }

  const targetElement = document.getElementsByTagName("pre");
  if (!targetElement) return;
  const jsonString = targetElement[0].innerText;
  if (!jsonString) return;

  let targetJson: { [key: string]: any } | undefined;
  try {
    targetJson = JSON.parse(jsonString);
  } catch (e) {
    console.log("JSONでは無いのでSKIP");
    console.error(e);
    return;
  }
  if (targetJson === undefined) return;
  await chrome.runtime.sendMessage({ type: "road", text: jsonString });

  targetElement[0].remove();

  // FIXME XSS
  document.body.innerHTML = formatJson(targetJson);
})();

function formatJson(obj: any, indent = 2) {
  let result = "";

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      result += `<pre><span class="jsonKey">${key}:</span>${JSON.stringify(
        obj[key],
        null,
        indent
      )}</pre>`;
    }
  }

  return result;
}
