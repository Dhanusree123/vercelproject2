/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import ProductForm from "@/components/ProductForm";
import { useGlobalContext } from "@/context/GlobalContext";
import AuthGuard from "@/guards/AuthGuard";
import { IProduct } from "@/types/product";
import { getProductsFromLocal, setProductsToLocal } from "@/utils/product";
import { Box } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const ProductAddFormPage = () => {
  const router = useRouter();

  const [products, setProducts] = useState<IProduct[]>([]);

  const { user } = useGlobalContext();
  const handleSubmit = (data: IProduct) => {
    try {
      const newData = { ...data, id: crypto.randomUUID() };
      setProductsToLocal([...products, newData]);
      router.push("/");
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const productData = getProductsFromLocal();
    if (productData) {
      try {
        setProducts(productData);
      } catch (error) {
        console.error("Error parsing products from localStorage", error);
        setProducts([]);
      }
    }
    if (user !== "ganesh@microfox.co") {
      alert("You are not admin to add products");
      router.push("/");
    }
  }, [user]);

  return (
    <AuthGuard>
      <Box>
        <ProductForm isEdit={false} onSubmit={handleSubmit} />
      </Box>
    </AuthGuard>
  );
};

export default ProductAddFormPage;
