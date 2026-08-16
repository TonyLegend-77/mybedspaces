import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Property photos go in a public folder.
 * ID documents go in a restricted folder with access_mode "authenticated"
 * so they cannot be viewed via a guessable public URL. Only server-side
 * requests using signed URLs (generated at review time) can read them.
 */
export async function uploadPropertyPhoto(base64: string) {
  const result = await cloudinary.uploader.upload(base64, {
    folder: "usoconnect/properties",
  });
  return result.secure_url;
}

export async function uploadIdDocument(base64: string) {
  const result = await cloudinary.uploader.upload(base64, {
    folder: "usoconnect/verification-private",
    access_mode: "authenticated",
    type: "authenticated",
  });
  return result.secure_url;
}

export function getSignedIdDocumentUrl(publicId: string) {
  return cloudinary.utils.private_download_url(publicId, "jpg", {
    resource_type: "image",
    type: "authenticated",
    expires_at: Math.floor(Date.now() / 1000) + 60 * 10, // 10 minute expiry
  });
}

export default cloudinary;
