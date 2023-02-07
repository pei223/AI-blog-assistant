import { CreateCompletionRequest } from 'openai'

export type GenerateOption = Omit<CreateCompletionRequest, 'prompt'>

export type AiSetting = GenerateOption & {
  template: string
}

export type AiSettingDict = Record<string, AiSetting>
