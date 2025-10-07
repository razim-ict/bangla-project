"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { logoutAdmin } from "@/app/actions/auth"
import {
  getAllLoginUsers,
  getAllAdmins,
  createAdmin,
  updateAdmin,
  toggleAdminStatus,
  deleteAdmin,
} from "@/app/actions/admin"
import type { Admin, LoginUser } from "@/lib/types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AdminDashboardProps {
  session: { id: string; email: string; role: "super-admin" | "admin" }
}

export default function AdminDashboard({ session }: AdminDashboardProps) {
  const router = useRouter()
  const [loginUsers, setLoginUsers] = useState<LoginUser[]>([])
  const [admins, setAdmins] = useState<Admin[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"users" | "admins">("users")

  // Create/Edit Admin Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null)
  const [formData, setFormData] = useState({ email: "", password: "", role: "admin" as "admin" | "super-admin" })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    const [usersResult, adminsResult] = await Promise.all([getAllLoginUsers(), getAllAdmins()])

    if (usersResult.success) {
      setLoginUsers(usersResult.data)
    }

    if (adminsResult.success) {
      setAdmins(adminsResult.data)
    }

    setIsLoading(false)
  }

  const handleLogout = async () => {
    await logoutAdmin()
    router.push("/admin/login")
  }

  const handleCreateOrUpdateAdmin = async () => {
    if (!formData.email || !formData.password) {
      alert("Email and password are required")
      return
    }

    let result
    if (editingAdmin) {
      result = await updateAdmin(editingAdmin.id, formData.email, formData.password)
    } else {
      result = await createAdmin(formData.email, formData.password, formData.role)
    }

    if (result.success) {
      alert(result.message)
      setIsDialogOpen(false)
      setEditingAdmin(null)
      setFormData({ email: "", password: "", role: "admin" })
      loadData()
    } else {
      alert(result.message)
    }
  }

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    const result = await toggleAdminStatus(id, !currentStatus)
    if (result.success) {
      alert(result.message)
      loadData()
    } else {
      alert(result.message)
    }
  }

  const handleDeleteAdmin = async (id: string) => {
    if (!confirm("Are you sure you want to delete this admin?")) return

    const result = await deleteAdmin(id)
    if (result.success) {
      alert(result.message)
      loadData()
    } else {
      alert(result.message)
    }
  }

  const openEditDialog = (admin: Admin) => {
    setEditingAdmin(admin)
    setFormData({ email: admin.email, password: admin.password, role: admin.role })
    setIsDialogOpen(true)
  }

  const openCreateDialog = () => {
    setEditingAdmin(null)
    setFormData({ email: "", password: "", role: "admin" })
    setIsDialogOpen(true)
  }

  const isSuperAdmin = session.role === "super-admin"

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">
              Logged in as: <span className="font-semibold">{session.email}</span>
              <Badge className="ml-2" variant={isSuperAdmin ? "default" : "secondary"}>
                {session.role}
              </Badge>
            </p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b">
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "users" ? "border-b-2 border-[#1e6b3e] text-[#1e6b3e]" : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Login Users
          </button>
          {isSuperAdmin && (
            <button
              onClick={() => setActiveTab("admins")}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === "admins"
                  ? "border-b-2 border-[#1e6b3e] text-[#1e6b3e]"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Admin Management
            </button>
          )}
        </div>

        {/* Login Users Table */}
        {activeTab === "users" && (
          <Card className="shadow-lg">
            <CardHeader className="bg-[#1e6b3e] text-white">
              <CardTitle className="text-xl">Login Users - Credentials</CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              {isLoading ? (
                <p className="text-center py-8">Loading...</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-bold">Username</TableHead>
                        <TableHead className="font-bold">Password</TableHead>
                        <TableHead className="font-bold">Created At</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loginUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.username}</TableCell>
                          <TableCell className="font-mono">{user.password}</TableCell>
                          <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Admin Management Table */}
        {activeTab === "admins" && isSuperAdmin && (
          <Card className="shadow-lg">
            <CardHeader className="bg-[#1e6b3e] text-white flex flex-row items-center justify-between">
              <CardTitle className="text-xl">Admin Management</CardTitle>
              {isSuperAdmin && (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={openCreateDialog} variant="secondary" size="sm">
                      Create Admin
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingAdmin ? "Edit Admin" : "Create New Admin"}</DialogTitle>
                      <DialogDescription>
                        {editingAdmin ? "Update admin credentials" : "Add a new admin to the system"}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="admin@example.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="text"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          placeholder="Enter password"
                        />
                      </div>
                      {!editingAdmin && (
                        <div className="space-y-2">
                          <Label htmlFor="role">Role</Label>
                          <Select
                            value={formData.role}
                            onValueChange={(value: "admin" | "super-admin") =>
                              setFormData({ ...formData, role: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="super-admin">Super Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      <Button onClick={handleCreateOrUpdateAdmin} className="w-full bg-[#1e6b3e] hover:bg-[#165230]">
                        {editingAdmin ? "Update Admin" : "Create Admin"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              {isLoading ? (
                <p className="text-center py-8">Loading...</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-bold">Email</TableHead>
                        <TableHead className="font-bold">Password</TableHead>
                        <TableHead className="font-bold">Role</TableHead>
                        <TableHead className="font-bold">Status</TableHead>
                        {isSuperAdmin && <TableHead className="font-bold">Actions</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {admins.map((admin) => (
                        <TableRow key={admin.id}>
                          <TableCell className="font-medium">{admin.email}</TableCell>
                          <TableCell className="font-mono">{admin.password}</TableCell>
                          <TableCell>
                            <Badge variant={admin.role === "super-admin" ? "default" : "secondary"}>{admin.role}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={admin.is_enabled ? "default" : "destructive"}>
                              {admin.is_enabled ? "Enabled" : "Disabled"}
                            </Badge>
                          </TableCell>
                          {isSuperAdmin && (
                            <TableCell>
                              <div className="flex gap-2 flex-wrap">
                                <Button size="sm" variant="outline" onClick={() => openEditDialog(admin)}>
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  variant={admin.is_enabled ? "destructive" : "default"}
                                  onClick={() => handleToggleStatus(admin.id, admin.is_enabled)}
                                >
                                  {admin.is_enabled ? "Disable" : "Enable"}
                                </Button>
                                {admin.role !== "super-admin" && (
                                  <Button size="sm" variant="destructive" onClick={() => handleDeleteAdmin(admin.id)}>
                                    Delete
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
