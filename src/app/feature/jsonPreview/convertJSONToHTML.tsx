import { getSurroundCharactor, surroundParentheses } from "./parentheses";

/**
 * jsonを受け取り、key,value,中間オブジェクト毎にhtmlタグを付与
 * @param json
 * @returns
 */
export function convertJSONToHTML(json: JSON) {
  const nodes = [];

  for (const [key, value] of Object.entries(json)) {
    nodes.push(<span className="jsonKey">{key}</span>);
    if (typeof value === "object") {
      const surruondChar = getSurroundCharactor(value);
      nodes.push(
        <span className="jsonMiddleKey">
          {surroundParentheses(convertJSONToHTML(value), surruondChar)}
        </span>
      );
    } else {
      nodes.push(<span className="jsonValue">{value}</span>);
    }
  }
  return nodes;
}
