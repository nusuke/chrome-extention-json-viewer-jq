import { isJSON } from "./lib/isJson";
import { jsonPreview } from "./feature/jsonPreview/jsonPreview";
import { jq } from "./feature/jq/jq";

const main = () => {
  if (!isJSON(document)) return;

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
  jsonPreview(targetJson);

  // targetElement[0].remove();
  jq();
};

main();
