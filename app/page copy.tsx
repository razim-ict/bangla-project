"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
// Removed Input/Label and Card imports in favor of custom floating-label fields
import Image from "next/image"
import { loginUser } from "./actions/auth"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    // Basic validation
    if (!username.trim() || !password.trim()) {
      setMessage({ type: "error", text: "ইউজারনেম এবং পাসওয়ার্ড প্রয়োজন" })
      return
    }

    setIsLoading(true)
    const result = await loginUser(username, password)
    setIsLoading(false)

    if (result.success) {
      setMessage({ type: "success", text: result.message })
      setUsername("")
      setPassword("")
    } else {
      setMessage({ type: "error", text: result.message })
    }
  }

  return (
    <div className="min-h-screen bg-white mt-16">
      <div className="w-full h-auto flex flex-col items-center justify-start px-20 py-5 relative sm:px-0">
        {/* Bottom-aligned decorative background image (keeps current asset) */}
        <img src="/images/login-background.png" alt="" className="w-full absolute -bottom-7 sm:z-20" />

        <div className="w-full h-auto flex flex-col items-center justify-start gap-y-14 sm:px-5 sm:gap-y-10">
          {/* Top Banner */}
          <div className="h-32 w-[550px] rounded-lg border-2 border-[#dadfd9] bg-[#d2e3d0] p-3 sm:w-full sm:h-auto">
            <p className="font-semibold text-[#665743] ">অফিস ব্যবহারকারীগণ কর্তৃক লগইন করতে কোন সমস্যা পরিলক্ষিত হলে বা বদলি জনিত কারণে সহায়তার জন্য নিম্নের নাম্বারে যোগাযোগ করুনঃ তৃপ্তি ভৌমিকঃ ০১৮৯৬০৪৭১১৭ <br /> যুবায়ের আহমেদঃ ০১৮৯৬০৪৭১১১</p>
          </div>

          {/* Main Content */}
          <div className="h-auto w-[450px] border border-gray-300 rounded-lg p-5 flex flex-col items-center justify-start gap-y-5 pb-16 bg-white z-10 relative sm:w-full sm:pb-12">
            {/* Logo and title */}
            <img src="/images/logo.jpg" alt="" className="h-16" />
            <p className="text-lg">লগইন করুন</p>

            <div className="w-full space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                {/* Username Field - Floating label inside border */}
                <div className="w-full h-14 border border-gray-300 rounded-lg relative text-sm">
                  <p className="absolute -top-[10px] text-base left-[16px] bg-white px-1">ইউজারনেম</p>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    className="w-full h-full bg-transparent outline-none px-4 placeholder:text-[#999495]"
                    placeholder="ইউজারনেম"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLoading}
                    aria-label="ইউজারনেম"
                  />
                </div>

                {/* Password Field - Floating label inside border */}
                <div className="w-full h-14 border border-gray-300 rounded-lg relative text-sm">
                  <p className="absolute -top-[10px] text-base left-[16px] bg-white px-1">পাসওয়ার্ড</p>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    className="w-full h-full bg-transparent outline-none px-4 placeholder:text-[#999495]"
                    placeholder="পাসওয়ার্ড"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    aria-label="পাসওয়ার্ড"
                  />
                </div>

                {/* Links */}
                <div className="flex flex-col sm:flex-row justify-between gap-2 text-sm">
                  <button type="button" className="text-red-600 hover:text-red-700 hover:underline text-right">
                    পাসওয়ার্ড ভুলে গেছেন?
                  </button>
                  <button type="button" className="text-red-600 hover:text-red-700 hover:underline text-right">
                    রেজিস্ট্রেশন করুন
                  </button>
                </div>

                {/* Message Display */}
                {message && (
                  <div
                    className={`p-3 rounded-md text-sm text-center ${message.type === "success"
                      ? "bg-green-100 text-green-800 border border-green-300"
                      : "bg-red-100 text-red-800 border border-red-300"
                      }`}
                  >
                    {message.text}
                  </div>
                )}

                {/* Login Button */}
                <Button
                  type="submit"
                  className="w-60 mx-auto bg-[#12623d] hover:bg-[#165230] text-white font-bold py-2 rounded-3xl"
                  disabled={isLoading}
                >
                  {isLoading ? "লগইন হচ্ছে..." : "লগইন করুন"}
                </Button>

                {/* Divider */}
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">or</span>
                  </div>
                </div>

                {/* GEMS Login Button */}
                <a className="w-60 mx-auto text-center text-white py-2 font-bold rounded-3xl bg-[#12623d]" href="#">
                  GEMS এর মাধ্যমে লগইন
                </a>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
