import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { readFile } from "node:fs/promises";

type Property = { id: number; address: string; city: string; state: string; zip: string; price: number; beds: number; baths: number; sqft: number; lotSize: string; yearBuilt: number; status: string; image: string; description: string; features: string[]; agent: string };

const getProperty = createServerFn({ method: "GET" })
  .validator((d: unknown) => d as number)
  .handler(async ({ data: id }) => {
    try {
      const raw = await readFile("src/data/properties.json", "utf8");
      const properties = JSON.parse(raw) as Property[];
      return properties.find((p) => p.id === id) ?? null;
    } catch { return null; }
  });

export const Route = createFileRoute("/listings/$id")({
  loader: async ({ params }) => {
    const property = await getProperty(Number(params.id));
    if (!property) throw notFound();
    return property;
  },
  notFoundComponent: () => (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-warm-50 px-6 text-center">
      <h1 className="text-3xl font-bold text-navy-900">Property Not Found</h1>
      <p className="text-navy-600">This listing may have been removed or doesn't exist.</p>
      <Link to="/listings" className="rounded-full bg-havenly-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-havenly-600">Browse All Listings</Link>
    </div>
  ),
  component: ListingDetail,
});

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(price);
}

function StatusBadge({ status }: { status: string }) {
  const s: Record<string, string> = { "for-sale": "bg-green-100 text-green-800", pending: "bg-amber-100 text-amber-800", sold: "bg-gray-100 text-gray-600" };
  const l: Record<string, string> = { "for-sale": "For Sale", pending: "Pending", sold: "Sold" };
  return <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${s[status] || ""}`}>{l[status] || status}</span>;
}

function ListingDetail() {
  const property = Route.useLoaderData();
  return (
    <div className="min-h-dvh bg-warm-50">
      <div className="h-16" />
      <div className="mx-auto max-w-7xl px-6 pt-6">
        <Link to="/listings" className="inline-flex items-center gap-2 text-sm font-medium text-navy-600 hover:text-navy-900">← Back to Listings</Link>
      </div>
      <div className="relative mx-auto mt-4 max-w-7xl px-6">
        <div className="relative h-64 overflow-hidden rounded-2xl sm:h-80 md:h-96">
          <img src={property.image} alt={property.address} className="h-full w-full object-cover" />
          <div className="absolute right-4 top-4"><StatusBadge status={property.status} /></div>
        </div>
      </div>
      <div className="mx-auto mt-8 max-w-7xl px-6 pb-20">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <p className="text-3xl font-bold text-navy-900 sm:text-4xl">{formatPrice(property.price)}</p>
            <h1 className="mt-2 text-xl font-bold text-navy-900 sm:text-2xl">{property.address}</h1>
            <p className="mt-1 text-navy-500">{property.city}, {property.state} {property.zip}</p>
            <div className="mt-6 grid grid-cols-3 gap-4 rounded-2xl bg-white p-6 shadow-sm">
              <div className="text-center"><p className="text-2xl font-bold text-navy-900">{property.beds}</p><p className="text-sm text-navy-500">Beds</p></div>
              <div className="text-center"><p className="text-2xl font-bold text-navy-900">{property.baths}</p><p className="text-sm text-navy-500">Baths</p></div>
              <div className="text-center"><p className="text-2xl font-bold text-navy-900">{property.sqft.toLocaleString()}</p><p className="text-sm text-navy-500">Sq Ft</p></div>
              <div className="text-center"><p className="text-2xl font-bold text-navy-900">{property.yearBuilt}</p><p className="text-sm text-navy-500">Year</p></div>
              <div className="text-center"><p className="text-2xl font-bold text-navy-900">{property.lotSize}</p><p className="text-sm text-navy-500">Lot</p></div>
              <div className="text-center"><p className="text-2xl font-bold text-havenly-500">{property.status === "for-sale" ? "Active" : property.status === "pending" ? "Pending" : "Sold"}</p><p className="text-sm text-navy-500">Status</p></div>
            </div>
            <div className="mt-8"><h2 className="text-xl font-bold text-navy-900">About This Property</h2><p className="mt-3 leading-relaxed text-navy-700">{property.description}</p></div>
            <div className="mt-8"><h2 className="text-xl font-bold text-navy-900">Features</h2><ul className="mt-4 grid gap-2 sm:grid-cols-2">{property.features.map((f) => (<li key={f} className="flex items-start gap-2 rounded-lg bg-white p-3 text-sm text-navy-700 shadow-sm"><svg className="mt-0.5 h-4 w-4 shrink-0 text-havenly-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>{f}</li>))}</ul></div>
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-navy-900">Listed by</h3>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-havenly-100 text-lg font-bold text-havenly-600">{property.agent.split(" ").map((n) => n[0]).join("")}</div>
                <div><p className="font-semibold text-navy-900">{property.agent}</p><p className="text-sm text-navy-500">Havenly Agent</p></div>
              </div>
              <div className="mt-6 space-y-3">
                <a href="/#contact" className="block w-full rounded-full bg-havenly-500 py-3 text-center text-sm font-semibold text-white shadow hover:bg-havenly-600">Schedule a Tour</a>
              </div>
              <div className="mt-6 border-t border-gray-100 pt-6"><p className="text-xs text-navy-500 leading-relaxed">Selling? Flat-fee starts at $3k. <a href="/#contact" className="text-havenly-600 underline">Get a valuation</a></p></div>
            </div>
          </div>
        </div>
      </div>
      <footer className="bg-navy-950 px-6 py-12 text-white/60"><div className="mx-auto max-w-7xl text-center text-xs">© {new Date().getFullYear()} Havenly. All rights reserved.</div></footer>
    </div>
  );
}