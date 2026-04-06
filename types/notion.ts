export type NotionPost = {
  id: string
  title: string
  category: string
  tags: string[]
  published: string
  status: 'draft' | 'published'
  slug: string
}

export type NotionBlock = {
  id: string
  type: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}
