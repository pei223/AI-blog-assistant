import {
  Configuration,
  CreateChatCompletionRequest,
  CreateCompletionRequest,
  OpenAIApi
} from 'openai'
import { ErrorPrefixTypeVal } from '../errors/types.cjs'
import { GenerateOption, GenerateOptionForChat, isChatModel } from './types.cjs'
import { join } from 'path'
import * as fs from 'fs'
import { AiSettingDict } from './types.cjs'
import { appDirPath } from '../storage/index.cjs'
import { isAuthError, isCanceled, isNotFound } from '../errors/index.cjs'
import { ExponentialBackoff } from '../utils/decorator.cjs'

export class OpenAiWrapper {
  openAiApi: OpenAIApi | null = null
  abortController: AbortController = new AbortController()

  setApiKey(apiKey: string) {
    this.openAiApi = new OpenAIApi(
      new Configuration({
        apiKey
      })
    )
  }

  @ExponentialBackoff(5, (e: any) => !isCanceled(e) && !isAuthError(e))
  async generateText(text: string, option: GenerateOption): Promise<string> {
    if (this.openAiApi == null) {
      throw new Error(
        `${ErrorPrefixTypeVal.OpenAiApiNotInitialized} not initialized`
      )
    }
    this.abortController = new AbortController()
    return isChatModel(option.model)
      ? this.execChatCompletion(text, option)
      : this.execCompletion(text, option)
  }

  async execChatCompletion(
    text: string,
    option: GenerateOption
  ): Promise<string> {
    const messages = text.split('\n').filter((t) => t !== '')
    // TODO asは使いたくないが、openai側のcreateCompletion/chatCompletionの型がほぼ同じだが微妙に違うため
    const chatOptions: GenerateOptionForChat = option as GenerateOptionForChat
    const request: CreateChatCompletionRequest = {
      ...chatOptions,
      messages: messages.map((t) => {
        return {
          content: t,
          role: 'user'
        }
      })
    }
    console.log(request)
    const completion = await this.openAiApi!.createChatCompletion(request, {
      signal: this.abortController.signal
    })
    console.log(completion.data.choices)
    const pop = completion.data.choices.pop()
    return pop?.message == null ? '' : pop.message.content
  }

  async execCompletion(text: string, option: GenerateOption): Promise<string> {
    const request: CreateCompletionRequest = {
      prompt: text,
      ...option
    }
    console.log(request)
    const completion = await this.openAiApi!.createCompletion(request, {
      signal: this.abortController.signal
    })
    const pop = completion.data.choices.pop()
    return pop?.text == null ? '' : pop.text
  }

  cancelGenerate() {
    this.abortController.abort()
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
