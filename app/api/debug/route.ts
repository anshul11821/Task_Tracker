import { NextResponse } from "next/server";

export async function GET() {
  const url = process.env.DATABASE_URL;
  
  if (!url) {
    return NextResponse.json({ 
      status: "error", 
      message: "DATABASE_URL is missing from environment variables." 
    });
  }

  // Safely check the start of the string without exposing the password
  const protocolMatch = url.startsWith("postgresql://") || url.startsWith("postgres://");
  const length = url.length;
  const firstChars = url.substring(0, 15);

  return NextResponse.json({
    status: "ok",
    diagnostics: {
      hasUrl: true,
      length,
      protocolCorrect: protocolMatch,
      prefix: firstChars + "...",
      advice: protocolMatch 
        ? "Protocol looks OK. Check for trailing spaces or hidden characters in Vercel UI." 
        : "Protocol is MISSING or INCORRECT. Make sure it starts exactly with 'postgresql://' (no quotes)."
    }
  });
}
