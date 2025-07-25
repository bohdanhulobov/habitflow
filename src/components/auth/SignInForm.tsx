import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ForgotPassword from "@/components/auth/ForgotPassword";
import { ControlledTextInput } from "@/components/shared/molecules/ControlledFields";

const signInSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type FormData = z.infer<typeof signInSchema>;

export default function SignInForm() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  // Read callbackUrl from search params
  const searchParams =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : undefined;
  const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard";

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValid, errors },
    setError,
    clearErrors,
  } = useForm<FormData>({
    resolver: zodResolver(signInSchema),
    mode: "all",
    defaultValues: {
      email: "",
      password: "",
    },
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
        <ControlledTextInput
          name="email"
          type="email"
          control={control}
          autoComplete="email"
          label={{ text: "Email", bold: false }}
          placeholder="e.g. your@email.com"
          onChange={() => clearErrors("root")}
        />

        <ControlledTextInput
          name="password"
          control={control}
          label={{ text: "Password", bold: false }}
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          onChange={() => clearErrors("root")}
        />

        <Box
          alignItems={"center"}
          display="flex"
          justifyContent={"space-between"}
        >
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Link
            component="button"
            type="button"
            onClick={handleClickOpen}
            variant="body2"
          >
            Forgot your password?
          </Link>
          <ForgotPassword open={open} handleClose={handleClose} />
        </Box>

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
