import * as React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  FormControl,
  Link,
  Box,
  Card,
  Typography,
  FormLabel,
  TextField,
  Button,
} from "@mui/material";

const signUpSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters long")
      .max(20, "Username must not exceed 20 characters"),
    email: z.email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    setError,
  } = useForm({
    resolver: zodResolver(signUpSchema),
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<SignUpFormData> = async (data) => {
    try {
      // Simulate an API call to sign up the user
      console.log("Signing up user with email:", data.email);
      // Here you would typically call your API to create the user
      // For example: await api.signUp(data.email, data.password);
    } catch (error) {
      console.error("Sign up error:", error);
      setError("root", {
        type: "manual",
        message: "Failed to sign up. Please try again later.",
      });
    }
  };
  return (
    <Card variant="auth">
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
      >
        Sign Up
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ display: "flex", flexDirection: "column", width: "100%", gap: 2 }}
      >
        <FormControl>
          <FormLabel htmlFor="username">Username</FormLabel>
          <TextField
            {...register("username")}
            error={!!errors.username}
            helperText={errors.username?.message}
            id="username"
            type="text"
            placeholder="your_username"
            autoComplete="username"
            required
            fullWidth
            variant="outlined"
            color={errors.username ? "error" : "primary"}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="email">Email</FormLabel>
          <TextField
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            id="email"
            type="email"
            placeholder="your@email.com"
            autoComplete="email"
            required
            fullWidth
            variant="outlined"
            color={errors.email ? "error" : "primary"}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="password">Password</FormLabel>
          <TextField
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            id="password"
            type="password"
            placeholder="Qwerty123!"
            autoComplete="new-password"
            required
            fullWidth
            variant="outlined"
            color={errors.password ? "error" : "primary"}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
          <TextField
            {...register("confirmPassword")}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            id="confirmPassword"
            type="password"
            placeholder="The same as above"
            autoComplete="new-password"
            required
            fullWidth
            variant="outlined"
            color={errors.confirmPassword ? "error" : "primary"}
          />
        </FormControl>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          disabled={isSubmitting || !isValid}
        >
          {isSubmitting ? "Creating a new account..." : "Sign up"}
        </Button>
        {errors.root && (
          <Typography
            color="error"
            variant="body2"
            sx={{ textAlign: "center" }}
          >
            {errors.root.message}
          </Typography>
        )}
        <Typography sx={{ textAlign: "center" }}>
          Already have an account?{" "}
          <span>
            <Link
              component="button"
              variant="body2"
              sx={{ alignSelf: "center" }}
              onClick={() => {
                const event = new CustomEvent("switchAuthCard", { detail: 0 });
                window.dispatchEvent(event);
              }}
            >
              Sign in
            </Link>
          </span>
        </Typography>
      </Box>
    </Card>
  );
}
