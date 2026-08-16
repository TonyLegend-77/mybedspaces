import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const UNLOCK_COST = 50;
const UNLOCK_HOURS = 48;

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  // Already unlocked and still valid? Don't charge again.
  const existing = await prisma.propertyUnlock.findUnique({
    where: { userId_propertyId: { userId: session.user.id, propertyId: params.id } },
  });
  if (existing && existing.expiresAt > new Date()) {
    return NextResponse.json(existing);
  }

  const result = await prisma.$transaction(async (db) => {
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { creditBalance: true },
    });

    if (!user || user.creditBalance < UNLOCK_COST) {
      throw new Error("INSUFFICIENT_CREDITS");
    }

    await db.user.update({
      where: { id: session.user.id },
      data: { creditBalance: { decrement: UNLOCK_COST } },
    });

    const expiresAt = new Date(Date.now() + UNLOCK_HOURS * 60 * 60 * 1000);

    return db.propertyUnlock.upsert({
      where: { userId_propertyId: { userId: session.user.id, propertyId: params.id } },
      update: { unlockedAt: new Date(), expiresAt, creditsSpent: UNLOCK_COST },
      create: {
        userId: session.user.id,
        propertyId: params.id,
        expiresAt,
        creditsSpent: UNLOCK_COST,
      },
    });
  }).catch((err) => {
    if (err.message === "INSUFFICIENT_CREDITS") return null;
    throw err;
  });

  if (!result) {
    return NextResponse.json(
      { error: `Not enough credits. Unlocking costs ${UNLOCK_COST} credits.` },
      { status: 402 }
    );
  }

  return NextResponse.json(result, { status: 201 });
}

// Check unlock status for the current user on this property.
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ unlocked: false });
  }

  const unlock = await prisma.propertyUnlock.findUnique({
    where: { userId_propertyId: { userId: session.user.id, propertyId: params.id } },
  });

  const unlocked = !!unlock && unlock.expiresAt > new Date();
  return NextResponse.json({ unlocked, expiresAt: unlock?.expiresAt || null });
}
