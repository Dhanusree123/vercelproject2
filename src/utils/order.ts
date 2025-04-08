/* eslint-disable @typescript-eslint/no-explicit-any */
// import { IOrder, IOrderMap, IUserOrderMap } from "@/types/order";

import { IOrderMap, IUserOrderMap } from "@/types/order";

function mapToObject(map: Map<any, any>): any {
  const obj: any = {};
  for (const [key, value] of map.entries()) {
    obj[key] = value instanceof Map ? mapToObject(value) : value;
  }
  return obj;
}


function objectToMap(obj: any): Map<any, any> {
  const map = new Map();
  for (const key in obj) {
    const value = obj[key];

    const isNestedMap = value && typeof value === "object" && !Array.isArray(value) &&
                        Object.values(value).every((v) => typeof v === "object" && !Array.isArray(v));

    if (isNestedMap) {
      map.set(key, objectToMap(value));
    } else {
      map.set(key, value); 
    }
  }
  return map;
}

export const getOrders = (): IOrderMap => {
  const raw = localStorage.getItem("orders");
  const obj = raw ? JSON.parse(raw) : {};
  return objectToMap(obj) as IOrderMap;
};

export const setOrders = (orders: IOrderMap) => {
  const obj = mapToObject(orders);
  localStorage.setItem("orders", JSON.stringify(obj));
};

export const getUserOrders = (email: string): IUserOrderMap => {
  const orders = getOrders();
  return orders.get(email) ?? new Map();
};

export const setUserOrders = (email: string, userOrders: IUserOrderMap) => {
  const orders = getOrders();
  orders.set(email, userOrders);
  setOrders(orders);
};
