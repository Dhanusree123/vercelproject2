"use client";
import { useGlobalContext } from "@/context/GlobalContext";
import { Add, Home, ShoppingCart } from "@mui/icons-material";
import { Badge, Box, Button, IconButton } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const Header = () => {
  const router = useRouter();

  const { cartQuantity, user, logout } = useGlobalContext();

  const handleLogout = () => {
    logout();
    alert("Logged Out Successfully");
    router.push("/login");
  };

  const handleClickOrders = () => {
    if (user === "ganesh@microfox.co") {
      router.push("/orders");
    } else {
      router.push("/my-orders");
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <Box>
        <Link href={"/"}>
          <IconButton size="small">
            <Home />
          </IconButton>
        </Link>

        {user === "ganesh@microfox.co" && (
          <Link href={"/product-add"}>
            <IconButton size="medium">
              <Add />
            </IconButton>
          </Link>
        )}
      </Box>
      <Box>
        {user && (
          <Box>
            <IconButton href="/cart">
              <Badge badgeContent={Number(cartQuantity || 0)} color="error">
                <ShoppingCart />
              </Badge>
            </IconButton>

            {/* <Link href={"/orders"}> */}
            <Button onClick={handleClickOrders}>Orders</Button>
            {/* </Link> */}

            <Link href="/login">
              <Button onClick={handleLogout}>LOGOUT</Button>
            </Link>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Header;
