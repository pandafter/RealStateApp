"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type FiltersShape = { name?: string; address?: string; minPrice?: string; maxPrice?: string };

type Props = {
  defaults?: FiltersShape;
  onFiltersChange?: (f: FiltersShape) => void;
  debounceMs?: number;
  syncUrlOnChange?: boolean;
};

const nf = new Intl.NumberFormat("es-CO");

const onlyDigits = (v?: string) => (v ?? "").replace(/[^\d]/g, "");
const fmt = (digits: string) => (digits ? nf.format(Number(digits)) : "");

export default function Filters({
  defaults,
  onFiltersChange,
  debounceMs = 300,
  syncUrlOnChange = true,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const [name, setName] = useState(defaults?.name ?? "");
  const [address, setAddress] = useState(defaults?.address ?? "");
  // estados de UI (formateados)
  const [minPriceUi, setMinPriceUi] = useState(fmt(onlyDigits(defaults?.minPrice)));
  const [maxPriceUi, setMaxPriceUi] = useState(fmt(onlyDigits(defaults?.maxPrice)));

  // estado normalizado (para emitir y URL) – SIEMPRE DÍGITOS
  const normalized = useMemo<Required<FiltersShape>>(() => {
    const min = onlyDigits(minPriceUi);
    const max = onlyDigits(maxPriceUi);

    // corrección (min <= max) si ambos están
    if (min && max && Number(min) > Number(max)) {
      // intercambiamos
      return {
        name: (name ?? "").trim(),
        address: (address ?? "").trim(),
        minPrice: max,
        maxPrice: min,
      };
    }

    return {
      name: (name ?? "").trim(),
      address: (address ?? "").trim(),
      minPrice: min,
      maxPrice: max,
    };
  }, [name, address, minPriceUi, maxPriceUi]);

  // reflejar URL en el UI (formateando precios)
  const urlState = useMemo<Required<FiltersShape>>(() => {
    const get = (k: string) => params.get(k) ?? "";
    return {
      name: get("name").trim(),
      address: get("address").trim(),
      minPrice: onlyDigits(get("minPrice")),
      maxPrice: onlyDigits(get("maxPrice")),
    };
  }, [params]);

  useEffect(() => {
    // si URL y UI difieren, sincroniza
    const a = JSON.stringify(urlState);
    const b = JSON.stringify(normalized);
    if (a !== b) {
      setName(urlState.name);
      setAddress(urlState.address);
      setMinPriceUi(fmt(urlState.minPrice));
      setMaxPriceUi(fmt(urlState.maxPrice));
    }
  }, [urlState]); // eslint-disable-line react-hooks/exhaustive-deps

  // emitir cambios con debounce
  const lastSentRef = useRef<string>("");
  useEffect(() => {
    const key = JSON.stringify(normalized);
    if (key === lastSentRef.current) return;

    const t = setTimeout(() => {
      lastSentRef.current = key;
      onFiltersChange?.(normalized);

      if (syncUrlOnChange) {
        const q = new URLSearchParams(params.toString());
        normalized.name ? q.set("name", normalized.name) : q.delete("name");
        normalized.address ? q.set("address", normalized.address) : q.delete("address");
        normalized.minPrice ? q.set("minPrice", String(Number(normalized.minPrice))) : q.delete("minPrice");
        normalized.maxPrice ? q.set("maxPrice", String(Number(normalized.maxPrice))) : q.delete("maxPrice");
        q.set("page", "1");
        router.replace(`${pathname}?${q.toString()}`, { scroll: false });
      }
    }, debounceMs);

    return () => clearTimeout(t);
  }, [normalized, debounceMs, onFiltersChange, syncUrlOnChange, params, pathname, router]);

  const clear = useCallback(() => {
    setName(""); setAddress(""); setMinPriceUi(""); setMaxPriceUi("");
    onFiltersChange?.({ name: "", address: "", minPrice: "", maxPrice: "" });
    if (syncUrlOnChange) router.replace(pathname, { scroll: false });
  }, [onFiltersChange, pathname, router, syncUrlOnChange]);

  return (
    <div className="sticky top-0 z-20 mb-6">
      <div className="mx-auto rounded-2xl border border-gray-200 bg-white/90 shadow-md backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="flex flex-wrap items-center gap-2 px-4 py-3">
          <span className="text-sm font-medium text-gray-700 select-none">Filtros</span>
          <span className="h-5 w-px bg-gray-200" />

          {!!normalized.name && (
            <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-700">
              🔎 {normalized.name}
            </span>
          )}

          {!!normalized.address && (
            <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-700">
              📍 {normalized.address}
            </span>
          )}

          {(normalized.minPrice || normalized.maxPrice) && (
            <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-700">
              💰 {normalized.minPrice ? `Min: ${fmt(normalized.minPrice)}` : "Min: —"} · {normalized.maxPrice ? `Max: ${fmt(normalized.maxPrice)}` : "Max: —"}
            </span>
          )}

          <div className="ms-auto flex items-center gap-2">
            <button
              onClick={clear}
              className="rounded-full border border-gray-300 bg-white px-4 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Limpiar
            </button>
          </div>
        </div>

        <div className="grid gap-3 border-t border-gray-100 p-4 sm:grid-cols-2 lg:grid-cols-4">
          <label htmlFor="f-name" className="select-none">
            <span className="mb-1 block text-xs font-medium text-gray-600">Nombre</span>
            <input
              id="f-name"
              className="h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-gray-100"
              placeholder="Ej. Casa con patio"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <label htmlFor="f-address" className="select-none">
            <span className="mb-1 block text-xs font-medium text-gray-600">Dirección</span>
            <input
              id="f-address"
              className="h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-gray-100"
              placeholder="Ej. Calle 123 #45-67"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </label>

          <label htmlFor="f-min" className="select-none">
            <span className="mb-1 block text-xs font-medium text-gray-600">Precio mínimo</span>
            <input
              id="f-min"
              className="h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-gray-100"
              placeholder="0"
              inputMode="numeric"
              value={minPriceUi}
              onChange={(e) => setMinPriceUi(e.target.value)}
            />
          </label>

          <label htmlFor="f-max" className="select-none">
            <span className="mb-1 block text-xs font-medium text-gray-600">Precio máximo</span>
            <input
              id="f-max"
              className="h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-gray-100"
              placeholder="Ej. 800.000.000"
              inputMode="numeric"
              value={maxPriceUi}
              onChange={(e) => setMaxPriceUi(e.target.value)}
            />
          </label>
        </div>
      </div>
    </div>
  );
}
