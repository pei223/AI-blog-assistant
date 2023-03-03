import { type CreateCompletionRequest } from 'openai'
import { ContentTemplate, SummaryTemplate } from './template'

export type GenerateOption = Omit<CreateCompletionRequest, 'prompt'>

export type AiSetting = GenerateOption & {
  template: string
}
export type AiSettingDict = Record<string, AiSetting>

export const INITIAL_SUMMARY_AI_SETTING: AiSetting = {
  template: SummaryTemplate,
  model: 'text-davinci-003',
  temperature: 0.8,
  max_tokens: 512
}

export const INITIAL_CONTENT_AI_SETTING: AiSetting = {
  template: ContentTemplate,
  model: 'gpt-3.5-turbo',
  temperature: 0.8,
  max_tokens: 1024
}

export type ModelInfo = {
  name: string
  value: string
  description: string
  dollarPerKiloTokens: number
  maxToken: number
}

export const ValidModels: ModelInfo[] = [
  {
    name: 'ada',
    value: 'text-ada-001',
    description: '',
    dollarPerKiloTokens: 0.0004,
    maxToken: 2048
  },
  {
    name: 'babbage',
    value: 'text-babbage-001',
    description: '',
    dollarPerKiloTokens: 0.0005,
    maxToken: 2048
  },
  {
    name: 'curie',
    value: 'text-curie-001',
    description: '',
    dollarPerKiloTokens: 0.002,
    maxToken: 2048
  },
  {
    name: 'davinci',
    value: 'text-davinci-003',
    description: '',
    dollarPerKiloTokens: 0.02,
    maxToken: 3000
  },
  {
    name: 'gpt-3.5',
    value: 'gpt-3.5-turbo',
    description: '',
    dollarPerKiloTokens: 0.002,
    maxToken: 3000
  }
]

export const getModelFromValue = (v: string) => {
  const result = ValidModels.filter((m) => m.value === v)
  if (result.length !== 1) {
    throw Error(`${v} is invalid model value`)
  }
  return result[0]
}

export const SUMMARY_SETTING_KEY = 'summary'
export const CONTENT_SETTING_KEY = 'content'
