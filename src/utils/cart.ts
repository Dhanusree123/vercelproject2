import { ICartProduct } from '@/types/product';

export const getCartItems = (): Record<string,ICartProduct[]> => {
  return JSON.parse(localStorage.getItem('carts') || '{}');
};

export const setCartItems = (email:string,items: ICartProduct[]) => {
  const carts = getCartItems();
  carts[email] = items; 
  localStorage.setItem("carts", JSON.stringify(carts));};
