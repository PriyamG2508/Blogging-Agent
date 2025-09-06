"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, BarChart3, PenTool, Rocket, Users, Star, Zap, Code, Target, Eye, ArrowRight, CheckCircle, TrendingUp, Clock, Shield, Sparkles } from "lucide-react"

export default function LandingPage() {
  const scrollToGenerate = () => {
    window.location.href = "/generate"
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Enhanced Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <Link href="/" className="text-xl font-bold text-slate-900 font-serif">BloggerAI</Link>
            </div>
            
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-slate-600 hover:text-slate-900 transition-colors">Features</Link>
              <Link href="#how-it-works" className="text-slate-600 hover:text-slate-900 transition-colors">How It Works</Link>
              <Link href="#pricing" className="text-slate-600 hover:text-slate-900 transition-colors">Pricing</Link>
              <Link href="/about" className="text-slate-600 hover:text-slate-900 transition-colors">About</Link>
            </div>

            <div className="flex items-center space-x-4">
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
              <Button onClick={scrollToGenerate} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Enhanced Hero Section */}
      <section className="pt-20 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-white to-pink-50/20"></div>
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-100/40 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-pink-100/40 rounded-full blur-3xl animate-pulse delay-700"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 font-serif leading-tight">
              From Research to Ranking<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                in 10 Minutes
              </span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-4xl mx-auto leading-relaxed">
              The world's first autonomous AI content agent that researches viral topics, analyzes top competitors, 
              writes publication-ready articles, and optimizes while you sleep. No prompts. No editing. Just results.
            </p>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                onClick={scrollToGenerate}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 text-lg rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Generate My First Article
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg border-slate-300">
                Watch 2-min Demo
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-slate-500">
              <div className="flex items-center">
                <div className="flex -space-x-2 mr-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full border-2 border-white"></div>
                  <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full border-2 border-white"></div>
                  <div className="w-6 h-6 bg-gradient-to-r from-pink-400 to-red-500 rounded-full border-2 border-white"></div>
                </div>
                <span>Trusted by 500+ creators</span>
              </div>
              <div className="flex items-center">
                <span className="text-yellow-500 mr-1">★★★★★</span>
                <span>4.9/5 rating</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                <span>No credit card required</span>
              </div>
            </div>
          </div>

          {/* Enhanced Process Flow */}
          <div className="flex justify-center mb-20">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-200/50 via-blue-200/50 to-green-200/50 rounded-full blur-xl"></div>
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20">
                <div className="flex items-center space-x-6">
                  <div className="flex flex-col items-center group">
                    <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Search className="w-8 h-8 text-white" />
                    </div>
                    <div className="mt-3 text-center">
                      <div className="text-sm font-semibold text-slate-800">Research</div>
                      <div className="text-xs text-slate-500">Trending Topics</div>
                    </div>
                  </div>

                  <div className="w-12 h-1 bg-gradient-to-r from-pink-400 to-blue-400 rounded-full"></div>

                  <div className="flex flex-col items-center group">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <BarChart3 className="w-8 h-8 text-white" />
                    </div>
                    <div className="mt-3 text-center">
                      <div className="text-sm font-semibold text-slate-800">Analyze</div>
                      <div className="text-xs text-slate-500">Competitor Gaps</div>
                    </div>
                  </div>

                  <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-green-400 rounded-full"></div>

                  <div className="flex flex-col items-center group">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <PenTool className="w-8 h-8 text-white" />
                    </div>
                    <div className="mt-3 text-center">
                      <div className="text-sm font-semibold text-slate-800">Generate</div>
                      <div className="text-xs text-slate-500">SEO-Optimized</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-slate-900 mb-4 font-serif">Why Choose BloggerAI?</h3>
            <p className="text-lg text-slate-600">Empowering content creators with intelligent automation</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <Card className="border-slate-200 bg-white hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-pink-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Eye className="w-7 h-7 text-pink-600" />
                </div>
                <h4 className="text-2xl font-bold text-slate-900 mb-4 font-serif text-center">The Big Picture</h4>
                <p className="text-slate-600 text-center leading-relaxed">
                  Every business knows content drives growth, but 90% struggle with consistency. We're solving the biggest bottleneck 
                  in digital marketing: scaling quality content production without burning out your team or budget.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Target className="w-7 h-7 text-green-600" />
                </div>
                <h4 className="text-2xl font-bold text-slate-900 mb-4 font-serif text-center">Our Promise</h4>
                <p className="text-slate-600 text-center leading-relaxed">
                  Replace your content team's 40-hour research-to-publish cycle with a 10-minute AI process that delivers 
                  higher-quality, better-optimized articles that actually rank and convert.
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
                <div className="text-3xl font-bold text-slate-900 mb-2 font-serif">500+</div>
                <div className="text-slate-600">Happy Creators</div>
              </CardContent>
            </Card>
            <Card className="border-slate-200 bg-white hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-14 h-14 bg-pink-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Star className="w-7 h-7 text-pink-600" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-2 font-serif">95%</div>
                <div className="text-slate-600">Success Rate</div>
              </CardContent>
            </Card>
            <Card className="border-slate-200 bg-white hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-7 h-7 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-2 font-serif">3x</div>
                <div className="text-slate-600">Faster Creation</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4 font-serif">Your AI Content Factory</h2>
            <p className="text-xl text-slate-600">Four simple steps to perfect content</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-slate-200 bg-white hover:shadow-lg transition-all p-2">
              <CardContent className="p-8">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-pink-600 rounded-xl flex items-center justify-center">
                      <Search className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 font-serif mb-3">Trend Intelligence Engine</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Continuously monitors data sources including social signals, news cycles, and search volume spikes 
                      to identify topics gaining momentum before competitors notice them.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white hover:shadow-lg transition-all p-2">
              <CardContent className="p-8">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center">
                      <BarChart3 className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 font-serif mb-3">Competitive Gap Analysis</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Deep-analyzes top-ranking articles to identify missing angles, unanswered questions, and content gaps 
                      that present immediate ranking opportunities in your niche.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white hover:shadow-lg transition-all p-2">
              <CardContent className="p-8">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center">
                      <PenTool className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 font-serif mb-3">Expert-Level Writing</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Advanced language models trained on high-performing content create publication-ready articles 
                      with perfect structure, engaging hooks, and compelling calls-to-action.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white hover:shadow-lg transition-all p-2">
              <CardContent className="p-8">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center">
                      <Rocket className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 font-serif mb-3">SEO Optimization Suite</h3>
                    <p className="text-slate-600 leading-relaxed">
                      Automatically optimizes titles, meta descriptions, headers, and keyword density while ensuring 
                      perfect readability scores and technical SEO compliance for maximum visibility.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4 font-serif">Simple, Transparent Pricing</h2>
            <p className="text-xl text-slate-600">Start free, scale as you grow</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <Card className="border-slate-200 bg-white relative">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Starter</h3>
                  <div className="text-3xl font-bold text-slate-900">$0</div>
                  <div className="text-slate-500">Forever free</div>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-slate-600">5 articles per month</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-slate-600">Basic SEO optimization</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-slate-600">Email support</span>
                  </li>
                </ul>
                <Button onClick={scrollToGenerate} className="w-full bg-slate-600 hover:bg-slate-700">
                  Get Started Free
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="border-blue-200 bg-white relative shadow-lg">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">Most Popular</span>
              </div>
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Professional</h3>
                  <div className="text-3xl font-bold text-slate-900">$29</div>
                  <div className="text-slate-500">per month</div>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-slate-600">50 articles per month</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-slate-600">Advanced SEO & analytics</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-slate-600">Priority support</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-slate-600">Content calendar</span>
                  </li>
                </ul>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Start Free Trial
                </Button>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="border-slate-200 bg-white relative">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Enterprise</h3>
                  <div className="text-3xl font-bold text-slate-900">Custom</div>
                  <div className="text-slate-500">Let's talk</div>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-slate-600">Unlimited articles</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-slate-600">Custom integrations</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-slate-600">Dedicated support</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-slate-600">Team collaboration</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full border-slate-300">
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-purple-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6 font-serif">
            Ready to Transform Your Content Strategy?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join thousands of creators who've already automated their content creation and boosted their rankings.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={scrollToGenerate}
              size="lg" 
              className="bg-white text-blue-600 hover:bg-blue-50 px-12 py-4 text-lg font-medium"
            >
              Start Creating Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-slate-900 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Code className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white font-serif">BloggerAI</h3>
              </div>
              <p className="text-sm text-slate-400 mb-4">Automated content generation powered by advanced AI technology.</p>
              <div className="flex space-x-4">
                <a href="https://x.com/_priyam_2003" className="text-slate-400 hover:text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="https://www.linkedin.com/in/priyamg2508/" className="text-slate-400 hover:text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="https://github.com/PriyamG2508" className="text-slate-400 hover:text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#features" className="text-slate-400 hover:text-white">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#how-it-works" className="text-slate-400 hover:text-white">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/generate" className="text-slate-400 hover:text-white">
                    Try Now
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="text-slate-400 hover:text-white">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="text-slate-400 hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-slate-400 hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-slate-400 hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/help" className="text-slate-400 hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-slate-400 hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-slate-400 hover:text-white">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-slate-400">© 2025 BloggerAI (Priyam Gupta). All rights reserved.</p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="text-sm text-slate-400">Made with</span>
              <span className="text-red-500">♥</span>
              <span className="text-sm text-slate-400">for content creators</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
