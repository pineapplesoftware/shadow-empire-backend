import { google } from "googleapis";
import { NextResponse } from "next/server";

const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL!;
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n");

export async function GET() {
  try {
    const auth = new google.auth.JWT(
      GOOGLE_CLIENT_EMAIL,
      undefined,
      GOOGLE_PRIVATE_KEY,
      ["https://www.googleapis.com/auth/spreadsheets"]
    );

    const sheets = google.sheets({ version: "v4", auth });

    const sheet = await sheets.spreadsheets.values.get({
      spreadsheetId: GOOGLE_SHEET_ID,
      range: "Ideas!A:D", // ajusta a tus columnas
    });

    const rows = sheet.data.values;
    if (!rows || rows.length < 2) {
      return NextResponse.json({ last: null, all: [] });
    }

    const headers = rows[0];
    const items = rows.slice(1).map((row) => {
      const item: Record<string, string> = {};
      headers.forEach((header, i) => {
        item[header.toLowerCase()] = row[i];
      });
      return item;
    });

    const last = items[items.length - 1];

    return NextResponse.json({ last, all: items });
  } catch (err) {
    console.error("❌ Error en /api/videos:", err);
    return NextResponse.json({ last: null, all: [] });
  }
}
