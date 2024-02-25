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
Object.defineProperty(exports, "__esModule", { value: true });
const isJson_1 = require("./lib/isJson");
(() => __awaiter(void 0, void 0, void 0, function* () {
    if (!(0, isJson_1.isJSON)(document)) {
        return;
    }
    const targetElement = document.getElementsByTagName("pre");
    if (!targetElement)
        return;
    const jsonString = targetElement[0].innerText;
    if (!jsonString)
        return;
    let targetJson;
    try {
        targetJson = JSON.parse(jsonString);
    }
    catch (e) {
        console.log("JSONでは無いのでSKIP");
        console.error(e);
        return;
    }
    if (targetJson === undefined)
        return;
    yield chrome.runtime.sendMessage({ type: "road", text: jsonString });
    targetElement[0].remove();
    // FIXME XSS
    document.body.innerHTML = formatJson(targetJson);
}))();
function createDomElement(html) {
    const dom = new DOMParser().parseFromString(html, "text/html");
    return dom.body.firstElementChild;
}
function formatJson(obj, indent = 2) {
    let result = "";
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            result += `<pre><span class="jsonKey">${key}:</span>${JSON.stringify(obj[key], null, indent)}</pre>`;
        }
    }
    return result;
}
