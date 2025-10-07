"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { getAdminSession } from "./auth"
import type { Admin } from "@/lib/types"
import { revalidatePath } from "next/cache"

export async function getAllAdmins() {
  try {
    const session = await getAdminSession()
    if (!session) {
      return { success: false, message: "Unauthorized", data: [] }
    }

    const supabase = await getSupabaseServerClient()
    const { data, error } = await supabase.from("admins").select("*").order("created_at", { ascending: false })

    if (error) {
      return { success: false, message: error.message, data: [] }
    }

    return { success: true, data: data as Admin[] }
  } catch (error) {
    return { success: false, message: "Failed to fetch admins", data: [] }
  }
}

export async function createAdmin(email: string, password: string, role: "admin" | "super-admin") {
  try {
    const session = await getAdminSession()
    if (!session || session.role !== "super-admin") {
      return { success: false, message: "Unauthorized. Only super-admin can create admins." }
    }

    const supabase = await getSupabaseServerClient()
    const { data, error } = await supabase
      .from("admins")
      .insert({ email, password, role, is_enabled: true })
      .select()
      .single()

    if (error) {
      return { success: false, message: error.message }
    }

    revalidatePath("/admin")
    return { success: true, message: "Admin created successfully", data }
  } catch (error) {
    return { success: false, message: "Failed to create admin" }
  }
}

export async function updateAdmin(id: string, email: string, password: string) {
  try {
    const session = await getAdminSession()
    if (!session || session.role !== "super-admin") {
      return { success: false, message: "Unauthorized. Only super-admin can update admins." }
    }

    const supabase = await getSupabaseServerClient()
    const { data, error } = await supabase
      .from("admins")
      .update({ email, password, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      return { success: false, message: error.message }
    }

    revalidatePath("/admin")
    return { success: true, message: "Admin updated successfully", data }
  } catch (error) {
    return { success: false, message: "Failed to update admin" }
  }
}

export async function toggleAdminStatus(id: string, isEnabled: boolean) {
  try {
    const session = await getAdminSession()
    if (!session || session.role !== "super-admin") {
      return { success: false, message: "Unauthorized. Only super-admin can toggle admin status." }
    }

    const supabase = await getSupabaseServerClient()
    const { data, error } = await supabase
      .from("admins")
      .update({ is_enabled: isEnabled, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      return { success: false, message: error.message }
    }

    revalidatePath("/admin")
    return { success: true, message: `Admin ${isEnabled ? "enabled" : "disabled"} successfully`, data }
  } catch (error) {
    return { success: false, message: "Failed to toggle admin status" }
  }
}

export async function deleteAdmin(id: string) {
  try {
    const session = await getAdminSession()
    if (!session || session.role !== "super-admin") {
      return { success: false, message: "Unauthorized. Only super-admin can delete admins." }
    }

    const supabase = await getSupabaseServerClient()
    const { error } = await supabase.from("admins").delete().eq("id", id)

    if (error) {
      return { success: false, message: error.message }
    }

    revalidatePath("/admin")
    return { success: true, message: "Admin deleted successfully" }
  } catch (error) {
    return { success: false, message: "Failed to delete admin" }
  }
}

export async function getAllLoginUsers() {
  try {
    const session = await getAdminSession()
    if (!session) {
      return { success: false, message: "Unauthorized", data: [] }
    }

    const supabase = await getSupabaseServerClient()
    const { data, error } = await supabase.from("login_users").select("*").order("created_at", { ascending: false })

    if (error) {
      return { success: false, message: error.message, data: [] }
    }

    return { success: true, data }
  } catch (error) {
    return { success: false, message: "Failed to fetch users", data: [] }
  }
}
