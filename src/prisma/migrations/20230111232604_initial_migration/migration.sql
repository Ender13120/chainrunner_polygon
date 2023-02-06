-- CreateTable
CREATE TABLE "Attack" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "attackInstanceId" INTEGER NOT NULL,
    "AttackerAddress" TEXT NOT NULL,

    CONSTRAINT "Attack_pkey" PRIMARY KEY ("id")
);
