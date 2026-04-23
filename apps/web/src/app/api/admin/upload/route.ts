import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const allowedTypes = new Map<string, string>([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
]);

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      {
        ok: false,
        message: "Unauthorized",
      },
      { status: 401 },
    );
  }

  try {
    const formData = await request.formData();
    const files = formData
      .getAll("files")
      .filter((file): file is File => file instanceof File && file.size > 0);

    if (!files.length) {
      return NextResponse.json(
        {
          ok: false,
          message: "No files received",
        },
        { status: 400 },
      );
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads", "products");
    await mkdir(uploadDir, { recursive: true });

    const uploadedFiles: string[] = [];

    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          {
            ok: false,
            message: `${file.name} is larger than 5MB`,
          },
          { status: 400 },
        );
      }

      const extension = allowedTypes.get(file.type);

      if (!extension) {
        return NextResponse.json(
          {
            ok: false,
            message: `${file.name} must be JPG, PNG, or WEBP`,
          },
          { status: 400 },
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = `${Date.now()}-${randomUUID()}${extension}`;
      const filepath = path.join(uploadDir, filename);

      await writeFile(filepath, buffer);
      uploadedFiles.push(`/uploads/products/${filename}`);
    }

    return NextResponse.json({
      ok: true,
      files: uploadedFiles,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Upload failed",
      },
      { status: 500 },
    );
  }
}
