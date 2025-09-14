"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Filters from "@/components/Filters";
import PropertyCard from "@/components/PropertyCard";
import { PropertiesResponse } from "@/types";
import fetchJSON from "@/lib/api";
 

type FiltersState = {
  name: string;
  address: string;
  minPrice: string;
  maxPrice: string;
  page: number;
  size: number;
};

export default function PropertiesLive({
  initialFilters,
  initialData,
  pollMs = 5000
}: {
  initialFilters: FiltersState;
  initialData: PropertiesResponse;
  pollMs?: number;
}) {
  const [filters, setFilters] = useState<FiltersState>(initialFilters);
  const [data, setData] = useState<PropertiesResponse>(initialData);
  const [loading, setLoading] = useState(false);
  const reqCounter = useRef(0);

  const query = useMemo(() => {
    const q = new URLSearchParams();
    if (filters.name) q.set("name", filters.name);
    if (filters.address) q.set("address", filters.address);
    if (filters.minPrice) q.set("minPrice", filters.minPrice);
    if (filters.maxPrice) q.set("maxPrice", filters.maxPrice);
    q.set("page", String(filters.page));
    q.set("size", String(filters.size));
    return q.toString();
  }, [filters]);


  useEffect(() => {
    const id = ++reqCounter.current;
    (async () => {
      setLoading(true);
      try {
        const res = await fetchJSON<PropertiesResponse>(`/api/v1/properties?${query}`);
        if (reqCounter.current === id) setData(res);
      } catch (err){
        console.error("Error fetching properties: ", err);
      }
      finally { if (reqCounter.current === id) setLoading(false); }
    })();
  }, [query]);


  useEffect(() => {
    let timer: NodeJS.Timeout | null = setInterval(async () => {
      const id = ++reqCounter.current;
      try {
        const res = await fetchJSON<PropertiesResponse>(
          `/api/v1/properties?${query}`
        );
        if (reqCounter.current === id) setData(res);
      } catch (err) {
        console.warn("Polling failed, keeping previous data:", err);
      }
    }, pollMs);

    // Listener safe: limpiar cuando la página entra a bfcache
    const handlePageHide = () => {
      if (timer) clearInterval(timer);
    };
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      if (timer) clearInterval(timer);
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, [query, pollMs]);
  const totalPages = Math.max(1, Math.ceil(data.total / filters.size));
  const goPage = (p: number) => setFilters(f => ({ ...f, page: Math.min(Math.max(1, p), totalPages) }));

  return (
    <>
      <Filters
        defaults={{
          name: filters.name,
          address: filters.address,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
        }}
        onFiltersChange={(f) => setFilters(s => ({ ...s, ...f, page: 1 }))}
        debounceMs={300}
        syncUrlOnApply={true}
      />

      <section style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
        {data.items.map(p => <PropertyCard key={p.id} p={p} />)}
      </section>

      <nav style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => goPage(filters.page - 1)} disabled={filters.page <= 1}>« Prev</button>
          <span>Page {filters.page} / {totalPages}</span>
          <button onClick={() => goPage(filters.page + 1)} disabled={filters.page >= totalPages}>Next »</button>
        </div>
        <small style={{ color: loading ? "#111" : "#666" }}>
          {data.total} resultados {loading ? "· loading…" : ""}
        </small>
      </nav>
    </>
  );
}
