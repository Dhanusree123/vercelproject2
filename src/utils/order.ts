import { IOrderMap, IUserOrderMap } from "@/types/order";

export const getOrders = (): IOrderMap => {
  return JSON.parse(localStorage.getItem("orders") || "{}");
 };
  
export const setOrders=(orders:IOrderMap)=> {
  localStorage.setItem("orders", JSON.stringify(orders));
};

export const getUserOrders = (email:string):IUserOrderMap => {
  const order = getOrders();
  return order[email] ?? {}
}

export const setUserOrders = (email:string,userOrders:IUserOrderMap) => {
  const order = getOrders();
  order[email] = userOrders;
  setOrders(order)
}


