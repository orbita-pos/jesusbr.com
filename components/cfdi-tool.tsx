"use client";

import { useState, useCallback, useRef } from "react";

type CfdiResult = {
  fileName: string;
  data: Record<string, unknown> | null;
  validation: { valid: boolean; errors: string[]; warnings: string[] } | null;
  error: string | null;
};

type ViewMode = "json" | "table";

export function CfdiTool() {
  const [results, setResults] = useState<CfdiResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback(async (files: FileList | File[]) => {
    setLoading(true);
    try {
      const { parseCfdi, validateCfdi } = await import("@/lib/cfdi");
      const fileArray = Array.from(files).filter((f) => f.name.endsWith(".xml"));

      const newResults: CfdiResult[] = [];
      for (const file of fileArray) {
        try {
          const xml = await file.text();
          const data = (await parseCfdi(xml)) as Record<string, unknown>;
          const validation = await validateCfdi(xml);
          newResults.push({ fileName: file.name, data, validation, error: null });
        } catch (e) {
          newResults.push({
            fileName: file.name,
            data: null,
            validation: null,
            error: e instanceof Error ? e.message : "Error desconocido",
          });
        }
      }
      setResults((prev) => [...prev, ...newResults]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      if (e.dataTransfer.files.length > 0) {
        processFiles(e.dataTransfer.files);
      }
    },
    [processFiles]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        processFiles(e.target.files);
      }
    },
    [processFiles]
  );

  const downloadCsv = useCallback(() => {
    const valid = results.filter((r) => r.data);
    if (valid.length === 0) return;

    const headers = [
      "archivo",
      "uuid",
      "fecha",
      "tipo",
      "emisor_rfc",
      "emisor_nombre",
      "receptor_rfc",
      "receptor_nombre",
      "subtotal",
      "total",
      "moneda",
    ];

    const rows = valid.map((r) => {
      const d = r.data as Record<string, unknown>;
      const emisor = (d.emisor || {}) as Record<string, unknown>;
      const receptor = (d.receptor || {}) as Record<string, unknown>;
      return [
        r.fileName,
        d.uuid || "",
        d.fecha || "",
        d.tipo_de_comprobante || "",
        emisor.rfc || "",
        emisor.nombre || "",
        receptor.rfc || "",
        receptor.nombre || "",
        d.sub_total || "",
        d.total || "",
        d.moneda || "",
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(",");
    });

    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cfdi-reporte.csv";
    a.click();
    URL.revokeObjectURL(url);
  }, [results]);

  const downloadJson = useCallback(() => {
    const valid = results.filter((r) => r.data);
    if (valid.length === 0) return;
    const json = JSON.stringify(
      valid.map((r) => r.data),
      null,
      2
    );
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cfdi-reporte.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [results]);

  return (
    <section className="pb-16">
      <div className="mx-auto max-w-6xl px-6">
        {/* Drop zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center border-2 border-dashed p-16 transition-colors ${
            dragging
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          }`}
        >
          <svg
            className="mb-4 h-12 w-12 text-muted-foreground/40"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
            />
          </svg>
          <p className="text-center font-mono text-sm text-muted-foreground">
            {loading
              ? "Procesando..."
              : "Arrastra tus archivos XML aqui o haz click para seleccionar"}
          </p>
          <p className="mt-2 text-center font-mono text-xs text-muted-foreground/60">
            Tus archivos se procesan localmente, nunca se suben a ningun servidor
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xml"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="mt-8">
            {/* Toolbar */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-muted-foreground">
                  {results.length} factura{results.length !== 1 ? "s" : ""} procesada
                  {results.length !== 1 ? "s" : ""}
                </span>
                <button
                  onClick={() => setResults([])}
                  className="font-mono text-xs text-muted-foreground/60 transition-colors hover:text-foreground"
                >
                  [limpiar]
                </button>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex border border-border">
                  <button
                    onClick={() => setViewMode("table")}
                    className={`px-3 py-1.5 font-mono text-xs transition-colors ${
                      viewMode === "table"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Tabla
                  </button>
                  <button
                    onClick={() => setViewMode("json")}
                    className={`px-3 py-1.5 font-mono text-xs transition-colors ${
                      viewMode === "json"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    JSON
                  </button>
                </div>
                <button
                  onClick={downloadCsv}
                  className="border border-border px-3 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  Descargar CSV
                </button>
                <button
                  onClick={downloadJson}
                  className="border border-border px-3 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  Descargar JSON
                </button>
              </div>
            </div>

            {viewMode === "table" ? (
              <div className="overflow-x-auto border border-border">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="px-4 py-3 font-medium text-muted-foreground">Archivo</th>
                      <th className="px-4 py-3 font-medium text-muted-foreground">UUID</th>
                      <th className="px-4 py-3 font-medium text-muted-foreground">Fecha</th>
                      <th className="px-4 py-3 font-medium text-muted-foreground">Emisor</th>
                      <th className="px-4 py-3 font-medium text-muted-foreground">Receptor</th>
                      <th className="px-4 py-3 text-right font-medium text-muted-foreground">Total</th>
                      <th className="px-4 py-3 font-medium text-muted-foreground">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r, i) => {
                      if (r.error) {
                        return (
                          <tr key={i} className="border-b border-border/50">
                            <td className="px-4 py-3 text-foreground">{r.fileName}</td>
                            <td colSpan={5} className="px-4 py-3 text-red-400">
                              {r.error}
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-red-400">Error</span>
                            </td>
                          </tr>
                        );
                      }
                      const d = r.data as Record<string, unknown>;
                      const emisor = (d.emisor || {}) as Record<string, unknown>;
                      const receptor = (d.receptor || {}) as Record<string, unknown>;
                      const uuid = String(d.uuid || "").slice(0, 8) + "...";
                      return (
                        <tr key={i} className="border-b border-border/50 hover:bg-muted/20">
                          <td className="px-4 py-3 text-foreground">{r.fileName}</td>
                          <td className="px-4 py-3 text-muted-foreground">{uuid}</td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {String(d.fecha || "").slice(0, 10)}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {String(emisor.nombre || emisor.rfc || "")}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {String(receptor.nombre || receptor.rfc || "")}
                          </td>
                          <td className="px-4 py-3 text-right text-foreground">
                            ${String(d.total || "0")} {String(d.moneda || "")}
                          </td>
                          <td className="px-4 py-3">
                            {r.validation?.valid ? (
                              <span className="text-green-400">Valido</span>
                            ) : (
                              <span className="text-yellow-400">
                                {r.validation?.errors?.length || 0} error(es)
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="max-h-[600px] overflow-auto border border-border bg-muted/30 p-4">
                <pre className="font-mono text-xs text-foreground">
                  {JSON.stringify(
                    results.map((r) => ({ file: r.fileName, ...((r.data as object) || { error: r.error }) })),
                    null,
                    2
                  )}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
