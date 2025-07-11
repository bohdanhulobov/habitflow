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

  const logs = [];
  for (const habit of habits) {
    for (let i = 0; i < 30; i++) {
      // Randomly skip some days for realism
      if (Math.random() < 0.15) continue;
      const logDate = new Date();
      logDate.setDate(logDate.getDate() - i);
      // Randomize value, allow zeroes and spikes
      let value;
      switch (habit.id) {
        case "habit-1": // Morning Exercise
          value = Math.random() < 0.1 ? 0 : 1;
          break;
        case "habit-2": // Reading
          value = Math.random() < 0.2 ? 0 : Math.floor(15 + Math.random() * 20); // 15-35 min
          break;
        case "habit-3": // Meditation
          value = Math.random() < 0.15 ? 0 : Math.floor(5 + Math.random() * 10); // 5-15 min
          break;
        default:
          value = 1;
      }
      // Add notes for some logs
      let notes = "";
      if (value === 0) {
        notes = "Missed today";
      } else if (Math.random() < 0.2) {
        notes = [
          "Felt great!",
          "Struggled a bit",
          "Routine day",
          "Improved focus",
          "Quick session",
          "Very productive",
        ][Math.floor(Math.random() * 6)];
      }
      logs.push(
        prisma.habitLog.upsert({
          where: {
            habitId_date: {
              habitId: habit.id,
              date: logDate,
            },
          },
          update: {},
          create: {
            habitId: habit.id,
            userId: testUser.id,
            date: logDate,
            value,
            notes,
          },
        }),
      );
    }
  }
  const logResults = await Promise.all(logs);
  console.log("📊 Created habit logs:", logResults.length);
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
