'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export function Footer() {
  const footerSections = [
    {
      title: "트렌드",
      links: [
        { href: "/trends/politics", label: "정치" },
        { href: "/trends/economy", label: "경제" },
        { href: "/trends/culture", label: "문화" },
        { href: "/trends/technology", label: "기술" }
      ]
    },
    {
      title: "아티클",
      links: [
        { href: "/blog", label: "전체 아티클" },
        { href: "/featured", label: "주목받는 글" },
        { href: "/analysis", label: "심층 분석" },
        { href: "/insights", label: "인사이트" }
      ]
    },
    {
      title: "KoreaTrendNow",
      links: [
        { href: "/about", label: "소개" },
        { href: "/team", label: "팀" },
        { href: "/contact", label: "문의" },
        { href: "/careers", label: "채용" }
      ]
    }
  ]

  const socialLinks = [
    {
      name: "Twitter",
      href: "https://twitter.com/koreatrendnow",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
        </svg>
      )
    },
    {
      name: "Instagram",
      href: "https://instagram.com/koreatrendnow",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm-2 7a2 2 0 114 0v6a2 2 0 11-4 0V7z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com/company/koreatrendnow",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      name: "YouTube",
      href: "https://youtube.com/@koreatrendnow",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
        </svg>
      )
    }
  ]

  return (
    <footer className="relative mt-32 border-t border-border/30">
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/95 to-transparent" />
      
      <div className="relative">
        <div className="max-w-6xl mx-auto px-6 py-16">
          {/* Main footer content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Brand section */}
            <div className="lg:col-span-1">
                          <Link href="/" className="group flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <span className="font-bold text-2xl tracking-tight gradient-text">
                KoreaTrendNow
              </span>
            </Link>
            
            <p className="text-slate-400 mb-6 leading-relaxed">
              한국 트렌드의 지금을 실시간으로 전하는 곳.<br />
              깊이 있는 분석과 즉시성으로 트렌드의 현재를<br />
              읽어내는 프리미엄 미디어
            </p>

              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                                         className="p-3 glass rounded-xl text-slate-400 hover:text-purple-400 lift-hover"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {social.icon}
                    <span className="sr-only">{social.name}</span>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Navigation sections */}
            {footerSections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <h3 className="font-semibold text-slate-200 mb-4">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-slate-400 hover:text-purple-400 smooth-hover relative group"
                      >
                        {link.label}
                        <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-300" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Newsletter subscription */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-strong rounded-2xl p-8 mb-12"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-3 gradient-text">
                  트렌드 인사이트 받아보기
                </h3>
                <p className="text-slate-400">
                  매주 엄선된 트렌드 분석과 실시간 인사이트를 이메일로 받아보세요.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="이메일 주소를 입력하세요"
                  className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 text-slate-200 placeholder-slate-400"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl lift-hover whitespace-nowrap">
                  구독하기
                </button>
              </div>
            </div>
          </motion.div>

          {/* Bottom bar */}
          <div className="flex flex-col lg:flex-row justify-between items-center pt-8 border-t border-border/30 space-y-4 lg:space-y-0">
            <div className="flex flex-wrap items-center space-x-6 text-sm text-slate-400">
              <span>&copy; 2024 KoreaTrendNow. All rights reserved.</span>
              <Link href="/privacy" className="hover:text-purple-400 smooth-hover">
                개인정보처리방침
              </Link>
              <Link href="/terms" className="hover:text-purple-400 smooth-hover">
                이용약관
              </Link>
              <Link href="/cookies" className="hover:text-purple-400 smooth-hover">
                쿠키 정책
              </Link>
            </div>
            
            <div className="text-sm text-slate-400">
              Made with ❤️ in Seoul, Korea
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 