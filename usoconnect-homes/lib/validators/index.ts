import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name is too short."),
  email: z.string().email("Enter a valid email."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  role: z.enum(["TENANT", "LANDLORD"]),
  budget: z.number().int().positive().optional(),
  preferredCity: z.string().optional(),
  moveDate: z.string().datetime().optional(),
});

export const propertySchema = z.object({
  title: z.string().min(5),
  description: z.string().min(20),
  rent: z.number().int().positive(),
  state: z.string().min(2),
  city: z.string().min(2),
  bedrooms: z.number().int().min(0),
  bathrooms: z.number().int().min(0),
  furnished: z.boolean().default(false),
  photos: z.array(z.string().url()).min(1, "Add at least one photo."),
  ownershipDocUrl: z.string().url().optional(),
});

export const messageSchema = z.object({
  propertyId: z.string(),
  receiverId: z.string(),
  content: z.string().min(1).max(2000),
});

export const reportSchema = z
  .object({
    reason: z.enum(["scam", "fake_listing", "harassment", "other"]),
    details: z.string().max(1000).optional(),
    reportedUserId: z.string().optional(),
    propertyId: z.string().optional(),
  })
  .refine((data) => data.reportedUserId || data.propertyId, {
    message: "A report must target a user or a property.",
  });

export const verificationSchema = z.object({
  idDocumentUrl: z.string().url(),
  idType: z.enum(["national_id", "drivers_license"]),
});
