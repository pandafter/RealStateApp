import fetchJSON from "@/lib/api";
import { Property, PropertyImage } from "@/types";
import { notFound } from "next/navigation";
import Link from "next/link";
import PropertyGallery from "@/components/PropertyGallery";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function PropertyDetailPage({ params }: Props) {
  const { id } = await params;

  const p =
    (await fetchJSON<Property>(`/api/v1/properties/${id}`, {}, {} as Property)) ??
    ({} as Property);

  if (!p?.id) {
    notFound();
  }

  const imgs =
    (await fetchJSON<PropertyImage[]>(
      `/api/v1/properties/${id}/images`,
      {},
      []
    )) ?? [];

  const gallery = (() => {
    const sorted = [...imgs].sort((a, b) => Number(b.enabled) - Number(a.enabled));
    const files = sorted.map((i) => i.file).filter(Boolean);
    if (files.length) return files;
    if (p.imageUrl) return [p.imageUrl];
    return ["/placeholder.png"];
  })();

  return (
    <main className="mx-auto max-w-5xl p-6">
      <Link href="/" className="mb-4 inline-block text-sm text-indigo-600 hover:underline">
        ← Volver
      </Link>

      <div className="grid gap-6 md:grid-cols-2">
        <PropertyGallery images={gallery} />

        <section>
          <h1 className="text-2xl font-bold text-gray-900">{p.name}</h1>
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
            {"createdAt" in p && (p as any).createdAt && (
              <div className="flex justify-between">
                <dt>Creado</dt>
                <dd>{new Date((p as any).createdAt).toLocaleDateString()}</dd>
              </div>
            )}
          </dl>
        </section>
      </div>
    </main>
  );
}
