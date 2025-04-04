/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useCartContext } from "@/context/CartContext";
import { IProduct } from "@/types/product";
import { getUserFromLocal } from "@/utils/user";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const MyOrdersPage = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<{ id: string; items: IProduct[] }[]>([]);
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);

  const { cartMap } = useCartContext();
  useEffect(() => {
    const loggedUser = getUserFromLocal();
    if (!loggedUser) {
      router.push("/login");
    } else {
      setLoggedInUser(loggedUser);
      console.log(loggedInUser);
      const storedOrders = JSON.parse(localStorage.getItem("orders") || "{}");

      setOrders(storedOrders[loggedUser] || []);
    }
  }, []);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, textAlign: "center" }}>
        My Orders
      </Typography>

      {orders.length === 0 ? (
        <Typography variant="h6" sx={{ textAlign: "center" }}>
          You have no orders yet.
        </Typography>
      ) : (
        orders.map((order) => (
          <Box
            key={order.id}
            sx={{ mb: 4, p: 2, border: "1px solid #ddd", borderRadius: 2 }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Order ID: {order.id}
            </Typography>
            <Grid container spacing={3}>
              {order.items.map((product) => (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product.id}>
                  <Card sx={{ display: "flex", width: "80vw" }}>
                    <Box
                      component="img"
                      src={product.image}
                      alt={product.title}
                      sx={{ height: 120, width: 120, objectFit: "contain" }}
                    />
                    <CardContent>
                      <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                        {product.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Price: Rs. {product.price}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Quantity: {cartMap[product.id]?.quantity}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))
      )}
    </Box>
  );
};

export default MyOrdersPage;
