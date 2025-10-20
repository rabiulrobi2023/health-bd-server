-- CreateTable
CREATE TABLE "doctor-specialties" (
    "speacialitiesId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,

    CONSTRAINT "doctor-specialties_pkey" PRIMARY KEY ("speacialitiesId","doctorId")
);

-- CreateTable
CREATE TABLE "Specialties" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "icon" TEXT NOT NULL,

    CONSTRAINT "Specialties_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "doctor-specialties" ADD CONSTRAINT "doctor-specialties_speacialitiesId_fkey" FOREIGN KEY ("speacialitiesId") REFERENCES "Specialties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctor-specialties" ADD CONSTRAINT "doctor-specialties_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
