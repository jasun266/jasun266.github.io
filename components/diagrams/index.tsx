// STUB — replaced by the diagrams builder agent. Keep these four exports and
// their zero-prop signatures: case studies import them by name.
function Placeholder({ label }: { label: string }) {
  return <div className="rounded-2xl border border-border p-10 font-mono text-sm">{label}</div>;
}
export const LayeredDiagram = () => <Placeholder label="controller → service → repository" />;
export const AdapterDiagram = () => <Placeholder label="Factory → Shopify / WordPress adapters" />;
export const PosModulesDiagram = () => <Placeholder label="POS modules" />;
export const XeroSyncDiagram = () => <Placeholder label="Xero sync pipeline" />;
