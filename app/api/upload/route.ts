import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { requireAdmin } from "@/modules/auth/auth.guard";

export const runtime = "nodejs";

const ALLOWED_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
]);

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(request: Request) {
  // Hanya admin yang boleh mengunggah
  const auth = await requireAdmin(request);
  if (!auth.ok) {
    return Response.json({ error: auth.error }, { status: auth.status });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  // Validasi tipe dan ukuran file
  if (!(file instanceof File)) {
    return Response.json(
      { error: "File gambar wajib diunggah" },
      { status: 400 },
    );
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return Response.json(
      { error: "Format harus PNG, JPG, atau WebP" },
      { status: 400 },
    );
  }
  if (file.size > MAX_SIZE) {
    return Response.json({ error: "Ukuran maksimal 5 MB" }, { status: 400 });
  }

  // Nama unik supaya tidak menimpa gambar lama
  const extension =
    file.type === "image/png"
      ? "png"
      : file.type === "image/webp"
        ? "webp"
        : "jpg";
  const filename = `${randomUUID()}.${extension}`;

  // File disimpan di public/uploads, jadi URL-nya harus /uploads/...
  const uploadDir = join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  await writeFile(
    join(uploadDir, filename),
    Buffer.from(await file.arrayBuffer()),
  );

  return Response.json({ url: `/uploads/${filename}` });
}
