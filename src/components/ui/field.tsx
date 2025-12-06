import { cn } from './utils'
import type { TextareaHTMLAttributes, ReactNode } from 'react'

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm text-gray-600">{label}</span>
      {children}
    </label>
  )
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'border-input w-full min-w-0 rounded-md border px-3 py-2 text-base transition-[color,box-shadow] outline-none',
        'bg-input-background focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] md:text-sm',
      )}
      {...props}
    />
  )
}


