import { CreateChatCompletionRequest, CreateCompletionRequest } from 'openai'

export type GenerateOption = Omit<CreateCompletionRequest, 'prompt'>
export type GenerateOptionForChat = Omit<
  CreateChatCompletionRequest,
  'messages'
>

export type AiSetting = GenerateOption & {
  template: string
}

export type AiSettingDict = Record<string, AiSetting>

export const isChatModel = (modelName: string): boolean => {
  // TODO モデルを増やす場合ちゃんとした判定が必要
  return modelName.includes('gpt')
}
