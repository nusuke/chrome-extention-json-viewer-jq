(async () => {
  const targetElement = document.getElementsByTagName("pre");
  if (!targetElement) return;
  const jsonString = targetElement[0].innerText;
  if (!jsonString) return;

  let targetJson: { [key: string]: any } | undefined;
  try {
    targetJson = JSON.parse(jsonString);
  } catch (e) {
    console.error(e);
    return;
  }
  if (targetJson === undefined) return;
  await chrome.runtime.sendMessage({ type: "road", text: jsonString });

  targetElement[0].remove();

  // FIXME XSS
  document.body.innerHTML = formatJson(targetJson);
})();

function createDomElement(html: string) {
  const dom = new DOMParser().parseFromString(html, "text/html");
  return dom.body.firstElementChild;
}

function formatJson(obj: any, indent = 2) {
  let result = "";

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      result += `<div class="jsonKey">${key}:</div><pre>${JSON.stringify(
        obj[key],
        null,
        indent
      )}</pre>`;
    }
  }

  return result;
}
