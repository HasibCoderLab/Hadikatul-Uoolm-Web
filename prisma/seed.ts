import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL is not set. Copy .env.example to .env before seeding.");
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main(): Promise<void> {
  const madrasah = await prisma.institution.upsert({
    where: { slug: "demo-madrasah" },
    update: {},
    create: {
      name: "Demo Madrasah (fake data)",
      slug: "demo-madrasah",
      type: "MADRASAH",
    },
  });

  const school = await prisma.institution.upsert({
    where: { slug: "demo-school" },
    update: {},
    create: {
      name: "Demo School (fake data)",
      slug: "demo-school",
      type: "SCHOOL",
    },
  });

  const madrasahMain = await prisma.campus.upsert({
    where: { institutionId_code: { institutionId: madrasah.id, code: "MAIN" } },
    update: {},
    create: {
      institutionId: madrasah.id,
      name: "Demo Madrasah Main Campus",
      code: "MAIN",
      address: "Fake address, Chapainawabganj",
      isPrimary: true,
    },
  });

  const madrasahAnnex = await prisma.campus.upsert({
    where: { institutionId_code: { institutionId: madrasah.id, code: "ANNEX" } },
    update: {},
    create: {
      institutionId: madrasah.id,
      name: "Demo Madrasah Annex Campus",
      code: "ANNEX",
      address: "Fake annex address, Chapainawabganj",
    },
  });

  const schoolMain = await prisma.campus.upsert({
    where: { institutionId_code: { institutionId: school.id, code: "MAIN" } },
    update: {},
    create: {
      institutionId: school.id,
      name: "Demo School Main Campus",
      code: "MAIN",
      isPrimary: true,
    },
  });

  const owner = await prisma.user.upsert({
    where: { email: "owner@example.test" },
    update: {},
    create: { email: "owner@example.test", name: "Demo Owner", locale: "bn" },
  });

  const principal = await prisma.user.upsert({
    where: { email: "principal@example.test" },
    update: {},
    create: { email: "principal@example.test", name: "Demo Principal", locale: "bn" },
  });

  const teacher = await prisma.user.upsert({
    where: { email: "teacher@example.test" },
    update: {},
    create: { email: "teacher@example.test", name: "Demo Teacher", locale: "bn" },
  });

  const guardian = await prisma.user.upsert({
    where: { email: "guardian@example.test" },
    update: {},
    create: { email: "guardian@example.test", name: "Demo Guardian", locale: "bn" },
  });

  await prisma.membership.upsert({
    where: { userId_institutionId: { userId: owner.id, institutionId: madrasah.id } },
    update: { role: "INSTITUTION_OWNER", status: "ACTIVE", campusId: null },
    create: {
      userId: owner.id,
      institutionId: madrasah.id,
      role: "INSTITUTION_OWNER",
      status: "ACTIVE",
    },
  });

  await prisma.membership.upsert({
    where: { userId_institutionId: { userId: principal.id, institutionId: madrasah.id } },
    update: { role: "PRINCIPAL", status: "ACTIVE", campusId: madrasahMain.id },
    create: {
      userId: principal.id,
      institutionId: madrasah.id,
      campusId: madrasahMain.id,
      role: "PRINCIPAL",
      status: "ACTIVE",
    },
  });

  await prisma.membership.upsert({
    where: { userId_institutionId: { userId: teacher.id, institutionId: madrasah.id } },
    update: { role: "TEACHER", status: "ACTIVE", campusId: madrasahAnnex.id },
    create: {
      userId: teacher.id,
      institutionId: madrasah.id,
      campusId: madrasahAnnex.id,
      role: "TEACHER",
      status: "ACTIVE",
    },
  });

  await prisma.membership.upsert({
    where: { userId_institutionId: { userId: guardian.id, institutionId: madrasah.id } },
    update: { role: "GUARDIAN", status: "ACTIVE", campusId: null },
    create: {
      userId: guardian.id,
      institutionId: madrasah.id,
      role: "GUARDIAN",
      status: "ACTIVE",
    },
  });

  await prisma.membership.upsert({
    where: { userId_institutionId: { userId: owner.id, institutionId: school.id } },
    update: { role: "ADMIN", status: "ACTIVE", campusId: schoolMain.id },
    create: {
      userId: owner.id,
      institutionId: school.id,
      campusId: schoolMain.id,
      role: "ADMIN",
      status: "ACTIVE",
    },
  });

  console.log("Seeded fake institutions, campuses, users and memberships.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
