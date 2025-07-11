import { Frequency } from "@prisma/client";

export interface Habit {
  id: string;
  title: string;
  description?: string;
  color: string;
  icon?: string;
  frequency: Frequency;
  targetValue: number;
  unit?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface HabitLog {
  id: string;
  date: Date;
  value: number;
  notes?: string;
  habitId: string;
  userId: string;
  createdAt: Date;
}

export interface CreateHabitInput {
  title: string;
  description?: string;
  color?: string;
  icon?: string;
  frequency?: Frequency;
  targetValue?: number;
  unit?: string;
}
