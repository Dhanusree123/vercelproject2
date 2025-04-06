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

  const [cartProducts, setCartProducts] = useState<IUserCartMap>({});

  const [warning, setWarning] = useState<string>("");

  const router = useRouter();

  const handleIncrease = (product: ICartProduct) => {
    const { id, title, price, image } = product;

    const userCartMap = cartMap[user] ?? {};
    if (userCartMap[id]) {
      userCartMap[id].quantity += 1;
    } else {
      userCartMap[id] = { id, title, price, image, quantity: 1 };
    }
    handleCartMap(userCartMap);
    incrementCartQuantity();
  };

  const handleDecrease = (product: ICartProduct) => {
    const { id } = product;
    const userCartMap = cartMap[user] ?? {};
    if (userCartMap[id]) {
      if (userCartMap[id].quantity > 1) {
        userCartMap[id].quantity -= 1;
      } else {
        delete userCartMap[id];
        window.location.reload();
      }
    }
    handleCartMap(userCartMap);
    decrementCartQuantity();
  };

  const PlaceOrder = () => {
    const carts = getCart();
    const products = getProductsFromLocal();
    const userCart = getUserCart(user) ?? {};

    const productMap: Record<string, IProduct> = {};
    products.forEach((p: IProduct) => {
      productMap[p.id] = p;
    });

    let orderValid = true;
    let errorMessage = "";

    Object.values(userCart).forEach((cartItem) => {
      const product = productMap[cartItem.id];
      if (!product) {
        orderValid = false;
        errorMessage += `Product ${cartItem.title} not found.\n`;
      } else if (cartItem.quantity > product.stock) {
        orderValid = false;
        errorMessage += `Not enough stock for ${cartItem.title}. Available: ${product.stock}, Requested: ${cartItem.quantity}}\n`;
      }
    });

    if (!orderValid) {
      alert(`Order cannot be placed due to stock issues:\n${errorMessage}`);
      return;
    }

    const orderId = crypto.randomUUID();

    const newOrder = {
      id: orderId,
      items: Object.values(userCart),
    };

    const userOrders = getUserOrders(user);
    userOrders[orderId] = newOrder;
    setUserOrders(user, userOrders);

    Object.values(userCart).forEach((cartItem) => {
      const product = productMap[cartItem.id];
      if (product) {
        product.stock -= cartItem.quantity;
      }
    });
    setProductsToLocal(Object.values(productMap));

    delete carts[user];
    setCart(carts);
    alert("Order placed successfully!");
    window.location.reload();
  };

  useEffect(() => {
    if (user) {
      const userCart = getUserCart(user) ?? {};
      setCartProducts(userCart);
    }
  }, [user]);

  useEffect(() => {
    const updatedProduct = getUpdatedProductFromLocal();
    if (updatedProduct) {
      const existingProduct = Object.values(cartProducts).find(
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

        const updatedCart: IUserCartMap = {
          ...cartProducts,
          [updatedProduct.id]: {
            ...cartProducts[updatedProduct.id],
            price: updatedProduct.price,
          },
        };

        setCartProducts(updatedCart);
        if (user) {
          const carts = getCart();
          carts[user] = updatedCart;
          setCart(carts);
        }
        const timeout = setTimeout(() => setWarning(""), 5000);
        return () => clearTimeout(timeout);
      }
    }
  }, [user, cartProducts]);

  return (
    <AuthGuard>
      <Container maxWidth="lg">
        <Box>
          {warning && (
            <Typography color="warning" sx={{ mb: 2 }}>
              {warning}
            </Typography>
          )}

          {Object.values(cartProducts).length > 0 ? (
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, lg: 8 }}>
                <Card>
                  <CardContent>
                    {Object.values(cartProducts).map((product) => (
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
                    {Object.values(cartProducts).reduce(
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
