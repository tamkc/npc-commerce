import CustomerDetailClient from "./CustomerDetailClient";

export default function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <CustomerDetailClient params={params} />;
}
