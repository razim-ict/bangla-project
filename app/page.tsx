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
    <>
      {/* Top header with right-aligned logo */}
      <header className="w-full bg-white">
        <div className=" w-full sm:w-[90%] md:max-w-[550px] flex items-center justify-start py-2 mx-2">
          <img src="/images/logo.jpg" alt="Logo" className="h-16" />
        </div>
      </header>
      <div className="bg-contain bg-center bg-no-repeat mx-auto w-full px-5 sm:px-0  py-5  flex flex-col justify-center items-center  mt-4"
        style={{ backgroundImage: "url('/images/login-background.png')" }}
      >
        <div className="sm:w-[90%] md:w-full flex justify-center items-center flex-col mx-auto mt-5">
          {/* Top Banner */}
          <div className="sm:w-[360px] md:w-[550px] rounded-md border-2 border-[#dadfd9] bg-[#d2e3d0] p-0 mt-5">
            <p className=" text-[#665743] font-semibold sm:text-[16px] md:text-[16px] p-2">অফিস ব্যবহারকারীগণ কর্তৃক লগইন করতে কোন সমস্যা পরিলক্ষিত হলে বা বদলি জনিত কারণে সহায়তার জন্য নিম্নের নাম্বারে যোগাযোগ করুনঃ তৃপ্তি ভৌমিকঃ ০১৮৯৬০৪৭১১৭ <br /> যুবায়ের আহমেদঃ ০১৮৯৬০৪৭১১১</p>
          </div>

          {/* Main Content */}
          <div
            className="h-auto w-full md:w-[480px] mx-auto border border-gray-300 rounded-lg p-5 flex flex-col items-center justify-start gap-y-5 pb-10 bg-white z-10 sm:pb-8 my-12"
          >
            <div className="w-full shadow-none border-gray-200">
              <div className="space-y-10">
                {/* Logos */}
                <div className="flex justify-center">
                  <img
                    src="/images/logo.jpg"
                    alt="Logo"
                    className="h-20"
                  />
                </div>

                {/* Title */}
                <h1 className="text-xl text-center text-gray-800">লগইন করুন</h1>
              </div>

              <form onSubmit={handleLogin} className="space-y-10 mt-10">
                <div className="space-y-5">
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
                </div>

                {/* Links */}
                <div className="flex flex-col justify-between items-right gap-2 text-sm">
                  <button type="button" className="text-red-700 hover:text-red-700 hover:underline text-right underline font-semibold">
                    পাসওয়ার্ড ভুলে গেছেন?
                  </button>
                  <button type="button" className="text-red-700 hover:text-red-700 hover:underline text-right underline font-semibold">
                    রেজিস্ট্রেশন করুন
                  </button>
                  <button type="button" className="text-red-700 hover:text-red-700 hover:underline text-right underline font-semibold">
                    সাপোর্ট টিকেট
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
                <div className="w-full h-auto flex flex-col items-center justify-center gap-y-5">
                  {/* Login Button */}
                  <Button
                    type="submit"
                    className="w-60 text-center text-white py-2 font-bold rounded-3xl bg-[#12623d]"
                    disabled={isLoading}
                  >
                    {isLoading ? "লগইন হচ্ছে..." : "লগইন করুন"}
                  </Button>

                  {/* Divider with lines and or */}
                  <div className="w-full flex items-center justify-center gap-x-5">
                    <div className="w-1/2 h-px bg-gray-300 "></div>
                    <p className="text-2xl text-gray-500 font-medium">or</p>
                    <div className="w-1/2 h-px bg-gray-300 "></div>
                  </div>

                  {/* GEMS Login Button */}
                  <a className="w-60 text-center text-white py-2 font-bold rounded-3xl bg-[#12623d]" href="#">
                    GEMS এর মাধ্যমে লগইন
                  </a>
                </div>

              </form>

            </div>
          </div>
        </div>

      </div>

      {/* Sticky footer that sticks at bottom when reached */}
      <footer className="w-full sticky bottom-0 bg-white border-t">
        <div className="w-full px-5 flex flex-col sm:flex-row items-center justify-between gap-3 py-3">
          <div className="text-left">
            <span className="font-bold text-[15px]">ভূমি ব্যবস্থাপনা অটোমেশন প্রকল্প, ভূমি মন্ত্রণালয়</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end">
            <span className="font-bold text-[15px] mr-2">কারিগরি সহায়তায়</span>
            <img src="/images/1.png" alt="logo 1" className="h-6 p-2" />
            <img src="/images/2.png" alt="logo 2" className="h-6 p-2" />
            <img src="/images/3.png" alt="logo 3" className="h-6 p-2" />
            <img src="/images/4.png" alt="logo 4" className="h-6 p-2" />
          </div>
        </div>
      </footer>
    </>
  )
}
