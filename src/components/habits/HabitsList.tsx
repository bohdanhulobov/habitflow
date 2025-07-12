"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/Inbox";
import { api } from "@/components/providers/TRPCProvider";
import Loader from "@/components/ui/molecules/Loader";
import Error from "@/components/ui/molecules/Error";

export default function HabitsList() {
  const { data, isLoading, error } = api.habit.getAll.useQuery();

  if (isLoading) {
    return <Loader wording={"Loading habits..."} />;
  }

  if (error || !data) {
    return <Error errorMessage={"Habits cannot be fetched"} />;
  }

  console.log("Habits data:", data);

  return (
    <Box
      sx={{
        width: "85%",
        justifySelf: "center",
      }}
    >
      <List
        sx={{
          width: "80%",
          bgcolor: "background.paper",
          borderRadius: 1.5,
          boxShadow: 1,
          justifySelf: "center",
        }}
      >
        {data.map((habit) => (
          <ListItem
            key={habit.id}
            disablePadding
            sx={{
              borderRadius: 2,
              bgcolor: habit.color + "22",
              "&:hover": {
                bgcolor: habit.color + "33",
              },
              marginY: 1,
            }}
          >
            <ListItemButton>
              <ListItemIcon sx={{ marginLeft: 2, marginRight: 1 }}>
                {habit.icon ?? <InboxIcon />}
              </ListItemIcon>
              <ListItemText
                primary={habit.title}
                secondary={habit.description}
                sx={{
                  textAlign: "center",
                }}
              />
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: 2,
                  backgroundColor: habit.color,
                  mr: 2,
                  flexShrink: 0,
                }}
              ></Box>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
