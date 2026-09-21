import { NextResponse } from "next/server";
import { readDb, writeDb, publicUser } from "@/lib/db";

export async function POST(request) {
  const body = await request.json();
  const db = await readDb();
  const user = { id: `u${Date.now()}`, password: body.password || "123456", ...body };
  db.users.push(user);
  await writeDb(db);
  return NextResponse.json(publicUser(user), { status: 201 });
}

export async function DELETE(request) {
  const id = new URL(request.url).searchParams.get("id");
  const db = await readDb();
  db.users = db.users.filter((user) => user.id !== id);
  await writeDb(db);
  return NextResponse.json({ ok: true });
}
