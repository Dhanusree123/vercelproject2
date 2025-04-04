"use client";
import { useCartContext } from "@/context/CartContext";
import { getUserFromLocal } from "@/utils/user";
import { Add, Home, ShoppingCart } from "@mui/icons-material";
import { Badge, Box, Button, IconButton } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Header = () => {
  const [loggedInUser, setLoggedInUser] = useState<string>("");
  const router = useRouter();

  const { cartQuantity } = useCartContext();

  useEffect(() => {
    const updateUser = () => {
      const user = getUserFromLocal();
      setLoggedInUser(user);
      // handlecartCount(loggedInUser);
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
    setLoggedInUser("");
  };

  const handleClickOrders = () => {
    const loggedInUser = getUserFromLocal();
    if (loggedInUser === "ganesh@microfox.co") {
      router.push("/orders");
    } else {
      router.push("/my-orders");
    }
  };

  console.log(cartQuantity);
  // useEffect(() => {
  //   const email = getUserFromLocal();
  //   if (email) {
  //     handlecartCount(email);
  //   }
  // }, [getUserFromLocal]);

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
              <Badge badgeContent={cartQuantity} color="error">
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
