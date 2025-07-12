import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ForgotPassword from "@/components/auth/ForgotPassword";

const signInSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type FormData = z.infer<typeof signInSchema>;

export default function SignInCard() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  // Read callbackUrl from search params
  const searchParams =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : undefined;
  const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(signInSchema),
    mode: "all",
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        setError("root", {
          type: "manual",
          message: "Invalid email or password",
        });
      } else {
        router.push(callbackUrl);
      }
    } catch (error) {
      console.error("Sign in error:", error);
      setError("root", {
        type: "manual",
        message: "Something went wrong. Please try again.",
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
        Sign in
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ display: "flex", flexDirection: "column", width: "100%", gap: 2 }}
      >
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
            autoFocus
            required
            fullWidth
            variant="outlined"
            color={errors.email ? "error" : "primary"}
          />
        </FormControl>
        <FormControl>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Link
              component="button"
              type="button"
              onClick={handleClickOpen}
              variant="body2"
              sx={{ alignSelf: "baseline" }}
            >
              Forgot your password?
            </Link>
          </Box>
          <TextField
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            placeholder="••••••"
            type="password"
            id="password"
            autoComplete="current-password"
            required
            fullWidth
            variant="outlined"
            color={errors.password ? "error" : "primary"}
          />
        </FormControl>
        <FormControlLabel
          control={<Checkbox value="remember" color="primary" />}
          label="Remember me"
        />
        <ForgotPassword open={open} handleClose={handleClose} />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          disabled={isSubmitting || !isValid}
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
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
          Don&apos;t have an account?{" "}
          <span>
            <Link
              component="button"
              variant="body2"
              sx={{ alignSelf: "center" }}
              onClick={() => {
                const event = new CustomEvent("switchAuthCard", { detail: 1 });
                window.dispatchEvent(event);
              }}
            >
              Sign up
            </Link>
          </span>
        </Typography>
      </Box>
    </Card>
  );
}
