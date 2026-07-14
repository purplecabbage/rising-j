"use client"

import ReactMarkdown from "react-markdown"

interface MarkdownContentProps {
  content: string
  className?: string
}

export default function MarkdownContent({ content, className }: MarkdownContentProps) {
  return (
    <div className={className}>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  )
}
