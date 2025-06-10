import { getPostData, getSortedPostsData } from '@/lib/posts'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { remark } from 'remark'
import html from 'remark-html'
import Image from 'next/image'
import { Metadata } from 'next'
import { Header } from '@/components/home/header'
import { Footer } from '@/components/home/footer'

interface PageProps {
  params: Promise<{
    slug: string[]
  }>
}

export async function generateStaticParams() {
  const posts = getSortedPostsData()
  return posts.map((post) => ({
    slug: [post.id],
  }))
}

export async function generateMetadata({
  params
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const slugString = Array.isArray(slug) ? slug[0] : slug

  try {
    const postData = await getPostData(slugString)

    return {
      title: postData.title,
      description: postData.description || postData.excerpt,
      keywords: postData.keywords?.join(', '),
      authors: [{ name: 'KoreaTrendNow Editorial Team' }],
      openGraph: {
        title: postData.title,
        description: postData.description || postData.excerpt,
        type: 'article',
        publishedTime: postData.date,
        modifiedTime: postData.updatedAt || postData.date,
        authors: ['KoreaTrendNow Editorial Team'],
        images: postData.thumbnail ? [
          {
            url: postData.thumbnail,
            width: 1200,
            height: 630,
            alt: postData.title,
          }
        ] : [],
        tags: postData.tags,
      },
      twitter: {
        card: 'summary_large_image',
        title: postData.title,
        description: postData.description || postData.excerpt,
        images: postData.thumbnail ? [postData.thumbnail] : [],
      },
    }
  } catch (error) {
    return {
      title: 'Post Not Found',
      description: 'The requested post could not be found.',
    }
  }
}

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params
  const slugString = Array.isArray(slug) ? slug[0] : slug

  try {
    const postData = await getPostData(slugString)
    const processedContent = await remark().use(html).process(postData.content)
    const contentHtml = processedContent.toString()

    // Calculate reading time
    const wordsPerMinute = 200
    const wordCount = postData.content.split(/\s+/).length
    const readingTime = Math.ceil(wordCount / wordsPerMinute)

    // JSON-LD structured data
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: postData.title,
      description: postData.description || postData.excerpt,
      image: postData.thumbnail ? [postData.thumbnail] : [],
      datePublished: postData.date,
      dateModified: postData.updatedAt || postData.date,
      author: {
        '@type': 'Organization',
        name: 'KoreaTrendNow Editorial Team',
        url: 'https://koreatrendnow.com'
      },
      publisher: {
        '@type': 'Organization',
        name: 'KoreaTrendNow',
        logo: {
          '@type': 'ImageObject',
          url: 'https://koreatrendnow.com/logo.png'
        }
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://koreatrendnow.com/blog/${postData.id}`
      },
      keywords: postData.tags?.join(', '),
      wordCount: wordCount,
      timeRequired: `PT${readingTime}M`,
      inLanguage: 'ko-KR',
      isAccessibleForFree: true
    }

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        <main className="min-h-screen">
        <Header />
        
        {/* Hero Section */}
        <section className="pt-32 pb-16 px-6">
          <div className="max-w-4xl mx-auto">
            {/* Category and Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <Link 
                href={`/blog?category=${postData.category}`}
                className="px-4 py-2 glass-subtle text-sm font-medium rounded-full hover:glass transition-colors"
              >
                {postData.category}
              </Link>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <time dateTime={postData.date}>
                  {new Date(postData.date).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
                <span>•</span>
                <span>{readingTime}분 읽기</span>
                {postData.updatedAt && postData.updatedAt !== postData.date && (
                  <>
                    <span>•</span>
                    <span>
                      업데이트: {new Date(postData.updatedAt).toLocaleDateString('ko-KR', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extralight tracking-tight leading-tight mb-8 text-gradient text-shadow-glow">
              {postData.title}
            </h1>

            {/* Description */}
            {postData.description && (
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-12 font-light">
                {postData.description}
              </p>
            )}

            {/* Hero Image */}
            {postData.thumbnail && (
              <div className="aspect-video overflow-hidden rounded-3xl mb-16 glass border border-border/20">
                <Image
                  src={postData.thumbnail}
                  alt={postData.title}
                  width={1200}
                  height={630}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
            )}
          </div>
        </section>

        {/* Content */}
        <article className="pb-24 px-6">
          <div className="max-w-4xl mx-auto">
            <div 
              className="markdown"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
            
            {/* Tags */}
            {postData.tags && postData.tags.length > 0 && (
              <div className="mt-16 pt-8 border-t border-border/30">
                <h3 className="text-lg font-semibold mb-4">태그</h3>
                <div className="flex flex-wrap gap-2">
                  {postData.tags.map((tag) => (
                                          <Link
                        key={tag}
                        href={`/blog?tag=${encodeURIComponent(tag)}`}
                        className="px-3 py-1 bg-slate-700/50 text-sm rounded-full hover:bg-slate-700 transition-colors text-slate-300"
                      >
                        #{tag}
                      </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Author Info */}
            <div className="mt-16 pt-8 border-t border-border/30">
              <div className="glass rounded-2xl p-8">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">K</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">KoreaTrendNow Editorial Team</h3>
                    <p className="text-slate-400 leading-relaxed">
                      한국의 최신 정보와 실용 팁을 제공하는 전문 에디터팀입니다. 
                      정책, 경제, 생활정보 분야의 정확하고 유용한 가이드를 제공합니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="mt-16 pt-8 border-t border-border/30">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link 
                  href="/blog"
                  className="group flex items-center space-x-3 p-6 glass rounded-2xl card-glass"
                >
                  <svg className="w-6 h-6 text-muted-foreground group-hover:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                  <div>
                    <h4 className="font-semibold group-hover:text-purple-400 transition-colors">모든 정보</h4>
                    <p className="text-sm text-muted-foreground">다른 글도 둘러보기</p>
                  </div>
                </Link>
                
                <Link 
                  href="/"
                  className="group flex items-center space-x-3 p-6 glass rounded-2xl card-glass"
                >
                  <svg className="w-6 h-6 text-muted-foreground group-hover:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <div>
                    <h4 className="font-semibold group-hover:text-purple-400 transition-colors">홈으로</h4>
                    <p className="text-sm text-muted-foreground">KoreaTrendNow 메인 페이지</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </article>

        <Footer />
      </main>
      </>
    )
  } catch (error) {
    console.error('BlogPost error:', error)
    notFound()
  }
} 