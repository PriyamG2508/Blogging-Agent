"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Search, BarChart3, PenTool, Rocket, Users, Star, Zap,
  Code, Target, Eye, ArrowRight, CheckCircle
} from "lucide-react"
import AuthModal from "@/components/AuthModal"
import Navbar from "@/components/Navbar"
import Link from "next/link"

export default function LandingPage() {
  const router = useRouter()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session)
    })
    return () => subscription.unsubscribe()
  }, [])

  // If logged in → go to /generate. If not → show auth modal
  const handleCTA = () => {
    if (isLoggedIn) {
      router.push("/generate")
    } else {
      setShowAuthModal(true)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-20 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-white to-pink-50/20" />
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-100/40 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-pink-100/40 rounded-full blur-3xl animate-pulse delay-700" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 font-serif leading-tight">
              From Research to Ranking<br />
              <span className="text-blue-700">
                in 10 Minutes
              </span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-4xl mx-auto leading-relaxed">
              The world's first autonomous AI content agent that researches viral topics, analyzes top competitors,
              writes publication-ready articles, and optimizes while you sleep. No prompts. No editing. Just results.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button onClick={handleCTA}
                className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 text-lg rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2">
                <span>Generate My First Article</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg border-slate-300">
                Watch 2-min Demo
              </Button>
            </div>
          </div>

          {/* Flow */}
          <div className="flex justify-center mb-20">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-200/50 via-blue-200/50 to-green-200/50 rounded-full blur-xl" />
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
                <div className="flex items-center space-x-6">
                  {[
                    { Icon: Search, grad: "from-pink-500 to-pink-600", label: "Research", sub: "Trending Topics" },
                    { Icon: BarChart3, grad: "from-blue-500 to-blue-600", label: "Analyze", sub: "Competitor Gaps" },
                    { Icon: PenTool, grad: "from-green-500 to-green-600", label: "Generate", sub: "SEO-Optimized" },
                  ].map(({ Icon, grad, label, sub }, i) => (
                    <React.Fragment key={label}>
                      <div className="flex flex-col items-center group">
                        <div className={`w-16 h-16 bg-gradient-to-br ${grad} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <div className="mt-3 text-center">
                          <div className="text-sm font-semibold text-slate-800">{label}</div>
                          <div className="text-xs text-slate-500">{sub}</div>
                        </div>
                      </div>
                      {i < 2 && <div className={`w-12 h-1 bg-gradient-to-r ${i === 0 ? "from-pink-400 to-blue-400" : "from-blue-400 to-green-400"} rounded-full`} />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-slate-900 mb-4 font-serif">Why Choose BloggerAI?</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {[
              { Icon: Eye, color: "bg-pink-100 text-pink-600", title: "The Big Picture", desc: "Every business knows content drives growth, but 90% struggle with consistency. We're solving the biggest bottleneck in digital marketing: scaling quality content production." },
              { Icon: Target, color: "bg-green-100 text-green-600", title: "Our Promise", desc: "Replace your team's 40-hour research-to-publish cycle with a 10-minute AI process that delivers higher-quality, better-optimized articles that actually rank and convert." },
            ].map(({ Icon, color, title, desc }) => (
              <Card key={title} className="border-slate-200 bg-white hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className={`w-14 h-14 ${color} rounded-xl flex items-center justify-center mx-auto mb-6`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h4 className="text-2xl font-bold text-slate-900 mb-4 font-serif text-center">{title}</h4>
                  <p className="text-slate-600 text-center leading-relaxed">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { Icon: Users, color: "bg-blue-100 text-blue-600", stat: "500+", label: "Happy Creators" },
              { Icon: Star, color: "bg-pink-100 text-pink-600", stat: "95%", label: "Success Rate" },
              { Icon: Zap, color: "bg-green-100 text-green-600", stat: "3x", label: "Faster Creation" },
            ].map(({ Icon, color, stat, label }) => (
              <Card key={label} className="border-slate-200 bg-white hover:shadow-lg transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className={`w-14 h-14 ${color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-2 font-serif">{stat}</div>
                  <div className="text-slate-600">{label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4 font-serif">Your AI Content Factory</h2>
            <p className="text-xl text-slate-600">Four simple steps to perfect content</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { Icon: Search, color: "bg-pink-600", title: "Trend Intelligence Engine", desc: "Continuously monitors Reddit, news cycles, and search volume spikes to identify topics gaining momentum before competitors notice them." },
              { Icon: BarChart3, color: "bg-blue-600", title: "Competitive Gap Analysis", desc: "Deep-analyzes top-ranking articles to identify missing angles, unanswered questions, and content gaps that present immediate ranking opportunities." },
              { Icon: PenTool, color: "bg-green-600", title: "Expert-Level Writing", desc: "Advanced language models create publication-ready articles with perfect structure, engaging hooks, and compelling calls-to-action." },
              { Icon: Rocket, color: "bg-blue-600", title: "SEO Optimization Suite", desc: "Automatically optimizes titles, meta descriptions, headers, and keyword density while ensuring perfect readability scores." },
            ].map(({ Icon, color, title, desc }) => (
              <Card key={title} className="border-slate-200 bg-white hover:shadow-lg transition-all p-2">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-6">
                    <div className={`flex-shrink-0 w-14 h-14 ${color} rounded-xl flex items-center justify-center`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 font-serif mb-3">{title}</h3>
                      <p className="text-slate-600 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4 font-serif">Simple, Transparent Pricing</h2>
            <p className="text-xl text-slate-600">Start free, scale as you grow</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-slate-200 bg-white">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Starter</h3>
                  <div className="text-3xl font-bold">$0</div>
                  <div className="text-slate-500">Forever free</div>
                </div>
                <ul className="space-y-3 mb-8">
                  {["5 articles per month", "Basic SEO optimization", "Email support"].map(f => (
                    <li key={f} className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" /><span className="text-slate-600">{f}</span></li>
                  ))}
                </ul>
                <button onClick={handleCTA} className="w-full bg-slate-600 hover:bg-slate-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors">
                  Get Started Free
                </button>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-white shadow-lg relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">Most Popular</span>
              </div>
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Professional</h3>
                  <div className="text-3xl font-bold">$29</div>
                  <div className="text-slate-500">per month</div>
                </div>
                <ul className="space-y-3 mb-8">
                  {["50 articles per month", "Advanced SEO & analytics", "Priority support", "Content calendar"].map(f => (
                    <li key={f} className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" /><span className="text-slate-600">{f}</span></li>
                  ))}
                </ul>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors">
                  Start Free Trial
                </button>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Enterprise</h3>
                  <div className="text-3xl font-bold">Custom</div>
                  <div className="text-slate-500">Let's talk</div>
                </div>
                <ul className="space-y-3 mb-8">
                  {["Unlimited articles", "Custom integrations", "Dedicated support", "Team collaboration"].map(f => (
                    <li key={f} className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" /><span className="text-slate-600">{f}</span></li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full border-slate-300">Contact Sales</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6 font-serif">Ready to Transform Your Content Strategy?</h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join thousands of creators who've already automated their content creation and boosted their rankings.
          </p>
          <button onClick={handleCTA}
            className="bg-white text-blue-600 hover:bg-blue-50 px-12 py-4 text-lg font-medium rounded-xl inline-flex items-center space-x-2 transition-colors">
            <span>Start Creating Now</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Code className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white font-serif">BloggerAI</h3>
              </div>
              <p className="text-sm text-slate-400">Automated content generation powered by advanced AI.</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                {[["#features", "Features"], ["#how-it-works", "How It Works"], ["/generate", "Try Now"], ["#pricing", "Pricing"]].map(([href, label]) => (
                  <li key={label}><Link href={href} className="text-slate-400 hover:text-white">{label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                {[["/about", "About"], ["/contact", "Contact"]].map(([href, label]) => (
                  <li key={label}><Link href={href} className="text-slate-400 hover:text-white">{label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                {[["/privacy", "Privacy Policy"], ["/terms", "Terms of Service"]].map(([href, label]) => (
                  <li key={label}><Link href={href} className="text-slate-400 hover:text-white">{label}</Link></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center">
            <p className="text-sm text-slate-400">© 2025 BloggerAI (Priyam Gupta). All rights reserved.</p>
          </div>
        </div>
      </footer>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  )
}