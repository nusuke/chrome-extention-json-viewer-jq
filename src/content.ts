import { isJSON } from "./lib/isJson";
import { jsonPreview } from "./feature/jsonPreview/jsonPreview";
import { jq } from "./feature/jq/jq";

const main = () => {
  if (!isJSON(document)) return;

  jsonPreview();
  jq();
};

main();
