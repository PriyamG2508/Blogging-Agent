"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { X, Loader2, AlertCircle, Code, Sparkles, ArrowRight, ArrowLeft, User, Calendar, Users } from "lucide-react"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultTab?: "signin" | "signup"
}

type SignupStep = "credentials" | "profile"

const GENDERS = ["Male", "Female", "Non-binary", "Prefer not to say"]

export default function AuthModal({ isOpen, onClose, defaultTab = "signin" }: AuthModalProps) {
  const router = useRouter()
  const [tab, setTab] = useState<"signin" | "signup">(defaultTab)
  const [step, setStep] = useState<SignupStep>("credentials")

  // Credentials
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // Profile
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [dob, setDob] = useState("")
  const [gender, setGender] = useState("")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  // Reset everything when modal opens/closes or tab switches
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setEmail(""); setPassword("")
        setFirstName(""); setLastName(""); setDob(""); setGender("")
        setError(""); setMessage(""); setStep("credentials")
      }, 300)
    }
  }, [isOpen])

  const switchTab = (newTab: "signin" | "signup") => {
    setTab(newTab)
    setStep("credentials")
    setError(""); setMessage("")
    setEmail(""); setPassword("")
    setFirstName(""); setLastName(""); setDob(""); setGender("")
  }

  if (!isOpen) return null

  // Calculate age from DOB
  const calculateAge = (dobString: string) => {
    const today = new Date()
    const birth = new Date(dobString)
    let age = today.getFullYear() - birth.getFullYear()
    const m = today.getMonth() - birth.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
    return age
  }

  // Step 1 — validate credentials and go to profile
  const handleCredentialsNext = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }
    setStep("profile")
  }

  // Step 2 — create account with profile data
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!firstName.trim() || !lastName.trim()) {
      setError("Please enter your full name.")
      return
    }
    if (!dob) {
      setError("Please enter your date of birth.")
      return
    }
    const age = calculateAge(dob)
    if (age < 13) {
      setError("You must be at least 13 years old to sign up.")
      return
    }
    if (!gender) {
      setError("Please select your gender.")
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            full_name: `${firstName.trim()} ${lastName.trim()}`,
            dob,
            age,
            gender,
          }
        }
      })
      if (error) throw error
      setMessage(`Account created! We've sent a confirmation email to ${email}. Please verify your email, then sign in.`)
      setStep("credentials")
      setTab("signin")
      setEmail(""); setPassword("")
    } catch (err: any) {
      setError(err.message || "Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  // Sign in
  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      onClose()
      router.refresh() // Stay on same page, just refresh auth state
    } catch (err: any) {
      setError(err.message || "Invalid email or password.")
    } finally {
      setLoading(false)
    }
  }

  const getInitials = () => {
    const f = firstName.charAt(0).toUpperCase()
    const l = lastName.charAt(0).toUpperCase()
    return f && l ? `${f}${l}` : f || "?"
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Top gradient bar */}
        <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600 z-10"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-8">
          {/* Logo */}
          <div className="text-center mb-5">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Code className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900 font-serif">BloggerAI</span>
            </div>

            {tab === "signup" && step === "profile" ? (
              <>
                {/* Avatar preview */}
                <div className="flex justify-center mb-3">
                  <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {getInitials()}
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 font-serif">Tell us about you</h2>
                <p className="text-slate-500 text-sm mt-1">Just a few details to set up your profile</p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-slate-900 font-serif">
                  {tab === "signin" ? "Welcome back" : "Create your account"}
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  {tab === "signin" ? "Sign in to access your articles" : "Start generating AI-powered articles for free"}
                </p>
              </>
            )}
          </div>

          {/* Tab switcher — only show on credentials step */}
          {step === "credentials" && (
            <div className="flex bg-slate-100 rounded-xl p-1 mb-6">
              <button
                onClick={() => switchTab("signin")}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${tab === "signin" ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-700"}`}
              >
                Sign In
              </button>
              <button
                onClick={() => switchTab("signup")}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${tab === "signup" ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-700"}`}
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Step progress for signup */}
          {tab === "signup" && (
            <div className="flex items-center gap-2 mb-5">
              <div className={`flex-1 h-1.5 rounded-full transition-all ${step === "credentials" ? "bg-blue-600" : "bg-blue-600"}`} />
              <div className={`flex-1 h-1.5 rounded-full transition-all ${step === "profile" ? "bg-blue-600" : "bg-slate-200"}`} />
            </div>
          )}

          {/* ── SIGN IN FORM ── */}
          {tab === "signin" && (
            <form onSubmit={handleSignin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm bg-slate-50 focus:bg-white transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Your password"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm bg-slate-50 focus:bg-white transition-all" />
              </div>

              {error && <ErrorBox message={error} />}
              {message && <SuccessBox message={message} />}

              <button type="submit" disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-center space-x-2 shadow-sm">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Signing in...</span></> : <><Sparkles className="w-4 h-4" /><span>Sign In</span></>}
              </button>

              <p className="text-center text-xs text-slate-400">
                Don't have an account?{" "}
                <button type="button" onClick={() => switchTab("signup")} className="text-blue-600 hover:underline font-medium">Sign up free</button>
              </p>
            </form>
          )}

          {/* ── SIGNUP STEP 1: Credentials ── */}
          {tab === "signup" && step === "credentials" && (
            <form onSubmit={handleCredentialsNext} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm bg-slate-50 focus:bg-white transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters" minLength={6}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm bg-slate-50 focus:bg-white transition-all" />
              </div>

              {error && <ErrorBox message={error} />}

              <button type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-center space-x-2 shadow-sm">
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-center text-xs text-slate-400">
                Already have an account?{" "}
                <button type="button" onClick={() => switchTab("signin")} className="text-blue-600 hover:underline font-medium">Sign in</button>
              </p>
            </form>
          )}

          {/* ── SIGNUP STEP 2: Profile ── */}
          {tab === "signup" && step === "profile" && (
            <form onSubmit={handleSignup} className="space-y-4">
              {/* Name row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    <User className="w-3.5 h-3.5 inline mr-1" />First name
                  </label>
                  <input type="text" required value={firstName} onChange={e => setFirstName(e.target.value)}
                    placeholder="Priyam"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-slate-50 focus:bg-white transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Last name</label>
                  <input type="text" required value={lastName} onChange={e => setLastName(e.target.value)}
                    placeholder="Gupta"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-slate-50 focus:bg-white transition-all" />
                </div>
              </div>

              {/* DOB */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  <Calendar className="w-3.5 h-3.5 inline mr-1" />Date of birth
                </label>
                <input type="date" required value={dob} onChange={e => setDob(e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-slate-50 focus:bg-white transition-all" />
                {dob && (
                  <p className="text-xs text-slate-500 mt-1">Age: {calculateAge(dob)} years old</p>
                )}
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  <Users className="w-3.5 h-3.5 inline mr-1" />Gender
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {GENDERS.map(g => (
                    <button key={g} type="button" onClick={() => setGender(g)}
                      className={`py-2 px-3 rounded-xl text-sm border transition-all ${
                        gender === g
                          ? "bg-blue-600 text-white border-blue-600 font-medium"
                          : "border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50"
                      }`}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {error && <ErrorBox message={error} />}

              <div className="flex gap-3">
                <button type="button" onClick={() => { setStep("credentials"); setError("") }}
                  className="flex items-center space-x-1.5 px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition-all">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button type="submit" disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-center space-x-2 shadow-sm">
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Creating account...</span></> : <><Sparkles className="w-4 h-4" /><span>Create Account</span></>}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="flex items-start space-x-2 bg-red-50 border border-red-100 rounded-xl p-3">
      <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
      <p className="text-red-600 text-sm">{message}</p>
    </div>
  )
}

function SuccessBox({ message }: { message: string }) {
  return (
    <div className="bg-green-50 border border-green-100 rounded-xl p-3">
      <p className="text-green-700 text-sm">{message}</p>
    </div>
  )
}