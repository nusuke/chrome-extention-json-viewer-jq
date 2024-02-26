import jq from "jq-web/jq.wasm.js";

type MessageType = {
  type: "road" | "query";
  text: string;
};
const key = "json";
// 拡張のアイコンをクリックした際
chrome.action.onClicked.addListener(async (tab) => {
  if (tab.id === undefined) return;

  await chrome.scripting.insertCSS({
    files: ["json-preview.css"],
    target: { tabId: tab.id },
  });
});

chrome.runtime.onMessage.addListener(
  async (message: MessageType, sender, sendResponse) => {
    console.log("message 受信", message);
    if (!sender.tab?.id) return;

    if (message.type == "road") {
      const text = message.text;
      try {
        const json = JSON.parse(text);

        await chrome.scripting.insertCSS({
          files: ["style.css"],
          target: { tabId: sender.tab.id },
        });

        await chrome.storage.session.set({ [key]: JSON.stringify(json) });

        return true;
      } catch (e) {
        console.error(e);
      }
    } else if (message.type == "query") {
      console.log(message);
      const jqQuery = message.text;
      const json = JSON.parse(
        JSON.parse(JSON.stringify(await chrome.storage.session.get(key))).json
      );

      console.log(json);
      const res = jq.json(json, jqQuery);
      console.log("結果::", res);
    }
  }
);
