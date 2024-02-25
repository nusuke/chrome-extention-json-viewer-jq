import { getSurroundCharactor, surroundParentheses } from "./parentheses";

/**
 * jsonを受け取り、key,value,中間オブジェクト毎にhtmlタグを付与
 * @param json
 * @returns
 */
export function convertJSONToHTML(json: JSON) {
  let html = "";

  for (const [key, value] of Object.entries(json)) {
    html += `<span class="jsonKey">${key}</span>`;
    if (typeof value === "object") {
      const surruondChar = getSurroundCharactor(value);
      html += `<span class="jsonMiddleKey">${surroundParentheses(
        convertJSONToHTML(value),
        surruondChar
      )}</span>`;
    } else {
      html += `<span class="jsonValue">${value}</span>`;
    }
  }
  return html;
}
