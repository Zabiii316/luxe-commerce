import { NextResponse } from "next/server";
import { prisma } from "@luxe/database";
import { adminTaxonomySchema } from "@/lib/validators/admin-taxonomy";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = adminTaxonomySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, message: "Invalid brand data", errors: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const data = parsed.data;

    const existing = await prisma.brand.findFirst({
      where: {
        OR: [{ name: data.name }, { slug: data.slug }],
      },
    });

    if (existing) {
      return NextResponse.json(
        { ok: false, message: "A brand with this name or slug already exists." },
        { status: 409 },
      );
    }

    const brand = await prisma.brand.create({
      data: {
        name: data.name,
        slug: data.slug,
      },
    });

    return NextResponse.json({ ok: true, brand });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Brand creation failed" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const parsed = adminTaxonomySchema.safeParse(body);

    if (!parsed.success || !parsed.data.id) {
      return NextResponse.json(
        { ok: false, message: "Invalid brand update data", errors: parsed.success ? undefined : parsed.error.flatten() },
        { status: 400 },
      );
    }

    const data = parsed.data;

    const slugConflict = await prisma.brand.findFirst({
      where: {
        slug: data.slug,
        NOT: { id: data.id },
      },
    });

    if (slugConflict) {
      return NextResponse.json(
        { ok: false, message: "Another brand already uses this slug." },
        { status: 409 },
      );
    }

    const brand = await prisma.brand.update({
      where: { id: data.id },
      data: {
        name: data.name,
        slug: data.slug,
      },
    });

    return NextResponse.json({ ok: true, brand });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Brand update failed" },
      { status: 500 },
    );
  }
}
