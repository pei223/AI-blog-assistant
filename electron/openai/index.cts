import { Configuration, CreateCompletionRequest, OpenAIApi } from 'openai'
import { ErrorPrefixTypeVal } from '../errors/types.cjs'
import { GenerateOption, InitialGenerateOption } from './types.cjs'
import { join } from 'path'
import * as fs from 'fs'
import { AiSettingDict } from './types.cjs'
import { appDirPath } from '../storage/index.cjs'
import { isNotFound } from '../errors/index.cjs'

export class OpenAiWrapper {
  openAiApi: OpenAIApi | null = null

  setApiKey(apiKey: string) {
    this.openAiApi = new OpenAIApi(
      new Configuration({
        apiKey
      })
    )
  }

  async generateText(text: string, option?: GenerateOption): Promise<string> {
    if (this.openAiApi == null) {
      throw new Error(
        `${ErrorPrefixTypeVal.OpenAiApiNotInitialized} not initialized`
      )
    }
    const genOption = {
      ...InitialGenerateOption,
      ...(option == null ? {} : option)
    }
    const completion = await this.openAiApi.createCompletion({
      prompt: text,
      ...genOption
    })
    const pop = completion.data.choices.pop()
    return pop?.text == null ? '' : pop.text
  }
}

export const openAiWrapper = new OpenAiWrapper()

const aiSettingFilePath = (): string => {
  return join(appDirPath(), '/ai_setting.json')
}

export const getAiSettingDict = (): AiSettingDict => {
  try {
    const buffer = fs.readFileSync(aiSettingFilePath())
    const aiSetting = JSON.parse(buffer.toString()) as AiSettingDict
    return aiSetting
  } catch (e) {
    // not found
    if (isNotFound(e)) {
      return {}
    }
    console.log(e)
    throw e
  }
}

export const setAiSettingDict = (settingDict: AiSettingDict) => {
  try {
    fs.writeFileSync(aiSettingFilePath(), JSON.stringify(settingDict))
  } catch (e) {
    console.log(e)
    throw e
  }
}
