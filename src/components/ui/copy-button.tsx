import { Button } from './button'

export function CopyButton({ text, onCopied }: { text: string; onCopied?: () => void }) {
  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      onCopied?.()
    } catch (error) {
      console.error('Failed to copy:', error);
      // noop
    }
  }
  return (
    <Button onClick={copy} type="button">复制</Button>
  )
}
