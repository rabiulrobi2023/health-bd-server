-- CreateTable
CREATE TABLE "schedules" (
    "id" TEXT NOT NULL,
    "startDateTime" TIMESTAMP(3) NOT NULL,
    "endDateTime" TIMESTAMP(3) NOT NULL,
    "ceatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "upadatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctor-schedules" (
    "doctorId" TEXT NOT NULL,
    "scchdhleId" TEXT NOT NULL,
    "isBooked" BOOLEAN NOT NULL DEFAULT false,
    "ceatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "upadatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "doctor-schedules_pkey" PRIMARY KEY ("doctorId","scchdhleId")
);

-- AddForeignKey
ALTER TABLE "doctor-schedules" ADD CONSTRAINT "doctor-schedules_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor-schedules" ADD CONSTRAINT "doctor-schedules_scchdhleId_fkey" FOREIGN KEY ("scchdhleId") REFERENCES "schedules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
