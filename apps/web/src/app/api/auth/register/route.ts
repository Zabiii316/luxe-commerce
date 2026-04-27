import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@luxe/database";
import { customerRegisterSchema } from "@/lib/validators/customer-auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = customerRegisterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          message: "Invalid registration data",
          errors: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const email = parsed.data.email.toLowerCase().trim();
    const passwordHash = await hash(parsed.data.password, 10);

    const existingCustomer = await prisma.customer.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        passwordHash: true,
      },
    });

    if (existingCustomer?.passwordHash) {
      return NextResponse.json(
        {
          ok: false,
          message: "An account with this email already exists.",
        },
        { status: 409 },
      );
    }

    const customer = existingCustomer
      ? await prisma.customer.update({
          where: {
            email,
          },
          data: {
            firstName: parsed.data.firstName,
            lastName: parsed.data.lastName,
            passwordHash,
          },
          select: {
            id: true,
            email: true,
          },
        })
      : await prisma.customer.create({
          data: {
            firstName: parsed.data.firstName,
            lastName: parsed.data.lastName,
            email,
            passwordHash,
          },
          select: {
            id: true,
            email: true,
          },
        });

    return NextResponse.json({
      ok: true,
      customer,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Registration failed",
      },
      { status: 500 },
    );
  }
}
