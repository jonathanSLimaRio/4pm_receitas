/*
  Warnings:

  - You are about to drop the column `alterado_em` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the column `criado_em` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the column `id_categorias` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the column `id_usuarios` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the column `modo_preparo` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the column `tempo_preparo_minutos` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the `usuarios` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `name` on table `Category` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `preparationMethod` to the `Recipe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Recipe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Recipe` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Recipe` DROP FOREIGN KEY `Recipe_id_categorias_fkey`;

-- DropForeignKey
ALTER TABLE `Recipe` DROP FOREIGN KEY `Recipe_id_usuarios_fkey`;

-- DropIndex
DROP INDEX `Recipe_id_categorias_idx` ON `Recipe`;

-- DropIndex
DROP INDEX `Recipe_id_usuarios_idx` ON `Recipe`;

-- AlterTable
ALTER TABLE `Category` MODIFY `name` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Recipe` DROP COLUMN `alterado_em`,
    DROP COLUMN `criado_em`,
    DROP COLUMN `id_categorias`,
    DROP COLUMN `id_usuarios`,
    DROP COLUMN `modo_preparo`,
    DROP COLUMN `tempo_preparo_minutos`,
    ADD COLUMN `categoryId` INTEGER NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `preparationMethod` VARCHAR(191) NOT NULL,
    ADD COLUMN `preparationTime` INTEGER NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `userId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `usuarios`;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `login` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_login_key`(`login`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Recipe_userId_idx` ON `Recipe`(`userId`);

-- CreateIndex
CREATE INDEX `Recipe_categoryId_idx` ON `Recipe`(`categoryId`);

-- AddForeignKey
ALTER TABLE `Recipe` ADD CONSTRAINT `Recipe_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Recipe` ADD CONSTRAINT `Recipe_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
