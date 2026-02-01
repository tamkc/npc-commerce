import OrderDetailClient from "./OrderDetailClient";

export const dynamicParams = false;

export function generateStaticParams() {
  return [];
}

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <OrderDetailClient params={params} />;
}
