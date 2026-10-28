import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/types/database";

const DEFAULT_SUPABASE_URL = "https://smcaqwlablyculowblyc.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtY2Fxd2xhYmx5Y3Vsb3dibHljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMxNzM4MDMsImV4cCI6MjEwODc0OTgwM30.zZdH7ncZ0dV6wvytt8DZu6rDA767hS4QichkDpD26Lc";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

  return createBrowserClient<Database>(url, anonKey);
}
