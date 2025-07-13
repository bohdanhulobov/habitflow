import * as React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, Box, Card, Typography, Button } from "@mui/material";
import { ControlledTextInput } from "../shared/molecules/ControlledFields";

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
    control,
    handleSubmit,
    formState: { isSubmitting, isValid, errors },
    setError,
  } = useForm({
    resolver: zodResolver(signUpSchema),
    mode: "onBlur",
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
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
        <ControlledTextInput
          name="username"
          control={control}
          label={{ text: "Username" }}
          autoComplete="username"
          placeholder="Your username"
        />
        <ControlledTextInput
          name="email"
          control={control}
          label={{ text: "Email" }}
          type="email"
          autoComplete="email"
          placeholder="Your email address"
          fullWidth
        />
        <ControlledTextInput
          name="password"
          control={control}
          label={{ text: "Password" }}
          type="password"
          autoComplete="new-password"
          placeholder="Your password"
          fullWidth
        />
        <ControlledTextInput
          name="confirmPassword"
          control={control}
          label={{ text: "Confirm Password" }}
          type="password"
          autoComplete="new-password"
          placeholder="Confirm your password"
          fullWidth
        />
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
