/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import ProductForm from "@/components/ProductForm";
import { IProduct } from "@/types/product";
import {
  getProductsFromLocal,
  setUpdatedProductToLocal,
} from "@/utils/product";
import { getUserFromLocal } from "@/utils/user";
import { useRouter } from "next/navigation";
import React from "react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const EditProductPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const router = useRouter();

  const [product, setProduct] = useState<IProduct | null>(null);
  const [logged, setLogged] = useState<string | null>(null);

  const param = React.use(params);

  const handleSubmit = (updatedProduct: IProduct) => {
    const products = getProductsFromLocal();

    const productHashMap: Record<string, IProduct> = {};
    products.forEach((p) => (productHashMap[p.id] = p));

    if (productHashMap[updatedProduct.id]) {
      setUpdatedProductToLocal(productHashMap[updatedProduct.id]);
    }

    productHashMap[updatedProduct.id] = updatedProduct;

    localStorage.setItem(
      "products",
      JSON.stringify(Object.values(productHashMap))
    );

    const cartData = localStorage.getItem("carts");

    if (cartData) {
      const carts = JSON.parse(cartData);

      Object.keys(carts).forEach((user) => {
        const cartHashMap: Record<string, IProduct> = {};
        carts[user].forEach((p: IProduct) => (cartHashMap[p.id] = p));

        if (cartHashMap[updatedProduct.id]) {
          cartHashMap[updatedProduct.id] = {
            ...cartHashMap[updatedProduct.id],
            ...updatedProduct,
          };
        }

        carts[user] = Object.values(cartHashMap);
      });

      localStorage.setItem("carts", JSON.stringify(carts));
    }
    router.push("/");
  };

  useEffect(() => {
    const productData = localStorage.getItem("products");
    if (productData) {
      const products: IProduct[] = JSON.parse(productData);
      const foundProduct = products.find((p) => p.id === param.id);
      if (foundProduct) {
        setProduct(foundProduct);
      }
    }
    const loggedUser = getUserFromLocal();
    if (!loggedUser) {
      router.push("/login");
    } else {
      setLogged(loggedUser);
      if (loggedUser !== "ganesh@microfox.co") {
        toast.error("you don't have access to edit this product");

        router.push("/");
      }
    }
  }, [param.id]);

  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <ProductForm isEdit={true} product={product} onSubmit={handleSubmit} />
  );
};

export default EditProductPage;
