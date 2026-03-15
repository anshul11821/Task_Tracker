import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Named the export 'database' to match the user's preference while using Supabase under the hood
export const database = createClient(supabaseUrl, supabaseAnonKey);
