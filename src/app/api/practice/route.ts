// app/api/practice/route.ts
import { NextResponse } from "next/server";

// TODO 简单内存存储（生产要换数据库，比如 Prisma + Postgres/SQLite）
const practiceLogs: { id: number; duration: number; createdAt: Date }[] = [];
let idCounter = 1;

export async function POST(req: Request) {
  const { duration } = await req.json();
  if (!duration) {
    return NextResponse.json({ error: "Duration is required" }, { status: 400 });
  }

  const log = { id: idCounter++, duration, createdAt: new Date() };
  practiceLogs.push(log);

  return NextResponse.json({ success: true, log });
}

export async function GET() {
  const totalSessions = practiceLogs.length;
  const totalTime = practiceLogs.reduce((sum, l) => sum + l.duration, 0);
  return NextResponse.json({
    totalSessions,
    totalTime, // 单位: 秒
    logs: practiceLogs,
  });
}
