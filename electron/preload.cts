import { ipcRenderer, contextBridge } from 'electron'
import { AiSettingDict, GenerateOption } from './openai/types.cjs'

contextBridge.exposeInMainWorld('mainProcess', {
  getAPIKey: async (): Promise<string> =>
    await ipcRenderer.invoke('get-api-key'),
  setAPIKey: async (keyVal: string) =>
    await ipcRenderer.invoke('set-api-key', keyVal),
  getAiSettingDict: async (): Promise<AiSettingDict> =>
    await ipcRenderer.invoke('get-ai-setting-dict'),
  setAiSettingDict: async (dict: AiSettingDict) =>
    await ipcRenderer.invoke('set-ai-setting-dict', dict),
  generateText: async (text: string, option: GenerateOption): Promise<string> =>
    await ipcRenderer.invoke('generate-text', text, option),
  cancelGenerate: async (): Promise<void> => {
    await ipcRenderer.invoke('cancel-generate')
  }
})
