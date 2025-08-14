"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { MessageSquare, TrendingUp, Copy, Download, RotateCcw } from "lucide-react"
import ReactMarkdown from "react-markdown"

// Interface for the topic data structure
interface Topic {
  id: string
  title: string
  subreddit: string
  score: number
  num_comments: number
}

// Type for the application's state machine
type AppState = "topic-selection" | "generating" | "article-ready" | "error"

// Interface for generation progress steps
interface GenerationStep {
  text: string
  progress: number
}

export default function GeneratePage() {
  const [appState, setAppState] = useState<AppState>("topic-selection")
  const [topics, setTopics] = useState<Topic[]>([])
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)
  const [currentStep, setCurrentStep] = useState<GenerationStep>({ text: "", progress: 0 })
  const [finalArticle, setFinalArticle] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string>("")
  
  // Use a ref for the WebSocket to persist across re-renders
  const ws = useRef<WebSocket | null>(null)

  // Fetch topics from the backend when the component mounts
  useEffect(() => {
    fetchTopics()
  }, [])
  
  // Cleanup WebSocket connection on component unmount
  useEffect(() => {
    return () => {
      if (ws.current) {
        ws.current.close()
      }
    }
  }, [])

  const fetchTopics = async () => {
    try {
      setLoading(true);
      // CORRECT: Use fetch to get topics from your backend API.
      const response = await fetch("https://blogging-agent-backend.onrender.com/api/topics");
      
      if (!response.ok) {
        throw new Error("Failed to fetch topics from backend.");
      }
      const data = await response.json();
      setTopics(data.topics);
    } catch (error) {
      console.error("Failed to fetch topics:", error);
      setAppState("error");
      setErrorMessage("Could not connect to the backend. Please ensure it's running and refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  const handleTopicSelect = (topic: Topic) => {
    setSelectedTopic(topic)
    setAppState("generating")
    setErrorMessage("") // Clear previous errors

    ws.current = new WebSocket("wss://blogging-agent-backend.onrender.com/ws/generate");

    ws.current.onopen = () => {
      console.log("WebSocket connected")
      // Send the selected topic to the backend
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
      
      // Update progress
      setCurrentStep({ text: data.text, progress: data.progress })

      // If the article is ready, set it and change state
      if (data.article) {
        setFinalArticle(data.article)
        setAppState("article-ready")
        ws.current?.close()
      }
    }

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error)
      setErrorMessage("A WebSocket connection error occurred. Please check the backend console.")
      setAppState("error")
    }
    
    ws.current.onclose = () => {
        console.log("WebSocket disconnected")
    }
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
    a.download = `${selectedTopic?.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.md`
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
    fetchTopics() // Re-fetch topics
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-black font-serif">BloggerAI <span className="text-blue-600">Agent Workspace</span></h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Topic Selection State */}
        {appState === "topic-selection" && (
          <div>
            <h2 className="text-3xl font-bold text-black mb-8 text-center font-serif">
              Step 1: Choose a <span className="text-blue-600">Trending Topic</span> to Begin
            </h2>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-slate-600 mt-4">Loading trending topics...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topics.map((topic) => (
                  <Card
                    key={topic.id}
                    className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-slate-200 bg-white"
                    onClick={() => handleTopicSelect(topic)}
                  >
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-black mb-3 line-clamp-3 leading-tight">{topic.title}</h3>
                      <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                        <span className="bg-green-800 text-white px-2 py-1 rounded-full text-xs">r/{topic.subreddit}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-purple-600">
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="w-4 h-4 text-blue-600" />
                          <span>{topic.score.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="w-4 h-4 text-blue-600" />
                          <span>{topic.num_comments}</span>
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
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-black mb-8 font-serif">
              Generating article for: "{selectedTopic.title}"
            </h2>

            <div className="bg-white rounded-lg p-8 shadow-sm border border-slate-200">
              <Progress value={currentStep.progress} className="w-full mb-6 h-3" />
              <p className="text-lg text-slate-600 mb-4">{currentStep.text}</p>
              <div className="text-sm text-slate-500">{currentStep.progress}% complete</div>
            </div>
          </div>
        )}

        {/* Article Ready State */}
        {appState === "article-ready" && selectedTopic && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <h2 className="text-2xl font-bold text-black font-serif">
                Article Generated <span className="text-blue-600">Successfully!</span>
              </h2>
              <div className="flex flex-wrap gap-3">
                <Button onClick={handleCopyArticle} variant="outline" className="flex items-center space-x-2">
                  <Copy className="w-4 h-4" />
                  <span>Copy Article</span>
                </Button>
                <Button onClick={handleDownloadMarkdown} variant="outline" className="flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Download .md</span>
                </Button>
                <Button onClick={handleStartOver} className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2">
                  <RotateCcw className="w-4 h-4" />
                  <span>Generate Another Article</span>
                </Button>
              </div>
            </div>

            <Card className="border-slate-200">
              <CardContent className="p-8">
                <div className="prose prose-slate max-w-none">
                   <ReactMarkdown>{finalArticle}</ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Error State */}
        {appState === "error" && (
            <div className="max-w-2xl mx-auto text-center">
                 <h2 className="text-2xl font-bold text-red-600 mb-4 font-serif">
                    An Error Occurred
                 </h2>
                 <Card className="border-red-300 bg-red-50">
                    <CardContent className="p-6">
                        <p className="text-red-700">{errorMessage}</p>
                    </CardContent>
                 </Card>
                 <Button onClick={handleStartOver} className="mt-6 bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2 mx-auto">
                    <RotateCcw className="w-4 h-4" />
                    <span>Try Again</span>
                </Button>
            </div>
        )}
      </div>
    </div>
  )
}
