declare module "jq-web/jq.wasm.js" {
  function json(json: unknown, jqQuery: string): string | undefined | null;
}
