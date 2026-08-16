import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function MessagesInboxPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const messages = await prisma.message.findMany({
    where: {
      OR: [{ senderId: session.user.id }, { receiverId: session.user.id }],
    },
    orderBy: { createdAt: "desc" },
    include: { property: { select: { id: true, title: true, photos: true } } },
  });

  const threadMap = new Map<string, (typeof messages)[number]>();
  for (const m of messages) {
    if (!threadMap.has(m.propertyId)) threadMap.set(m.propertyId, m);
  }
  const threads = Array.from(threadMap.values());

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">Messages</h1>
      {threads.length === 0 ? (
        <p className="text-neutral-500">
          No conversations yet. Message a landlord from a property page to
          start one.
        </p>
      ) : (
        <div className="space-y-2">
          {threads.map((t) => (
            <Link
              key={t.propertyId}
              href={`/messages/${t.propertyId}`}
              className="block rounded-lg border border-neutral-200 bg-white p-4 hover:shadow-md"
            >
              <p className="font-medium">{t.property.title}</p>
              <p className="truncate text-sm text-neutral-500">{t.content}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
