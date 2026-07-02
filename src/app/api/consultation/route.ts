import { NextResponse } from "next/server";

import { saveConsultationSubmission } from "@/lib/consultations";

type ConsultationPayload = {
  name?: string;
  email?: string;
  company?: string;
  phone?: string;
  message?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as ConsultationPayload;
  const name = body.name?.trim();
  const email = body.email?.trim();
  const phone = body.phone?.trim();
  const message = body.message?.trim();

  if (!name || !email || (!message && !phone)) {
    return NextResponse.json(
      {
        message: "Name, email, and either a phone number or message are required.",
      },
      { status: 400 },
    );
  }

  await saveConsultationSubmission({
    name,
    email,
    company: body.company?.trim(),
    phone,
    message,
  });

  return NextResponse.json({
    message:
      "Thanks for reaching out. Your consultation request has been saved for the PatentZoom team.",
  });
}
