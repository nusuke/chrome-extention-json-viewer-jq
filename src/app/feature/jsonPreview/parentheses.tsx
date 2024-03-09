type SurroundChars = { start: string; end: string };
/**
 * Object,Arrayを判別
 * @param value
 * @returns
 */
export function getSurroundCharactor(value: unknown): SurroundChars {
  if (Array.isArray(value)) {
    return { start: "[", end: "]" };
  } else if (typeof value === "object") {
    return { start: "{", end: "}" };
  } else {
    return { start: "", end: "" };
  }
}

/**
 * Array,Object型を{},[]で囲う
 * @param text
 * @param surroundChars
 * @returns
 */
export function surroundParentheses(
  text: JSX.Element[],
  surroundChars: SurroundChars
) {
  return (
    <>
      <div className="jsonMiddleWrapper">
        <span className="surroundChar--start">{surroundChars.start}</span>
        <details open={true} className="jsonObjectWrapper">
          <summary>
            {surroundChars.start}
            {text.length}
            {surroundChars.end}
          </summary>
          <span className="jsonObject">{text}</span>
        </details>
      </div>
      <span>{surroundChars.end}</span>
    </>
  );
}
