import { debugLog, errorLog } from '../logger'
import { type GenerateOption } from '../openai/types'

const electronPrefix = '[to electron] '

// TODO aiSettingDict周りも追加したい
// TODO ここ全部デコレータとかでできたら楽
export const getAPIKey = async (): Promise<string> => {
  if (import.meta.env.MODE !== 'production') {
    debugLog(`${electronPrefix} getAPIKey`)
  }
  try {
    const ret = await window.mainProcess.getAPIKey()
    debugLog(`${electronPrefix} getAPIKey success: `, ret)
    return ret
  } catch (e) {
    if (e instanceof Error) {
      errorLog(`${electronPrefix} getAPIKey error: ${e.message}`)
    }
    throw e
  }
}

export const setAPIKey = async (keyVal: string): Promise<void> => {
  if (import.meta.env.MODE !== 'production') {
    debugLog(`${electronPrefix} setAPIKey: ${keyVal}`)
  }
  try {
    await window.mainProcess.setAPIKey(keyVal)
    debugLog(`${electronPrefix} setAPIKey success`)
  } catch (e) {
    if (e instanceof Error) {
      errorLog(`${electronPrefix} setAPIKey error: ${e.message}`)
    }
  }
}

export const generateText = async (
  text: string,
  option: GenerateOption
): Promise<string> => {
  if (import.meta.env.MODE !== 'production') {
    debugLog(`${electronPrefix} generateText: ${text}`, option)
  }
  try {
    const ret = await window.mainProcess.generateText(text, option)
    debugLog(`${electronPrefix} generateText success`, ret)
    return ret
  } catch (e) {
    if (e instanceof Error) {
      errorLog(`${electronPrefix} generateText error: ${e.message}`)
    }
    throw e
  }
}

export const cancelGenerate = async (): Promise<void> => {
  try {
    debugLog(`${electronPrefix} cancelGenerate`)
    await window.mainProcess.cancelGenerate()
  } catch (e) {
    if (e instanceof Error) {
      errorLog(`${electronPrefix} cancelGenerate error: ${e.message}`)
    }
    throw e
  }
}
