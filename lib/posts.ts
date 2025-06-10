import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const postsDirectory = path.join(process.cwd(), 'content/posts')

export interface PostData {
  id: string
  date: string
  title: string
  description?: string
  excerpt?: string
  category: string
  thumbnail?: string
  image?: string
  keywords?: string[]
  tags?: string[]
  readingTime?: number
  updatedAt?: string
  contentHtml?: string
  [key: string]: any
}

// 독서 시간 계산 함수 (평균 200 단어/분 기준)
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

export function getSortedPostsData(): PostData[] {
  const categoryFolders = fs.readdirSync(postsDirectory)

  const allPostsData = categoryFolders
    .flatMap((folder) => {
      const folderPath = path.join(postsDirectory, folder)
      if (!fs.statSync(folderPath).isDirectory()) return []

      const fileNames = fs.readdirSync(folderPath)
      return fileNames.map((fileName) => {
        const id = fileName.replace(/\.md$/, '')
        const fullPath = path.join(folderPath, fileName)
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const matterResult = matter(fileContents)

        return {
          id,
          category: folder,
          readingTime: calculateReadingTime(matterResult.content),
          ...matterResult.data,
        } as PostData
      })
    })
    .filter((post) => post) // Filter out any empty arrays if a non-directory was found

  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })
}

export async function getPostData(id: string): Promise<PostData> {
  let fullPath: string | undefined

  const categoryFolders = fs.readdirSync(postsDirectory)
  for (const folder of categoryFolders) {
    const folderPath = path.join(postsDirectory, folder)
    if (!fs.statSync(folderPath).isDirectory()) continue

    const potentialPath = path.join(folderPath, `${id}.md`)
    if (fs.existsSync(potentialPath)) {
      fullPath = potentialPath
      break
    }
  }

  if (!fullPath) {
    // This should be handled by the page calling this function, e.g., with notFound()
    // For now, we'll throw an error to make it clear.
    throw new Error(`Post with id ${id} not found.`)
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8')

  const matterResult = matter(fileContents)

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content)
  const contentHtml = processedContent.toString()

  // 카테고리 추출 (폴더명에서)
  const category = path.dirname(fullPath).split(path.sep).pop() || 'general'

  return {
    id,
    contentHtml,
    category,
    readingTime: calculateReadingTime(matterResult.content),
    ...matterResult.data,
  } as PostData
} 