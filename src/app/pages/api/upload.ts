import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).end();

    const { name, base64 } = req.body;

    const { data, error } = await supabase.from("images").insert([{ name, base64 }]);

    if (error) return res.status(500).json({ error: error.message });

    res.status(200).json({ message: "Uploaded!", data });
}
