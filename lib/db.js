import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const filePath = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "data", "db.json");

export async function readDb() {
  const content = await fs.readFile(filePath, "utf8");
  const data = JSON.parse(content);
  return {
    users: Array.isArray(data.users) ? data.users : [],
    tasks: Array.isArray(data.tasks) ? data.tasks : [],
    exams: Array.isArray(data.exams) ? data.exams : [],
    submissions: Array.isArray(data.submissions) ? data.submissions : []
  };
}

export async function writeDb(data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
  return data;
}

export function publicUser(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}
