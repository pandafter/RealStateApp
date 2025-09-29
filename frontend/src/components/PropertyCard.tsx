"use client";

import Link from "next/link";
import { Property } from "@/types";

export default function PropertyCard({ p }: { p: Property }) {
  const cover = p.imageUrl ?? "/placeholder.png";

  return (
    <Link
      href={`/properties/${p.id}`}
      className="group block overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="relative aspect-[4/3] w-full bg-gray-100">
        <img
          src={cover}
          alt={p.name}
          className="h-full w-full object-cover transition group-hover:scale-[1.02]"
          draggable={false}
        />
      </div>

      <div className="p-4">
        <h2 className="truncate text-lg font-semibold text-gray-900 group-hover:text-indigo-600">
          {p.name}
        </h2>
        <p className="truncate text-sm text-gray-600">{p.address}</p>
        <p className="mt-2 font-bold text-indigo-600">
          {p.price.toLocaleString("es-CO", {
            style: "currency",
            currency: "COP",
            maximumFractionDigits: 0,
          })}
        </p>
        <p className="mt-1 text-xs text-gray-400">
          Año {p.year} · Código {p.codeInternal}
        </p>
      </div>
    </Link>
  );
}
