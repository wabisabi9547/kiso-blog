import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getSortedPostsData, PostData } from '@/lib/posts'
import { Header } from '@/components/home/header'
import { SearchProvider } from '@/components/search/search-provider'
import { BlogPageClient } from '@/components/blog/blog-page-client'

export const metadata: Metadata = {
  title: 'Blog',
  description: '일상과 기술, 그리고 생각들을 담는 개인 블로그입니다.',
  alternates: {
    canonical: 'https://kiso.blog/blog',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'KISO blog',
  description: '일상과 기술, 그리고 생각들을 담는 개인 블로그입니다.',
  url: 'https://kiso.blog/blog',
  author: {
    '@type': 'Person',
    name: 'KISO',
    url: 'https://kiso.blog'
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://kiso.blog/blog'
  }
}

export default function BlogPage() {
  const posts = getSortedPostsData()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <SearchProvider posts={posts}>
        <div className="min-h-screen bg-background bg-mesh bg-noise">
          <Header />
          
          {/* Hero Section */}
          <section className="pt-32 pb-20">
            <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
              <h1 className="text-5xl md:text-7xl font-extralight mb-6 text-gradient text-shadow-glow">
                모든 글
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12">
                생각을 글로 담아내는 공간
              </p>
            </div>
          </section>

          {/* Blog Content with Pagination and Categories */}
          <BlogPageClient posts={posts} />
        </div>
      </SearchProvider>
    </>
  )
} 