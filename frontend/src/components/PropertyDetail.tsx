import { Property } from "@/types";

export default function PropertyDetail({ p }: { p: Property }) {
  return (
    <main className="mx-auto max-w-4xl p-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden rounded-xl">
          <img
            src={p.imageUrl || "/placeholder.jpg"}
            alt={p.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{p.name}</h1>
          <p className="text-gray-600 Location">{p.address}</p>
          <p className="mt-4 text-xl font-semibold text-gray-900">
            {p.price.toLocaleString("es-CO", {
              style: "currency",
              currency: "COP",
              maximumFractionDigits: 0,
            })}
          </p>

          <dl className="mt-6 space-y-2 text-sm text-gray-700">
            <div className="flex justify-between">
              <dt>Código interno</dt>
              <dd>{p.codeInternal}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Año</dt>
              <dd>{p.year}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Owner ID</dt>
              <dd className="Owner">{p.idOwner}</dd>
            </div>
            {p.createdAt && (
              <div className="flex justify-between">
                <dt>Creado</dt>
                <dd>{new Date(p.createdAt).toLocaleDateString()}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </main>
  );
}
