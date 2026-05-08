"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Code, LayoutDashboard, LogOut, FileText, ChevronDown } from "lucide-react"
import AuthModal from "@/components/AuthModal"

export default function Navbar() {
  const router = useRouter()
  const [user, setUser] = useState<{ email: string; initials: string; fullName: string } | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [loading, setLoading] = useState(true)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const buildUserObj = (session: any) => {
    if (!session?.user) return null
    const meta = session.user.user_metadata || {}
    const firstName: string = meta.first_name || ""
    const lastName: string = meta.last_name || ""
    const email: string = session.user.email || ""
    let initials = ""
    if (firstName && lastName) {
      initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
    } else if (firstName) {
      initials = firstName.charAt(0).toUpperCase()
    } else {
      initials = email.charAt(0).toUpperCase()
    }
    return {
      email,
      initials,
      fullName: firstName && lastName ? `${firstName} ${lastName}` : firstName || email.split("@")[0],
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(buildUserObj(session))
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(buildUserObj(session))
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setShowDropdown(false)
    router.refresh()
  }

  const getAvatarColor = (initials: string) => {
    const colors = ["bg-blue-500", "bg-purple-500", "bg-emerald-500", "bg-pink-500", "bg-orange-500", "bg-teal-500", "bg-indigo-500"]
    return colors[(initials.charCodeAt(0) || 0) % colors.length]
  }

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900 font-serif">BloggerAI</span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link href="/#features" className="text-slate-600 hover:text-slate-900 text-sm transition-colors">Features</Link>
              <Link href="/#how-it-works" className="text-slate-600 hover:text-slate-900 text-sm transition-colors">How It Works</Link>
              <Link href="/#pricing" className="text-slate-600 hover:text-slate-900 text-sm transition-colors">Pricing</Link>
              <Link href="/about" className="text-slate-600 hover:text-slate-900 text-sm transition-colors">About</Link>
            </div>

            <div className="flex items-center">
              {loading ? (
                <div className="w-9 h-9 rounded-full bg-slate-200 animate-pulse" />
              ) : user ? (
                <div className="relative" ref={dropdownRef}>
                  <button onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center space-x-2 group focus:outline-none">
                    <div className={`w-9 h-9 rounded-full ${getAvatarColor(user.initials)} flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-white group-hover:ring-blue-100 transition-all select-none`}>
                      {user.initials}
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${showDropdown ? "rotate-180" : ""}`} />
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 top-12 w-60 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
                      <div className="px-4 py-3 bg-gradient-to-br from-blue-50 to-slate-50 border-b border-slate-100">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-full ${getAvatarColor(user.initials)} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                            {user.initials}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">{user.fullName}</p>
                            <p className="text-xs text-slate-500 truncate">{user.email}</p>
                          </div>
                        </div>
                      </div>
                      <div className="py-1.5">
                        <Link href="/dashboard" onClick={() => setShowDropdown(false)}
                          className="flex items-center space-x-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                          <LayoutDashboard className="w-4 h-4 text-slate-400" /><span>Dashboard</span>
                        </Link>
                        <Link href="/generate" onClick={() => setShowDropdown(false)}
                          className="flex items-center space-x-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                          <FileText className="w-4 h-4 text-slate-400" /><span>Generate Article</span>
                        </Link>
                      </div>
                      <div className="border-t border-slate-100 py-1.5">
                        <button onClick={handleLogout}
                          className="flex items-center space-x-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors w-full text-left">
                          <LogOut className="w-4 h-4" /><span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button onClick={() => setShowAuthModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow-md">
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  )
}