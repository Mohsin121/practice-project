/*
  Warnings:

  - You are about to drop the column `roleId` on the `group_members` table. All the data in the column will be lost.
  - You are about to drop the `group_permissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `permissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `roles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."group_members" DROP CONSTRAINT "group_members_roleId_fkey";

-- DropForeignKey
ALTER TABLE "public"."group_permissions" DROP CONSTRAINT "group_permissions_permissionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."group_permissions" DROP CONSTRAINT "group_permissions_roleId_fkey";

-- AlterTable
ALTER TABLE "group_members" DROP COLUMN "roleId";

-- DropTable
DROP TABLE "public"."group_permissions";

-- DropTable
DROP TABLE "public"."permissions";

-- DropTable
DROP TABLE "public"."roles";
