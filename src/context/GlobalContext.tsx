"use client";
import { ICartMap, IUserCartMap } from "@/types/cart";
import { getCart, getUserCart, setCart } from "@/utils/cart";
import { getUserFromLocal } from "@/utils/user";
import { redirect } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

interface IGlobalContext {
  cartMap: ICartMap;
  handleCartMap: (userCartMap: IUserCartMap) => void;
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
  const [cartMap, setCartMap] = useState<ICartMap>({});
  const [cartQuantity, setCartQuantity] = useState(0);
  const [user, setUser] = useState<string>("");

  const handleCartMap = (userCartMap: IUserCartMap) => {
    const newCartMap = {
      ...cartMap,
      [user]: userCartMap,
    };
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
    setCartMap({});
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
      const totalQuantity: number = Object.values(userCart)?.reduce(
        (acc, product) => {
          return acc + product.quantity;
        },
        0
      );
      setUser(user);
      setCartQuantity(totalQuantity);
    }
  }, [user]);

  // const loadCart = useCallback(() => {
  //   const email = getUserFromLocal();
  //   if (!email) return;

  //   const carts = getCartItems();
  //   const userCart: ICartProduct[] = carts[email] || [];

  //   const newCartMap: ICartMap = {};
  //   userCart.forEach((item) => {
  //     newCartMap[item.id] = item;
  //   });

  //   setCartMap(newCartMap);

  //   const totalQuantity = userCart.reduce(
  //     (acc, item) => acc + item.quantity,
  //     0
  //   );
  //   setCartQuantity(totalQuantity);

  //   window.addEventListener("userloggedin", loadCart);
  // }, []);

  // useEffect(() => {
  //   loadCart();
  // }, [loadCart]);

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
