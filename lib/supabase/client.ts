import { createBrowserClient } from "@supabase/ssr"
import { envConfig } from "@/lib/env-config"

let client: ReturnType<typeof createBrowserClient> | null = null

export function getSupabaseBrowserClient() {
  if (client) {
    return client
  }

  client = createBrowserClient(envConfig.supabase.url, envConfig.supabase.anonKey)

  return client
}
