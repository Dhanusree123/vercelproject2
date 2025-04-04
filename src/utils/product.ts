import { ICartProduct, IProduct } from "@/types/product";


export const setProductsToLocal = (product:ICartProduct) => {
    localStorage.setItem("products",JSON.stringify(product));
}

export const getProductsFromLocal = ():IProduct[] => {
    const productData = localStorage.getItem("products");
    return productData ? JSON.parse(productData) : [];
}

export const getUpdatedProductFromLocal = (): IProduct | null => {
    const product = localStorage.getItem("updatedproduct");
    return product ? JSON.parse(product) : null;
  };
  
  export const setUpdatedProductToLocal = (product: IProduct) => {
    localStorage.setItem("updatedproduct", JSON.stringify(product));
  };