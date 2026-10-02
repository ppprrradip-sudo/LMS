import { NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/db";

function normalizeKkm(value) {
  const numeric = Number(value ?? 75);
  if (!Number.isFinite(numeric)) return 75;
  return Math.min(100, Math.max(0, numeric));
}

export async function POST(request) {
  const body = await request.json();
  const db = await readDb();
  const exam = {
    id: `e${Date.now()}`,
    ...body,
    kkm: normalizeKkm(body?.kkm),
    createdAt: new Date().toISOString().slice(0, 10)
  };
  db.exams.unshift(exam);
  await writeDb(db);
  return NextResponse.json(exam, { status: 201 });
}

export async function PUT(request) {
  const id = new URL(request.url).searchParams.get("id");
  const body = await request.json();
  const db = await readDb();

  if (!id) {
    return NextResponse.json({ message: "ID ujian wajib diisi." }, { status: 400 });
  }

  const examIndex = db.exams.findIndex((exam) => exam.id === id);
  if (examIndex === -1) {
    return NextResponse.json({ message: "Ujian tidak ditemukan." }, { status: 404 });
  }

  const updatedExam = {
    ...db.exams[examIndex],
    ...body,
    kkm: normalizeKkm(body?.kkm ?? db.exams[examIndex].kkm ?? 75)
  };

  db.exams[examIndex] = updatedExam;
  await writeDb(db);
  return NextResponse.json(updatedExam, { status: 200 });
}

export async function DELETE(request) {
  const id = new URL(request.url).searchParams.get("id");
  const db = await readDb();
  db.exams = db.exams.filter((exam) => exam.id !== id);
  db.submissions = db.submissions.filter((submission) => submission.activityId !== id);
  await writeDb(db);
  return NextResponse.json({ ok: true });
}
