import { ICartMap, IUserCartMap } from "@/types/cart";

export const getCart = (): ICartMap => {
  return JSON.parse(localStorage.getItem('carts') || '{}');
};

export const setCart = (carts:ICartMap) => {
  localStorage.setItem("carts", JSON.stringify(carts));
};

export const getUserCart = (email:string):IUserCartMap => {
  const cart = getCart();
  return cart[email] ?? {}
}

export const setUserCart = (email:string,userCart:IUserCartMap) => {
  const cart = getCart();
  cart[email] = userCart;
  setCart(cart)
}
