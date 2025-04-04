"use client";

import { IProduct, ProductSchema } from "@/types/product";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";

type Props = {
  onSubmit: (data: IProduct) => void;
  isEdit?: boolean;
  product?: IProduct | null;
};

const ProductForm = (props: Props) => {
  const { onSubmit, isEdit = false, product } = props;

  const methods = useForm<IProduct>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      id: product?.id ?? "",
      title: product?.title ?? "",
      image: product?.image ?? "",
      price: product?.price ?? 0,
      stock: product?.stock ?? 0,
    },
  });

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = methods;

  return (
    <Box>
      <FormProvider {...methods}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container>
            <Stack spacing={3} sx={{ width: "100%" }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 3 }}>
                    {isEdit ? "Edit" : "Add"} Product
                  </Typography>
                  <Stack spacing={2}>
                    {isEdit && (
                      <Controller
                        name="id"
                        control={control}
                        render={({ field }) => (
                          <TextField {...field} label="ID" disabled />
                        )}
                      />
                    )}

                    <Controller
                      name="title"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Title"
                          error={!!errors.title}
                          helperText={errors.title?.message}
                        />
                      )}
                    />
                    <Controller
                      name="image"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Image URL"
                          error={!!errors.image}
                          helperText={errors.image?.message}
                        />
                      )}
                    />
                    <Controller
                      name="price"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Price"
                          type="number"
                          error={!!errors.price}
                          helperText={errors.price?.message}
                        />
                      )}
                    />
                    <Controller
                      name="stock"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Stock"
                          type="number"
                          error={!!errors.stock}
                          helperText={errors.stock?.message}
                        />
                      )}
                    />
                  </Stack>
                  <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                    Submit
                  </Button>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Box>
      </FormProvider>
    </Box>
  );
};

export default ProductForm;
