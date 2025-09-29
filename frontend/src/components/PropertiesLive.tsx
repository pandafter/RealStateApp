"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Filters from "@/components/Filters";
import PropertyCard from "@/components/PropertyCard";
import { PropertiesResponse, PropertyImage } from "@/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type FiltersState = {
  name: string;
  address: string;
  minPrice: string; // siempre dígitos
  maxPrice: string; // siempre dígitos
  page: number;
  size: number;
};

const onlyDigits = (v?: string) => (v ?? "").replace(/[^\d]/g, "");

export default function PropertiesLive({
  initialFilters,
  initialData,
  pollMs = 5000,
}: {
  initialFilters: FiltersState;
  initialData: PropertiesResponse;
  pollMs?: number;
}) {
  const [filters, setFilters] = useState(initialFilters);
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  // Portadas derivadas cuando falta imageUrl
  const [coverById, setCoverById] = useState<Record<string, string>>({});

  const reqCounter = useRef(0);
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const totalPages = Math.max(1, Math.ceil(data.total / filters.size));
  const hasPrev = filters.page > 1;
  const hasNext = filters.page < totalPages;

  const syncPageToUrl = (p: number) => {
    const q = new URLSearchParams(params.toString());
    q.set("page", String(p));
    q.set("size", String(filters.size));
    router.replace(`${pathname}?${q.toString()}`, { scroll: false });
  };

  const goPage = (p: number) => {
    const bounded = Math.min(Math.max(1, p), totalPages);
    if (bounded === filters.page) return;
    setFilters((f) => ({ ...f, page: bounded }));
    syncPageToUrl(bounded);
  };

  // Construcción de query (solo dígitos en precios)
  const query = useMemo(() => {
    const q = new URLSearchParams();
    if (filters.name) q.set("name", filters.name);
    if (filters.address) q.set("address", filters.address);

    const min = onlyDigits(filters.minPrice);
    const max = onlyDigits(filters.maxPrice);
    if (min) q.set("minPrice", min);
    if (max) q.set("maxPrice", max);

    q.set("page", String(filters.page));
    q.set("size", String(filters.size));
    return q.toString();
  }, [filters]);

  // Fetch inicial + cambios de filtros
  useEffect(() => {
    const id = ++reqCounter.current;
    const ctrl = new AbortController();

    (async () => {
      setLoading(true);
      try {
        const { default: fetchJSON } = await import("@/lib/api");
        const res = await fetchJSON<PropertiesResponse>(
          `/api/v1/properties?${query}`,
          { signal: ctrl.signal },
          {
            items: data.items,
            total: data.total,
            page: filters.page,
            size: filters.size,
          }
        );
        if (!ctrl.signal.aborted && reqCounter.current === id) {
          setData(res);
        }
      } catch (err) {
        if (!ctrl.signal.aborted) console.error("Error fetching properties:", err);
      } finally {
        if (!ctrl.signal.aborted && reqCounter.current === id) setLoading(false);
      }
      
      return ctrl.abort();
    })();

  }, [query]);

  // Polling suave
  useEffect(() => {
    let timer: NodeJS.Timeout | null = setInterval(async () => {
      const id = ++reqCounter.current;
      const ctrl = new AbortController();
      try {
        const { default: fetchJSON } = await import("@/lib/api");
        const res = await fetchJSON<PropertiesResponse>(
          `/api/v1/properties?${query}`,
          { signal: ctrl.signal },
          {
            items: data.items,
            total: data.total,
            page: filters.page,
            size: filters.size,
          }
        );
        if (!ctrl.signal.aborted && reqCounter.current === id) setData(res);
      } catch (err) {
        if (!(err instanceof DOMException && err.name === "AbortError")) {
          console.warn("Polling failed:", err);
        }
      }
    }, pollMs);

    const onPageHide = () => {
      if (timer) clearInterval(timer);
      timer = null;
    };
    window.addEventListener("pagehide", onPageHide);

    return () => {
      if (timer) clearInterval(timer);
      window.removeEventListener("pagehide", onPageHide);
    };
  }, [query, pollMs]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch de portadas para los que no tienen imageUrl
  useEffect(() => {
    const missing = data.items.filter((p) => !p.imageUrl && !coverById[p.id]);
    if (missing.length === 0) return;

    let cancelled = false;

    (async () => {
      const { default: fetchJSON } = await import("@/lib/api");
      const entries = await Promise.all(
        missing.map(async (p) => {
          const images = await fetchJSON<PropertyImage[]>(
            `/api/v1/properties/${p.id}/images`,
            {},
            []
          );
          const sorted = images.sort((a, b) => Number(b.enabled) - Number(a.enabled));
          const cover = sorted.find((i) => i.enabled)?.file ?? sorted[0]?.file;
          return [p.id, cover] as const;
        })
      );

      if (!cancelled) {
        setCoverById((prev) => {
          const next = { ...prev };
          for (const [id, file] of entries) {
            if (file) next[id] = file;
          }
          return next;
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [data.items, coverById]);

  // Items con portada derivada
  const derivedItems = useMemo(
    () => data.items.map((p) => ({ ...p, imageUrl: p.imageUrl ?? coverById[p.id] })),
    [data.items, coverById]
  );

  return (
    <>
      <Filters
        defaults={{
          name: filters.name,
          address: filters.address,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
        }}
        onFiltersChange={(f) => setFilters((s) => ({ ...s, ...f, page: 1 }))}
        debounceMs={300}
        syncUrlOnChange={true}
      />

      <section
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}
      >
        {derivedItems.map((p) => (
          <PropertyCard key={p.id} p={p} />
        ))}
      </section>

      {totalPages > 1 && (
        <nav className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => goPage(filters.page - 1)}
              disabled={!hasPrev}
              className={`rounded-full px-4 py-2 text-sm transition ${
                hasPrev
                  ? "border border-gray-300 bg-white hover:bg-gray-50"
                  : "cursor-not-allowed border border-gray-200 bg-gray-100 text-gray-400"
              }`}
            >
              « Prev
            </button>

            <span className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700">
              Página {filters.page} / {totalPages}
            </span>

            <button
              onClick={() => goPage(filters.page + 1)}
              disabled={!hasNext}
              className={`rounded-full px-4 py-2 text-sm transition ${
                hasNext
                  ? "border border-gray-300 bg-white hover:bg-gray-50"
                  : "cursor-not-allowed border border-gray-200 bg-gray-100 text-gray-400"
              }`}
            >
              Next »
            </button>
          </div>

          <small className={loading ? "text-black" : "text-gray-600"}>
            {(() => {
              if (data.total === 0) return "0 resultados";
              const start = (filters.page - 1) * filters.size + 1;
              const end = Math.min(filters.page * filters.size, data.total);
              return `Mostrando ${start}–${end} de ${data.total}${loading ? " · cargando…" : ""}`;
            })()}
          </small>
        </nav>
      )}
    </>
  );
}
