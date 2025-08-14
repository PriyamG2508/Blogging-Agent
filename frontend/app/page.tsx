"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, BarChart3, PenTool, Rocket, Users, Star, Zap, Code, Target, Eye } from "lucide-react"

export default function LandingPage() {
  const scrollToGenerate = () => {
    window.location.href = "/generate"
  }

  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-900 font-serif">BloggerAI</h1>
            </div>
            <div className="flex items-center">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="bg-transparent border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                <a
                  href="https://github.com/PriyamG2508"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  <span>GitHub</span>
                </a>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 font-serif leading-tight">
              Generate SEO-Ready Blog Posts <span className="text-blue-600">in Minutes, Not Hours</span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-4xl mx-auto leading-relaxed">
              Our autonomous AI agent discovers trending topics, analyzes content gaps, writes compelling drafts, and
              optimizes for search engines, so you don't have to.
            </p>
          </div>

          <div className="flex justify-center mb-20">
            <div className="relative w-96 h-24">
              <div className="absolute inset-0 flex items-center justify-center space-x-4">
                <div className="w-3 h-3 bg-pink-600 rounded-full animate-pulse"></div>
                <div className="w-16 h-0.5 bg-pink-300"></div>
                <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse delay-300"></div>
                <div className="w-16 h-0.5 bg-blue-300"></div>
                <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse delay-700"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-slate-900 mb-4 font-serif">Our Purpose</h3>
            <p className="text-lg text-slate-600">Empowering content creators with intelligent automation</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <Card className="border-slate-200 bg-white hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-pink-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Eye className="w-7 h-7 text-pink-600" />
                </div>
                <h4 className="text-2xl font-bold text-slate-900 mb-4 font-serif text-center">Our Vision</h4>
                <p className="text-slate-600 text-center leading-relaxed">
                  To democratize high-quality content creation by making professional-grade writing accessible to
                  everyone, regardless of their writing experience or technical background.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Target className="w-7 h-7 text-green-600" />
                </div>
                <h4 className="text-2xl font-bold text-slate-900 mb-4 font-serif text-center">Our Mission</h4>
                <p className="text-slate-600 text-center leading-relaxed">
                  To eliminate the time-consuming aspects of content research and writing while maintaining
                  authenticity, allowing creators to focus on strategy and creativity.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-slate-200 bg-white hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-7 h-7 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-2 font-serif">1,000+</div>
                <div className="text-slate-600">Articles Generated</div>
              </CardContent>
            </Card>
            <Card className="border-slate-200 bg-white hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-14 h-14 bg-pink-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Star className="w-7 h-7 text-pink-600" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-2 font-serif">95% Satisfaction</div>
                <div className="text-slate-600">User Rating</div>
              </CardContent>
            </Card>
            <Card className="border-slate-200 bg-white hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-7 h-7 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-2 font-serif">3x Faster</div>
                <div className="text-slate-600">Content Creation</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4 font-serif">Your Content on Autopilot</h2>
            <p className="text-xl text-slate-600">Four simple steps to perfect content</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Step 1 - Pink */}
            <Card className="border-slate-200 bg-white hover:shadow-lg transition-all p-2">
              <CardContent className="p-8">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-pink-600 rounded-xl flex items-center justify-center">
                      <Search className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 font-serif mb-3">Discover Trends</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Our agent scans the web for hot topics with high engagement, so you always write about what's
                      relevant now.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 2 - Blue */}
            <Card className="border-slate-200 bg-white hover:shadow-lg transition-all p-2">
              <CardContent className="p-8">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center">
                      <BarChart3 className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 font-serif mb-3">Find the Gaps</h3>
                    <p className="text-slate-600 leading-relaxed">
                      It analyzes top-ranking articles to find unanswered questions and missed opportunities, ensuring
                      your content is unique.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 3 - Green */}
            <Card className="border-slate-200 bg-white hover:shadow-lg transition-all p-2">
              <CardContent className="p-8">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center">
                      <PenTool className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 font-serif mb-3">Write the Draft</h3>
                    <p className="text-slate-600 leading-relaxed">
                      A world-class writing model crafts a complete, high-quality article based on a strategic outline.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 4 - Blue */}
            <Card className="border-slate-200 bg-white hover:shadow-lg transition-all p-2">
              <CardContent className="p-8">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center">
                      <Rocket className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 font-serif mb-3">Optimize & Polish</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Finally, the draft is rewritten to meet technical SEO requirements for maximum visibility.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-6 font-serif">
            Ready to Transform Your Content Creation?
          </h2>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            Join content creators who are already saving hours every week with AI-powered blog generation.
          </p>
          <Button
            onClick={scrollToGenerate}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 text-lg rounded-lg font-medium"
          >
            Try Now for Free
          </Button>
        </div>
      </section>

      <footer className="bg-slate-900 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Code className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white font-serif">BloggerAI</h3>
              </div>
              <p className="text-sm text-slate-400">Automated content generation powered by advanced AI technology.</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-slate-400 hover:text-white">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-slate-400 hover:text-white">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/generate" className="text-slate-400 hover:text-white">
                    Try Now
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-slate-400 hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-slate-400 hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-slate-400 hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center">
            <p className="text-sm text-slate-400">© 2024 BloggerAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
