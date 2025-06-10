'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { PostData } from '@/lib/posts'

interface BlogPageClientProps {
  posts: PostData[]
}

const POSTS_PER_PAGE = 9

const categoryLabels: { [key: string]: string } = {
  'tech': '기술',
  'lifestyle': '라이프스타일',
  'travel': '여행',
  'culture': '문화',
  'career': '커리어',
  'language': '언어',
  'productivity': '생산성',
  'finance': '금융',
  'photography': '사진',
  'tips': '팁'
}

export function BlogPageClient({ posts }: BlogPageClientProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Get unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(posts.map(post => post.category))]
    return cats.sort()
  }, [posts])

  // Filter posts by category
  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'all') return posts
    return posts.filter(post => post.category === selectedCategory)
  }, [posts, selectedCategory])

  // Calculate pagination
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE
  const endIndex = startIndex + POSTS_PER_PAGE
  const currentPosts = filteredPosts.slice(startIndex, endIndex)

  // Reset to page 1 when category changes
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setCurrentPage(1)
  }

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const delta = 2
    const pages = []
    const start = Math.max(1, currentPage - delta)
    const end = Math.min(totalPages, currentPage + delta)

    if (start > 1) {
      pages.push(1)
      if (start > 2) pages.push('...')
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push('...')
      pages.push(totalPages)
    }

    return pages
  }

  return (
    <>
      {/* Category Filter */}
      <section className="py-8">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <button
              onClick={() => handleCategoryChange('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'glass-strong text-white'
                  : 'glass-subtle hover:glass-strong'
              }`}
            >
              전체 ({posts.length})
            </button>
            {categories.map((category) => {
              const count = posts.filter(post => post.category === category).length
              const label = categoryLabels[category] || category
              return (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? 'glass-strong text-white'
                      : 'glass-subtle hover:glass-strong'
                  }`}
                >
                  {label} ({count})
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="pb-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          {currentPosts.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {currentPosts.map((post: PostData) => (
                  <Link 
                    key={post.id} 
                    href={`/blog/${post.id}`}
                    className="card-glass group h-full"
                  >
                    <div className="p-6 flex flex-col h-full">
                                             {(post.image || post.thumbnail) && (
                        <div className="relative mb-4 overflow-hidden rounded-lg flex-shrink-0">
                                                      <Image
                              src={post.image || post.thumbnail || '/og-image.png'}
                              alt={post.title}
                            width={400}
                            height={200}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                      
                      {/* Fixed height tag container */}
                      <div className="flex flex-wrap items-center gap-1.5 mb-3 min-h-[2rem]">
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium glass-subtle shrink-0">
                          {categoryLabels[post.category] || post.category}
                        </span>
                        {post.tags?.slice(0, 2).map((tag: string) => (
                          <span 
                            key={tag}
                            className="px-2 py-0.5 rounded-full text-xs font-medium glass-subtle shrink-0 truncate max-w-[80px]"
                            title={tag}
                          >
                            {tag}
                          </span>
                        ))}
                        {post.tags && post.tags.length > 2 && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium glass-subtle shrink-0 text-muted-foreground">
                            +{post.tags.length - 2}
                          </span>
                        )}
                      </div>
                      
                      <h3 className="text-lg mb-2 text-gradient group-hover:text-gradient-purple transition-colors line-clamp-2 flex-shrink-0">
                        {post.title}
                      </h3>
                      
                      {(post.description || post.excerpt) && (
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-grow">
                          {post.description || post.excerpt}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto flex-shrink-0">
                        <span>{new Date(post.date).toLocaleDateString('ko-KR')}</span>
                        {post.readingTime && (
                          <span>{post.readingTime}분</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  {/* Previous Button */}
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      currentPage === 1
                        ? 'opacity-50 cursor-not-allowed glass-subtle'
                        : 'glass-subtle hover:glass-strong'
                    }`}
                  >
                    이전
                  </button>

                  {/* Page Numbers */}
                  {getPageNumbers().map((page, index) => (
                    <button
                      key={index}
                      onClick={() => typeof page === 'number' && setCurrentPage(page)}
                      disabled={page === '...'}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        page === currentPage
                          ? 'glass-strong text-white'
                          : page === '...'
                          ? 'cursor-default glass-subtle opacity-50'
                          : 'glass-subtle hover:glass-strong'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  {/* Next Button */}
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      currentPage === totalPages
                        ? 'opacity-50 cursor-not-allowed glass-subtle'
                        : 'glass-subtle hover:glass-strong'
                    }`}
                  >
                    다음
                  </button>
                </div>
              )}

              {/* Results Info */}
              <div className="text-center mt-8">
                <p className="text-sm text-muted-foreground">
                  {filteredPosts.length}개의 글 중 {startIndex + 1}-{Math.min(endIndex, filteredPosts.length)}개 표시
                  {selectedCategory !== 'all' && (
                    <span> (카테고리: {categoryLabels[selectedCategory] || selectedCategory})</span>
                  )}
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="glass-strong rounded-3xl p-12 max-w-2xl mx-auto">
                <h3 className="text-2xl mb-4 text-gradient">
                  해당 카테고리에 글이 없습니다
                </h3>
                <p className="text-muted-foreground mb-6">
                  다른 카테고리를 선택해보세요.
                </p>
                <button
                  onClick={() => handleCategoryChange('all')}
                  className="btn-glass-strong"
                >
                  전체 글 보기
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
} 