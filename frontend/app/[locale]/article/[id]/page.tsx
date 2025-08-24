'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Heart, Eye, Share2, ArrowLeft, Calendar, Tag } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { ShareButtons } from '@/components/share-buttons'
import { Locale } from '@/lib/i18n'

// Enable dynamic rendering for this page
export const dynamic = 'force-dynamic'

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
    return (await import(`../../../../messages/${locale}.json`)).default
  } catch (error) {
    return (await import(`../../../../messages/en.json`)).default
  }
}

export default function ArticlePage({ 
  params: { locale, id } 
}: { 
  params: { locale: Locale; id: string } 
}) {
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [messages, setMessages] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    getMessages(locale).then(setMessages)
  }, [locale])

  const fetchArticle = async () => {
    setLoading(true)
    try {
      // Since we don't have a single article endpoint, we'll fetch random articles
      // and find the one with matching ID, or create a mock endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles/random`)
      const articles = await response.json()
      const foundArticle = articles.find((a: Article) => a.id === id)
      
      if (foundArticle) {
        setArticle(foundArticle)
        // Increment view count
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles/${id}/view`, {
          method: 'POST'
        })
        setArticle(prev => prev ? { ...prev, views: prev.views + 1 } : null)
      } else {
        // Article not found, redirect to home
        router.push(`/${locale}`)
      }
    } catch (error) {
      console.error('Error fetching article:', error)
      router.push(`/${locale}`)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async () => {
    if (!article) return
    
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles/${article.id}/like`, {
        method: 'POST'
      })
      setArticle(prev => prev ? { ...prev, likes: prev.likes + 1 } : null)
    } catch (error) {
      console.error('Error liking article:', error)
    }
  }

  const handleShare = async () => {
    if (!article) return
    
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles/${article.id}/share`, {
        method: 'POST'
      })
      setArticle(prev => prev ? { ...prev, shares: prev.shares + 1 } : null)
    } catch (error) {
      console.error('Error updating share count:', error)
    }
  }

  useEffect(() => {
    fetchArticle()
  }, [id])

  if (!messages) {
    return <div className="flex justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  }

  if (loading) {
    return (
      <div className="container max-w-4xl py-8">
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="container max-w-4xl py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              {messages.article?.notFound || 'Article not found'}
            </p>
            <div className="flex justify-center mt-4">
              <Button onClick={() => router.push(`/${locale}`)}>
                {messages.article?.backToHome || 'Back to Home'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const articleUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/${locale}/article/${article.id}`

  return (
    <div className="container max-w-4xl py-8">
      {/* Back button */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push(`/${locale}`)}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          {messages.article?.backToArticles || 'Back to Articles'}
        </Button>
      </div>

      {/* Article content */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="text-3xl leading-tight mb-4">
            {article.title}
          </CardTitle>
          
          {/* Article metadata */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(article.createdAt).toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{article.views} {messages.home?.views || 'views'}</span>
              </div>
            </div>
            
            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-muted-foreground" />
                <div className="flex flex-wrap gap-1">
                  {article.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="pb-6">
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown>{article.content}</ReactMarkdown>
          </div>
        </CardContent>

        <Separator />

        {/* Article actions */}
        <CardFooter className="flex flex-col gap-6 py-6">
          {/* Like and basic share */}
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{article.views} {messages.home?.views || 'views'}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className="gap-1 text-muted-foreground hover:text-foreground"
              >
                <Heart className="w-4 h-4" />
                <span>{article.likes} {messages.home?.likes || 'likes'}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="gap-1 text-muted-foreground hover:text-foreground"
              >
                <Share2 className="w-4 h-4" />
                <span>{article.shares} {messages.home?.shares || 'shares'}</span>
              </Button>
            </div>
          </div>

          <Separator />

          {/* Social share buttons */}
          <div className="w-full">
            <h3 className="text-lg font-semibold mb-4">
              {messages.article?.shareArticle || 'Share this article'}
            </h3>
            <ShareButtons
              url={articleUrl}
              title={article.title}
              description={article.content.substring(0, 200) + '...'}
              onShare={handleShare}
            />
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}