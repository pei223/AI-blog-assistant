import { app } from 'electron'
import { join } from 'path'
import * as fs from 'fs'

// TODO なければ作成は良くない気がする
export const appDirPath = (): string => {
  const userData = app.getPath('home')
  const dirPath = join(userData, '/.ai_blog_assistant')
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
  return dirPath
}
