/* eslint-disable @typescript-eslint/no-explicit-any */

import { ICartMap, IUserCartMap } from "@/types/cart";

function mapToObject(map: Map<any, any>): any {
  const obj: any = {};
  for (const [key, value] of map.entries()) {
    if (value instanceof Map) {
      obj[key] = mapToObject(value);
    } else {
      obj[key] = value;
    }
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

export const getCart = (): ICartMap => {
  const raw = localStorage.getItem("carts");
  const obj = raw ? JSON.parse(raw) : {};
  return objectToMap(obj) as ICartMap;
};

export const setCart = (carts: ICartMap) => {
  const obj = mapToObject(carts);
  localStorage.setItem("carts", JSON.stringify(obj));
};

export const getUserCart = (email: string): IUserCartMap => {
  const cartMap = getCart();
  return cartMap.get(email) ?? new Map();
};

export const setUserCart = (email: string, userCart: IUserCartMap) => {
  const cartMap = getCart();
  cartMap.set(email, userCart);
  setCart(cartMap);
};
