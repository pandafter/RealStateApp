// src/app/page.tsx
import PropertiesLive from "@/components/PropertiesLive";
import fetchJSON from "@/lib/api";
import { PropertiesResponse } from "@/types";

export const dynamic = "force-dynamic";

function buildQuery(sp: Record<string, string | string[] | undefined>) {
  const q = new URLSearchParams();
  if (sp.name) q.set("name", String(sp.name));
  if (sp.address) q.set("address", String(sp.address));
  if (sp.minPrice) q.set("minPrice", String(sp.minPrice));
  if (sp.maxPrice) q.set("maxPrice", String(sp.maxPrice));
  q.set("page", String(sp.page ?? "1"));
  q.set("size", String(sp.size ?? "12"));
  return q.toString();
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  const sp = await searchParams;

  const query = buildQuery(sp);

  const fallback: PropertiesResponse = {
    items: [],
    total: 0,
    page: Number(sp.page ?? 1),
    size: Number(sp.size ?? 12),
  };

  const initialData =
    (await fetchJSON<PropertiesResponse>(`/api/v1/properties?${query}`, {}, fallback)) ??
    fallback;

  const initialFilters = {
    name: sp.name ? String(sp.name) : "",
    address: sp.address ? String(sp.address) : "",
    minPrice: sp.minPrice ? String(sp.minPrice) : "",
    maxPrice: sp.maxPrice ? String(sp.maxPrice) : "",
    page: Number(sp.page ?? 1),
    size: Number(sp.size ?? 12),
  };

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: 16 }}>
      <h1 style={{ fontSize: 24, margin: "8px 0 16px" }}>Properties</h1>
      <PropertiesLive initialFilters={initialFilters} initialData={initialData} />
    </main>
  );
}
