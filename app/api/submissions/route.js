import { NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/db";

export async function POST(request) {
  const body = await request.json();
  if (body.type === "task" && !body.answerPhoto) {
    return NextResponse.json({ message: "Foto halaman jawaban wajib dilampirkan." }, { status: 400 });
  }
  const db = await readDb();
  const submission = { id: `s${Date.now()}`, ...body, submittedAt: new Date().toISOString() };
  db.submissions = db.submissions.filter((item) => !(item.userId === body.userId && item.activityId === body.activityId));
  db.submissions.push(submission);
  await writeDb(db);
  return NextResponse.json(submission, { status: 201 });
}
