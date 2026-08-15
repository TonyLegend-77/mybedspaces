import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadPropertyPhoto, uploadIdDocument } from "@/lib/cloudinary";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { base64, kind } = await req.json();
  if (!base64 || !kind) {
    return NextResponse.json({ error: "base64 and kind are required." }, { status: 400 });
  }

  try {
    const url =
      kind === "id_document"
        ? await uploadIdDocument(base64)
        : await uploadPropertyPhoto(base64);

    return NextResponse.json({ url });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed." }, { status: 500 });
  }
}
