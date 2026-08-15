import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { propertySchema } from "@/lib/validators";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const state = searchParams.get("state") || undefined;
  const city = searchParams.get("city") || undefined;
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const bedrooms = searchParams.get("bedrooms");
  const furnished = searchParams.get("furnished");

  const properties = await prisma.property.findMany({
    where: {
      status: "APPROVED",
      state,
      city,
      rent: {
        gte: minPrice ? Number(minPrice) : undefined,
        lte: maxPrice ? Number(maxPrice) : undefined,
      },
      bedrooms: bedrooms ? Number(bedrooms) : undefined,
      furnished: furnished ? furnished === "true" : undefined,
    },
    orderBy: { createdAt: "desc" },
    include: {
      landlord: {
        select: { name: true, verification: { select: { status: true } } },
      },
    },
  });

  return NextResponse.json(properties);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "LANDLORD") {
    return NextResponse.json(
      { error: "Only landlords can list properties." },
      { status: 403 }
    );
  }

  // Verification gate. This is the rule that matters most: a landlord
  // cannot publish a listing until an admin has approved their ID.
  const verification = await prisma.verification.findUnique({
    where: { userId: session.user.id },
  });

  if (!verification || verification.status !== "APPROVED") {
    return NextResponse.json(
      {
        error:
          "Your account must be verified before you can list a property. Submit your ID for review first.",
      },
      { status: 403 }
    );
  }

  const body = await req.json();
  const parsed = propertySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0].message },
      { status: 400 }
    );
  }

  const property = await prisma.property.create({
    data: {
      ...parsed.data,
      landlordId: session.user.id,
      verifiedProperty: !!parsed.data.ownershipDocUrl,
      status: "PENDING", // still requires admin approval regardless of docs
    },
  });

  return NextResponse.json(property, { status: 201 });
}
