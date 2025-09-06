import { supabase } from "@/config/Subpabase.Client";
import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req) {
  try {
    const authHeader = req.headers.get("authorization"); // fixed
    const { name, domain, description } = await req.json();

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const apiKey = authHeader.split("Bearer ")[1];
      const { data, error } = await supabase
        .from("users")
        .select()
        .eq("api", apiKey);

      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 500, headers: corsHeaders }
        );
      }

      if (data.length > 0) {
        if (!name?.trim() || !domain?.trim()) {
          return NextResponse.json(
            { error: "name or domain fields must not be empty" },
            { status: 400, headers: corsHeaders }
          );
        }

        const { error: insertError } = await supabase.from("events").insert([
          {
            event_name: name.toLowerCase(),
            website_id: domain,
            message: description,
          },
        ]);

        if (insertError) {
          return NextResponse.json(
            { error: insertError.message },
            { status: 400, headers: corsHeaders }
          );
        }

        return NextResponse.json(
          { message: "success" },
          { status: 200, headers: corsHeaders }
        );
      }

      return NextResponse.json(
        { error: "Unauthorized - Invalid API" },
        { status: 401, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { error: "Missing Authorization header" },
      { status: 401, headers: corsHeaders }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500, headers: corsHeaders }
    );
  }
}
