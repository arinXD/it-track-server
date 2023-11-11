/*
  Warnings:

  - You are about to drop the column `name` on the `student` table. All the data in the column will be lost.
  - Added the required column `fname` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lname` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Student_stu_id_key` ON `student`;

-- AlterTable
ALTER TABLE `student` DROP COLUMN `name`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `fname` VARCHAR(191) NOT NULL,
    ADD COLUMN `image` VARCHAR(191) NULL,
    ADD COLUMN `lname` VARCHAR(191) NOT NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL,
    MODIFY `stu_id` VARCHAR(191) NULL;
