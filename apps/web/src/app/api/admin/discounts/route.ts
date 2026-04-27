import { NextResponse } from "next/server";
import { prisma } from "@luxe/database";
import { auth } from "@/auth";
import { adminDiscountSchema } from "@/lib/validators/admin-discount";

function normalizeDate(value?: string | null) {
  if (!value) return null;
  return new Date(value);
}

export async function POST(request: Request) {
  const session = await auth();

  if ((session?.user as { role?: string } | undefined)?.role !== "admin") {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = adminDiscountSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          message: "Invalid discount data",
          errors: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const data = parsed.data;

    const existing = await prisma.discountCode.findUnique({
      where: { code: data.code },
      select: { id: true },
    });

    if (existing) {
      return NextResponse.json(
        { ok: false, message: "A discount with this code already exists." },
        { status: 409 },
      );
    }

    const discount = await prisma.discountCode.create({
      data: {
        code: data.code,
        type: data.type,
        value: data.value,
        minOrderAmount: data.minOrderAmount ?? null,
        usageLimit: data.usageLimit ?? null,
        startsAt: normalizeDate(data.startsAt),
        endsAt: normalizeDate(data.endsAt),
        isActive: data.isActive,
      },
    });

    return NextResponse.json({ ok: true, discount });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Discount creation failed" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  const session = await auth();

  if ((session?.user as { role?: string } | undefined)?.role !== "admin") {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = adminDiscountSchema.safeParse(body);

    if (!parsed.success || !parsed.data.id) {
      return NextResponse.json(
        {
          ok: false,
          message: "Invalid discount update data",
          errors: parsed.success ? undefined : parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const data = parsed.data;

    const conflict = await prisma.discountCode.findFirst({
      where: {
        code: data.code,
        NOT: { id: data.id },
      },
      select: { id: true },
    });

    if (conflict) {
      return NextResponse.json(
        { ok: false, message: "Another discount already uses this code." },
        { status: 409 },
      );
    }

    const discount = await prisma.discountCode.update({
      where: { id: data.id },
      data: {
        code: data.code,
        type: data.type,
        value: data.value,
        minOrderAmount: data.minOrderAmount ?? null,
        usageLimit: data.usageLimit ?? null,
        startsAt: normalizeDate(data.startsAt),
        endsAt: normalizeDate(data.endsAt),
        isActive: data.isActive,
      },
    });

    return NextResponse.json({ ok: true, discount });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Discount update failed" },
      { status: 500 },
    );
  }
}
