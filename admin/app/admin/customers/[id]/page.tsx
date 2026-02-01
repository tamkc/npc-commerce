import CustomerDetailClient from "./CustomerDetailClient";

export const dynamicParams = false;

export function generateStaticParams() {
  return [];
}

export default function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <CustomerDetailClient params={params} />;
}
