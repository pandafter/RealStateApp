import PropertiesLive from "@/components/PropertiesLive";
import fetchJSON from "@/lib/api";
import { PropertiesResponse } from "@/types";

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
    <main className="max-w-[1100px] mx-auto p-4">
      <h1 className="text-4xl mb-4 text-center font-bold text-indigo-600">REAL STATE APP</h1>
      <PropertiesLive initialFilters={initialFilters} initialData={initialData} />
    </main>
  );
}
