"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type FiltersShape = { name?: string; address?: string; minPrice?: string; maxPrice?: string };

type Props = {
  defaults?: FiltersShape;
  onFiltersChange?: (f: FiltersShape) => void;
  debounceMs?: number;
  syncUrlOnApply?: boolean;
};

export default function Filters({
  defaults,
  onFiltersChange,
  debounceMs = 300,
  syncUrlOnApply = true,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const [name, setName] = useState(defaults?.name ?? "");
  const [address, setAddress] = useState(defaults?.address ?? "");
  const [minPrice, setMinPrice] = useState(defaults?.minPrice ?? "");
  const [maxPrice, setMaxPrice] = useState(defaults?.maxPrice ?? "");

  // Mantén sincronía con la URL
  useEffect(() => {
    setName(params.get("name") ?? "");
    setAddress(params.get("address") ?? "");
    setMinPrice(params.get("minPrice") ?? "");
    setMaxPrice(params.get("maxPrice") ?? "");
  }, [params]);

  // Live search (debounce)
  useEffect(() => {
    const t = setTimeout(() => {
      onFiltersChange?.({ name, address, minPrice, maxPrice });
    }, debounceMs);
    return () => clearTimeout(t);
  }, [name, address, minPrice, maxPrice, onFiltersChange, debounceMs]);

  const apply = useCallback(() => {
    if (!syncUrlOnApply) return;
    const q = new URLSearchParams(params.toString());
    name ? q.set("name", name) : q.delete("name");
    address ? q.set("address", address) : q.delete("address");
    minPrice ? q.set("minPrice", minPrice) : q.delete("minPrice");
    maxPrice ? q.set("maxPrice", maxPrice) : q.delete("maxPrice");
    q.set("page", "1");
    router.replace(`${pathname}?${q.toString()}`, { scroll: false });
  }, [name, address, minPrice, maxPrice, params, pathname, router, syncUrlOnApply]);

  const clear = useCallback(() => {
    setName(""); setAddress(""); setMinPrice(""); setMaxPrice("");
    onFiltersChange?.({ name: "", address: "", minPrice: "", maxPrice: "" });
    if (syncUrlOnApply) router.replace(pathname, { scroll: false });
  }, [onFiltersChange, pathname, router, syncUrlOnApply]);

  return (
    <div className="mb-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      <input
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-gray-400"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-gray-400"
        placeholder="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <input
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-gray-400"
        placeholder="Min price"
        type="number"
        min={0}
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
      />
      <input
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-gray-400"
        placeholder="Max price"
        type="number"
        min={0}
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
      />
      <div className="flex items-center gap-2">
        <button
          onClick={apply}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50"
        >
          Apply
        </button>
        <button
          onClick={clear}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
