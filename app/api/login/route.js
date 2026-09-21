import { NextResponse } from "next/server";
import { readDb, publicUser } from "@/lib/db";

export async function POST(request) {
  const { username, password } = await request.json();
  const db = await readDb();
  const user = db.users.find((item) => item.username === username && item.password === password);
  if (!user) return NextResponse.json({ message: "Username atau password salah." }, { status: 401 });
  return NextResponse.json({ user: publicUser(user) });
}
