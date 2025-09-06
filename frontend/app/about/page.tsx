"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Code, ArrowLeft, Target, Users, Zap, Heart, Award, Lightbulb } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <Link href="/" className="text-xl font-bold text-slate-900 font-serif">BloggerAI</Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Home</span>
                </Button>
              </Link>
              <Link href="/generate">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Try BloggerAI
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6 font-serif">
            About <span className="text-blue-600">BloggerAI</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            We're building the future of content creation, where AI doesn't replace creativity it amplifies it. 
            Our mission is to democratize high-quality content production for creators everywhere.
          </p>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6 font-serif">Our Mission</h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Content creation shouldn't be a bottleneck to your success. Every creator, marketer, and business 
                owner deserves access to tools that help them produce exceptional content consistently.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                BloggerAI was born from the frustration of spending countless hours researching, writing, and 
                optimizing content manually. We knew there had to be a better way—and we built it.
              </p>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold">95%</div>
                    <div className="text-blue-100">Time Saved</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">10min</div>
                    <div className="text-blue-100">Avg. Generation</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">500+</div>
                    <div className="text-blue-100">Happy Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">24/7</div>
                    <div className="text-blue-100">AI Working</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center font-serif">Our Story</h2>
          
          <div className="space-y-12">
            <Card className="border-slate-200">
              <CardContent className="p-8">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                      <Lightbulb className="w-6 h-6 text-pink-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3 font-serif">The Problem</h3>
                    <p className="text-slate-600 leading-relaxed">
                      As content creators ourselves, we experienced the pain firsthand. Spending 8+ hours researching, 
                      writing, and optimizing a single blog post. Missing trending topics because we were too slow. 
                      Watching competitors outrank us while we struggled with consistency.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardContent className="p-8">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Target className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3 font-serif">The Vision</h3>
                    <p className="text-slate-600 leading-relaxed">
                      We envisioned a world where AI could handle the heavy lifting—trend research, competitive analysis, 
                      SEO optimization—while humans focus on strategy and creativity. Not replacing writers, but empowering them.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardContent className="p-8">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <Zap className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3 font-serif">The Solution</h3>
                    <p className="text-slate-600 leading-relaxed">
                      BloggerAI was built from months of testing, iterating, and refining. We've created an autonomous system 
                      that doesn't just generate content—it creates strategic, optimized articles that actually perform.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center font-serif">Our Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-slate-200 bg-white">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 font-serif">User-Centric</h3>
                <p className="text-slate-600 leading-relaxed">
                  Every feature we build starts with understanding our users' pain points. We don't build for technology's sake—we build for real people with real content challenges.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Award className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 font-serif">Quality First</h3>
                <p className="text-slate-600 leading-relaxed">
                  We believe in quality over quantity. Our AI doesn't just generate more content—it generates better content that drives real results for your business.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-8 h-8 text-pink-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 font-serif">Transparency</h3>
                <p className="text-slate-600 leading-relaxed">
                  We're open about how our AI works, what it can and can't do, and how we're constantly improving. No black boxes, no false promises.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-12 font-serif">Built by Creators, for Creators</h2>
          <Card className="border-slate-200 bg-white max-w-md mx-auto">
            <CardContent className="p-8">
              <div className="w-24 h-24 rounded-full mx-auto mb-6 overflow-hidden">
                <img 
                  src="/Team_member_1.jpeg" 
                  alt="Priyam Gupta" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 font-serif">Priyam Gupta</h3>
              <p className="text-blue-600 mb-4">Founder & Creator</p>
              <p className="text-slate-600 text-sm leading-relaxed">
                A passionate developer and content creator who experienced the content creation struggle firsthand. 
                Priyam built BloggerAI to solve his own problems and help fellow creators scale their content production.
              </p>
              <div className="flex justify-center space-x-4 mt-6">
                <a href="https://github.com/PriyamG2508" className="text-slate-400 hover:text-slate-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                <a href="https://www.linkedin.com/in/priyamg2508/" className="text-slate-400 hover:text-slate-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-purple-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6 font-serif">
            Ready to Join Our Story?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Become part of the content creation revolution. Start generating better content in less time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/generate">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-12 py-4 text-lg font-medium">
                Start Creating Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Code className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white font-serif">BloggerAI</h3>
          </div>
          <p className="text-slate-400 mb-4">Automated content generation powered by advanced AI technology.</p>
          <p className="text-sm text-slate-500">© 2025 BloggerAI (Priyam Gupta). All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}