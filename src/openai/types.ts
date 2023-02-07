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
  max_tokens: 1024
}

export const INITIAL_CONTENT_AI_SETTING: AiSetting = {
  template: ContentTemplate,
  model: 'text-davinci-003',
  temperature: 0.8,
  max_tokens: 2048
}

export type ModelInfo = {
  name: string
  value: string
  description: string
}

export const ValidModels: ModelInfo[] = [
  {
    name: 'ada',
    value: 'text-ada-001',
    description: ''
  },
  {
    name: 'babbage',
    value: 'text-babbage-001',
    description: ''
  },
  {
    name: 'curie',
    value: 'text-curie-001',
    description: ''
  },
  {
    name: 'davinci',
    value: 'text-davinci-003',
    description: ''
  }
]

export const SUMMARY_SETTING_KEY = 'summary'
export const CONTENT_SETTING_KEY = 'content'
