-- CreateTable
CREATE TABLE "Vote2025" (
    "id" TEXT NOT NULL,
    "valid" BOOLEAN NOT NULL,
    "nominee2024Id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vote2025_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Nominee2025" (
    "id" TEXT NOT NULL,
    "userNomineeId" TEXT NOT NULL,
    "userNominatedId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Nominee2025_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Nominee2025_userNomineeId_key" ON "Nominee2025"("userNomineeId");

-- AddForeignKey
ALTER TABLE "Vote2025" ADD CONSTRAINT "Vote2025_nominee2024Id_fkey" FOREIGN KEY ("nominee2024Id") REFERENCES "Nominee2025"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote2025" ADD CONSTRAINT "Vote2025_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nominee2025" ADD CONSTRAINT "Nominee2025_userNomineeId_fkey" FOREIGN KEY ("userNomineeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nominee2025" ADD CONSTRAINT "Nominee2025_userNominatedId_fkey" FOREIGN KEY ("userNominatedId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
