import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { propertySchema } from "@/lib/validators";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const property = await prisma.property.findUnique({
    where: { id: params.id },
    include: {
      landlord: {
        select: { id: true, name: true, verification: { select: { status: true } } },
      },
    },
  });

  if (!property) {
    return NextResponse.json({ error: "Property not found." }, { status: 404 });
  }

  return NextResponse.json(property);
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const property = await prisma.property.findUnique({
    where: { id: params.id },
  });
  if (!property) {
    return NextResponse.json({ error: "Property not found." }, { status: 404 });
  }
  if (property.landlordId !== session.user.id && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const body = await req.json();
  const parsed = propertySchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 400 }
    );
  }

  // Edits to an approved listing revert it to pending review, so a
  // landlord cannot swap in different photos or an address after approval.
  const updated = await prisma.property.update({
    where: { id: params.id },
    data: {
      ...parsed.data,
      status: session.user.role === "ADMIN" ? property.status : "PENDING",
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const property = await prisma.property.findUnique({
    where: { id: params.id },
  });
  if (!property) {
    return NextResponse.json({ error: "Property not found." }, { status: 404 });
  }
  if (property.landlordId !== session.user.id && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  await prisma.property.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
