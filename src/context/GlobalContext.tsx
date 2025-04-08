"use client";
import { ICartProduct } from "@/types/cart";
import { getCart, getUserCart, setCart } from "@/utils/cart";
import { getUserFromLocal } from "@/utils/user";
import { redirect } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

type ICartMap = Map<string, Map<string, ICartProduct>>;
interface IGlobalContext {
  cartMap: ICartMap;
  handleCartMap: (userCartMap: Map<string, ICartProduct>) => void;
  cartQuantity: number;
  incrementCartQuantity: () => void;
  decrementCartQuantity: () => void;
  clearCart: () => void;
  user: string;
  login: (email: string) => void;
  logout: VoidFunction;
}

export const GlobalContext = createContext({} as IGlobalContext);

export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartMap, setCartMap] = useState<ICartMap>(new Map());
  const [cartQuantity, setCartQuantity] = useState<number>(0);
  const [user, setUser] = useState<string>("");

  const handleCartMap = (userCartMap: Map<string, ICartProduct>) => {
    const newCartMap = new Map(cartMap);
    newCartMap.set(user, userCartMap);
    setCartMap(newCartMap);
    setCart(newCartMap);
  };

  const incrementCartQuantity = () => {
    setCartQuantity((prev) => prev + 1);
  };

  const decrementCartQuantity = () => {
    setCartQuantity((prev) => Math.max(prev - 1, 0));
  };

  const clearCart = () => {
    const clearedMap = new Map();
    setCartMap(clearedMap);
    setCartQuantity(0);
    localStorage.removeItem("cart");
  };

  const login = (email: string) => {
    localStorage.setItem("loggedinuser", email);
    setUser(email);
    redirect("/");
  };

  const logout = () => {
    localStorage.removeItem("loggedinuser");
    setUser("");
    setCartQuantity(0);
    redirect("/login");
  };

  useEffect(() => {
    const cart = getCart();
    setCartMap(cart);

    const user = getUserFromLocal();

    if (user) {
      const userCart = getUserCart(user);
      let totalQuantity = 0;
      userCart.forEach((product) => {
        totalQuantity += product.quantity;
      });
      setUser(user);
      setCartQuantity(totalQuantity);
    }
  }, [user]);

  return (
    <GlobalContext.Provider
      value={{
        cartMap,
        handleCartMap,
        cartQuantity,
        incrementCartQuantity,
        decrementCartQuantity,
        clearCart,
        user,
        login,
        logout,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
