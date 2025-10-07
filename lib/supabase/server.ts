import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { envConfig } from "@/lib/env-config"

export async function getSupabaseServerClient() {
  const cookieStore = await cookies()

  return createServerClient(envConfig.supabase.url, envConfig.supabase.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        } catch (error) {
          // Handle cookie setting errors in middleware
        }
      },
    },
  })
}
