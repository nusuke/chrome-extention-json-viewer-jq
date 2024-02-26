import { isJSON } from "./lib/isJson";
import { JsonPreview } from "./app/feature/jsonPreview/jsonPreview";
import { createRoot } from "react-dom/client";
import { QueryInput } from "./app/feature/jq/queryInput";
import { createContext, useContext, useState } from "react";
import { App } from "./app/app";

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

  const root = createRoot(document.body);
  root.render(<App targetJson={targetJson} />);
};

main();
