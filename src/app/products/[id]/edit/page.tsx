"use client";

import ProductForm from "@/components/ProductForm";
import { useGlobalContext } from "@/context/GlobalContext";
import AuthGuard from "@/guards/AuthGuard";
import { IProduct } from "@/types/product";
import { getCart, setCart } from "@/utils/cart";
import {
  getProductsFromLocal,
  setProductsToLocal,
  setUpdatedProductToLocal,
} from "@/utils/product";
import { useRouter } from "next/navigation";
import React from "react";
import { useEffect, useState } from "react";

const EditProductPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const router = useRouter();
  const { user } = useGlobalContext();
  const [product, setProduct] = useState<IProduct | null>(null);
  const param = React.use(params);

  const handleSubmit = (updatedProduct: IProduct) => {
    const products = getProductsFromLocal();

    const productMap: Record<string, IProduct> = {};
    products.forEach((p: IProduct) => (productMap[p.id] = p));

    if (productMap[updatedProduct.id]) {
      setUpdatedProductToLocal(productMap[updatedProduct.id]);
    }

    productMap[updatedProduct.id] = updatedProduct;

    setProductsToLocal(Object.values(productMap));
    const cartMap = getCart();

    Object.keys(cartMap).forEach((userEmail) => {
      const userCartMap = cartMap[userEmail];

      if (userCartMap[updatedProduct.id]) {
        userCartMap[updatedProduct.id] = {
          ...userCartMap[updatedProduct.id],
          ...updatedProduct,
        };
      }

      cartMap[userEmail] = userCartMap;
    });

    setCart(cartMap);
    router.push("/");
  };

  useEffect(() => {
    if (!user) return;
    if (user !== "ganesh@microfox.co") {
      alert("you don't have access to edit this product");
      router.push("/");
      return;
    }
    const productData = localStorage.getItem("products");
    if (productData) {
      const products: IProduct[] = JSON.parse(productData);
      const foundProduct = products.find((p) => p.id === param.id);
      if (foundProduct) {
        setProduct(foundProduct);
      }
    }
  }, [param.id, user, router]);

  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <AuthGuard>
      <ProductForm isEdit={true} product={product} onSubmit={handleSubmit} />
    </AuthGuard>
  );
};

export default EditProductPage;
