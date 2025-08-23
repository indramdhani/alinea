'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const SimpleMDE = dynamic(() => import('react-simplemde-editor'), { ssr: false })

export default function WritePage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim() || !content.trim()) {
      alert('Please fill in both title and content')
      return
    }

    setIsSubmitting(true)
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
        }),
      })

      if (response.ok) {
        alert('Article published successfully!')
        router.push('/')
      } else {
        throw new Error('Failed to publish article')
      }
    } catch (error) {
      console.error('Error publishing article:', error)
      alert('Failed to publish article. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Write Your Story
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Share your thoughts, stories, poems, or notes anonymously with the world. 
          No account required, just pure expression.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Article</CardTitle>
          <CardDescription>
            Your content will be published anonymously. Markdown formatting is supported.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your title..."
                maxLength={200}
                className="text-lg"
              />
              <p className="text-sm text-muted-foreground">
                {title.length}/200 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <div className="min-h-[400px]">
                <SimpleMDE
                  value={content}
                  onChange={setContent}
                  options={{
                    spellChecker: false,
                    minHeight: '400px',
                    maxHeight: '600px',
                    placeholder: 'Write your story here... You can use Markdown formatting for rich text.',
                    toolbar: [
                      'bold', 'italic', 'heading', '|',
                      'quote', 'unordered-list', 'ordered-list', '|',
                      'link', 'image', '|',
                      'preview', 'side-by-side', 'fullscreen', '|',
                      'guide'
                    ],
                    status: false,
                  }}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/')}
              >
                Cancel
              </Button>
              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={isSubmitting || !title.trim() || !content.trim()}
                  className="min-w-[120px]"
                >
                  {isSubmitting ? 'Publishing...' : 'Publish Article'}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Writing Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Use **bold** and *italic* text for emphasis</p>
          <p>• Create headers with # for main titles, ## for subtitles</p>
          <p>• Add links with [text](url) format</p>
          <p>• Create lists with - or 1. for numbered lists</p>
          <p>• Use > for quotes and blockquotes</p>
        </CardContent>
      </Card>
    </div>
  )
}