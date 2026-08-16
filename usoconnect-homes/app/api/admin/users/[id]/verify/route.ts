import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Admin only." }, { status: 403 });
  }

  const { decision } = await req.json(); // "APPROVED" | "REJECTED"
  if (!["APPROVED", "REJECTED"].includes(decision)) {
    return NextResponse.json({ error: "Invalid decision." }, { status: 400 });
  }

  const verification = await prisma.verification.update({
    where: { userId: params.id },
    data: {
      status: decision,
      reviewedBy: session.user.id,
      reviewedAt: new Date(),
    },
  });

  return NextResponse.json(verification);
}
