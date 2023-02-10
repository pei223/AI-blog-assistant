import {
  Button,
  Card,
  CardActions,
  CardContent,
  TextField,
  Typography
} from '@mui/material'
import React, { useEffect, useState } from 'react'
type Props = {
  value: string
  submitTitle?: string
  onSubmit: (keyVal: string) => void
}

const APIKeyForm: React.FC<Props> = ({
  value,
  submitTitle = '保存',
  onSubmit
}) => {
  const [keyValue, setKeyValue] = useState('')
  useEffect(() => {
    setKeyValue(value)
  }, [value])

  const submit = () => {
    if (keyValue === '') {
      return
    }
    onSubmit(keyValue)
  }

  return (
    <Card sx={{ p: 3 }}>
      <CardContent>
        <Typography variant="h6" marginBottom={'20px'}>
          OpenAI APIキー設定
        </Typography>
        <TextField
          fullWidth
          label="OpenAI APIキー"
          value={keyValue}
          onChange={(e) => {
            setKeyValue(e.target.value)
          }}
        />
        <Typography marginTop="20px">
          こちらのページからAPIキーは生成できます。
        </Typography>
        <a href="https://platform.openai.com/account/api-keys" target="__blank">
          https://platform.openai.com/account/api-keys
        </a>
        <Typography marginTop="20px">
          使用料はこちらから確認できます。
        </Typography>
        <a href="https://platform.openai.com/account/usage">
          https://platform.openai.com/account/usage
        </a>
      </CardContent>
      <CardActions>
        <Button onClick={submit} variant="contained">
          {submitTitle}
        </Button>
      </CardActions>
    </Card>
  )
}

export default APIKeyForm
