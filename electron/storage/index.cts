import { app } from 'electron'
import { join } from 'path'

export const appDirPath = (): string => {
  const userData = app.getPath('home')
  return join(userData, '/.ai_blog_assistant')
}
