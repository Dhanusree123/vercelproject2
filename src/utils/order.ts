import { ICartProduct } from "@/types/product";

export const getOrdersFromLocal = (): Record<string, Record<string,ICartProduct[]>> => {
    return JSON.parse(localStorage.getItem("orders") || "{}");
  };
  
  export const setOrdersToLocal = (orders: Record<string, ICartProduct[]>) => {
    localStorage.setItem("orders", JSON.stringify(orders));
  };