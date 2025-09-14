import { Property } from "@/types";

export default function PropertyCard({ p }: { p: Property }) {
  return (
    <a href={`/properties/${p.id}`} style={{ border: "1px solid #eee", borderRadius: 12, overflow: "hidden", textDecoration: "none", color: "inherit" }}>
      <div style={{ aspectRatio: "4/3", background: "#fafafa" }}>
        <img src={p.imageUrl} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} fetchPriority="high" />
      </div>
      <div style={{ padding: 12 }}>
        <h3 style={{ margin: "0 0 6px 0", fontSize: 18 }}>{p.name}</h3>
        <p style={{ margin: 0, color: "#555" }}>{p.address}</p>
        <p style={{ margin: "6px 0 0 0", fontWeight: 600 }}>
          {p.price.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 })}
        </p>
      </div>
    </a>
  );
}
