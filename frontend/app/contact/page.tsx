"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Code, ArrowLeft, Mail, MessageSquare, Clock, MapPin, Phone, Send } from "lucide-react"
import { useState } from "react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    alert('Thank you for your message! We\'ll get back to you soon.')
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

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
            Get in <span className="text-blue-600">Touch</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Have questions about BloggerAI? Need help with your content strategy? We're here to help you succeed.
            Reach out and let's start a conversation.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="border-slate-200 bg-white hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 font-serif">Email Us</h3>
                <p className="text-slate-600 mb-4">Send us an email and we'll respond within 24 hours.</p>
                <a href="mailto:hello@bloggerai.com" className="text-blue-600 hover:text-blue-700 font-medium">
                  priyamgupta2508@gmail.com
                </a>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <MessageSquare className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 font-serif">Live Chat</h3>
                <p className="text-slate-600 mb-4">Chat with our support team in realtime.</p>
                <Button className="bg-green-600 hover:bg-green-700">Coming Soon</Button>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Clock className="w-8 h-8 text-pink-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 font-serif">Response Time</h3>
                <p className="text-slate-600 mb-4">We typically respond within 2-4 hours during business hours.</p>
                <span className="text-pink-600 font-medium">Mon-Fri 9AM-6PM EST</span>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4 font-serif">Send Us a Message</h2>
            <p className="text-lg text-slate-600">Fill out the form below and we'll get back to you as soon as possible.</p>
          </div>

          <Card className="border-slate-200 bg-white shadow-lg">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-slate-700 mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="technical">Technical Support</option>
                    <option value="billing">Billing Question</option>
                    <option value="feature">Feature Request</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <div className="text-center">
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 text-lg font-medium"
                  >
                    Send Message
                    <Send className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4 font-serif">Frequently Asked Questions</h2>
            <p className="text-lg text-slate-600">Quick answers to common questions about BloggerAI.</p>
          </div>

          <div className="space-y-6">
            <Card className="border-slate-200 bg-white">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">How does BloggerAI generate content?</h3>
                <p className="text-slate-600">
                  BloggerAI uses advanced AI models to research trending topics, analyze competitor content, and generate 
                  SEO-optimized articles tailored to your niche and audience.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Is there a free trial available?</h3>
                <p className="text-slate-600">
                  Yes! Our Starter plan is completely free forever and includes 5 articles per month with basic 
                  SEO optimization and email support.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Can I customize the generated content?</h3>
                <p className="text-slate-600">
                  Absolutely! All generated content can be edited and customized to match your brand voice, 
                  style preferences, and specific requirements.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">What kind of support do you offer?</h3>
                <p className="text-slate-600">
                  We offer email support for all users, priority support for Pro users, and dedicated support 
                  for Enterprise customers. Response times are typically 2-4 hours during business hours.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-8 text-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-3xl font-bold mb-4 font-serif">Ready to Get Started?</h3>
                <p className="text-blue-100 mb-6">
                  Join community of creators who are already using BloggerAI to scale their content production 
                  and boost their rankings.
                </p>
                <Link href="/generate">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                    Start Creating Now
                  </Button>
                </Link>
              </div>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="w-5 h-5 mr-3 text-blue-200" />
                  <span className="text-blue-100">priyamgupta2508@gmail.com</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-3 text-blue-200" />
                  <span className="text-blue-100">Mon-Fri 9AM-6PM EST</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-3 text-blue-200" />
                  <span className="text-blue-100">Bareilly, India.</span>
                </div>
              </div>
            </div>
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