import { Button, Container } from '@mui/material'
import React from 'react'
import { type FallbackProps } from 'react-error-boundary'
import { isAuthError, isTooManyRequestError } from './errors'

const AppErrorFallback: React.FC<FallbackProps> = ({
  error,
  resetErrorBoundary
}) => {
  let title = 'エラー'
  let message = '予期しないエラーが発生しました。'
  let detail = `${error.message}: ${error.message}`
  if (isAuthError(error)) {
    title = '認証エラー'
    message = 'APIキーが正しくありません。再設定してください。'
    detail = ''
  } else if (isTooManyRequestError(error)) {
    title = 'API実行エラー'
    message =
      '短期間で多く実行したため一時的にOpenAIを利用できなくなっています。時間を置いてから実行してください。'
    detail = ''
  }
  return (
    <Container sx={{ pt: 8 }}>
      <h1>{title}</h1>
      <p>{message}</p>
      {detail !== '' && (
        <div>
          <p>エラー詳細情報</p>
          <p>{detail}</p>
        </div>
      )}
      <Button sx={{ mt: 4 }} variant="contained" onClick={resetErrorBoundary}>
        リロードする
      </Button>
    </Container>
  )
}

export default AppErrorFallback
