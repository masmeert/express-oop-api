import { PrismaClient, User } from "@prisma/client";
import { z } from "zod";
import { userPostModel, userPutModel } from "../types/user";

type UserReturnData = {
  message: string;
  success: boolean;
  data?: User;
};

type UsersReturnData = {
  message: string;
  success: boolean;
  data?: Array<User>;
};

export default class UserService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  public async findAll(): Promise<UsersReturnData> {
    try {
      const dbUsers = await this.prisma.user.findMany();
      return { success: true, data: dbUsers, message: "Users retrieved." };
    } catch (error) {
      return {
        success: false,
        message: "Error getting users.",
      };
    }
  }

  public async findOne(id: string): Promise<UserReturnData> {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) {
        return {
          success: false,
          message: "User not found.",
        };
      }
      return { success: true, data: user, message: "User retrieved." };
    } catch (error) {
      return {
        success: false,
        message: "Error getting user.",
      };
    }
  }

  public async findOneByEmail(email: string): Promise<UserReturnData> {
    try {
      const user = await this.prisma.user.findUnique({ where: { email } });
      if (!user) {
        return {
          success: false,
          message: "User not found.",
        };
      }
      return { success: true, data: user, message: "User retrieved." };
    } catch (error) {
      return {
        success: false,
        message: "Error getting user.",
      };
    }
  }

  public async create(
    user: z.infer<typeof userPostModel>
  ): Promise<UserReturnData> {
    try {
      const oldUser = await this.prisma.user.findUnique({
        where: { email: user.email },
      });
      if (oldUser) {
        return {
          success: false,
          message: "User already exists.",
        };
      }
      const dbUser = await this.prisma.user.create({
        data: {
          ...user,
        },
      });
      if (!dbUser) {
        return {
          success: false,
          message: "User not created.",
        };
      }
      return { success: true, data: dbUser, message: "User created." };
    } catch (error) {
      return {
        success: false,
        message: "Error creating user.",
      };
    }
  }

  public async update(
    id: string,
    user: z.infer<typeof userPutModel>
  ): Promise<UserReturnData> {
    try {
      const dbUser = await this.prisma.user.update({
        where: { id },
        data: {
          ...user,
        },
      });
      if (!dbUser) {
        return {
          success: false,
          message: "User doesn't exist.",
        };
      }
      return { success: true, data: dbUser, message: "User updated." };
    } catch (error) {
      return {
        success: false,
        message: "Error updating user.",
      };
    }
  }

  public async delete(id: string): Promise<UserReturnData> {
    try {
      const dbUser = await this.prisma.user.delete({ where: { id } });
      if (!dbUser) {
        return {
          success: false,
          message: "User doesn't exist.",
        };
      }
      return { success: true, data: dbUser, message: "User deleted." };
    } catch (error) {
      return {
        success: false,
        message: "Error deleting user.",
      };
    }
  }
}
