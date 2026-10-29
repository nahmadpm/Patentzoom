import { NextResponse } from "next/server";
import { z } from "zod";

import { saveConsultationSubmission } from "@/lib/consultations";

const consultationSchema = z.object({
  name: z.string().trim().min(2).max(150),
  email: z.string().trim().email().max(254),
  company: z.string().trim().max(200).optional(),
  phone: z.string().trim().max(50).optional(),
  message: z.string().trim().max(5000).optional(),
}).refine((body) => Boolean(body.phone || body.message));

export async function POST(request: Request) {
  const parsed = consultationSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Name, email, and either a phone number or message are required.",
      },
      { status: 400 },
    );
  }

  try {
    await saveConsultationSubmission(parsed.data);
  } catch {
    return NextResponse.json({ message: "Your request could not be saved. Please try again later." }, { status: 503 });
  }

  return NextResponse.json({
    message:
      "Thanks for reaching out. Your consultation request has been saved for the PatentZoom team.",
  });
}
