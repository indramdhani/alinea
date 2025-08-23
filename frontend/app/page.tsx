'use client'

import { useState, useEffect } from 'react'
import { Heart, Eye, Share2, RefreshCw } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

interface Article {
  id: string
  title: string
  content: string
  createdAt: string
  likes: number
  views: number
  shares: number
}

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  const fetchRandomArticles = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles/random`)
      const data = await response.json()
      setArticles(data)
    } catch (error) {
      console.error('Error fetching articles:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (articleId: string) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles/${articleId}/like`, {
        method: 'POST'
      })
      setArticles(articles.map(article => 
        article.id === articleId 
          ? { ...article, likes: article.likes + 1 }
          : article
      ))
    } catch (error) {
      console.error('Error liking article:', error)
    }
  }

  const handleShare = async (article: Article) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles/${article.id}/share`, {
        method: 'POST'
      })
      
      if (navigator.share) {
        await navigator.share({
          title: article.title,
          text: article.content.substring(0, 100) + '...',
          url: window.location.href
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        alert('Link copied to clipboard!')
      }
      
      setArticles(articles.map(a => 
        a.id === article.id 
          ? { ...a, shares: a.shares + 1 }
          : a
      ))
    } catch (error) {
      console.error('Error sharing article:', error)
    }
  }

  useEffect(() => {
    fetchRandomArticles()
  }, [])

  return (
    <div className="container max-w-4xl py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Discover Anonymous Stories
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Read random articles, poems, and thoughts shared by anonymous writers from around the world
        </p>
        <Button
          onClick={fetchRandomArticles}
          disabled={loading}
          size="lg"
          className="gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Loading...' : 'Load New Articles'}
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {articles.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  No articles found. Be the first to share your story!
                </p>
              </CardContent>
            </Card>
          ) : (
            articles.map((article) => (
              <Card key={article.id} className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-2xl leading-tight">
                    {article.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {new Date(article.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-gray max-w-none dark:prose-invert">
                    <ReactMarkdown>{article.content}</ReactMarkdown>
                  </div>
                </CardContent>
                <Separator />
                <CardFooter className="flex items-center justify-between py-4">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{article.views}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(article.id)}
                      className="gap-1 text-muted-foreground hover:text-red-500"
                    >
                      <Heart className="w-4 h-4" />
                      <span>{article.likes}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleShare(article)}
                      className="gap-1 text-muted-foreground hover:text-primary"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>{article.shares}</span>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  )
}