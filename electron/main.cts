import { app, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import {
  openAiWrapper,
  setAiSettingDict,
  getAiSettingDict
} from './openai/index.cjs'
import { GenerateOption } from './openai/types.cjs'
import { getApiKey, setApiKey } from './settings/index.cjs'
import { type AiSettingDict } from './openai/types.cjs'

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title: 'AI blog assistant',
    webPreferences: {
      preload: join(__dirname, 'preload.cjs')
    }
  })

  ipcMain.handle('get-api-key', async (_e, _arg): Promise<string> => {
    return getApiKey()
  })

  ipcMain.handle('set-api-key', async (_e, keyVal: string): Promise<void> => {
    setApiKey(keyVal)
    openAiWrapper.setApiKey(keyVal)
  })

  ipcMain.handle(
    'generate-text',
    async (_e, text: string, option: GenerateOption): Promise<string> => {
      return await openAiWrapper.generateText(text, option)
    }
  )

  ipcMain.handle('cancel-generate', async (_e): Promise<void> => {
    openAiWrapper.cancelGenerate()
  })

  ipcMain.handle('get-ai-setting-dict', async (_e): Promise<AiSettingDict> => {
    return await getAiSettingDict()
  })

  ipcMain.handle(
    'set-ai-setting-dict',
    async (_e, settingDict: AiSettingDict): Promise<void> => {
      await setAiSettingDict(settingDict)
    }
  )

  // eslint-disable-next-line @typescript-eslint/no-floating-promises, n/no-path-concat
  mainWindow.loadURL(`file://${__dirname}/../renderer/index.html`)
}

app.once('ready', () => {
  createWindow()
})

app.once('window-all-closed', () => app.quit())
