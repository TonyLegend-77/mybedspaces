import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

export async function PATCH(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Admin only." }, { status: 403 });
  }

  const updated = await prisma.property.update({
    where: { id: params.id },
    data: { status: "APPROVED" },
  });

  return NextResponse.json(updated);
}
