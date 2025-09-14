import PropertyDetailClient from "@/components/PropertyDetailClient";


export const dynamic = "force-dynamic";

export default async function PropertyDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PropertyDetailClient id={id} />;
}
