type MessageType = {
  type: "road";
  text: string;
};
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
        // const json = JSON.parse(text);

        await chrome.scripting.insertCSS({
          files: ["style.css"],
          target: { tabId: sender.tab.id },
        });

        // const key = "json";
        // chrome.storage.session.set({ [key]: json }).then(sendResponse);

        return true;
      } catch (e) {
        console.error(e);
      }
    }
  }
);
