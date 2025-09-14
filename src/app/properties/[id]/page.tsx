import fetchJSON from "@/lib/api";
import { Property } from "@/types";


export default async function PropertyDetail({ params }: { params: { id: string } }) {
  const p = await fetchJSON<Property>(`/api/v1/properties/${params.id}`);

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>
      <a href="/" style={{ display: "inline-block", marginBottom: 12 }}>← Back</a>
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1.2fr 1fr" }}>
        <div style={{ aspectRatio: "4/3", background: "#fafafa" }}>
          <img src={p.imageUrl} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div>
          <h1 style={{ marginTop: 0 }}>{p.name}</h1>
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
