"use client"

import { supabase } from "@/lib/supabase"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { MessageSquare, TrendingUp, Copy, Download, RotateCcw, ArrowLeft, PenTool, AlertCircle } from "lucide-react"
import ReactMarkdown from "react-markdown"

interface Topic {
  id: string
  title: string
  subreddit: string
  score: number
  num_comments: number
}

type AppState = "topic-selection" | "generating" | "article-ready" | "error"

interface GenerationStep {
  text: string
  progress: number
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://blogging-agent-backend.onrender.com"

export default function GeneratePage() {
  const [appState, setAppState] = useState<AppState>("topic-selection")
  const [topics, setTopics] = useState<Topic[]>([])
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)
  const [currentStep, setCurrentStep] = useState<GenerationStep>({ text: "", progress: 0 })
  const [finalArticle, setFinalArticle] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [customTopic, setCustomTopic] = useState<string>("")
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [backendSlow, setBackendSlow] = useState(false)

  const ws = useRef<WebSocket | null>(null)

  useEffect(() => {
    fetchTopics()
  }, [])

  useEffect(() => {
    return () => {
      if (ws.current) {
        ws.current.close()
      }
    }
  }, [])

  const fetchTopics = async () => {
    try {
      setLoading(true)
      setBackendSlow(false)

      // Show slow backend warning after 5 seconds
      const slowTimer = setTimeout(() => setBackendSlow(true), 5000)

      const response = await fetch(`${BACKEND_URL}/api/topics`)

      clearTimeout(slowTimer)
      setBackendSlow(false)

      if (!response.ok) {
        throw new Error("Failed to fetch topics from backend.")
      }
      const data = await response.json()
      setTopics(data.topics || [])
    } catch (error) {
      console.error("Failed to fetch topics:", error)
      setAppState("error")
      setErrorMessage("Could not connect to the backend. The server may be waking up — please wait 30 seconds and try again.")
    } finally {
      setLoading(false)
    }
  }

  const startGeneration = (topic: Topic) => {
    setSelectedTopic(topic)
    setAppState("generating")
    setErrorMessage("")

    const wsUrl = BACKEND_URL.replace("https://", "wss://").replace("http://", "ws://")
    ws.current = new WebSocket(`${wsUrl}/ws/generate`)

    ws.current.onopen = () => {
      console.log("WebSocket connected")
      ws.current?.send(JSON.stringify(topic))
    }

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data)

      if (data.error) {
        console.error("Error from backend:", data.error)
        setErrorMessage(data.error)
        setAppState("error")
        ws.current?.close()
        return
      }

      setCurrentStep({ text: data.text, progress: data.progress })

      if (data.article) {
        setFinalArticle(data.article)
        setAppState("article-ready")
        ws.current?.close()
      }
    }

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error)
      setErrorMessage("A connection error occurred. Please check your internet connection and try again.")
      setAppState("error")
    }

    ws.current.onclose = () => {
      console.log("WebSocket disconnected")
    }
  }

  const handleTopicSelect = (topic: Topic) => {
    startGeneration(topic)
  }

  const handleCustomTopicSubmit = () => {
    if (!customTopic.trim()) return

    const topic: Topic = {
      id: "custom-" + Date.now(),
      title: customTopic.trim(),
      subreddit: "custom",
      score: 0,
      num_comments: 0,
    }
    setCustomTopic("")
    setShowCustomInput(false)
    startGeneration(topic)
  }

  const handleCopyArticle = async () => {
    try {
      await navigator.clipboard.writeText(finalArticle)
      alert("Article copied to clipboard!")
    } catch (error) {
      console.error("Failed to copy article:", error)
    }
  }

  const handleDownloadMarkdown = () => {
    const blob = new Blob([finalArticle], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${selectedTopic?.title.replace(/[^a-z0-9]/gi, "_").toLowerCase() || "article"}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleStartOver = () => {
    setAppState("topic-selection")
    setSelectedTopic(null)
    setCurrentStep({ text: "", progress: 0 })
    setFinalArticle("")
    setErrorMessage("")
    if (topics.length === 0) {
      fetchTopics()
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-black font-serif">
              BloggerAI <span className="text-blue-600">Workspace</span>
            </h1>
          </div>
          {appState === "topic-selection" && !loading && (
            <Button
              onClick={() => setShowCustomInput(!showCustomInput)}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <PenTool className="w-4 h-4" />
              <span>Custom Topic</span>
            </Button>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Topic Selection State */}
        {appState === "topic-selection" && (
          <div>
            {/* Custom Topic Input */}
            {showCustomInput && (
              <Card className="border-blue-200 bg-blue-50 mb-8">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Enter Your Own Topic</h3>
                  <p className="text-slate-600 text-sm mb-4">
                    Type any topic you want — the AI will research and write a full article about it.
                  </p>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={customTopic}
                      onChange={(e) => setCustomTopic(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleCustomTopicSubmit()}
                      placeholder="e.g. The future of electric vehicles in India"
                      className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                      maxLength={200}
                    />
                    <Button
                      onClick={handleCustomTopicSubmit}
                      disabled={!customTopic.trim()}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Generate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <h2 className="text-3xl font-bold text-black mb-2 text-center font-serif">
              Choose a <span className="text-blue-600">Trending Topic</span>
            </h2>
            <p className="text-center text-slate-500 mb-8 text-sm">
              Select from today's trending topics, or click "Custom Topic" above to write about anything.
            </p>

            {/* Cold start warning */}
            {backendSlow && (
              <Card className="border-yellow-200 bg-yellow-50 mb-6">
                <CardContent className="p-4 flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-yellow-800 font-medium text-sm">Backend is waking up</p>
                    <p className="text-yellow-700 text-sm">
                      The server goes to sleep when unused. It's waking up now — this usually takes 20-40 seconds. Please wait!
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {loading ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-slate-600 mt-4 font-medium">Fetching trending topics...</p>
                <p className="text-slate-400 text-sm mt-2">This may take a moment if the server is starting up</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {topics.map((topic) => (
                  <Card
                    key={topic.id}
                    className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-slate-200 bg-white"
                    onClick={() => handleTopicSelect(topic)}
                  >
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-black mb-3 line-clamp-3 leading-tight text-sm">{topic.title}</h3>
                      <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                        <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full text-xs font-medium">
                          r/{topic.subreddit}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-1 text-slate-500">
                          <TrendingUp className="w-4 h-4 text-blue-500" />
                          <span>{topic.score.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-slate-500">
                          <MessageSquare className="w-4 h-4 text-blue-500" />
                          <span>{topic.num_comments.toLocaleString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Generation in Progress State */}
        {appState === "generating" && selectedTopic && (
          <div className="max-w-2xl mx-auto text-center py-8">
            <h2 className="text-2xl font-bold text-black mb-2 font-serif">
              Generating Article
            </h2>
            <p className="text-slate-500 mb-8 text-sm line-clamp-2">"{selectedTopic.title}"</p>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
              <Progress value={currentStep.progress} className="w-full mb-6 h-3" />

              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <p className="text-lg text-slate-700 font-medium">{currentStep.text || "Starting up..."}</p>
              </div>

              <div className="text-sm text-slate-400">{currentStep.progress}% complete</div>

              <div className="mt-6 bg-blue-50 rounded-lg p-4 text-left">
                <p className="text-blue-800 text-sm font-medium mb-1">What's happening?</p>
                <p className="text-blue-700 text-xs">
                  Our AI is researching the web, analyzing competitor content, writing your article, and optimizing it for SEO. This takes 2-3 minutes for best results.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Article Ready State */}
        {appState === "article-ready" && selectedTopic && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-black font-serif">
                  Article <span className="text-blue-600">Generated!</span>
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  {finalArticle.split(/\s+/).length} words · {Math.ceil(finalArticle.split(/\s+/).length / 200)} min read
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button onClick={handleCopyArticle} variant="outline" size="sm" className="flex items-center space-x-2">
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </Button>
                <Button onClick={handleDownloadMarkdown} variant="outline" size="sm" className="flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Download .md</span>
                </Button>
                <Button
                  onClick={handleStartOver}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>New Article</span>
                </Button>
              </div>
            </div>

            <Card className="border-slate-200">
              <CardContent className="p-6 sm:p-8">
                <div className="prose prose-slate max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:leading-relaxed prose-p:text-slate-700">
                  <ReactMarkdown>{finalArticle}</ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Error State */}
        {appState === "error" && (
          <div className="max-w-2xl mx-auto text-center py-8">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-600 mb-4 font-serif">
              Something went wrong
            </h2>
            <Card className="border-red-200 bg-red-50 mb-6">
              <CardContent className="p-6">
                <p className="text-red-700 text-sm">{errorMessage}</p>
              </CardContent>
            </Card>
            <Button
              onClick={handleStartOver}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2 mx-auto"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Try Again</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}