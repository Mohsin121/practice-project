// Prisma generates types automatically from schema.prisma
// You can import the generated User type like this:
// import { User } from '@prisma/client';

export class User {
  id: number;
  email: string;
  hash: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}