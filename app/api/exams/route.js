import { NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/db";

export async function POST(request) {
  const body = await request.json();
  const db = await readDb();
  const exam = { id: `e${Date.now()}`, ...body, createdAt: new Date().toISOString().slice(0, 10) };
  db.exams.unshift(exam);
  await writeDb(db);
  return NextResponse.json(exam, { status: 201 });
}

export async function DELETE(request) {
  const id = new URL(request.url).searchParams.get("id");
  const db = await readDb();
  db.exams = db.exams.filter((exam) => exam.id !== id);
  db.submissions = db.submissions.filter((submission) => submission.activityId !== id);
  await writeDb(db);
  return NextResponse.json({ ok: true });
}
