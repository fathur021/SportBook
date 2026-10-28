import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return Response.json({
      status: "ok",
      Database: "connected",
    });
  } catch (error) {
    console.error("Health check database failed:", error);
    return Response.json(
      {
        status: "error",
        database: "disconnected",
      },
      { status: 503 },
    );
  }
}
