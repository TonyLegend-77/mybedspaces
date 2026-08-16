import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET(req: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Admin only." }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "PENDING";

  const transactions = await prisma.creditTransaction.findMany({
    where: { status: status as any },
    orderBy: { createdAt: "asc" },
    include: { user: { select: { name: true, email: true } } },
  });

  return NextResponse.json(transactions);
}

// Approve credits the user's balance. Reject just marks it, no balance change.
export async function PATCH(req: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Admin only." }, { status: 403 });
  }

  const { id, decision } = await req.json();
  if (!["APPROVED", "REJECTED"].includes(decision)) {
    return NextResponse.json({ error: "Invalid decision." }, { status: 400 });
  }

  const tx = await prisma.creditTransaction.findUnique({ where: { id } });
  if (!tx) {
    return NextResponse.json({ error: "Transaction not found." }, { status: 404 });
  }
  if (tx.status !== "PENDING") {
    return NextResponse.json(
      { error: "This transaction was already reviewed." },
      { status: 409 }
    );
  }

  await prisma.$transaction(async (db) => {
    await db.creditTransaction.update({
      where: { id },
      data: { status: decision, reviewedBy: session.user.id, reviewedAt: new Date() },
    });

    if (decision === "APPROVED") {
      await db.user.update({
        where: { id: tx.userId },
        data: { creditBalance: { increment: tx.creditsBought } },
      });
    }
  });

  return NextResponse.json({ success: true });
}
