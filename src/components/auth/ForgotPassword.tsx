import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

interface ForgotPasswordProps {
  open: boolean;
  handleClose: () => void;
}

const forgotPasswordSchema = z.object({
  email: z.email("Please enter a valid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword({
  open,
  handleClose,
}: ForgotPasswordProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<ForgotPasswordFormData> = async (data) => {
    try {
      // Simulate an API call to send a password reset email
      console.log("Sending password reset email to:", data.email);
      // Here you would typically call your API to send the email
      // For example: await api.sendPasswordResetEmail(data.email);
      handleClose();
    } catch (error) {
      console.error("Error sending password reset email:", error);
      setError("root", {
        type: "manual",
        message: "Failed to send password reset email. Please try again later.",
      });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      slotProps={{
        paper: {
          component: "form",
          onSubmit: handleSubmit(onSubmit),
          disabled: isSubmitting,
          sx: { backgroundImage: "none" },
        },
      }}
    >
      <DialogTitle>Reset password</DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}
      >
        <DialogContentText>
          Enter your account&apos;s email address, and we&apos;ll send you a
          link to reset your password.
        </DialogContentText>

        <TextField
          autoFocus
          {...register("email")}
          margin="dense"
          id="email"
          placeholder="Email address"
          type="email"
          error={!!errors.email}
          helperText={errors.email?.message}
          fullWidth
        />
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          variant="contained"
          type="submit"
          disabled={isSubmitting || !isValid}
        >
          {isSubmitting ? "Sending..." : "Continue"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
