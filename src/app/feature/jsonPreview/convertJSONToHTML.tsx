import { logger } from "../../../lib/logger";
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
      nodes.push(
        <span className="jsonValue">{convertJsonValueToHTML(value)}</span>
      );
    }
  }
  return nodes;
}

/**
 * jsonのValueを文字列、数値、URLで付与するclassを変える
 * @param value
 * @returns
 */
function convertJsonValueToHTML(value: unknown) {
  if (typeof value === "number") {
    return <span className="jsonValue--number">{value}</span>;
  } else if (typeof value === "string") {
    if (URL.canParse(value)) {
      return (
        <span className="jsonValue--url">
          <a href={value} target="_blank">
            {value}
          </a>
        </span>
      );
    } else {
      return <span className="jsonValue--string">{value}</span>;
    }
  } else {
    logger.debug("unexpected value:", value);
  }
}
