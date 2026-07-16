import { useEffect, useRef, type ReactNode } from 'react'

type ConfirmDialogProps = {
  title: string
  children?: ReactNode
  confirmLabel: string
  dismissLabel: string
  destructive?: boolean
  secondaryConfirm?: boolean
  onConfirm: () => void
  onDismiss: () => void
}

export function ConfirmDialog({
  title,
  children,
  confirmLabel,
  dismissLabel,
  destructive = false,
  secondaryConfirm = false,
  onConfirm,
  onDismiss,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const dismissRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    dismissRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onDismiss()
        return
      }
      if (event.key !== 'Tab') return
      const controls = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled])',
      )
      if (!controls?.length) return
      const first = controls[0]
      const last = controls[controls.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onDismiss])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onDismiss()
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className="max-h-[calc(100dvh-3rem)] w-full max-w-sm overflow-y-auto rounded-sm border border-[var(--color-border)] bg-[var(--color-secondary)] p-4"
      >
        <h2 id="confirm-dialog-title" className="text-heading">
          {title}
        </h2>
        {children ? <div className="mt-2 text-body">{children}</div> : null}
        <div className="mt-6 flex flex-col gap-2">
          <button
            type="button"
            className={`min-h-11 rounded-sm px-4 text-body font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
              destructive
                ? 'bg-[var(--color-destructive)] text-[var(--color-text-primary)] focus-visible:outline-[var(--color-text-primary)]'
                : secondaryConfirm
                  ? 'border border-[var(--color-border)] bg-transparent text-[var(--color-text-primary)] focus-visible:outline-[var(--color-text-primary)]'
                : 'bg-[var(--color-accent)] text-[#0B0B0B] focus-visible:outline-[var(--color-accent)]'
            }`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
          <button
            ref={dismissRef}
            type="button"
            className="min-h-11 rounded-sm px-4 text-body underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-text-primary)]"
            onClick={onDismiss}
          >
            {dismissLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
