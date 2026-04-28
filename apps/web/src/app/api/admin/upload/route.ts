import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { uploadProductImageToCloudinary } from "@/lib/storage/cloudinary";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const allowedTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export async function POST(request: Request) {
  const session = await auth();

  if ((session?.user as { role?: string } | undefined)?.role !== "admin") {
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

      if (!allowedTypes.has(file.type)) {
        return NextResponse.json(
          {
            ok: false,
            message: `${file.name} must be JPG, PNG, or WEBP`,
          },
          { status: 400 },
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());

      const url = await uploadProductImageToCloudinary({
        buffer,
        contentType: file.type,
      });

      uploadedFiles.push(url);
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
