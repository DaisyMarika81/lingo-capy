import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/database";

/**
 * Privileged Supabase client using the Service Role Key.
 * NEVER expose this client to the browser/client-side!
 * Use only inside Server Actions, Route Handlers, or Edge Functions.
 */
const DEFAULT_SUPABASE_URL = "https://smcaqwlablyculowblyc.supabase.co";
const DEFAULT_SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtY2Fxd2xhYmx5Y3Vsb3dibHljIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MzE3MzgwMywiZXhwIjoyMTA4NzQ5ODAzfQ.0qnTV3YI4ZtzE9409nA-5rm1SurHw6vXRLf_ksyjHao";

export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || DEFAULT_SERVICE_ROLE_KEY;

  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
