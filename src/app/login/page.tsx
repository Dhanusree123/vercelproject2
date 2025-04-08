"use client";
import { useGlobalContext } from "@/context/GlobalContext";
import { ILogin, LoginSchema } from "@/types/login";
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
import { useRouter } from "next/navigation";
import React from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";

const LoginPage = () => {
  const router = useRouter();

  const methods = useForm<ILogin>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
    },
  });

  const { login } = useGlobalContext();

  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = methods;

  const onSubmit = (details: ILogin) => {
    login(details.email);
    reset();
    router.push("/");
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        marginTop: "10vh",
      }}
    >
      <FormProvider {...methods}>
        <Box component="form" sx={{ p: 5 }} onSubmit={handleSubmit(onSubmit)}>
          <Grid container>
            <Stack spacing={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Login</Typography>
                  <Stack>
                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Email"
                          error={!!errors.email}
                          helperText={errors.email?.message}
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

export default LoginPage;
