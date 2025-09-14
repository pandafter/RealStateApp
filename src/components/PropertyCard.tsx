import Image from "next/image";
import { Property } from "@/types";

export default function PropertyCard({ p }: { p: Property }) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm">
      <div className="relative w-full aspect-[4/3] bg-gray-100">
        <Image
          src={p.imageUrl || "/placeholder.jpg"}
          alt={p.name}
          fill
          style={{ objectFit: "cover" }}
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="p-3">
        <h2 className="font-semibold">{p.name}</h2>
        <p className="text-sm text-gray-600">{p.address}</p>
        <p className="font-bold mt-2">
          {p.price.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 })}
        </p>
      </div>
    </div>
  );
}
