import { NextResponse } from "next/server";
import { readDb, publicUser } from "@/lib/db";

export async function GET() {
  const db = await readDb();
  return NextResponse.json({ ...db, users: db.users.map(publicUser) });
}
