import { debugLog, errorLog } from '../logger'
import { type AiSettingDict, type GenerateOption } from '../openai/types'

const electronPrefix = '[to electron] '

const LogWrapper = () => {
  return (
    // eslint-disable-next-line @typescript-eslint/ban-types
    _target: Object,
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ) => {
    const defaultFunc = descriptor.value
    descriptor.value = function (...args: any[]) {
      debugLog(`${electronPrefix}(${_propertyKey}): Exec`, ...args)
      try {
        const ret = defaultFunc.apply(this, args)
        debugLog(`${electronPrefix}(${_propertyKey}): Success`, ret)
        return ret
      } catch (e) {
        if (e instanceof Error) {
          errorLog(`${electronPrefix}(${_propertyKey}): Error [${e.message}]`)
        } else {
          errorLog(`${electronPrefix}(${_propertyKey}): Unexpected throw`, e)
        }
        throw e
      }
    }
  }
}

class ElectronModule {
  @LogWrapper()
  async getAPIKey(): Promise<string> {
    return await window.mainProcess.getAPIKey()
  }

  @LogWrapper()
  async setAPIKey(keyVal: string): Promise<void> {
    await window.mainProcess.setAPIKey(keyVal)
  }

  @LogWrapper()
  async generateText(text: string, option: GenerateOption): Promise<string> {
    return await window.mainProcess.generateText(text, option)
  }

  @LogWrapper()
  async cancelGenerate(): Promise<void> {
    await window.mainProcess.cancelGenerate()
  }

  @LogWrapper()
  async getAiSettingDict(): Promise<AiSettingDict> {
    return await window.mainProcess.getAiSettingDict()
  }

  @LogWrapper()
  async setAiSettingDict(v: AiSettingDict) {
    await window.mainProcess.setAiSettingDict(v)
  }
}

export const electronModule = new ElectronModule()
