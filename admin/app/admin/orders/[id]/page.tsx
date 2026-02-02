import OrderDetailClient from "./OrderDetailClient";

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <OrderDetailClient params={params} />;
}
