import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const NAIRA_PER_100_CREDITS = 1000;

// Submit a claim: "I sent this amount, here's my bank reference."
// This does NOT credit the account. It just queues it for admin review,
// since there's no payment gateway verifying the transfer actually happened.
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { amountNaira, bankReference } = await req.json();

  if (!amountNaira || amountNaira < 100) {
    return NextResponse.json({ error: "Enter a valid amount." }, { status: 400 });
  }
  if (!bankReference || bankReference.trim().length < 4) {
    return NextResponse.json(
      { error: "Enter the bank transfer reference or narration you used." },
      { status: 400 }
    );
  }

  const creditsBought = Math.floor((amountNaira / NAIRA_PER_100_CREDITS) * 100);

  const tx = await prisma.creditTransaction.create({
    data: {
      userId: session.user.id,
      amountNaira,
      creditsBought,
      bankReference: bankReference.trim(),
    },
  });

  return NextResponse.json(tx, { status: 201 });
}

// Current balance + pending/past transactions for the logged-in user.
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const [user, transactions] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { creditBalance: true },
    }),
    prisma.creditTransaction.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  return NextResponse.json({
    balance: user?.creditBalance || 0,
    transactions,
  });
}
