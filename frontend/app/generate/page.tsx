"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { MessageSquare, TrendingUp, Copy, Download, RotateCcw } from "lucide-react"
import ReactMarkdown from "react-markdown"

interface Topic {
  id: string
  title: string
  subreddit: string
  score: number
  num_comments: number
}

type AppState = "topic-selection" | "generating" | "article-ready"

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

  const generationSteps: GenerationStep[] = [
    { text: "Analyzing content gaps...", progress: 25 },
    { text: "Generating strategic outline...", progress: 50 },
    { text: "Writing first draft...", progress: 75 },
    { text: "Optimizing for SEO & finalizing...", progress: 100 },
  ]

  // Fetch topics on component mount
  useEffect(() => {
    fetchTopics()
  }, [])

  const fetchTopics = async () => {
    try {
      setLoading(true)
      // Mock API call - replace with actual endpoint
      const mockTopics: Topic[] = [
        {
          id: "1",
          title: "The Future of AI in Web Development: What Developers Need to Know",
          subreddit: "webdev",
          score: 1247,
          num_comments: 89,
        },
        {
          id: "2",
          title: "Why TypeScript is Becoming the Standard for Large-Scale Applications",
          subreddit: "typescript",
          score: 892,
          num_comments: 156,
        },
        {
          id: "3",
          title: "Next.js 15: Revolutionary Changes That Will Transform React Development",
          subreddit: "nextjs",
          score: 2103,
          num_comments: 234,
        },
        {
          id: "4",
          title: "The Rise of Edge Computing: How It's Changing Cloud Architecture",
          subreddit: "cloudcomputing",
          score: 756,
          num_comments: 67,
        },
        {
          id: "5",
          title: "Sustainable Software Development: Green Coding Practices for 2024",
          subreddit: "programming",
          score: 1456,
          num_comments: 198,
        },
        {
          id: "6",
          title: "Cybersecurity Trends: Protecting Applications in the AI Era",
          subreddit: "cybersecurity",
          score: 934,
          num_comments: 112,
        },
      ]

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setTopics(mockTopics)
    } catch (error) {
      console.error("Failed to fetch topics:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleTopicSelect = async (topic: Topic) => {
    setSelectedTopic(topic)
    setAppState("generating")

    // Simulate the generation process
    for (let i = 0; i < generationSteps.length; i++) {
      setCurrentStep(generationSteps[i])
      await new Promise((resolve) => setTimeout(resolve, 2000))
    }

    // Mock final article
    const mockArticle = `# ${topic.title}

## Introduction

In today's rapidly evolving technological landscape, understanding the implications and opportunities presented by emerging trends has become crucial for professionals across all industries. This comprehensive analysis explores the key factors driving change and provides actionable insights for navigating the future.

## Key Insights

### 1. Market Dynamics
The current market shows unprecedented growth in adoption rates, with early indicators suggesting a fundamental shift in how businesses approach technology integration.

### 2. Technical Considerations
From an implementation perspective, several critical factors must be considered:
- **Scalability**: Ensuring solutions can grow with demand
- **Security**: Maintaining robust protection against emerging threats  
- **Performance**: Optimizing for speed and efficiency
- **Maintainability**: Building sustainable, long-term solutions

### 3. Industry Impact
The ripple effects across different sectors demonstrate the far-reaching implications of these technological advances.

## Best Practices

1. **Stay Informed**: Continuously monitor industry developments
2. **Experiment Early**: Test new technologies in controlled environments
3. **Build Incrementally**: Implement changes gradually to minimize risk
4. **Focus on Fundamentals**: Maintain strong foundational knowledge

## Looking Forward

As we move into the next phase of technological evolution, the organizations and individuals who adapt quickly while maintaining focus on core principles will be best positioned for success.

## Conclusion

The landscape continues to evolve at an accelerating pace. By understanding these trends and preparing accordingly, we can harness the opportunities while mitigating potential challenges.

---

*This article was generated by BloggerAI's autonomous content creation system, optimized for SEO and reader engagement.*`

    setFinalArticle(mockArticle)
    setAppState("article-ready")
  }

  const handleCopyArticle = async () => {
    try {
      await navigator.clipboard.writeText(finalArticle)
      // You could add a toast notification here
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
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-black font-serif">BloggerAI Agent Workspace</h1>
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
                        <span className="bg-black text-white px-2 py-1 rounded-full">r/{topic.subreddit}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-slate-600">
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
                <Button
                  onClick={handleCopyArticle}
                  variant="outline"
                  className="flex items-center space-x-2 bg-transparent border-black text-black hover:bg-black hover:text-white"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy Article</span>
                </Button>
                <Button
                  onClick={handleDownloadMarkdown}
                  variant="outline"
                  className="flex items-center space-x-2 bg-transparent border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                >
                  <Download className="w-4 h-4" />
                  <span>Download .md</span>
                </Button>
                <Button
                  onClick={handleStartOver}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Generate Another Article</span>
                </Button>
              </div>
            </div>

            <Card className="border-slate-200">
              <CardContent className="p-8">
                <div className="prose prose-slate max-w-none">
                  <ReactMarkdown
                    components={{
                      h1: ({ children }) => (
                        <h1 className="text-3xl font-bold text-black mb-6 font-serif">{children}</h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-2xl font-bold text-black mt-8 mb-4 font-serif">{children}</h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-xl font-bold text-black mt-6 mb-3 font-serif">{children}</h3>
                      ),
                      p: ({ children }) => <p className="text-slate-700 mb-4 leading-relaxed">{children}</p>,
                      ul: ({ children }) => (
                        <ul className="list-disc list-inside text-slate-700 mb-4 space-y-2">{children}</ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal list-inside text-slate-700 mb-4 space-y-2">{children}</ol>
                      ),
                      strong: ({ children }) => <strong className="font-semibold text-black">{children}</strong>,
                      em: ({ children }) => <em className="italic text-slate-700">{children}</em>,
                      hr: () => <hr className="border-slate-200 my-8" />,
                    }}
                  >
                    {finalArticle}
                  </ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
