// Architecture diagrams for the home page and case studies. Zero-prop exports;
// every label comes from lib/data.ts facts.
import { Diagram } from "./diagram";

export const LayeredDiagram = () => (
  <Diagram
    id="layered"
    title="Asthafy layered architecture: storefront to controller, service and repository, down to PostgreSQL, with a Redis cache beside the service layer."
    width={440}
    height={528}
    nodes={[
      { id: "client", x: 50, y: 12, w: 200, label: "Storefront", sub: "Next.js" },
      { id: "controller", x: 50, y: 124, w: 200, label: "Controller", sub: "Express.js · REST" },
      { id: "service", x: 50, y: 236, w: 200, label: "Service", sub: "business logic", tone: "accent" },
      { id: "repo", x: 50, y: 348, w: 200, label: "Repository", sub: "decoupled from the ORM" },
      { id: "db", x: 50, y: 460, w: 200, label: "PostgreSQL", sub: "normalised schema" },
      { id: "redis", x: 290, y: 236, w: 145, label: "Redis", sub: "targeted invalidation", tone: "dashed" },
    ]}
    edges={[
      { from: "client", to: "controller", label: "HTTP" },
      { from: "controller", to: "service" },
      { from: "service", to: "repo" },
      { from: "repo", to: "db", label: "ORM" },
      { from: "service", to: "redis", label: "cache" },
    ]}
  />
);

export const AdapterDiagram = () => (
  <Diagram
    id="adapter"
    title="Asthafy integration layer: a factory returns a Shopify or WordPress adapter, both behind one common interface."
    width={440}
    height={528}
    nodes={[
      { id: "service", x: 110, y: 12, w: 220, label: "Service layer", sub: "business logic" },
      { id: "factory", x: 110, y: 124, w: 220, label: "Factory", sub: "picks the adapter", tone: "accent" },
      { id: "iface", x: 110, y: 236, w: 220, label: "«interface» Adapter", sub: "one common contract", tone: "dashed" },
      { id: "shopifyA", x: 20, y: 348, w: 190, label: "Shopify adapter" },
      { id: "wpA", x: 230, y: 348, w: 190, label: "WordPress adapter" },
      { id: "shopify", x: 20, y: 460, w: 190, label: "Shopify" },
      { id: "wp", x: 230, y: 460, w: 190, label: "WordPress" },
    ]}
    edges={[
      { from: "service", to: "factory" },
      { from: "factory", to: "iface", label: "returns" },
      { from: "iface", to: "shopifyA", label: "implements", dashed: true },
      { from: "iface", to: "wpA", dashed: true },
      { from: "shopifyA", to: "shopify" },
      { from: "wpA", to: "wp" },
    ]}
  />
);

export const PosModulesDiagram = () => (
  <Diagram
    id="pos"
    accent="cyan"
    title="Asthafy POS: terminals call an idempotent checkout API; sales, inventory, payments and reporting modules share a domain and auth layer with the storefront, over PostgreSQL ACID transactions."
    width={460}
    height={528}
    nodes={[
      { id: "terminals", x: 120, y: 12, w: 220, label: "POS terminals", sub: "concurrent checkouts" },
      { id: "api", x: 120, y: 124, w: 220, label: "Express API", sub: "idempotent checkout", tone: "accent" },
      { id: "sales", x: 7, y: 236, w: 98, label: "Sales" },
      { id: "inventory", x: 123, y: 236, w: 98, label: "Inventory" },
      { id: "payments", x: 239, y: 236, w: 98, label: "Payments" },
      { id: "reporting", x: 355, y: 236, w: 98, label: "Reporting" },
      { id: "shared", x: 80, y: 348, w: 300, label: "Shared domain + auth", sub: "dependency inversion" },
      { id: "storefront", x: 20, y: 460, w: 170, label: "Storefront", sub: "Asthafy" },
      { id: "db", x: 270, y: 460, w: 170, label: "PostgreSQL", sub: "ACID transactions" },
    ]}
    edges={[
      { from: "terminals", to: "api" },
      { from: "api", to: "sales" },
      { from: "api", to: "inventory" },
      { from: "api", to: "payments" },
      { from: "api", to: "reporting" },
      { from: "sales", to: "shared" },
      { from: "inventory", to: "shared" },
      { from: "payments", to: "shared" },
      { from: "reporting", to: "shared" },
      { from: "storefront", to: "shared", label: "shares" },
      { from: "shared", to: "db" },
    ]}
  />
);

export const XeroSyncDiagram = () => (
  <Diagram
    id="xero"
    accent="pink"
    title="Lumiere Xero sync: portal actions fire observers that queue sync jobs; jobs write idempotently to the Xero API, refresh tokens and retry with backoff."
    width={460}
    height={528}
    nodes={[
      { id: "portal", x: 80, y: 12, w: 200, label: "Portal action", sub: "Laravel" },
      { id: "mysql", x: 310, y: 12, w: 130, label: "MySQL" },
      { id: "observer", x: 80, y: 124, w: 200, label: "Observer", sub: "model events" },
      { id: "queue", x: 80, y: 236, w: 200, label: "Queue", sub: "Laravel queues" },
      { id: "job", x: 80, y: 348, w: 200, label: "Sync job", sub: "idempotent writes", tone: "accent" },
      { id: "xero", x: 80, y: 460, w: 200, label: "Xero API" },
      { id: "token", x: 310, y: 460, w: 130, label: "Token refresh", tone: "dashed" },
    ]}
    edges={[
      { from: "portal", to: "mysql" },
      { from: "portal", to: "observer" },
      { from: "observer", to: "queue", label: "dispatch" },
      { from: "queue", to: "job" },
      { from: "job", to: "xero" },
      { from: "token", to: "xero" },
      { d: "M280 376H330V264H280", at: [338, 320], label: "retry + backoff", dashed: true },
    ]}
  />
);
