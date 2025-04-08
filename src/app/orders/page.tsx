"use client";

import AuthGuard from "@/guards/AuthGuard";
import { IOrderMap, IOrderProduct } from "@/types/order";
import { getOrders } from "@/utils/order";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";

const OrdersPage = () => {
  const [orders, setOrders] = useState<IOrderMap>(new Map());

  useEffect(() => {
    const storedOrders = getOrders();
    setOrders(storedOrders);
  }, []);
  // const allOrders = Array.from(orders.values())

  return (
    <AuthGuard>
      <Box>
        <Typography variant="h4" sx={{ mb: 3, textAlign: "center" }}>
          All Orders
        </Typography>

        {orders.size === 0 ? (
          <Typography variant="h6" sx={{ textAlign: "center" }}>
            No orders placed yet.
          </Typography>
        ) : (
          Array.from(orders)?.map(([userMail, userOrder]) => (
            <Box key={userMail} sx={{ mb: 5, p: 3, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Orders from : {userMail}
              </Typography>

              {Array.from(userOrder.values()).map((order) => (
                <Box
                  key={order.id}
                  sx={{
                    mb: 4,
                    p: 2,
                    border: "1px solid #ddd",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Order ID: {order.id}
                  </Typography>

                  <Grid container spacing={3}>
                    {order.items?.map((product: IOrderProduct) => (
                      <Grid
                        sx={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                        key={product.id}
                      >
                        <Card
                          sx={{
                            width: "80vw",
                            height: "100%",
                            display: "flex",
                          }}
                        >
                          <Box
                            component="img"
                            src={product.image}
                            alt={product.title}
                            sx={{
                              height: 120,
                              width: 120,
                              objectFit: "contain",
                            }}
                          />
                          <CardContent>
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: "bold" }}
                            >
                              {product.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Price: Rs. {product.price}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Quantity:
                              {product.quantity}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              ))}
            </Box>
          ))
        )}
      </Box>
    </AuthGuard>
  );
};

export default OrdersPage;
