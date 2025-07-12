"use client";

import { api } from "@/components/providers/TRPCProvider";
import Error from "@/components/ui/molecules/Error";
import Loader from "@/components/ui/molecules/Loader";
import PageHeader from "@/components/ui/organisms/PageHeader";
import { Typography, Box } from "@mui/material";

export default function ProfilePage() {
  const { data, isLoading, error } = api.user.me.useQuery();

  if (isLoading) {
    return <Loader wording="Loading profile..." />;
  }
  if (error || !data) {
    return <Error errorMessage="Profile is not found" />;
  }

  return (
    <Box>
      <PageHeader title={`Your profile, ${data.name}`} />

      {/* Display user profile information */}
      <Typography variant="body1">Name: {data.name}</Typography>
      <Typography variant="body1">Email: {data.email}</Typography>
    </Box>
  );
}
