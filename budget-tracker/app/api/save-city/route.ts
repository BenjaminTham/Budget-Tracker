// app/api/save-city/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const cityData = await request.json();
    const filePath = path.join(process.cwd(), "public", "cityData.json");
    const jsonString = JSON.stringify(cityData, null, 2);
    fs.writeFileSync(filePath, jsonString, "utf-8");
    return NextResponse.json(
      { message: "City data saved successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error saving city data." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const filecontents = JSON.parse(
      fs.readFileSync(
        path.join(process.cwd(), "public", "cityData.json"),
        "utf-8"
      )
    );
    return NextResponse.json(filecontents, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error loading city data" },
      { status: 500 }
    );
  }
}
