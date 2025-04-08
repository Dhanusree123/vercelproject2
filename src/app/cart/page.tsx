/* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable react-hooks/exhaustive-deps */
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
import React, { useEffect, useState } from "react";
import RemoveIcon from "@mui/icons-material/Remove";
import { Add } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "@/context/GlobalContext";
import AuthGuard from "@/guards/AuthGuard";
import { ICartProduct, IUserCartMap } from "@/types/cart";
import { getCart, getUserCart, setCart } from "@/utils/cart";
import {
  getProductsFromLocal,
  getUpdatedProductFromLocal,
  setProductsToLocal,
} from "@/utils/product";
import { getUserOrders, setUserOrders } from "@/utils/order";
import { IProduct } from "@/types/product";

const CartPage = () => {
  const {
    user,
    cartMap,
    incrementCartQuantity,
    decrementCartQuantity,
    handleCartMap,
  } = useGlobalContext();

  const [cartProducts, setCartProducts] = useState<Map<string, ICartProduct>>(
    new Map()
  );
  const [productsInLocal, setProductsInLocal] = useState<IProduct[]>([]);
  const [warning, setWarning] = useState<string>("");

  const router = useRouter();

  const handleIncrease = (product: ICartProduct) => {
    const { id, title, price, image } = product;
    const userCartMap = new Map(cartMap.get(user));

    const foundProduct = productsInLocal.find((p) => p.id === id);
    const stock = foundProduct?.stock ?? 0;

    console.log(userCartMap);
    const existing = userCartMap.get(id);
    const currentQuantity = existing?.quantity ?? 0;
    if (existing) {
      if (currentQuantity >= stock) {
        alert("Maximum limit reached");
        return;
      }
      userCartMap.set(id, {
        id,
        title,
        image,
        price,
        quantity: currentQuantity + 1,
      });
    } else {
      userCartMap.set(id, { id, title, price, image, quantity: 1 });
    }

    handleCartMap(userCartMap);
    incrementCartQuantity();
  };
  const handleDecrease = (product: ICartProduct) => {
    const { id } = product;
    const userCartMap = new Map(cartMap.get(user) ?? []);
    const existing = userCartMap.get(id);

    if (existing) {
      if (existing.quantity > 1) {
        userCartMap.set(id, { ...existing, quantity: existing.quantity - 1 });
      } else {
        userCartMap.delete(id);
      }
    }

    handleCartMap(userCartMap);
    decrementCartQuantity();
  };

  const PlaceOrder = () => {
    const cartMapObj = getCart();
    const products = getProductsFromLocal();
    const userCart = getUserCart(user) ?? new Map();

    const productMap = new Map<string, IProduct>();
    products.forEach((p: IProduct) => productMap.set(p.id, p));

    let orderValid = true;
    let errorMessage = "";

    for (const [_, cartItem] of userCart.entries()) {
      const product = productMap.get(cartItem.id);
      if (!product) {
        orderValid = false;
        errorMessage += `Product ${cartItem.title} not found.\n`;
      } else if (cartItem.quantity > product.stock) {
        orderValid = false;
        errorMessage += `Not enough stock for ${cartItem.title}. Available: ${product.stock}, Requested: ${cartItem.quantity}\n`;
      }
    }

    if (!orderValid) {
      alert(`Order cannot be placed due to stock issues:\n${errorMessage}`);
      return;
    }

    const orderId = crypto.randomUUID();
    const newOrder = {
      id: orderId,
      items: Array.from(userCart.values()),
    };

    const userOrders = getUserOrders(user);
    userOrders.set(orderId, newOrder);
    setUserOrders(user, userOrders);

    for (const [_, cartItem] of userCart.entries()) {
      const product = productMap.get(cartItem.id);
      if (product) {
        product.stock -= cartItem.quantity;
      }
    }
    setProductsToLocal(Array.from(productMap.values()));

    cartMapObj.delete(user);
    setCart(cartMapObj);
    alert("Order placed successfully!");
    window.location.reload();
  };

  useEffect(() => {
    if (user && cartMap.get(user)) {
      setCartProducts(cartMap.get(user) ?? new Map());
    }
  }, [cartMap, user]);

  useEffect(() => {
    const updatedProduct = getUpdatedProductFromLocal();
    if (updatedProduct) {
      const existingProduct = Array.from(cartProducts.values()).find(
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

        const updatedCart = new Map(cartProducts);
        updatedCart.set(updatedProduct.id, {
          ...cartProducts.get(updatedProduct.id)!,
          price: updatedProduct.price,
        });

        setCartProducts(updatedCart);
        if (user) {
          const carts = getCart();
          carts.set(user, updatedCart);
          setCart(carts);
        }
        const timeout = setTimeout(() => setWarning(""), 5000);
        return () => clearTimeout(timeout);
      }
    }
  }, [user, cartProducts]);

  useEffect(() => {
    setProductsInLocal(getProductsFromLocal());
  }, []);

  return (
    <AuthGuard>
      <Container maxWidth="lg">
        <Box>
          {warning && (
            <Typography color="warning" sx={{ mb: 2 }}>
              {warning}
            </Typography>
          )}

          {cartProducts.size > 0 ? (
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, lg: 8 }}>
                <Card>
                  <CardContent>
                    {Array.from(cartProducts.values())
                      .filter((product) => product.id)
                      .map((product) => (
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
                              <Typography>{product.quantity}</Typography>
                              <Button
                                onClick={() => handleIncrease(product)}
                                disabled={
                                  (productsInLocal.find(
                                    (p: IProduct) => p.id === product.id
                                  )?.stock ?? 0) ===
                                  cartProducts.get(product.id)?.quantity
                                }
                              >
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
                  <Typography>
                    {Array.from(cartProducts.values()).length}
                  </Typography>
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
                    {Array.from(cartProducts.values()).reduce(
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
    </AuthGuard>
  );
};

export default CartPage;
