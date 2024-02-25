"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// 拡張のアイコンをクリックした際
chrome.action.onClicked.addListener((tab) => __awaiter(void 0, void 0, void 0, function* () {
    if (tab.id === undefined)
        return;
    yield chrome.scripting.insertCSS({
        files: ["json-preview.css"],
        target: { tabId: tab.id },
    });
}));
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("message 受信", message);
    if (message.greeting === "tip") {
        chrome.storage.local.get("tip").then(sendResponse);
        return true;
    }
});
