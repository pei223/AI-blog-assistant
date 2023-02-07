import {
  Button,
  Card,
  CardActions,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { ValidModels, type AiSetting } from '../../openai/types'

type Props = {
  title: string
  value: AiSetting
  initValue: AiSetting
  onSubmit: (v: AiSetting) => void
}

const AiModelSettings: React.FC<Props> = ({
  title,
  value,
  initValue,
  onSubmit
}) => {
  const [template, setTemplate] = useState<string>(value.template)
  const [model, setModel] = useState<string>(value.model)
  const [temperature, setTemperature] = useState<number>(
    value.temperature as number
  )
  const [maxTokens, setMaxTokens] = useState<number>(value.max_tokens as number)

  useEffect(() => {
    setTemplate(value.template)
    setMaxTokens(value.max_tokens as number)
    setModel(value.model)
    setTemperature(value.temperature as number)
  }, [value])

  const submit = () => {
    onSubmit({
      max_tokens: maxTokens,
      temperature,
      model,
      template
    })
  }
  const reset = () => {
    setTemplate(initValue.template)
    setMaxTokens(initValue.max_tokens as number)
    setModel(initValue.model)
    setTemperature(initValue.temperature as number)
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          文章生成時の設定ができます。
        </Typography>
        <section>
          <FormControl fullWidth>
            <InputLabel id="model-select-label">モデル</InputLabel>
            <Select
              labelId="model-select-label"
              id="model-select"
              value={model}
              label="モデル"
              onChange={(e) => {
                setModel(e.target.value)
              }}
            >
              {ValidModels.map((m) => (
                <MenuItem key={m.value} value={m.value}>
                  {m.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </section>
        <section>
          <TextField
            value={temperature}
            label="temperature"
            type="number"
            onChange={(e) => {
              setTemperature(Number(e.target.value))
            }}
          />
          <TextField
            value={maxTokens}
            label="最大トークン数"
            type="number"
            onChange={(e) => {
              setMaxTokens(Number(e.target.value))
            }}
          />
        </section>
        <section>
          <FormControl fullWidth>
            <TextField
              fullWidth
              multiline
              label="テンプレート"
              rows={6}
              value={template}
              onChange={(e) => {
                setTemplate(e.target.value)
              }}
            />
          </FormControl>
        </section>
      </CardContent>

      <CardActions>
        <Button size="small" color="primary" onClick={submit}>
          保存
        </Button>
        <Button size="small" color="info" onClick={reset}>
          初期値に戻す
        </Button>
      </CardActions>
    </Card>
  )
}

export default AiModelSettings
