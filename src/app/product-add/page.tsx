/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import ProductForm from "@/components/ProductForm";
import { IProduct } from "@/types/product";
import { getUserFromLocal } from "@/utils/user";
import { Box } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ProductAddFormPage = () => {
  const router = useRouter();

  const [logged, setLogged] = useState<string | null>(null);
  const [products, setProducts] = useState<IProduct[]>([]);

  const handleSubmit = (data: IProduct) => {
    try {
      const newData = { ...data, id: crypto.randomUUID() };
      localStorage.setItem("products", JSON.stringify([...products, newData]));
      router.push("/");
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const productData = localStorage.getItem("products");
    if (productData) {
      try {
        setProducts(JSON.parse(productData) || []);
      } catch (error) {
        console.error("Error parsing products from localStorage", error);
        setProducts([]);
      }
    }
    const loggedUser = getUserFromLocal();
    console.log(loggedUser);
  }, []);

  return (
    <Box>
      <ProductForm isEdit={false} onSubmit={handleSubmit} />
    </Box>
  );
};

export default ProductAddFormPage;
