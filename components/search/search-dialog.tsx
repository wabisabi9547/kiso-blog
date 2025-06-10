'use client'

import { useState, useEffect, useMemo } from 'react'
import { useSearch } from './search-provider'
import { PostData } from '@/lib/posts'
import Link from 'next/link'
import { disassemble } from 'hangul-js'

interface SearchDialogProps {}

export function SearchDialog({}: SearchDialogProps) {
  const { isOpen, setIsOpen, posts } = useSearch()
  const [query, setQuery] = useState('')
  const [filteredPosts, setFilteredPosts] = useState<PostData[]>([])

  // 한글 자모 분리 검색 함수
  const searchKorean = (text: string, searchTerm: string): boolean => {
    if (!searchTerm) return true
    
    const normalizedText = text.toLowerCase()
    const normalizedSearch = searchTerm.toLowerCase()
    
    // 일반 검색도 지원
    if (normalizedText.includes(normalizedSearch)) {
      return true
    }
    
    // 한글 자모 분리 검색
    try {
      const textChars = disassemble(normalizedText)
      const searchChars = disassemble(normalizedSearch)
      
      if (searchChars.length === 0) return true
      
      for (let i = 0; i <= textChars.length - searchChars.length; i++) {
        let match = true
        for (let j = 0; j < searchChars.length; j++) {
          if (textChars[i + j] !== searchChars[j]) {
            match = false
            break
          }
        }
        if (match) return true
      }
    } catch (error) {
      // 한글 처리 오류 시 일반 검색으로 fallback
      return normalizedText.includes(normalizedSearch)
    }
    
    return false
  }

  // 검색 결과 필터링
  const searchResults = useMemo(() => {
    if (!query.trim()) return []
    
    return posts.filter(post => {
      return (
        searchKorean(post.title, query) ||
        searchKorean(post.excerpt || '', query) ||
        searchKorean(post.content || post.contentHtml || '', query) ||
        post.tags?.some(tag => searchKorean(tag, query))
      )
    }).slice(0, 10) // 최대 10개 결과
  }, [query, posts])

  // ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'auto'
    }
  }, [isOpen, setIsOpen])

  // 검색창 열릴 때 포커스
  useEffect(() => {
    if (isOpen) {
      const input = document.getElementById('search-input')
      if (input) {
        setTimeout(() => input.focus(), 100)
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="min-h-screen px-4 text-center">
        <div className="inline-block w-full max-w-2xl my-8 text-left align-middle transition-all transform">
          <div className="glass-strong rounded-2xl shadow-xl">
            {/* 검색 입력 */}
            <div className="p-6">
              <div className="flex items-center space-x-4">
                <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  id="search-input"
                  type="text"
                  placeholder="검색어를 입력하세요... (한글 자모 검색 지원)"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-transparent border-0 outline-none text-lg placeholder-muted-foreground"
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* 검색 결과 */}
            {query && (
              <div className="border-t border-border/20">
                {searchResults.length > 0 ? (
                  <div className="max-h-96 overflow-y-auto p-2">
                    {searchResults.map((post) => (
                      <Link
                        key={post.id}
                        href={`/blog/${post.id}`}
                        onClick={() => setIsOpen(false)}
                        className="block p-4 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <h3 className="font-medium text-foreground mb-1 line-clamp-1">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {post.excerpt}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          {post.tags?.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 text-xs rounded-full glass-subtle"
                            >
                              {tag}
                            </span>
                          ))}
                          <span className="text-xs text-muted-foreground ml-auto">
                            {new Date(post.date).toLocaleDateString('ko-KR')}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.469-.901-6.08-2.379C7.773 10.878 9.79 9 12.257 9c1.63 0 3.065.792 3.943 2.009L18 13.291z" />
                    </svg>
                    <p>검색 결과가 없습니다.</p>
                    <p className="text-sm mt-1">다른 키워드로 검색해보세요.</p>
                  </div>
                )}
              </div>
            )}

            {/* 검색 가이드 */}
            {!query && (
              <div className="p-6 border-t border-border/20">
                <div className="text-center text-muted-foreground">
                  <p className="mb-2">한글 자모 분리 검색을 지원합니다</p>
                  <div className="text-sm space-y-1">
                    <p><span className="text-purple-400">"ㅈ"</span> → "저는", "좋은" 등 검색</p>
                    <p><span className="text-purple-400">"개발"</span> → 일반 단어 검색</p>
                    <p><span className="text-purple-400">"esc"</span> 키로 창 닫기</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 