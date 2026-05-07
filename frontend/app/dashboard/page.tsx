"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Code, PenTool, FileText, Trash2, Copy, Eye,
  LogOut, User, Plus, Clock, X, Loader2
} from "lucide-react"
import ReactMarkdown from "react-markdown"

interface Article {
  id: string
  title: string
  topic: string
  content: string
  word_count: number
  created_at: string
}

interface UserProfile {
  email: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [articles, setArticles] = useState<Article[]>([])
  const [loadingUser, setLoadingUser] = useState(true)
  const [loadingArticles, setLoadingArticles] = useState(true)
  const [activeView, setActiveView] = useState<"overview" | "generate" | "article">("overview")
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Check authentication on page load
  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      router.push("/login")
      return
    }

    setUser({ email: session.user.email || "" })
    setLoadingUser(false)
    fetchArticles()
  }

  const fetchArticles = async () => {
    setLoadingArticles(true)
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false })

    if (!error && data) {
      setArticles(data)
    }
    setLoadingArticles(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const handleDeleteArticle = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article? This cannot be undone.")) return

    setDeletingId(id)
    const { error } = await supabase.from("articles").delete().eq("id", id)

    if (!error) {
      setArticles(prev => prev.filter(a => a.id !== id))
      if (selectedArticle?.id === id) {
        setSelectedArticle(null)
        setActiveView("overview")
      }
    }
    setDeletingId(null)
  }

  const handleCopyArticle = async (content: string) => {
    await navigator.clipboard.writeText(content)
    alert("Article copied to clipboard!")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    })
  }

  const getUserInitial = () => {
    return user?.email?.charAt(0).toUpperCase() || "U"
  }

  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full hidden md:flex">
        {/* Logo */}
        <div className="p-6 border-b border-slate-200">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Code className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900 font-serif">BloggerAI</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => setActiveView("overview")}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
              activeView === "overview"
                ? "bg-blue-50 text-blue-700"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>My Articles</span>
            {articles.length > 0 && (
              <span className="ml-auto bg-slate-200 text-slate-600 text-xs rounded-full px-2 py-0.5">
                {articles.length}
              </span>
            )}
          </button>

          <Link
            href="/generate"
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Generate Article</span>
          </Link>
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-blue-700 text-sm font-bold">{getUserInitial()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="w-full flex items-center space-x-2 text-slate-600"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 md:ml-64">
        {/* Top bar for mobile */}
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <Code className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900">BloggerAI</span>
          </div>
          <div className="flex items-center space-x-2">
            <Link href="/generate">
              <Button size="sm" className="bg-blue-600 text-white">
                <Plus className="w-4 h-4 mr-1" /> New
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="p-6 lg:p-8">
          {/* Overview — Article List */}
          {activeView === "overview" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 font-serif">My Articles</h1>
                  <p className="text-slate-500 text-sm mt-1">
                    Welcome back, {user?.email?.split("@")[0]}
                  </p>
                </div>
                <Link href="/generate">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Generate Article</span>
                  </Button>
                </Link>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                <Card className="border-slate-200">
                  <CardContent className="p-4">
                    <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">Total Articles</p>
                    <p className="text-3xl font-bold text-slate-900 mt-1">{articles.length}</p>
                  </CardContent>
                </Card>
                <Card className="border-slate-200">
                  <CardContent className="p-4">
                    <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">Total Words</p>
                    <p className="text-3xl font-bold text-slate-900 mt-1">
                      {articles.reduce((sum, a) => sum + (a.word_count || 0), 0).toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-slate-200 col-span-2 md:col-span-1">
                  <CardContent className="p-4">
                    <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">Latest Article</p>
                    <p className="text-sm font-semibold text-slate-900 mt-1 truncate">
                      {articles[0]?.topic || "None yet"}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Articles list */}
              {loadingArticles ? (
                <div className="text-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
                  <p className="text-slate-500 mt-3">Loading your articles...</p>
                </div>
              ) : articles.length === 0 ? (
                // Empty state
                <div className="text-center py-16 bg-white rounded-xl border border-slate-200 border-dashed">
                  <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-700 mb-2">No articles yet</h3>
                  <p className="text-slate-400 mb-6 max-w-sm mx-auto text-sm">
                    Generate your first AI-powered article. Pick a trending topic or enter your own.
                  </p>
                  <Link href="/generate">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Generate First Article
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {articles.map((article) => (
                    <Card
                      key={article.id}
                      className="border-slate-200 bg-white hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-4 sm:p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div
                            className="flex-1 min-w-0 cursor-pointer"
                            onClick={() => {
                              setSelectedArticle(article)
                              setActiveView("article")
                            }}
                          >
                            <h3 className="font-semibold text-slate-900 mb-1 line-clamp-1 hover:text-blue-600 transition-colors">
                              {article.title || article.topic}
                            </h3>
                            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatDate(article.created_at)}
                              </span>
                              <span>{(article.word_count || 0).toLocaleString()} words</span>
                              <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium truncate max-w-32">
                                {article.topic}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-1 flex-shrink-0">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedArticle(article)
                                setActiveView("article")
                              }}
                              title="View article"
                            >
                              <Eye className="w-4 h-4 text-slate-500" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopyArticle(article.content)}
                              title="Copy article"
                            >
                              <Copy className="w-4 h-4 text-slate-500" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteArticle(article.id)}
                              disabled={deletingId === article.id}
                              title="Delete article"
                            >
                              {deletingId === article.id ? (
                                <Loader2 className="w-4 h-4 animate-spin text-red-400" />
                              ) : (
                                <Trash2 className="w-4 h-4 text-red-400" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Article detail view */}
          {activeView === "article" && selectedArticle && (
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveView("overview")}
                  className="flex items-center space-x-2"
                >
                  <X className="w-4 h-4" />
                  <span>Back</span>
                </Button>
                <div className="flex-1" />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyArticle(selectedArticle.content)}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteArticle(selectedArticle.id)}
                  className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>

              <div className="mb-4 flex flex-wrap gap-3 text-sm text-slate-500">
                <span>{formatDate(selectedArticle.created_at)}</span>
                <span>·</span>
                <span>{(selectedArticle.word_count || 0).toLocaleString()} words</span>
                <span>·</span>
                <span>{Math.ceil((selectedArticle.word_count || 0) / 200)} min read</span>
              </div>

              <Card className="border-slate-200">
                <CardContent className="p-6 sm:p-8">
                  <div className="prose prose-slate max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-p:leading-relaxed prose-p:text-slate-700">
                    <ReactMarkdown>{selectedArticle.content}</ReactMarkdown>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}