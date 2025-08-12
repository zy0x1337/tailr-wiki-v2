// components/Providers.tsx
'use client'

import { ThemeProvider } from 'next-themes'
import { ReactNode } from 'react'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider 
      attribute="data-theme" 
      defaultTheme="light"
      themes={["light", "dark", "luxury", "emerald"]}
      enableSystem={true}
      storageKey="tailr-wiki-theme"
    >
      {children}
    </ThemeProvider>
  )
}
