import { Suspense } from "react";
import ProductsClient from "../components/products/productsclient"

export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsClient />
    </Suspense>
  );
}