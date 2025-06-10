'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useSearch } from '@/components/search/search-provider'
import { useState } from 'react'
import { PortfolioChat } from '@/components/portfolio/portfolio-chat'

export function Header() {
  const { setIsOpen } = useSearch()
  const [isPortfolioOpen, setIsPortfolioOpen] = useState(false)

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-5xl mx-auto px-6 backdrop-blur-sm"
      >
        <div className="glass-strong rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/" 
              className="group flex items-center space-x-3"
            >
              <span className="font-bold text-xl tracking-wide text-gradient group-hover:text-gradient-purple transition-colors pl-2">
                KISO
              </span>
            </Link>
            
            <nav className="hidden md:flex">
              <ul className="flex items-center space-x-6">
                <li>
                  <Link 
                    href="/blog" 
                    className="text-sm font-medium text-muted-foreground hover:text-purple-400 transition-colors relative group"
                  >
                    블로그
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-300" />
                  </Link>
                </li>
              </ul>
            </nav>

            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setIsOpen(true)}
                className="p-2 rounded-xl glass hover:glass-strong transition-colors text-muted-foreground hover:text-purple-400"
                title="검색 (한글 자모 지원)"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              
              <button className="md:hidden p-2 rounded-xl glass hover:glass-strong transition-colors text-muted-foreground hover:text-purple-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Portfolio Dialog */}
      <PortfolioChat 
        isOpen={isPortfolioOpen} 
        onClose={() => setIsPortfolioOpen(false)} 
      />
    </>
  )
} 