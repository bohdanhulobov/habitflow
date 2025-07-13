import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import { z } from "zod";
import { Frequency } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DrawerHeader from "@/components/shared/organisms/DrawerHeader";
import { ControlledTextInput } from "../shared/molecules/ControlledFields";

const newHabitSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
  frequency: z.enum(Frequency),
  targetValue: z.number().min(1, "Target value must be at least 1"),
  unit: z.string().optional(),
  isActive: z.boolean(),
});

type NewHabitFormValues = z.infer<typeof newHabitSchema>;

export default function NewHabitDrawer() {
  const [open, setOpen] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = useForm<NewHabitFormValues>({
    resolver: zodResolver(newHabitSchema),
    defaultValues: {
      title: "",
      description: "",
      color: "",
      icon: "",
      frequency: Frequency.DAILY,
      targetValue: 1,
      unit: "",
      isActive: true,
    },
    mode: "onTouched",
  });

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };
  const onSubmit = (data: NewHabitFormValues) => {
    console.log("New Habit Data:", data);
    // Here you would typically call your API to create the habit
    // For example: await api.createHabit(data);
    setOpen(false); // Close the drawer after submission
  };

  const NewHabitForm = (
    <Box
      sx={{ width: 400, paddingX: 2 }}
      component={"form"}
      display={"flex"}
      flexDirection={"column"}
      gap={2}
      role="presentation"
      onSubmit={handleSubmit(onSubmit)}
    >
      <ControlledTextInput
        name="title"
        control={control}
        label={{ text: "Title" }}
        placeholder="e.g. Morning Workout"
      />
      <ControlledTextInput
        name="description"
        control={control}
        label={{ text: "Description" }}
        placeholder="e.g. 30 minutes of exercise"
      />
    </Box>
  );

  return (
    <div>
      <Button variant="outlined" onClick={toggleDrawer(true)}>
        Add New Habit
      </Button>
      <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
        <DrawerHeader title="New Habit" onClose={toggleDrawer(false)} />
        {NewHabitForm}
      </Drawer>
    </div>
  );
}
