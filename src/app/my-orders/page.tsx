"use client";

import { useGlobalContext } from "@/context/GlobalContext";
import AuthGuard from "@/guards/AuthGuard";
import { IOrder } from "@/types/order";
import { getUserOrders } from "@/utils/order";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";

const MyOrdersPage = () => {
  const [orders, setOrders] = useState<Map<string, IOrder>>(new Map());

  const { user } = useGlobalContext();

  useEffect(() => {
    const storedUserOrders = getUserOrders(user);
    // const orders = Array.from(storedUserOrders);
    setOrders(storedUserOrders ?? new Map());
  }, [user]);

  const myOrders = Array.from(orders.values());
  console.log(myOrders);
  return (
    <AuthGuard>
      <Box>
        <Typography variant="h4" sx={{ mb: 3, textAlign: "center" }}>
          My Orders
        </Typography>

        {orders.size === 0 ? (
          <Typography variant="h6" sx={{ textAlign: "center" }}>
            You have no orders yet.
          </Typography>
        ) : (
          myOrders.map((order) => (
            <Box
              key={order?.id}
              sx={{ mb: 4, p: 2, border: "1px solid #ddd", borderRadius: 2 }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                Order ID: {order.id}
              </Typography>
              <Grid container spacing={3}>
                {order.items?.map((product) => (
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
                          Quantity: {product.quantity}
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
    </AuthGuard>
  );
};

export default MyOrdersPage;
