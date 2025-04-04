/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import React, { useContext, useEffect, useState } from "react";
import RemoveIcon from "@mui/icons-material/Remove";
import { IProduct } from "@/types/product";
import { Add } from "@mui/icons-material";
// import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  getProductsFromLocal,
  getUpdatedProductFromLocal,
} from "@/utils/product";
import { CartContext } from "@/context/CartContext";
import { getUserFromLocal } from "@/utils/user";

const CartPage = () => {
  const useCartContext = () => useContext(CartContext);
  const {
    cartMap,
    incrementCartQuantity,
    decrementCartQuantity,
    handleCartMap,
  } = useCartContext();
  const [cartProducts, setCartProducts] = useState<IProduct[]>([]);

  const [user, setUser] = useState<string | null>("");
  const [warning, setWarning] = useState<string>("");

  const router = useRouter();

  const handleIncrease = (product: IProduct) => {
    const email = getUserFromLocal();

    const newCartMap = { ...cartMap };
    if (newCartMap[product.id]) {
      newCartMap[product.id].quantity += 1;
    } else {
      newCartMap[product.id] = { ...product, quantity: 1 };
    }
    handleCartMap(email, newCartMap);
    incrementCartQuantity();
  };

  const handleDecrease = (product: IProduct) => {
    const email = getUserFromLocal();
    console.log(email);
    if (!email) return;

    const newCartMap = { ...cartMap };
    if (newCartMap[product.id]?.quantity > 1) {
      newCartMap[product.id].quantity -= 1;
    } else {
      delete newCartMap[product.id];
      window.location.reload();
    }
    handleCartMap(email, newCartMap);
    decrementCartQuantity();
  };

  const PlaceOrder = () => {
    const activeUser = getUserFromLocal();
    if (!activeUser) {
      alert("Login to place an order");
      return;
    }

    const carts = JSON.parse(localStorage.getItem("carts") || "{}");
    const orders = JSON.parse(localStorage.getItem("orders") || "{}");
    const products = getProductsFromLocal();

    const userCart = carts[activeUser] || [];

    let orderValid = true;
    let errorMessage = "";

    userCart.forEach((product: IProduct) => {
      const requestedQuantity = cartMap[product.id]?.quantity || 0;
      if (requestedQuantity > product.stock) {
        orderValid = false;
        errorMessage += `Not enough stock for ${product.title}. Available: ${product.stock}, Requested: ${requestedQuantity}}\n`;
      }
    });

    if (!orderValid) {
      alert(`Order cannot be placed due to stock issues:\n${errorMessage}`);
      return;
    }

    orders[activeUser] = orders[activeUser] || [];

    const orderId = crypto.randomUUID();

    const newOrder = {
      id: orderId,
      items: userCart.map((product: IProduct) => ({
        ...product,
        quantity: cartMap[product.id]?.quantity,
      })),
    };

    orders[activeUser].push(newOrder);

    const productHashMap: Record<string, IProduct> = {};
    products.forEach((p) => {
      productHashMap[p.id] = p;
    });

    userCart.forEach((product: IProduct) => {
      if (productHashMap[product.id]) {
        productHashMap[product.id].stock -= cartMap[product.id]?.quantity || 0;
      }
    });

    localStorage.setItem(
      "products",
      JSON.stringify(Object.values(productHashMap))
    );

    localStorage.setItem("orders", JSON.stringify(orders));

    delete carts[activeUser];
    localStorage.setItem("carts", JSON.stringify(carts));

    alert("Order placed successfully!");
    window.location.reload();
  };

  useEffect(() => {
    const activeUser = getUserFromLocal();
    if (!activeUser) {
      router.push("/login");
    } else {
      setUser(activeUser);
    }
    if (activeUser) {
      const carts = JSON.parse(localStorage.getItem("carts") || "{}");
      const userCart = carts[activeUser] || [];
      setCartProducts(userCart);
    }
  }, []);

  useEffect(() => {
    const updatedProduct = getUpdatedProductFromLocal();
    if (updatedProduct) {
      const existingProduct = cartProducts.find(
        (p) => p.id === updatedProduct.id
      );
      if (existingProduct && existingProduct.price !== updatedProduct.price) {
        const status =
          existingProduct.price < updatedProduct.price
            ? "Decreased"
            : "Increased";
        setWarning(
          `Price ${status} for ${existingProduct.title} from Rs. ${updatedProduct.price} to Rs. ${existingProduct.price}`
        );
        const updatedCart = cartProducts.map((p) =>
          p.id === updatedProduct.id ? { ...p, updatedProduct } : p
        );
        setCartProducts(updatedCart);
        if (user) {
          const carts = JSON.parse(localStorage.getItem("carts") || "{}");
          carts[user] = updatedCart;
          localStorage.setItem("carts", JSON.stringify(carts));
        }
      }
    }
  }, [user]);

  return (
    <>
      <Container maxWidth="lg">
        <Box>
          {warning && (
            <Typography color="warning" sx={{ mb: 2 }}>
              {warning}
            </Typography>
          )}

          {cartProducts.length > 0 ? (
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, lg: 8 }}>
                <Card>
                  <CardContent>
                    {cartProducts.map((product) => (
                      <Box
                        key={product.id}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Box
                            component="img"
                            src={product.image}
                            width={180}
                            height={180}
                            padding={2}
                            sx={{
                              objectFit: "cover",
                              "&:hover": {
                                transform: "scale(1.05)",
                              },
                            }}
                            onClick={() => router.push("/")}
                          />
                          <Box sx={{ marginLeft: 2 }}>
                            <Typography>{product.title}</Typography>
                            <Typography>Rs. {product.price}</Typography>
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Button onClick={() => handleDecrease(product)}>
                              <RemoveIcon />
                            </Button>
                            <Typography>
                              {cartMap[product.id]?.quantity}
                            </Typography>
                            <Button onClick={() => handleIncrease(product)}>
                              <Add />
                            </Button>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </CardContent>
                  {user && (
                    <CardActions
                      sx={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      <Button
                        variant="contained"
                        color="warning"
                        onClick={PlaceOrder}
                      >
                        Place Order
                      </Button>
                    </CardActions>
                  )}
                </Card>
              </Grid>
              <Grid size={{ xs: 12, lg: 4 }}>
                <Typography>PRICE DETAILS</Typography>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography>Total Items:</Typography>
                  <Typography>{Object.values(cartMap).length}</Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 1,
                  }}
                >
                  <Typography>Total Amount:</Typography>
                  <Typography>
                    Rs.
                    {Object.values(cartMap).reduce(
                      (acc, p) => acc + p.price * p.quantity,
                      0
                    )}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography variant="h5">Cart is Empty</Typography>
              <Box
                component="img"
                src="https://png.pngtree.com/png-vector/20220629/ourmid/pngtree-empty-shopping-cart-store-icon-png-image_5624129.png"
                sx={{ width: 400, height: 300, objectFit: "contain" }}
              />
            </Box>
          )}
        </Box>
      </Container>
    </>
  );
};

export default CartPage;
