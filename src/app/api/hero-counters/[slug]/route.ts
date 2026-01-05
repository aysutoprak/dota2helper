import { NextResponse } from "next/server";
import path from "path";
import { readFile } from "fs/promises";

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;

    const filePath = path.join(
      process.cwd(),
      "src/app/scripts/data/heroCounters",
      `${slug}.json`
    );

    const file = await readFile(filePath, "utf-8");
    const data = JSON.parse(file);

    return NextResponse.json(data);
  } catch (error) {
    console.error("COUNTER API ERROR:", error);

    return NextResponse.json(
      { error: "Counter file not found" },
      { status: 404 }
    );
  }
}
