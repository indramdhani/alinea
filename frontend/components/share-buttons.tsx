'use client'

import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  TelegramShareButton,
  RedditShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
  TelegramIcon,
  RedditIcon,
  EmailIcon,
} from 'react-share'
import { Button } from '@/components/ui/button'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'

interface ShareButtonsProps {
  url: string
  title: string
  description?: string
  onShare?: () => void
}

export function ShareButtons({ url, title, description, onShare }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      onShare?.()
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy link:', error)
    }
  }

  const handleShare = () => {
    onShare?.()
  }

  const iconSize = 40
  const buttonStyle = {
    marginRight: '8px',
    marginBottom: '8px',
  }

  return (
    <div className="space-y-4">
      {/* Social media share buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <FacebookShareButton
          url={url}
          hashtag="#anonymous"
          style={buttonStyle}
          beforeOnClick={handleShare}
        >
          <FacebookIcon size={iconSize} round />
        </FacebookShareButton>

        <TwitterShareButton
          url={url}
          title={title}
          hashtags={['anonymous', 'story']}
          style={buttonStyle}
          beforeOnClick={handleShare}
        >
          <TwitterIcon size={iconSize} round />
        </TwitterShareButton>

        <LinkedinShareButton
          url={url}
          title={title}
          summary={description}
          source="Anonymous Articles"
          style={buttonStyle}
          beforeOnClick={handleShare}
        >
          <LinkedinIcon size={iconSize} round />
        </LinkedinShareButton>

        <WhatsappShareButton
          url={url}
          title={title}
          separator=" - "
          style={buttonStyle}
          beforeOnClick={handleShare}
        >
          <WhatsappIcon size={iconSize} round />
        </WhatsappShareButton>

        <TelegramShareButton
          url={url}
          title={title}
          style={buttonStyle}
          beforeOnClick={handleShare}
        >
          <TelegramIcon size={iconSize} round />
        </TelegramShareButton>

        <RedditShareButton
          url={url}
          title={title}
          style={buttonStyle}
          beforeOnClick={handleShare}
        >
          <RedditIcon size={iconSize} round />
        </RedditShareButton>

        <EmailShareButton
          url={url}
          subject={title}
          body={`Check out this article: ${title}\n\n${description}\n\n`}
          style={buttonStyle}
          beforeOnClick={handleShare}
        >
          <EmailIcon size={iconSize} round />
        </EmailShareButton>
      </div>

      {/* Copy link button */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyLink}
          className="gap-2"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy Link
            </>
          )}
        </Button>
        <span className="text-sm text-muted-foreground">
          or copy the link to share anywhere
        </span>
      </div>
    </div>
  )
}