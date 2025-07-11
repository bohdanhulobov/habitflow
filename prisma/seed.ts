import { Frequency, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create test user
  const hashedPassword = await bcrypt.hash("password", 12);

  const testUser = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      email: "test@example.com",
      name: "Test User",
      password: hashedPassword,
    },
  });

  console.log("👤 Created test user:", testUser.email);

  const habits = await Promise.all([
    prisma.habit.upsert({
      where: { id: "habit-1" },
      update: {},
      create: {
        id: "habit-1",
        title: "Morning Exercise",
        description: "15 minutes of morning physical exercise",
        color: "#22C55E",
        frequency: Frequency.DAILY,
        targetValue: 1,
        unit: "times",
        userId: testUser.id,
      },
    }),
    prisma.habit.upsert({
      where: { id: "habit-2" },
      update: {},
      create: {
        id: "habit-2",
        title: "Reading",
        description: "Read books daily",
        color: "#3B82F6",
        frequency: Frequency.DAILY,
        targetValue: 30,
        unit: "minutes",
        userId: testUser.id,
      },
    }),
    prisma.habit.upsert({
      where: { id: "habit-3" },
      update: {},
      create: {
        id: "habit-3",
        title: "Meditation",
        description: "Morning meditation for peace of mind",
        color: "#8B5CF6",
        frequency: Frequency.DAILY,
        targetValue: 10,
        unit: "minutes",
        userId: testUser.id,
      },
    }),
  ]);

  console.log(
    "✅ Created habits:",
    habits.map((h) => h.title),
  );

  // Create test habit logs
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const logs = await Promise.all([
    prisma.habitLog.upsert({
      where: {
        habitId_date: {
          habitId: habits[0].id,
          date: today,
        },
      },
      update: {},
      create: {
        habitId: habits[0].id,
        userId: testUser.id,
        date: today,
        value: 1,
        notes: "Great morning workout!",
      },
    }),
    prisma.habitLog.upsert({
      where: {
        habitId_date: {
          habitId: habits[1].id,
          date: yesterday,
        },
      },
      update: {},
      create: {
        habitId: habits[1].id,
        userId: testUser.id,
        date: yesterday,
        value: 25,
        notes: "Read an interesting book about productivity",
      },
    }),
  ]);

  console.log("📊 Created habit logs:", logs.length);
  console.log("🎉 Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
