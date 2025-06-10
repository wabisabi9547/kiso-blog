'use client'

import { useState } from 'react'
import { PortfolioChat } from '@/components/portfolio/portfolio-chat'

export function PortfolioButton() {
  const [isPortfolioOpen, setIsPortfolioOpen] = useState(false)

  return (
    <>
      <button 
        onClick={() => setIsPortfolioOpen(true)}
        className="btn-glass px-6 py-3 rounded-2xl flex items-center space-x-2 group"
      >
        <span>더 많은 정보 알아보기</span>
        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      
      <PortfolioChat 
        isOpen={isPortfolioOpen} 
        onClose={() => setIsPortfolioOpen(false)} 
      />
    </>
  )
} 