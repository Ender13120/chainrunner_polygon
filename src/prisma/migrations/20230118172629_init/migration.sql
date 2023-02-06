-- AlterTable
ALTER TABLE "Attack" ADD COLUMN     "AttackSeed" INTEGER[],
ADD COLUMN     "AttackerShipIds" INTEGER[],
ADD COLUMN     "Distance" INTEGER,
ADD COLUMN     "FromPlanet" TEXT,
ADD COLUMN     "TimeToBeResolved" INTEGER,
ADD COLUMN     "ToPlanet" TEXT;
