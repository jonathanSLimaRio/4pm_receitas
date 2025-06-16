-- CreateTable
CREATE TABLE `usuarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NULL,
    `login` VARCHAR(191) NOT NULL,
    `senha` VARCHAR(191) NOT NULL,
    `criado_em` DATETIME(3) NOT NULL,
    `alterado_em` DATETIME(3) NOT NULL,

    UNIQUE INDEX `usuarios_login_key`(`login`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,

    UNIQUE INDEX `Category_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Recipe` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_usuarios` INTEGER NOT NULL,
    `id_categorias` INTEGER NULL,
    `name` VARCHAR(191) NULL,
    `tempo_preparo_minutos` INTEGER NULL,
    `servings` INTEGER NULL,
    `modo_preparo` VARCHAR(191) NOT NULL,
    `ingredients` VARCHAR(191) NULL,
    `criado_em` DATETIME(3) NOT NULL,
    `alterado_em` DATETIME(3) NOT NULL,

    INDEX `Recipe_id_usuarios_idx`(`id_usuarios`),
    INDEX `Recipe_id_categorias_idx`(`id_categorias`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Recipe` ADD CONSTRAINT `Recipe_id_usuarios_fkey` FOREIGN KEY (`id_usuarios`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Recipe` ADD CONSTRAINT `Recipe_id_categorias_fkey` FOREIGN KEY (`id_categorias`) REFERENCES `Category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
