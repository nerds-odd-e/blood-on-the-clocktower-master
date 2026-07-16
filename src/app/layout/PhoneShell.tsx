import type { ReactNode } from 'react'

type PhoneShellProps = {
  children: ReactNode
}

/**
 * Phone-first chrome: safe-area insets, overflow-x containment, max-width 40rem.
 */
export function PhoneShell({ children }: PhoneShellProps) {
  return (
    <div
      className="PhoneShell min-h-dvh overflow-x-hidden bg-[var(--color-dominant)] text-[var(--color-text-primary)]"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingRight: 'env(safe-area-inset-right)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingLeft: 'env(safe-area-inset-left)',
      }}
    >
      <div className="mx-auto w-full max-w-[40rem] px-6">{children}</div>
    </div>
  )
}
