'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Locale } from '@/lib/i18n'

async function getMessages(locale: Locale) {
  try {
    return (await import(`../../../messages/${locale}.json`)).default
  } catch (error) {
    return (await import(`../../../messages/en.json`)).default
  }
}

export default function ReportAbusePage({ params: { locale } }: { params: { locale: Locale } }) {
  const [title, setTitle] = useState('')
  const [link, setLink] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [messages, setMessages] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    getMessages(locale).then(setMessages)
  }, [locale])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim() || !link.trim() || !description.trim()) {
      alert(messages?.reportAbuse?.fillRequired || 'Please fill in all required fields')
      return
    }

    setIsSubmitting(true)
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/report-abuse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          link: link.trim(),
          description: description.trim(),
          timestamp: new Date().toISOString(),
          locale
        }),
      })

      if (response.ok) {
        alert(messages?.reportAbuse?.submitSuccess || 'Report submitted successfully!')
        setTitle('')
        setLink('')
        setDescription('')
      } else {
        throw new Error('Failed to submit report')
      }
    } catch (error) {
      console.error('Error submitting report:', error)
      alert(messages?.reportAbuse?.submitError || 'Failed to submit report. Please try again.')
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
          {messages.reportAbuse?.title || 'Report Abuse'}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {messages.reportAbuse?.subtitle || 'Help us maintain a safe and respectful community'}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{messages.reportAbuse?.cardTitle || 'Report Inappropriate Content'}</CardTitle>
          <CardDescription>
            {messages.reportAbuse?.cardDescription || 'Please provide details about the content you wish to report. All reports are reviewed by our team.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">{messages.reportAbuse?.titleLabel || 'Report Title'} *</Label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={messages.reportAbuse?.titlePlaceholder || 'Brief description of the issue...'}
                maxLength={200}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="link">{messages.reportAbuse?.linkLabel || 'Link to Content'} *</Label>
              <Input
                id="link"
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder={messages.reportAbuse?.linkPlaceholder || 'URL of the article or content to report'}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{messages.reportAbuse?.descriptionLabel || 'Description'} *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={messages.reportAbuse?.descriptionPlaceholder || 'Please provide detailed information about why you are reporting this content...'}
                className="min-h-[120px]"
                maxLength={1000}
                required
              />
              <p className="text-sm text-muted-foreground">
                {description.length}/1000 characters
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/${locale}`)}
              >
                {messages.reportAbuse?.cancel || 'Cancel'}
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !title.trim() || !link.trim() || !description.trim()}
                className="min-w-[120px]"
              >
                {isSubmitting ? (messages.reportAbuse?.submitting || 'Submitting...') : (messages.reportAbuse?.submit || 'Submit Report')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">{messages.reportAbuse?.guidelines?.title || 'Reporting Guidelines'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          {(messages.reportAbuse?.guidelines?.items || [
            'Only report content that violates our community guidelines',
            'Provide specific details about the violation',
            'Include the direct link to the problematic content',
            'Reports are reviewed within 24-48 hours',
            'False reports may result in restrictions'
          ]).map((item: string, index: number) => (
            <p key={index}>• {item}</p>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}