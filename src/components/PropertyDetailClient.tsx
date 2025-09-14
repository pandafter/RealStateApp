"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Property } from "@/types";

export default function PropertyDetailClient({ id }: { id: string }) {
  const [p, setP] = useState<Property>({
    id,
    idOwner: "",
    name: "",
    address: "",
    price: 0,
    imageUrl: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let abort = false;
    (async () => {
      try {
        const { default: fetchJSON } = await import("@/lib/api");
        const res = await fetchJSON<Property>(`/api/v1/properties/${id}`, {}, p);
        if (!abort) setP(res && res.id ? res : p);
      } catch (err) {
        console.warn("Property detail fetch failed:", err);
      } finally {
        if (!abort) setLoading(false);
      }
    })();
    return () => {
      abort = true;
    };
  }, [id]);

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>
      <Link href="/" style={{ display: "inline-block", marginBottom: 12 }}>
        ← Back
      </Link>

      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1.2fr 1fr" }}>
        <div style={{ aspectRatio: "4/3", background: "#fafafa", position: "relative" }}>
          <Image
            src={p.imageUrl || "/placeholder.jpg"}
            alt={p.name || "Property"}
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        </div>

        <div>
          <h1 style={{ marginTop: 0 }}>{loading ? "Loading…" : (p.name || "Property")}</h1>
          <p style={{ margin: 0, color: "#555" }}>{p.address}</p>
          <p style={{ fontSize: 22, fontWeight: 700, marginTop: 12 }}>
            {p.price.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 })}
          </p>
          <div style={{ marginTop: 12 }}>
            <p><b>Owner:</b> {p.idOwner}</p>
            <p><b>Property ID:</b> {p.id}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
