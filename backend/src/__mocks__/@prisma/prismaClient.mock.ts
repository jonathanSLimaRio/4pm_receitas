import { mockDeep } from "jest-mock-extended";
import { PrismaClient } from "@prisma/client";

export const prisma = mockDeep<PrismaClient>();
export type { PrismaClient };
