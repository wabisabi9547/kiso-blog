'use client'

import { useState, useRef, useEffect } from 'react'

interface ChatMessage {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  isTyping?: boolean
}

interface PortfolioChatProps {
  isOpen: boolean
  onClose: () => void
}

const initialMessages: ChatMessage[] = [
  {
    id: '1',
    type: 'user',
    content: '안녕하세요! KISO에 대해 소개해주세요.',
    timestamp: new Date(Date.now() - 300000),
  },
  {
    id: '2',
    type: 'assistant',
    content: `안녕하세요! 👋 저는 5년차 풀스택 개발자 **KISO**입니다.

현대적인 웹 기술을 활용해 사용자에게 의미있는 경험을 제공하는 것을 목표로 합니다. React와 Next.js를 중심으로 한 프론트엔드 개발부터 Node.js, Python을 활용한 백엔드 설계까지 전체 제품 개발 라이프사이클에 깊이 관여해왔습니다.

**주요 통계:**
- 💼 5년+ 개발 경험
- 🚀 50+ 프로젝트 완료
- 🏢 3개 회사 경력
- ❤️ 100% 열정

특히 사용자 경험 최적화와 성능 개선에 관심이 많으며, 팀과의 협업을 통해 더 나은 제품을 만들어가는 과정을 즐깁니다.`,
    timestamp: new Date(Date.now() - 290000),
  },
  {
    id: '3',
    type: 'user',
    content: '주요 프로젝트들을 보여주세요.',
    timestamp: new Date(Date.now() - 280000),
  },
  {
    id: '4',
    type: 'assistant',
    content: `제가 진행한 주요 프로젝트들을 소개해드릴게요! 🚀

## 📱 **E-Commerce Platform** (2024)
Next.js와 Stripe을 활용한 현대적인 이커머스 플랫폼을 개발했습니다.
- **기술 스택:** Next.js, React, TypeScript, Stripe, Tailwind CSS
- **상태:** ✅ 완료

## 🤖 **AI-Powered Dashboard** (2024)  
머신러닝 데이터 시각화를 위한 인터랙티브 대시보드를 구축했습니다.
- **기술 스택:** React, D3.js, Python, FastAPI, PostgreSQL
- **상태:** 🔄 진행중

## 💳 **Mobile Banking App** (2023)
React Native로 구현한 보안이 강화된 모바일 뱅킹 솔루션입니다.
- **기술 스택:** React Native, Node.js, MongoDB, JWT, Biometric Auth
- **상태:** ✅ 완료

## 📝 **Content Management System** (2023)
기업용 헤드리스 CMS 및 관리자 패널을 개발했습니다.
- **기술 스택:** Next.js, Prisma, PostgreSQL, AWS, GraphQL
- **상태:** ✅ 완료

각 프로젝트는 사용자 중심의 설계와 확장 가능한 아키텍처에 중점을 두고 개발했습니다.`,
    timestamp: new Date(Date.now() - 270000),
  },
  {
    id: '5',
    type: 'user',
    content: '경력 사항에 대해 알려주세요.',
    timestamp: new Date(Date.now() - 260000),
  },
  {
    id: '6',
    type: 'assistant',
    content: `제 경력 여정을 소개해드릴게요! 💼

## 🏢 **TechCorp Inc.** 
**Senior Full-Stack Developer** | 2022 - Present
대규모 웹 애플리케이션 개발 및 아키텍처 설계를 담당하고 있습니다. 팀 리드로서 주니어 개발자 멘토링 및 기술 스택 선정을 맡고 있어요.

## 🚀 **StartupXYZ**
**Full-Stack Developer** | 2020 - 2022  
스타트업 환경에서 0에서 1까지 제품 개발을 경험했습니다. MVP부터 스케일링까지 전체 개발 라이프사이클을 경험할 수 있었어요.

## 🎨 **Digital Agency**
**Frontend Developer** | 2019 - 2020
다양한 클라이언트 프로젝트를 수행하며 브랜드 웹사이트부터 복잡한 웹 애플리케이션까지 폭넓은 경험을 쌓았습니다.

각 단계에서 기술적 성장뿐만 아니라 팀워크와 커뮤니케이션 능력도 함께 발전시켜왔습니다.`,
    timestamp: new Date(Date.now() - 250000),
  }
]

const suggestedQuestions = [
  "사용하는 주요 기술 스택은 무엇인가요?",
  "개발 철학이나 접근 방식을 알려주세요.",
  "협업할 때 어떤 점을 중요하게 생각하나요?",
  "최근에 관심 있는 기술 트렌드는 무엇인가요?",
  "프로젝트 문의를 하고 싶어요.",
  "GitHub나 포트폴리오 링크를 알려주세요."
]

export function PortfolioChat({ isOpen, onClose }: PortfolioChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // ESC 키로 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: getAIResponse(content),
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)
    }, 2000)
  }

  const getAIResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase()
    
    if (lowerQuestion.includes('기술') || lowerQuestion.includes('스택')) {
      return `제가 주로 사용하는 기술 스택을 소개해드릴게요! 💻

**Frontend:**
- React, Next.js, TypeScript
- Tailwind CSS, Styled Components
- Vue.js, Nuxt.js

**Backend:**
- Node.js, Express, Fastify
- Python, Django, FastAPI
- Go (학습 중)

**Database:**
- PostgreSQL, MongoDB
- Redis, Prisma ORM

**DevOps & Cloud:**
- Docker, Kubernetes
- AWS, Vercel, Netlify
- CI/CD, GitHub Actions

**Mobile:**
- React Native
- Expo

지속적인 학습을 통해 새로운 기술들도 적극적으로 도입하고 있습니다!`
    }

    if (lowerQuestion.includes('철학') || lowerQuestion.includes('접근')) {
      return `제 개발 철학을 공유해드릴게요! 🎯

**1. 사용자 중심 설계**
- 기술을 위한 기술이 아닌, 사용자 경험을 최우선으로 고려합니다.

**2. 클린 코드**
- 읽기 쉽고 유지보수 가능한 코드를 작성하려 노력합니다.
- 코드 리뷰와 테스트를 중요하게 생각합니다.

**3. 지속적인 학습**
- 빠르게 변화하는 기술 트렌드를 꾸준히 학습합니다.
- 새로운 도전을 두려워하지 않습니다.

**4. 팀워크**
- 혼자서는 할 수 없는 일들을 팀과 함께 이뤄내는 것을 즐깁니다.
- 지식 공유와 멘토링을 적극적으로 합니다.

"완벽한 코드는 없지만, 더 나은 코드를 위해 계속 노력한다"는 마음으로 개발하고 있습니다.`
    }

    if (lowerQuestion.includes('협업') || lowerQuestion.includes('팀')) {
      return `협업할 때 중요하게 생각하는 점들을 말씀드릴게요! 🤝

**커뮤니케이션**
- 명확하고 투명한 소통을 지향합니다.
- 정기적인 회의와 진진 상황 공유를 중요하게 생각합니다.

**코드 품질**
- 일관된 코딩 컨벤션과 코드 리뷰 문화를 만들어갑니다.
- 문서화와 주석을 통해 코드의 이해도를 높입니다.

**성장 마인드**
- 팀원들과 함께 성장하는 것을 중요하게 생각합니다.
- 실수를 두려워하지 않고, 실패에서 배우는 문화를 지향합니다.

**역할 분담**
- 각자의 강점을 파악하고 적재적소에 배치하려 노력합니다.
- 필요시 다른 분야도 적극적으로 도움을 제공합니다.

"함께 가면 더 멀리 갈 수 있다"는 믿음으로 협업하고 있습니다.`
    }

    if (lowerQuestion.includes('트렌드') || lowerQuestion.includes('관심')) {
      return `최근 관심 있는 기술 트렌드들을 공유해드릴게요! 🔥

**AI/ML 통합**
- AI 도구들을 개발 워크플로우에 통합하는 방법들을 연구하고 있습니다.
- LLM을 활용한 개발자 도구들에 큰 관심이 있어요.

**Edge Computing**
- Vercel Edge Functions, Cloudflare Workers 등을 활용한 성능 최적화

**Server Components**
- React Server Components와 Next.js App Router의 새로운 패러다임

**WebAssembly (WASM)**
- 브라우저에서의 고성능 애플리케이션 개발 가능성

**Micro Frontend**
- 대규모 애플리케이션의 모듈화와 독립적 배포

**Developer Experience**
- 개발자 경험을 향상시키는 도구들과 워크플로우 개선

항상 새로운 기술을 학습하면서도 실제 프로젝트에 적용 가능한지를 신중히 판단하고 있습니다.`
    }

    if (lowerQuestion.includes('문의') || lowerQuestion.includes('연락') || lowerQuestion.includes('프로젝트')) {
      return `프로젝트 문의 환영합니다! 🚀

**연락처:**
📧 **이메일:** wabisabi.9547@gmail.com
📱 **LinkedIn:** [KISO LinkedIn 프로필]
💻 **GitHub:** [github.com/kiso]

**협업 가능한 프로젝트:**
- 웹 애플리케이션 개발 (Frontend + Backend)
- 모바일 앱 개발 (React Native)
- API 설계 및 개발
- 기술 컨설팅 및 아키텍처 설계
- 팀 멘토링 및 코드 리뷰

**선호하는 프로젝트:**
- 사용자 경험이 중요한 프로젝트
- 기술적 도전이 있는 흥미로운 문제
- 장기적으로 함께 성장할 수 있는 팀

언제든 편하게 연락주세요! 함께 의미있는 프로젝트를 만들어가고 싶습니다. ✨`
    }

    if (lowerQuestion.includes('github') || lowerQuestion.includes('포트폴리오') || lowerQuestion.includes('링크')) {
      return `제 작업물들을 확인하실 수 있는 링크들을 공유해드릴게요! 🔗

**GitHub**
🔗 [github.com/kiso] - 오픈소스 프로젝트와 개인 프로젝트들

**블로그**
📝 [kiso.blog] - 기술 아티클과 개발 경험 공유

**LinkedIn**  
💼 [KISO LinkedIn] - 전문적인 경력과 네트워킹

**이메일**
📧 wabisabi.9547@gmail.com - 직접 연락

**최근 프로젝트들:**
- 🛍️ E-Commerce Platform (Next.js + Stripe)
- 🤖 AI Dashboard (React + D3.js + Python)
- 📱 Mobile Banking App (React Native)
- 📝 Headless CMS (Next.js + GraphQL)

GitHub에서 코드 품질과 프로젝트 구조를 확인해보세요. 궁금한 점이 있으시면 언제든 문의해주세요!`
    }

    // Default response
    return `흥미로운 질문이네요! 🤔 

죄송하지만 아직 해당 질문에 대한 구체적인 답변을 준비하지 못했습니다. 

대신 아래 주제들에 대해서는 자세히 답변드릴 수 있어요:
- 기술 스택과 개발 경험
- 프로젝트 소개와 작업 방식  
- 개발 철학과 협업 스타일
- 최근 관심사와 기술 트렌드
- 연락처와 협업 문의

궁금한 점이 있으시면 언제든 다시 질문해주세요! 😊

**연락처:** wabisabi.9547@gmail.com`
  }

  if (!isOpen) return null

  return (
    <>
      {/* Full Screen Backdrop */}
      <div 
        className="fixed inset-0 w-screen h-screen bg-background/60 backdrop-blur-md z-[100] portfolio-backdrop"
        onClick={onClose}
      />
      
      {/* Dialog Container */}
      <div className="fixed inset-0 w-screen h-screen z-[101] flex items-center justify-center p-2 sm:p-4 md:p-8">
        <div 
          className="w-full h-full max-w-4xl max-h-[98vh] sm:max-h-[95vh] glass rounded-3xl shadow-2xl flex flex-col overflow-hidden portfolio-dialog"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Chat Header */}
          <div className="card-glass p-6 flex-shrink-0 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">K</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background online-indicator">
                    <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
                  </div>
                </div>
                
                <div className="flex-1">
                  <h1 className="text-xl font-bold text-gradient">KISO AI Assistant</h1>
                  <p className="text-sm text-muted-foreground">풀스택 개발자 • 항상 온라인</p>
                </div>
                
                <div className="text-xs text-muted-foreground bg-primary/10 px-3 py-1 rounded-full">
                  실시간 대화
                </div>
              </div>
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full glass-subtle hover:bg-red-500/20 flex items-center justify-center transition-colors group"
              >
                <svg className="w-4 h-4 text-muted-foreground group-hover:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto space-y-4 p-6 scroll-smooth chat-container"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} chat-message ${message.type}`}
              >
                <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                  <div
                    className={`p-4 rounded-2xl message ${
                      message.type === 'user'
                        ? 'bg-primary text-white ml-auto'
                        : 'chat-message-glass'
                    }`}
                  >
                    <div className="prose prose-sm max-w-none">
                      <div
                        className={`whitespace-pre-wrap message-content ${
                          message.type === 'user' ? 'text-white' : 'text-foreground'
                        }`}
                        dangerouslySetInnerHTML={{
                          __html: message.content
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/## (.*?)$/gm, '<h3 class="text-lg font-bold mb-2 text-gradient">$1</h3>')
                            .replace(/- (.*?)$/gm, '<div class="flex items-start space-x-2 mb-1"><span class="text-primary mt-1">•</span><span>$1</span></div>')
                            .replace(/\n/g, '<br/>')
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className={`mt-2 text-xs text-muted-foreground message-timestamp ${
                    message.type === 'user' ? 'text-right' : 'text-left'
                  }`}>
                    {message.timestamp.toLocaleTimeString('ko-KR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
                
                {message.type === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mr-3 flex-shrink-0 order-1">
                    <span className="text-white font-bold text-sm">K</span>
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-white font-bold text-sm">K</span>
                </div>
                <div className="card-glass p-4 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          <div className="px-6 pb-4 flex-shrink-0">
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(question)}
                  className="px-3 py-2 text-sm glass-subtle rounded-full hover:glass transition-all duration-200 hover:scale-105 suggested-question"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="card-glass p-6 flex-shrink-0 border-t border-white/10 chat-input-container">
            <div className="flex space-x-4 items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
                placeholder="KISO에게 질문해보세요..."
                className="flex-1 bg-transparent border-0 outline-none text-foreground placeholder:text-muted-foreground chat-input"
                disabled={isTyping}
              />
              <button
                onClick={() => handleSendMessage(inputValue)}
                disabled={!inputValue.trim() || isTyping}
                className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed send-button"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            
            <div className="mt-3 text-xs text-muted-foreground text-center">
              💡 Gemini AI와 연동 준비 중 • 현재는 미리 준비된 응답을 제공합니다 • ESC로 닫기
            </div>
          </div>
        </div>
      </div>
    </>
  )
} 