"use client";
import { useGlobalContext } from "@/context/GlobalContext";
import AuthGuard from "@/guards/AuthGuard";
import { IProduct } from "@/types/product";
import { getProductsFromLocal } from "@/utils/product";
import { Add, Remove } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

const ProductsPage = () => {
  const [products, setProducts] = useState<IProduct[]>([]);

  const {
    user,
    cartMap,
    handleCartMap,
    incrementCartQuantity,
    decrementCartQuantity,
  } = useGlobalContext();

  const handleIncrease = (product: IProduct) => {
    const { id, title, price, image, stock } = product;
    // console.log(cartMap);
    const userCartMap = new Map(cartMap.get(user));
    const existing = userCartMap.get(id);
    const existingQuantity = existing?.quantity ?? 0;
    // console.log(existing?.id);
    if (existing) {
      if (existingQuantity >= stock) {
        alert("Maximum limit reached");
        return;
      }
      userCartMap.set(id, {
        id,
        title,
        price,
        image,
        quantity: existingQuantity + 1,
      });
    } else {
      userCartMap.set(id, { id, title, price, image, quantity: 1 });
    }
    console.log(userCartMap);

    handleCartMap(userCartMap);
    incrementCartQuantity();
  };

  const handleDecrease = (product: IProduct) => {
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
  useEffect(() => {
    setProducts(getProductsFromLocal());
  }, []);

  return (
    <AuthGuard>
      <Box>
        <Typography variant="h4" sx={{ mb: 3, textAlign: "center" }}>
          Products
        </Typography>

        {products.length > 0 ? (
          <Grid container spacing={3}>
            {products.map((product) => {
              const userCart = cartMap.get(user);
              const cartItem = userCart?.get(product.id);
              return (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product.id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "transform 0.3s ease-in-out",
                      "&:hover": {
                        transform: "scaleY(1.02)",
                        boxShadow: 3,
                      },
                    }}
                  >
                    <Button href={`/products/${product.id}/edit`} disableRipple>
                      <Box
                        component="img"
                        src={product.image}
                        alt={product.title}
                        sx={{
                          objectFit: "cover",
                          width: 180,
                          height: 200,
                          "&:hover": {
                            transform: "scale(1.05)",
                          },
                        }}
                      />
                    </Button>

                    <CardContent>
                      <Box
                        sx={{
                          width: 200,
                          height: 100,
                          display: "flex",
                          overflow: "hidden",
                        }}
                      >
                        <Typography variant="body1">{product.title}</Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Rs. {product.price}
                      </Typography>
                      {product.stock === 0 && (
                        <Typography color="error" fontWeight="bold">
                          Out of Stock
                        </Typography>
                      )}
                    </CardContent>
                    <CardActions>
                      {cartItem?.quantity ? (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Button onClick={() => handleDecrease(product)}>
                            <Remove />
                          </Button>

                          <Typography>{cartItem?.quantity}</Typography>
                          <Button
                            onClick={() => handleIncrease(product)}
                            disabled={product.stock === cartItem.quantity}
                          >
                            <Add />
                          </Button>
                        </Box>
                      ) : (
                        <Box>
                          <Button
                            onClick={() => handleIncrease(product)}
                            disabled={product.stock === 0}
                          >
                            Add to Cart
                          </Button>
                        </Box>
                      )}
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography> No Products found</Typography>
            <Box
              component="img"
              src="https://www.shutterstock.com/image-vector/search-no-result-data-document-260nw-2344073251.jpg"
              sx={{ width: 300, height: 200, objectFit: "contain" }}
            />
          </Box>
        )}
      </Box>
    </AuthGuard>
  );
};

export default ProductsPage;
