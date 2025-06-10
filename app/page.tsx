import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getSortedPostsData, PostData } from '@/lib/posts'
import { Header } from '@/components/home/header'
import { SearchProvider } from '@/components/search/search-provider'
import { PortfolioButton } from '@/components/home/portfolio-button'

export const metadata: Metadata = {
  title: 'KISO | Full-Stack Developer & Tech Innovator',
  description: '현대적인 웹 기술과 혁신적인 사용자 경험을 통해 비즈니스 가치를 창출하는 풀스택 개발자입니다.',
  keywords: ['풀스택 개발자', 'Full-Stack Developer', 'React', 'Next.js', 'TypeScript', 'Node.js', 'KISO', '포트폴리오'],
  openGraph: {
    title: 'KISO | Full-Stack Developer & Tech Innovator',
    description: '현대적인 웹 기술과 혁신적인 사용자 경험을 통해 비즈니스 가치를 창출하는 풀스택 개발자입니다.',
    url: 'https://kiso.blog',
    siteName: 'KISO',
    type: 'website',
    locale: 'ko_KR',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'KISO',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KISO | Full-Stack Developer & Tech Innovator',
    description: '현대적인 웹 기술과 혁신적인 사용자 경험을 통해 비즈니스 가치를 창출하는 풀스택 개발자입니다.',
    images: ['/og-image.png'],
    creator: '@kiso',
  },
  alternates: {
    canonical: 'https://kiso.blog',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'KISO',
  alternateName: 'KISO Developer',
  description: '현대적인 웹 기술과 혁신적인 사용자 경험을 통해 비즈니스 가치를 창출하는 풀스택 개발자입니다.',
  jobTitle: 'Full-Stack Developer',
  knowsAbout: ['React', 'Next.js', 'TypeScript', 'Node.js', 'Web Development'],
  url: 'https://kiso.blog',
  author: {
    '@type': 'Person',
    name: 'KISO',
    url: 'https://kiso.blog'
  },
  publisher: {
    '@type': 'Person',
    name: 'KISO',
    url: 'https://kiso.blog'
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://kiso.blog'
  }
}

export default function HomePage() {
  const posts = getSortedPostsData()
  const featuredPosts = posts.slice(0, 3)
  const recentPosts = posts.slice(3, 15)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <SearchProvider posts={posts}>
        <div className="min-h-screen bg-background bg-mesh bg-noise relative overflow-hidden">
          <Header />
          
          {/* Subtle Particle Background */}
          <div className="fixed inset-0 opacity-20 pointer-events-none">
            <div className="absolute inset-0">
              <svg className="w-full h-full" viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g className="text-primary/30">
                  <circle cx="150" cy="120" r="1" fill="currentColor" className="animate-pulse">
                    <animateTransform
                      attributeName="transform"
                      type="translate"
                      values="0,0; 8,4; 0,0"
                      dur="8s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle cx="350" cy="180" r="0.8" fill="currentColor" className="animate-pulse">
                    <animateTransform
                      attributeName="transform"
                      type="translate"
                      values="0,0; -6,8; 0,0"
                      dur="10s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle cx="550" cy="100" r="1.2" fill="currentColor" className="animate-pulse">
                    <animateTransform
                      attributeName="transform"
                      type="translate"
                      values="0,0; 4,-6; 0,0"
                      dur="9s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle cx="750" cy="220" r="0.6" fill="currentColor" className="animate-pulse">
                    <animateTransform
                      attributeName="transform"
                      type="translate"
                      values="0,0; -10,2; 0,0"
                      dur="11s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle cx="950" cy="140" r="1.1" fill="currentColor" className="animate-pulse">
                    <animateTransform
                      attributeName="transform"
                      type="translate"
                      values="0,0; 6,10; 0,0"
                      dur="7s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle cx="1100" cy="200" r="0.9" fill="currentColor" className="animate-pulse">
                    <animateTransform
                      attributeName="transform"
                      type="translate"
                      values="0,0; -4,6; 0,0"
                      dur="12s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </g>
              </svg>
            </div>
          </div>
          
          {/* Hero Section */}
          <section className="relative pt-32 pb-32 overflow-hidden z-10">
            {/* V0 Style Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full">
                <svg className="w-full h-full" viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Geometric Grid Pattern */}
                  <defs>
                    <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                      <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" className="text-foreground/20"/>
                  
                  {/* Floating Geometric Shapes */}
                  <g className="text-primary/30">
                    <circle cx="200" cy="150" r="3" fill="currentColor" className="animate-pulse"/>
                    <circle cx="800" cy="200" r="2" fill="currentColor" className="animate-pulse" style={{animationDelay: '1s'}}/>
                    <circle cx="400" cy="400" r="4" fill="currentColor" className="animate-pulse" style={{animationDelay: '2s'}}/>
                    <circle cx="1000" cy="300" r="2.5" fill="currentColor" className="animate-pulse" style={{animationDelay: '0.5s'}}/>
                    <circle cx="150" cy="500" r="3.5" fill="currentColor" className="animate-pulse" style={{animationDelay: '1.5s'}}/>
                    <circle cx="900" cy="600" r="2" fill="currentColor" className="animate-pulse" style={{animationDelay: '3s'}}/>
                  </g>
                  
                  {/* Connecting Lines */}
                  <g className="text-primary/20" strokeWidth="0.5">
                    <line x1="200" y1="150" x2="400" y2="400" stroke="currentColor" className="opacity-50"/>
                    <line x1="800" y1="200" x2="1000" y2="300" stroke="currentColor" className="opacity-30"/>
                    <line x1="400" y1="400" x2="800" y2="200" stroke="currentColor" className="opacity-40"/>
                  </g>
                  
                  {/* Abstract AWS-style shapes */}
                  <g className="text-primary/15">
                    <rect x="100" y="100" width="20" height="4" rx="2" fill="currentColor" transform="rotate(45 110 102)"/>
                    <rect x="700" y="150" width="15" height="3" rx="1.5" fill="currentColor" transform="rotate(-30 707.5 151.5)"/>
                    <rect x="300" y="300" width="25" height="5" rx="2.5" fill="currentColor" transform="rotate(60 312.5 302.5)"/>
                    <rect x="850" y="400" width="18" height="4" rx="2" fill="currentColor" transform="rotate(-45 859 402)"/>
                    <rect x="50" y="600" width="22" height="4.5" rx="2.25" fill="currentColor" transform="rotate(30 61 602.25)"/>
                  </g>
                </svg>
              </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10">
              <div className="text-center">
                <div className="inline-flex items-center glass-subtle px-4 py-2 rounded-full mb-8">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-sm font-medium tracking-wide">Available for Work</span>
                </div>
                
                <div className="mb-8 flex justify-center">
                  <div className="kiso-3d">
                    <span className="kiso-3d-text">KISO</span>
                  </div>
                </div>
                
                <div className="max-w-2xl mx-auto mb-16">
                  <p className="text-xl md:text-2xl font-light mb-6 text-gradient-purple">
                    Full-Stack Developer
                  </p>
                  <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                    아름다운 코드로 의미있는 경험을 만들어갑니다
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <PortfolioButton />
                  <Link href="mailto:wabisabi.9547@gmail.com" className="btn-glass px-6 py-3 rounded-2xl">
                    연락하기
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* About Section */}
          <section className="py-32 relative z-10">
            <div className="max-w-6xl mx-auto px-6 lg:px-8">
              <div className="text-center mb-16">
                <div className="inline-flex items-center glass-subtle px-4 py-2 rounded-full mb-8">
                  <span className="text-sm font-medium tracking-wide">About KISO</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient tracking-wide">
                  풀스택 개발자의 여정
                </h2>
                <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
                  현대적인 기술과 사용자 중심의 설계로 비즈니스 가치를 창출하는 개발자입니다.
                  복잡한 문제를 단순하고 아름다운 솔루션으로 해결하는 것을 즐깁니다.
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Left Side - Stats & Info */}
                <div className="space-y-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="card-glass p-6 text-center">
                      <div className="text-3xl font-bold text-gradient mb-2">5+</div>
                      <div className="text-sm text-muted-foreground">년 경험</div>
                    </div>
                    <div className="card-glass p-6 text-center">
                      <div className="text-3xl font-bold text-gradient mb-2">50+</div>
                      <div className="text-sm text-muted-foreground">프로젝트</div>
                    </div>
                    <div className="card-glass p-6 text-center">
                      <div className="text-3xl font-bold text-gradient mb-2">3</div>
                      <div className="text-sm text-muted-foreground">회사 경력</div>
                    </div>
                    <div className="card-glass p-6 text-center">
                      <div className="text-3xl font-bold text-gradient mb-2">100%</div>
                      <div className="text-sm text-muted-foreground">열정</div>
                    </div>
                  </div>

                  <div className="card-glass p-6">
                    <h3 className="text-lg font-semibold mb-4 text-gradient">주요 전문 분야</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
                        <span className="text-sm">Frontend Development</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
                        <span className="text-sm">Backend Architecture</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                        <span className="text-sm">UI/UX Design</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
                        <span className="text-sm">DevOps & Cloud</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side - Description */}
                <div className="space-y-6">
                  <div className="card-glass p-8">
                    <h3 className="text-xl font-semibold mb-4 text-gradient">개발 철학</h3>
                    <div className="space-y-4 text-muted-foreground">
                      <p>
                        <strong className="text-foreground">사용자 중심</strong> - 
                        기술을 위한 기술이 아닌, 실제 사용자에게 가치를 제공하는 솔루션을 만들어갑니다.
                      </p>
                      <p>
                        <strong className="text-foreground">지속 가능한 코드</strong> - 
                        현재뿐만 아니라 미래의 확장과 유지보수를 고려한 코드를 작성합니다.
                      </p>
                      <p>
                        <strong className="text-foreground">끊임없는 학습</strong> - 
                        빠르게 변화하는 기술 환경에서 지속적인 학습과 성장을 추구합니다.
                      </p>
                    </div>
                  </div>

                  <div className="card-glass p-8">
                    <h3 className="text-xl font-semibold mb-4 text-gradient">핵심 기술</h3>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'React', 'Next.js', 'TypeScript', 'Node.js', 
                        'Python', 'PostgreSQL', 'AWS', 'Docker'
                      ].map((tech) => (
                        <span 
                          key={tech}
                          className="px-3 py-1 glass-subtle rounded-full text-sm font-medium hover:glass transition-all duration-200"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Featured Posts */}
          {featuredPosts.length > 0 && (
            <section className="py-32">
              <div className="max-w-6xl mx-auto px-6 lg:px-8">
                <div className="text-center mb-16">
                  <div className="inline-flex items-center glass-subtle px-4 py-2 rounded-full mb-8">
                    <span className="text-sm font-medium tracking-wide">Featured Articles</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient tracking-wide">
                    Latest Insights
                  </h2>
                  <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    기술 트렌드와 개발 경험을 공유하는 아티클들
                  </p>
                </div>
                
                <div className="grid lg:grid-cols-3 gap-8">
                  {featuredPosts.map((post: PostData, index: number) => (
                    <Link 
                      key={post.id} 
                      href={`/blog/${post.id}`}
                      className={`card-glass group ${index === 0 ? 'lg:col-span-2 lg:row-span-2' : ''}`}
                    >
                      <div className="p-8">
                        {(post.thumbnail || post.image) && (
                          <div className="relative mb-6 overflow-hidden rounded-xl">
                            <Image
                              src={(post.thumbnail || post.image) as string}
                              alt={post.title}
                              width={index === 0 ? 800 : 400}
                              height={index === 0 ? 450 : 225}
                              className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                        )}
                        
                        <div className="flex items-center gap-3 mb-4">
                          {post.tags?.slice(0, 2).map((tag: string) => (
                            <span 
                              key={tag}
                              className="px-3 py-1 rounded-full text-xs font-medium glass-subtle"
                            >
                              {tag}
                            </span>
                          ))}
                          {post.tags && post.tags.length > 2 && (
                            <span className="px-3 py-1 rounded-full text-xs font-medium glass-subtle text-muted-foreground">
                              +{post.tags.length - 2}
                            </span>
                          )}
                        </div>
                        
                        <h3 className={`mb-3 text-gradient group-hover:text-gradient-purple transition-colors ${
                          index === 0 ? 'text-2xl md:text-3xl' : 'text-xl'
                        }`}>
                          {post.title}
                        </h3>
                        
                        {post.excerpt && (
                          <p className="text-muted-foreground mb-4">
                            {post.excerpt}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{new Date(post.date).toLocaleDateString('ko-KR')}</span>
                          {post.readingTime && (
                            <span>{post.readingTime}분 읽기</span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Recent Posts */}
          {recentPosts.length > 0 && (
            <section id="recent" className="py-32">
              <div className="max-w-6xl mx-auto px-6 lg:px-8">
                <div className="text-center mb-16">
                  <div className="inline-flex items-center glass-subtle px-4 py-2 rounded-full mb-8">
                    <span className="text-sm font-medium tracking-wide">More Articles</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient tracking-wide">
                    Recent Stories
                  </h2>
                  <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    개발 여정과 기술적 통찰을 담은 최신 아티클들
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {recentPosts.map((post: PostData) => (
                    <Link 
                      key={post.id} 
                      href={`/blog/${post.id}`}
                      className="card-glass group"
                    >
                      <div className="p-6">
                        {(post.thumbnail || post.image) && (
                          <div className="relative mb-4 overflow-hidden rounded-lg">
                            <Image
                              src={(post.thumbnail || post.image) as string}
                              alt={post.title}
                              width={400}
                              height={200}
                              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2 mb-3 min-h-[2rem]">
                          {post.tags?.slice(0, 2).map((tag: string) => (
                            <span 
                              key={tag}
                              className="px-2 py-1 rounded-full text-xs font-medium glass-subtle shrink-0 truncate max-w-[80px]"
                              title={tag}
                            >
                              {tag}
                            </span>
                          ))}
                          {post.tags && post.tags.length > 2 && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium glass-subtle shrink-0 text-muted-foreground">
                              +{post.tags.length - 2}
                            </span>
                          )}
                        </div>
                        
                        <h3 className="text-lg mb-2 text-gradient group-hover:text-gradient-purple transition-colors">
                          {post.title}
                        </h3>
                        
                        {post.excerpt && (
                          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                            {post.excerpt}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{new Date(post.date).toLocaleDateString('ko-KR')}</span>
                          {post.readingTime && (
                            <span>{post.readingTime}분</span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                
                <div className="text-center mt-12">
                  <Link 
                    href="/blog"
                    className="btn-glass-strong"
                  >
                    모든 글 보기
                  </Link>
                </div>
              </div>
            </section>
          )}
        </div>
                {/* Chatbot */}
      </SearchProvider>
    </>
  )
}
