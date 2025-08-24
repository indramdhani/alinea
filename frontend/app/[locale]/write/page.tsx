'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TagInput } from '@/components/tag-input'
import { MDEditorWrapper } from '@/components/md-editor-wrapper'
import { Locale } from '@/lib/i18n'
import '../../../styles/md-editor.css'

async function getMessages(locale: Locale) {
  try {
    return (await import(`../../../messages/${locale}.json`)).default
  } catch (error) {
    return (await import(`../../../messages/en.json`)).default
  }
}

export default function WritePage({ params: { locale } }: { params: { locale: Locale } }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [messages, setMessages] = useState<any>(null)

  const router = useRouter()

  useEffect(() => {
    getMessages(locale).then(setMessages)
  }, [locale])





  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim() || !content.trim()) {
      alert(messages?.write?.fillRequired || 'Please fill in both title and content')
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
          tags: tags,
        }),
      })

      if (response.ok) {
        alert(messages?.write?.publishSuccess || 'Article published successfully!')
        router.push(`/${locale}`)
      } else {
        throw new Error('Failed to publish article')
      }
    } catch (error) {
      console.error('Error publishing article:', error)
      alert(messages?.write?.publishError || 'Failed to publish article. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!messages) {
    return <div className="flex justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          {messages.write.title}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {messages.write.subtitle}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{messages.write.cardTitle}</CardTitle>
          <CardDescription>
            {messages.write.cardDescription}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">{messages.write.titleLabel}</Label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={messages.write.titlePlaceholder}
                maxLength={200}
                className="text-lg"
              />
              <p className="text-sm text-muted-foreground">
                {title.length}/200 {messages.write.charactersLeft}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">{messages.write.tagsLabel}</Label>
              <TagInput
                tags={tags}
                onTagsChange={setTags}
                placeholder={messages.write.tagsPlaceholder}
                maxTags={10}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">{messages.write.contentLabel}</Label>
              <MDEditorWrapper
                value={content}
                onChange={(val) => setContent(val || '')}
                placeholder={messages.write.contentPlaceholder}
                height={400}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/${locale}`)}
              >
                {messages.write.cancel}
              </Button>
              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={isSubmitting || !title.trim() || !content.trim()}
                  className="min-w-[120px]"
                >
                  {isSubmitting ? messages.write.publishing : messages.write.publish}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">{messages.write.tipsTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          {messages.write.tips.map((tip: string, index: number) => (
            <p key={index}>• {tip}</p>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}