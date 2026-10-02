import { NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/db";

function normalizeScore(value) {
  const numeric = Number(value ?? 0);
  if (!Number.isFinite(numeric)) return 0;
  return Math.min(100, Math.max(0, numeric));
}

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

export async function PUT(request) {
  const id = new URL(request.url).searchParams.get("id");
  const body = await request.json();
  const db = await readDb();

  if (!id) {
    return NextResponse.json({ message: "ID pengumpulan wajib diisi." }, { status: 400 });
  }

  const submissionIndex = db.submissions.findIndex((submission) => submission.id === id);
  if (submissionIndex === -1) {
    return NextResponse.json({ message: "Pengumpulan tidak ditemukan." }, { status: 404 });
  }

  const current = db.submissions[submissionIndex];
  const updatedSubmission = {
    ...current,
    ...body,
    score: body?.score != null ? normalizeScore(body.score) : current.score,
  };

  db.submissions[submissionIndex] = updatedSubmission;
  await writeDb(db);
  return NextResponse.json(updatedSubmission, { status: 200 });
}
