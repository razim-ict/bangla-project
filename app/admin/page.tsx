import { redirect } from "next/navigation"
import { getAdminSession } from "../actions/auth"
import AdminDashboard from "@/components/admin-dashboard"

export default async function AdminPage() {
  const session = await getAdminSession()

  if (!session) {
    redirect("/admin/login")
  }

  return <AdminDashboard session={session} />
}
