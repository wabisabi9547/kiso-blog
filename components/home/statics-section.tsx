'use client'

import { motion } from 'framer-motion'

export function StaticsSection() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="py-32 w-full flex justify-center"
    >
      <div className="grid grid-cols-3 gap-16 max-w-4xl">
        <div className="text-center">
          <p className="text-6xl font-bold bg-gradient-to-b from-primary to-primary/50 bg-clip-text text-transparent">
            1,200+
          </p>
          <p className="text-lg text-muted-foreground tracking-wide">분석된 키워드</p>
        </div>
        <div className="text-center">
          <p className="text-6xl font-bold bg-gradient-to-b from-primary to-primary/50 bg-clip-text text-transparent">
            50M+
          </p>
          <p className="text-lg text-muted-foreground tracking-wide">월간 검색량</p>
        </div>
        <div className="text-center">
          <p className="text-6xl font-bold bg-gradient-to-b from-primary to-primary/50 bg-clip-text text-transparent">
            $1K+
          </p>
          <p className="text-lg text-muted-foreground tracking-wide">월 수익 (목표)</p>
        </div>
      </div>
    </motion.section>
  )
} 