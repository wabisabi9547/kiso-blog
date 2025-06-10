import { getSortedPostsData } from '@/lib/posts'
import { SearchProvider } from '@/components/search/search-provider'

interface ClientProvidersProps {
  children: React.ReactNode
}

export function ClientProviders({ children }: ClientProvidersProps) {
  const posts = getSortedPostsData()

  return (
    <SearchProvider posts={posts}>
      {children}
    </SearchProvider>
  )
} 