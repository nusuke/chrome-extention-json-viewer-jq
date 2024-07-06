import { logger } from "../../../lib/logger";
import { getSurroundCharactor, surroundParentheses } from "./parentheses";

/**
 * jsonを受け取り、key,value,中間オブジェクト毎にhtmlタグを付与
 * @param json
 * @returns
 */
export function convertJSONToHTML(json: JSON) {
  const nodes = [];

  // booleanなどが単一で入ってきた際
  const jsonArray = Object.entries(json);
  if (jsonArray.length === 0) {
    nodes.push(
      <div className="jsonRow">
        <span className="jsonValue">{convertJsonValueToHTML(json)}</span>
      </div>
    );

    return nodes;
  }
  for (const [key, value] of jsonArray) {
    // keyがfalsyの場合
    if (!key) {
      nodes.push(
        <div className="jsonRow">
          <span className="jsonValue">{convertJsonValueToHTML(value)}</span>
        </div>
      );
      return nodes;
    }

    if (typeof value === "object") {
      const surruondChar = getSurroundCharactor(value);
      nodes.push(
        <div className="jsonRow">
          <span className="jsonMiddleKey">{key}</span>
          <div className="jsonMiddleValue">
            {surroundParentheses(convertJSONToHTML(value), surruondChar)}
          </div>
        </div>
      );
    } else {
      nodes.push(
        <div className="jsonRow">
          <span className="jsonKey">{key}</span>
          <span className="jsonValue">{convertJsonValueToHTML(value)}</span>
        </div>
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
  } else if (typeof value === "boolean") {
    return (
      <span className="jsonValue--boolean">{value ? "true" : "false"}</span>
    );
  } else if (typeof value === "undefined") {
    return <span className="jsonValue--undefined">{value}</span>;
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
