"use client";
import { ICartMap } from "@/types/cart";
import { ICartProduct } from "@/types/product";
import { getCartItems, setCartItems } from "@/utils/cart";
import { getUserFromLocal } from "@/utils/user";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface ICartContext {
  cartMap: ICartMap;
  handleCartMap: (email: string, cartMap: ICartMap) => void;
  cartQuantity: number;
  incrementCartQuantity: () => void;
  decrementCartQuantity: () => void;
  clearCart: () => void;
  // handlecartCount: (email: string) => void;
}

export const CartContext = createContext({} as ICartContext);

export const useCartContext = () => useContext(CartContext);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartMap, setCartMap] = useState<ICartMap>({});
  const [cartQuantity, setCartQuantity] = useState(0);

  const handleCartMap = (email: string, newCartMap: ICartMap) => {
    setCartMap(newCartMap);
    setCartItems(email, Object.values(newCartMap));
  };

  const incrementCartQuantity = () => {
    setCartQuantity((prev) => prev + 1);
  };

  const decrementCartQuantity = () => {
    setCartQuantity((prev) => Math.max(prev - 1, 0));
  };

  const clearCart = () => {
    const email = getUserFromLocal();
    if (!email) return;
    setCartMap({});
    setCartQuantity(0);
    localStorage.removeItem("cart");
  };

  // useEffect(() => {
  // const email = getUserFromLocal();
  // if (!email) return;

  // console.log(email);

  // const handlecartCount = (email: string) => {

  // useEffect(() => {
  //   const email = getUserFromLocal();
  //   setUser(email);
  // }, []);

  // useEffect(() => {
  //   const carts = getCartItems();
  //   const userCart: ICartProduct[] = carts[user] || [];
  //   const newCartMap: ICartMap = {};
  //   userCart.forEach((item) => {
  //     newCartMap[item.id] = item;
  //   });
  //   setCartMap(newCartMap);

  //   const totalQuantity: number = userCart.reduce((acc, cartItem) => {
  //     return acc + cartItem.quantity;
  //   }, 0);
  //   setCartQuantity(totalQuantity);
  // }, [user]);

  const loadCart = useCallback(() => {
    const email = getUserFromLocal();
    if (!email) return;

    const carts = getCartItems();
    const userCart: ICartProduct[] = carts[email] || [];

    const newCartMap: ICartMap = {};
    userCart.forEach((item) => {
      newCartMap[item.id] = item;
    });

    setCartMap(newCartMap);

    const totalQuantity = userCart.reduce(
      (acc, item) => acc + item.quantity,
      0
    );
    setCartQuantity(totalQuantity);

    window.addEventListener("userloggedin", loadCart);
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  return (
    <CartContext.Provider
      value={{
        cartMap,
        handleCartMap,
        cartQuantity,
        incrementCartQuantity,
        decrementCartQuantity,
        clearCart,
        // handlecartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
