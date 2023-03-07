export type GenerateState = 'summary' | 'content' | 'canceling'
export type GenerateStep =
  | Extract<GenerateState, 'summary' | 'content'>
  | 'title'
export const GenerateStateText: Record<GenerateState, string> = {
  summary: '目次作成中...',
  content: 'ブログ記事作成中...',
  canceling: 'キャンセル中...'
}
