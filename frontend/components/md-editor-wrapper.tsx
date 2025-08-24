'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from './theme-provider'
import dynamic from 'next/dynamic'

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

interface MDEditorWrapperProps {
  value: string
  onChange: (val: string | undefined) => void
  placeholder?: string
  height?: number
}

export function MDEditorWrapper({ value, onChange, placeholder, height = 400 }: MDEditorWrapperProps) {
  const { theme } = useTheme()
  const wrapperRef = useRef<HTMLDivElement>(null)

  const forceTextVisibility = () => {
    if (!wrapperRef.current) return

    const textColor = theme === 'dark' ? '#ffffff' : '#000000'
    const bgColor = theme === 'dark' ? '#171717' : '#ffffff'
    
    // Apply styles to all text elements
    const textElements = wrapperRef.current.querySelectorAll(`
      .w-md-editor textarea,
      .w-md-editor-text-input,
      .w-md-editor-text-pre,
      .w-md-editor-text,
      .w-md-editor-text-textarea,
      .w-md-editor span:not([class*="icon"]),
      .w-md-editor div:not([class*="toolbar"]):not([class*="bar"]),
      .w-md-editor .CodeMirror,
      .w-md-editor .CodeMirror-line
    `)

    textElements.forEach(el => {
      const htmlEl = el as HTMLElement
      htmlEl.style.setProperty('color', textColor, 'important')
      htmlEl.style.setProperty('caret-color', textColor, 'important')
      
      if (el.tagName.toLowerCase() === 'textarea' || el.classList.contains('CodeMirror')) {
        htmlEl.style.setProperty('background-color', 'transparent', 'important')
      }
    })
  }

  useEffect(() => {
    // Apply styles multiple times to ensure they stick
    const intervals = [100, 300, 500, 1000, 2000]
    const timeouts = intervals.map(delay => 
      setTimeout(forceTextVisibility, delay)
    )

    // Also apply on any DOM changes
    const observer = new MutationObserver(forceTextVisibility)
    if (wrapperRef.current) {
      observer.observe(wrapperRef.current, { 
        childList: true, 
        subtree: true, 
        attributes: true 
      })
    }

    return () => {
      timeouts.forEach(clearTimeout)
      observer.disconnect()
    }
  }, [theme, value])

  return (
    <div 
      ref={wrapperRef}
      className="w-md-editor-wrapper" 
      data-color-mode={theme === 'dark' ? 'dark' : 'light'}
      style={{
        '--text-color': theme === 'dark' ? '#ffffff' : '#000000',
        '--bg-color': theme === 'dark' ? '#171717' : '#ffffff'
      } as React.CSSProperties}
    >
      <MDEditor
        value={value}
        onChange={onChange}
        preview="edit"
        hideToolbar={false}
        visibleDragbar={false}
        data-color-mode={theme === 'dark' ? 'dark' : 'light'}
        textareaProps={{
          placeholder,
          style: {
            fontSize: '14px',
            lineHeight: '1.5',
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
            color: theme === 'dark' ? '#ffffff' : '#000000',
            backgroundColor: 'transparent',
            caretColor: theme === 'dark' ? '#ffffff' : '#000000'
          },
        }}
        height={height}
      />
    </div>
  )
}