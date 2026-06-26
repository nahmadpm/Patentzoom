import { NextResponse } from "next/server";

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

  return NextResponse.json({
    message:
      "Thanks for reaching out. This starter endpoint is ready to connect to email and CRM delivery next.",
  });
}
