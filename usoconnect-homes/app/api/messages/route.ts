import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { messageSchema } from "@/lib/validators";

function maskName(fullName: string) {
  const parts = fullName.trim().split(" ");
  const first = parts[0];
  const lastInitial = parts.length > 1 ? `${parts[parts.length - 1][0]}.` : "";
  return `${first} ${lastInitial}`.trim();
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const body = await req.json();
  const parsed = messageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 400 }
    );
  }

  const message = await prisma.message.create({
    data: {
      propertyId: parsed.data.propertyId,
      receiverId: parsed.data.receiverId,
      senderId: session.user.id,
      content: parsed.data.content,
    },
  });

  return NextResponse.json(message, { status: 201 });
}

// Thread for a given property between the current user and the other party.
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const propertyId = searchParams.get("propertyId");
  if (!propertyId) {
    return NextResponse.json({ error: "propertyId is required." }, { status: 400 });
  }

  const messages = await prisma.message.findMany({
    where: {
      propertyId,
      OR: [{ senderId: session.user.id }, { receiverId: session.user.id }],
    },
    orderBy: { createdAt: "asc" },
    include: {
      sender: { select: { id: true, name: true, email: true } },
      receiver: { select: { id: true, name: true, email: true } },
    },
  });

  // Mask identity until contact has been mutually shared on this thread.
  const anyShared = messages.some((m) => m.contactShared);

  const shaped = messages.map((m) => ({
    id: m.id,
    content: m.content,
    createdAt: m.createdAt,
    senderId: m.senderId,
    isSelf: m.senderId === session.user.id,
    senderDisplay: anyShared ? m.sender.name : maskName(m.sender.name),
    senderContact: anyShared ? m.sender.email : null,
  }));

  return NextResponse.json(shaped);
}
