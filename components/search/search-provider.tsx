'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { PostData } from '@/lib/posts'
import { SearchDialog } from '@/components/search/search-dialog'

interface SearchContextType {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  posts: PostData[]
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export function useSearch() {
  const context = useContext(SearchContext)
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}

interface SearchProviderProps {
  children: ReactNode
  posts: PostData[]
}

export function SearchProvider({ children, posts }: SearchProviderProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <SearchContext.Provider value={{ isOpen, setIsOpen, posts }}>
      {children}
      <SearchDialog />
    </SearchContext.Provider>
  )
} 