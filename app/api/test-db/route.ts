import { supabase } from "@/utils/supabase/client";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const { count, error } = await supabase.from('cells').select('*', { count: 'exact', head: true });

        // Check if URL is loaded
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

        if (error) {
            return NextResponse.json({
                success: false,
                message: "Connection failed",
                error: error.message,
                envLoaded: !!url
            });
        }

        return NextResponse.json({
            success: true,
            message: "Successfully connected to Supabase!",
            tableRowEstimate: count,
            envLoaded: !!url
        });
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message });
    }
}
