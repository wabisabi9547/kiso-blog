import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getSortedPostsData, PostData } from '@/lib/posts'
import { Header } from '@/components/home/header'
import { SearchProvider } from '@/components/search/search-provider'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{
    category: string
  }>
}

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

export function generateStaticParams() {
  const posts = getSortedPostsData()
  const categories = [...new Set(posts.map(post => post.category))]
  
  return categories.map((category) => ({
    category: category,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  const categoryName = categoryLabels[category] || category
  
  return {
    title: `${categoryName} | KISO`,
    description: `${categoryName} 관련 글들을 모아봤습니다.`,
    alternates: {
      canonical: `https://kiso.blog/blog/category/${category}`,
    },
  }
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params
  const allPosts = getSortedPostsData()
  const categoryPosts = allPosts.filter(post => post.category === category)
  
  if (categoryPosts.length === 0) {
    notFound()
  }
  
  const categoryName = categoryLabels[category] || category

  return (
    <>
      <SearchProvider posts={allPosts}>
        <div className="min-h-screen bg-background bg-mesh bg-noise">
          <Header />
          
          {/* Hero Section */}
          <section className="pt-32 pb-20">
            <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
              <div className="inline-flex items-center glass-subtle px-4 py-2 rounded-full mb-8">
                <span className="text-sm font-medium">{categoryName}</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-extralight mb-6 text-gradient text-shadow-glow">
                {categoryName}
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12">
                {categoryPosts.length}개의 글
              </p>
              
              <Link href="/blog" className="btn-glass">
                ← 모든 글 보기
              </Link>
            </div>
          </section>

          {/* Posts List */}
          <section className="py-20">
            <div className="max-w-6xl mx-auto px-6 lg:px-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categoryPosts.map((post: PostData) => (
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
                        {post.tags?.slice(0, 3).map((tag: string) => (
                          <span 
                            key={tag}
                            className="px-2 py-0.5 rounded-full text-xs font-medium glass-subtle shrink-0 truncate max-w-[80px]"
                            title={tag}
                          >
                            {tag}
                          </span>
                        ))}
                        {post.tags && post.tags.length > 3 && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium glass-subtle shrink-0 text-muted-foreground">
                            +{post.tags.length - 3}
                          </span>
                        )}
                      </div>
                      
                      <h3 className="text-lg mb-2 text-gradient group-hover:text-gradient-purple transition-colors line-clamp-2 flex-shrink-0">
                        {post.title}
                      </h3>
                      
                      {post.excerpt && (
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-grow">
                          {post.excerpt}
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
            </div>
          </section>
        </div>
      </SearchProvider>
    </>
  )
} 