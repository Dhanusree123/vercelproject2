import { IProduct } from "@/types/product";

export const setProductsToLocal = (product:IProduct[]) => {
  localStorage.setItem("products",JSON.stringify(product));
}

export const getProductsFromLocal = ()=> {
  const products  = JSON.parse(localStorage.getItem("products")||'[]');
  return products;
}

export const getUpdatedProductFromLocal = (): IProduct | null => {
  const product = localStorage.getItem("updatedproduct");
  return product ? JSON.parse(product) : null;
};
  
export const setUpdatedProductToLocal = (product: IProduct) => {
  localStorage.setItem("updatedproduct", JSON.stringify(product));
};