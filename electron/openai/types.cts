import { CreateCompletionRequest } from 'openai'

export type GenerateOption = Omit<CreateCompletionRequest, 'prompt'>

export const InitialGenerateOption: GenerateOption = {
  model: 'text-davinci-003',
  temperature: 0.8,
  max_tokens: 250
}

export type AiSetting = GenerateOption & {
  template: string
}

export type AiSettingDict = Record<string, AiSetting>
