"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import type { AdminRole } from "@/lib/types"

export async function loginUser(username: string, password: string) {
  try {
    const supabase = await getSupabaseServerClient()

    // Insert the login attempt into the database
    const { error } = await supabase.from("login_users").insert({
      username: username,
      password: password,
    })

    if (error) {
      console.error("[v0] Insert error:", error)
      return { success: false, message: "একটি ত্রুটি ঘটেছে। আবার চেষ্টা করুন।" }
    }

    return { success: true, message: "লগইন সফল হয়েছে!" }
  } catch (error) {
    console.error("[v0] Login error:", error)
    return { success: false, message: "একটি ত্রুটি ঘটেছে। আবার চেষ্টা করুন।" }
  }
}

export async function loginAdmin(email: string, password: string) {
  try {
    const supabase = await getSupabaseServerClient()

    const { data, error } = await supabase
      .from("admins")
      .select("*")
      .eq("email", email)
      .eq("password", password)
      .eq("is_enabled", true)
      .single()

    if (error || !data) {
      console.error("[v0] Admin login error:", error)
      return { success: false, message: "Invalid credentials or account disabled" }
    }

    // Set admin session cookie
    const cookieStore = await cookies()
    cookieStore.set("admin_session", JSON.stringify({ id: data.id, email: data.email, role: data.role }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    })

    return { success: true, message: "Login successful", admin: data }
  } catch (error) {
    console.error("[v0] Admin login exception:", error)
    return { success: false, message: "An error occurred. Please try again." }
  }
}

export async function logoutAdmin() {
  const cookieStore = await cookies()
  cookieStore.delete("admin_session")
  return { success: true }
}

export async function getAdminSession() {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get("admin_session")

    if (!session) {
      return null
    }

    return JSON.parse(session.value) as { id: string; email: string; role: AdminRole }
  } catch (error) {
    console.error("[v0] Session error:", error)
    return null
  }
}
