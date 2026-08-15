import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import MessageThread from "@/components/MessageThread";
import { notFound } from "next/navigation";

export default async function ThreadPage({
  params,
}: {
  params: { propertyId: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const property = await prisma.property.findUnique({
    where: { id: params.propertyId },
    select: { id: true, title: true, landlordId: true },
  });
  if (!property) notFound();

  // Determine the other party: if I'm the landlord, find the tenant from
  // the first message; if I'm a tenant, the other party is the landlord.
  let otherUserId = property.landlordId;
  if (session.user.id === property.landlordId) {
    const firstMessage = await prisma.message.findFirst({
      where: { propertyId: property.id, senderId: { not: property.landlordId } },
      orderBy: { createdAt: "asc" },
    });
    otherUserId = firstMessage?.senderId || property.landlordId;
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-4 text-xl font-semibold">{property.title}</h1>
      <MessageThread propertyId={property.id} otherUserId={otherUserId} />
    </div>
  );
}
