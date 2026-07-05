import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { readFile } from "node:fs/promises";

type Property = {
  id: number;
  address: string;
  city: string;
  state: string;
  zip: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  status: string;
  image: string;
  description: string;
};

const getProperties = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const data = await readFile("src/data/properties.json", "utf8");
    return JSON.parse(data) as Property[];
  } catch {
    return [] as Property[];
  }
});

export const Route = createFileRoute("/listings/")({
  loader: () => getProperties(),
  component: ListingsPage,
});

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(price);
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = { "for-sale": "bg-green-100 text-green-800", pending: "bg-amber-100 text-amber-800", sold: "bg-gray-100 text-gray-600" };
  const labels: Record<string, string> = { "for-sale": "For Sale", pending: "Pending", sold: "Sold" };
  return <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${styles[status] || "bg-gray-100 text-gray-600"}`}>{labels[status] || status}</span>;
}

function ListingsPage() {
  const properties = Route.useLoaderData();
  const statusFilter = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("status") || "all" : "all";
  const filtered = statusFilter === "all" ? properties : properties.filter((p) => p.status === statusFilter);

  return (
    <div className="min-h-dvh bg-warm-50">
      <div className="h-16" />
      <section className="bg-navy-950 px-6 py-16 text-white md:py-20">
        <div className="mx-auto max-w-7xl">
          <span className="text-sm font-bold uppercase tracking-widest text-havenly-300">Property Listings</span>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl md:text-5xl">Find Your Dream Home</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/70">Browse our curated selection of premium properties. Each listing includes virtual tours, detailed specs, and a dedicated Havenly agent.</p>
        </div>
      </section>
      <section className="sticky top-16 z-30 border-b border-gray-200 bg-white/90 px-6 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <span className="text-sm font-medium text-navy-700">Filter:</span>
          {["all", "for-sale", "pending", "sold"].map((s) => (
            <Link key={s} to="/listings" search={s === "all" ? {} : { status: s }}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${statusFilter === s ? "bg-havenly-500 text-white shadow-sm" : "bg-gray-100 text-navy-700 hover:bg-gray-200"}`}>
              {s === "all" ? "All" : s === "for-sale" ? "For Sale" : s.charAt(0).toUpperCase() + s.slice(1)}
            </Link>
          ))}
          <span className="ml-auto text-sm text-navy-500">{filtered.length} {filtered.length === 1 ? "property" : "properties"}</span>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-6 py-10">
        {filtered.length === 0 ? (
          <div className="py-20 text-center"><p className="text-lg text-navy-500">No properties match this filter.</p></div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((prop) => (
              <Link key={prop.id} to="/listings/$id" params={{ id: String(prop.id) }}
                className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                <div className="relative h-52 overflow-hidden">
                  <img src={prop.image} alt={prop.address} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute right-3 top-3"><StatusBadge status={prop.status} /></div>
                </div>
                <div className="p-5">
                  <p className="text-2xl font-bold text-navy-900">{formatPrice(prop.price)}</p>
                  <p className="mt-1 text-sm text-navy-700">{prop.address}</p>
                  <p className="text-xs text-navy-500">{prop.city}, {prop.state} {prop.zip}</p>
                  <div className="mt-3 flex items-center gap-4 text-sm text-navy-600">
                    <span>🛏 {prop.beds} bd</span>
                    <span>🛁 {prop.baths} ba</span>
                    <span>📐 {prop.sqft.toLocaleString()} sqft</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
      <footer className="bg-navy-950 px-6 py-12 text-white/60">
        <div className="mx-auto max-w-7xl text-center text-xs">&copy; {new Date().getFullYear()} Havenly. All rights reserved.</div>
      </footer>
    </div>
  );
}