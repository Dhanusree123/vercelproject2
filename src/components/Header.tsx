"use client";
import { useCartContext } from "@/context/CartContext";
import { getUserFromLocal } from "@/utils/user";
import { Add, Home, ShoppingCart } from "@mui/icons-material";
import { Badge, Box, Button, IconButton } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Header = () => {
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  const [cart, setCart] = useState(0);
  const router = useRouter();

  const { cartQuantity } = useCartContext();

  useEffect(() => {
    const updateUser = () => {
      const user = getUserFromLocal();
      setLoggedInUser(user);
    };
    updateUser();

    window.addEventListener("userloggedin", updateUser);

    return () => {
      window.removeEventListener("userloggedin", updateUser);
    };
  });

  const handleLogout = () => {
    localStorage.removeItem("loggedinuser");
    window.alert("Logged Out Successfully");
    router.push("/login");
    setLoggedInUser(null);
  };

  const handleClickOrders = () => {
    const loggedInUser = getUserFromLocal();
    if (loggedInUser === "ganesh@microfox.co") {
      router.push("/orders");
    } else {
      router.push("/my-orders");
    }
  };

  useEffect(() => {
    setCart(cartQuantity);
  }, [cartQuantity]);

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <Box>
        <Link href={"/"}>
          <IconButton size="small">
            <Home />
          </IconButton>
        </Link>

        {loggedInUser === "ganesh@microfox.co" && (
          <Link href={"/product-add"}>
            <IconButton size="small">
              <Add />
            </IconButton>
          </Link>
        )}
      </Box>
      <Box>
        {loggedInUser && (
          <Box>
            <IconButton href="/cart">
              <Badge badgeContent={cart} color="error">
                <ShoppingCart />
              </Badge>
            </IconButton>
            {loggedInUser === "ganesh@microfox.co" ? (
              <Link href={"/orders"}>
                <Button onClick={handleClickOrders}>Orders</Button>
              </Link>
            ) : (
              <Link href={"/my-orders"}>
                <Button onClick={handleClickOrders}>Orders</Button>
              </Link>
            )}

            <Link href="/login">
              <Button onClick={handleLogout} sx={{ ml: 2 }}>
                LOGOUT
              </Button>
            </Link>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Header;
