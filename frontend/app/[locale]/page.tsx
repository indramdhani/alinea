'use client'

import { useState, useEffect } from 'react'
import { Heart, Eye, Share2, RefreshCw } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Locale } from '@/lib/i18n'

interface Article {
  id: string
  title: string
  content: string
  tags: string[]
  createdAt: string
  likes: number
  views: number
  shares: number
}

async function getMessages(locale: Locale) {
  try {
    return (await import(`../../messages/${locale}.json`)).default
  } catch (error) {
    return (await import(`../../messages/en.json`)).default
  }
}

export default function HomePage({ params: { locale } }: { params: { locale: Locale } }) {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [messages, setMessages] = useState<any>(null)

  useEffect(() => {
    getMessages(locale).then(setMessages)
  }, [locale])

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

  if (!messages) {
    return <div className="flex justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          {messages.home.title}
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          {messages.home.subtitle}
        </p>
        <Button
          onClick={fetchRandomArticles}
          disabled={loading}
          size="lg"
          className="gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? messages.home.loading : messages.home.loadArticles}
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
                  {messages.home.noArticles}
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
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      {new Date(article.createdAt).toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    {article.tags && article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {article.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {article.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{article.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <ReactMarkdown>{article.content}</ReactMarkdown>
                  </div>
                </CardContent>
                <Separator />
                <CardFooter className="flex items-center justify-between py-4">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{article.views} {messages.home.views}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(article.id)}
                      className="gap-1 text-muted-foreground hover:text-foreground"
                    >
                      <Heart className="w-4 h-4" />
                      <span>{article.likes} {messages.home.likes}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleShare(article)}
                      className="gap-1 text-muted-foreground hover:text-foreground"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>{article.shares} {messages.home.shares}</span>
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