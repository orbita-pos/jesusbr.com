/* eslint-disable @typescript-eslint/no-explicit-any */
let wasmModule: any = null;
let initPromise: Promise<void> | null = null;

async function ensureWasmLoaded() {
  if (wasmModule) return;
  if (initPromise) {
    await initPromise;
    return;
  }
  initPromise = (async () => {
    // Load glue JS and WASM from public/ at runtime to avoid bundler issues
    const glue = await import(/* webpackIgnore: true */ "/wasm/cfdi_cli.js");
    await glue.default("/wasm/cfdi_cli_bg.wasm");
    wasmModule = glue;
  })();
  await initPromise;
}

export async function parseCfdi(xml: string): Promise<unknown> {
  await ensureWasmLoaded();
  return JSON.parse(wasmModule.parseCfdiPretty(xml));
}

export async function validateCfdi(
  xml: string
): Promise<{ valid: boolean; errors: string[]; warnings: string[] }> {
  await ensureWasmLoaded();
  return JSON.parse(wasmModule.validateCfdi(xml));
}

export async function infoCfdi(xml: string): Promise<unknown> {
  await ensureWasmLoaded();
  return JSON.parse(wasmModule.infoCfdi(xml));
}

export async function parseCfdiBulk(xmls: string[]): Promise<unknown[]> {
  await ensureWasmLoaded();
  return JSON.parse(wasmModule.parseCfdiBulk(JSON.stringify(xmls)));
}
