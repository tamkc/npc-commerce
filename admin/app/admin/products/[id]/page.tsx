import ProductDetailClient from "./ProductDetailClient";

export const dynamicParams = false;

export function generateStaticParams() {
  return [];
}

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <ProductDetailClient params={params} />;
}
