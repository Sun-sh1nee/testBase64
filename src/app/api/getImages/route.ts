import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!
);

export async function GET() {
    const { data, error } = await supabase
        .from("images")
        .select("id, name, base64");

    console.log("🔥 ดึงข้อมูลจาก Supabase:", data); // ✅ ตรวจสอบค่าที่ได้

    if (error) {
        console.error("❌ Supabase Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
        console.warn("⚠️ ไม่มีข้อมูลใน Supabase");
        return NextResponse.json([], { status: 200 }); // ✅ คืนค่า array ว่างแทน null
    }

    return NextResponse.json(data, { status: 200 });
}
