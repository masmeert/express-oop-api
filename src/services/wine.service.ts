import { PrismaClient, Wine } from "@prisma/client";
import { z } from "zod";

import { winePostModel, winePutModel } from "../types/wine";

type WineReturnData = {
  message: string;
  success: boolean;
  data?: Wine | Array<Wine>;
};

export default class WineService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  public async findAll(): Promise<WineReturnData> {
    try {
      const dbWines = await this.prisma.wine.findMany();
      return { success: true, data: dbWines, message: "Wines retrieved." };
    } catch (error) {
      return {
        success: false,
        message: "Error getting wines.",
      };
    }
  }

  public async findOne(id: string): Promise<WineReturnData> {
    try {
      const wine = await this.prisma.wine.findUnique({ where: { id } });
      if (!wine) {
        return {
          success: false,
          message: "Wine doesn't exist.",
        };
      }
      return { success: true, data: wine, message: "Wine retrieved." };
    } catch (error) {
      return {
        success: false,
        message: "Error getting wine.",
      };
    }
  }
  public async create(
    wine: z.infer<typeof winePostModel>
  ): Promise<WineReturnData> {
    try {
      const dbWine = await this.prisma.wine.create({ data: wine });
      return { success: true, data: dbWine, message: "Wine created." };
    } catch (error) {
      return {
        success: false,
        message: "Error creating wine.",
      };
    }
  }

  public async update(
    id: string,
    wine: z.infer<typeof winePutModel>
  ): Promise<WineReturnData> {
    try {
      const oldWine = await this.prisma.wine.findUnique({
        where: { id },
        select: { id: false },
      });
      if (!oldWine) {
        return {
          success: false,
          message: "Wine doesn't exist.",
        };
      }
      const dbWine = await this.prisma.wine.update({
        where: { id },
        data: Object.assign(oldWine, wine),
      });
      return { success: true, data: dbWine, message: "Wine updated." };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: "Error updating wine.",
      };
    }
  }

  public async delete(id: string): Promise<WineReturnData> {
    try {
      const dbWine = await this.prisma.wine.delete({ where: { id } });
      if (!dbWine) {
        return {
          success: false,
          message: "Wine doesn't exist.",
        };
      }
      return { success: true, data: dbWine, message: "Wine deleted." };
    } catch (error) {
      return {
        success: false,
        message: "Error deleting wine.",
      };
    }
  }
}
