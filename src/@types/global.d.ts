// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="node">

declare namespace NodeJS {
  interface ImportMetaEnv {
    MODE: 'development' | 'production'
  }
}

interface Window {
  mainProcess: MainProcess
}
declare let window: Window

interface MainProcess {
  getAPIKey: () => Promise<string>
  setAPIKey: (keyVal: string) => Promise<void>
  getAiSettingDict: () => Promise<AiSettingDict>
  setAiSettingDict: (dict: AiSettingDict) => Promise<void>
  generateText: (text: string, option: GenerateOption) => Promise<string>
  cancelGenerate: () => Promise<void>
}
