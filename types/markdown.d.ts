declare module 'react-markdown' {
  import React from 'react'
  import { PluggableList } from 'unified'

  export interface ReactMarkdownOptions {
    children?: React.ReactNode
    remarkPlugins?: PluggableList
    components?: any
  }

  const ReactMarkdown: React.ComponentType<ReactMarkdownOptions>
  export default ReactMarkdown
  export type Components = any
}

declare module 'remark-gfm' {
  const gfm: any
  export default gfm
}

