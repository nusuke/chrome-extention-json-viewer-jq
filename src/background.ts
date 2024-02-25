// 拡張のアイコンをクリックした際
chrome.action.onClicked.addListener(async (tab) => {
  if (tab.id === undefined) return;

  await chrome.scripting.insertCSS({
    files: ["json-preview.css"],
    target: { tabId: tab.id },
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("message 受信", message);
  if (message.greeting === "tip") {
    chrome.storage.local.get("tip").then(sendResponse);
    return true;
  }
});
