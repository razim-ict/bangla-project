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
    <div className="bg-contain bg-bottom bg-no-repeat mx-auto w-full px-3 sm:px-0  py-5  flex flex-col justify-center items-center  mt-16"
      style={{ backgroundImage: "url('/images/login-background.png')" }}
    >
      <div className="sm:w-[90%] md:max-w-[550px]">
        {/* Top Banner */}
        <div className="w-full rounded-lg border-2 border-[#dadfd9] bg-[#d2e3d0] p-3 sm:px-2">
          <p className=" text-[#665743] font-semibold text-[18px]">অফিস ব্যবহারকারীগণ কর্তৃক লগইন করতে কোন সমস্যা পরিলক্ষিত হলে বা বদলি জনিত কারণে সহায়তার জন্য নিম্নের নাম্বারে যোগাযোগ করুনঃ তৃপ্তি ভৌমিকঃ ০১৮৯৬০৪৭১১৭ <br /> যুবায়ের আহমেদঃ ০১৮৯৬০৪৭১১১</p>
        </div>

        {/* Main Content */}
        <div
          className="h-auto w-full border border-gray-300 rounded-lg p-5 flex flex-col items-center justify-start gap-y-5 pb-16 bg-white z-10 sm:pb-12 my-[60px]"
        >
          <div className="w-full shadow-none border-gray-200">
            <div className="">
              {/* Logos */}
              <div className="flex justify-center">
                <Image
                  src="/images/logo.jpg"
                  alt="Logo"
                  width={600}
                  height={100}
                  className="w-full max-w-[500px] h-auto"
                  priority
                />
              </div>

              {/* Title */}
              <h1 className="text-xl md:text-2xl font-bold text-center text-gray-800">লগইন করুন</h1>
            </div>

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
                className="w-full bg-[#1e6b3e] hover:bg-[#165230] text-white font-medium py-6 rounded-full"
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
              <Button
                type="button"
                className="w-full bg-[#1e6b3e] hover:bg-[#165230] text-white font-medium py-6 rounded-full"
              >
                GEMS এর মাধ্যমে লগইন
              </Button>
            </form>

          </div>
        </div>
      </div>




    </div>
  )
}
