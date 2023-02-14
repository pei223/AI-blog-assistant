import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  FormControl,
  Grid,
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

type FormErrors = {
  template: string
  temperature: string
  maxTokens: string
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
  const [errors, setErrors] = useState<FormErrors>({
    template: '',
    temperature: '',
    maxTokens: ''
  })

  useEffect(() => {
    setTemplate(value.template)
    setMaxTokens(value.max_tokens as number)
    setModel(value.model)
    setTemperature(value.temperature as number)
  }, [value])

  const isErrorExists = (): boolean => {
    return Object.values(errors).filter((e) => e !== '').length > 0
  }

  const isChanged = (): boolean => {
    return !(
      template === value.template &&
      model === value.model &&
      temperature === value.temperature &&
      maxTokens === value.max_tokens
    )
  }

  const submit = () => {
    if (isErrorExists()) {
      return
    }
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
  const onMaxTokenChange = (v: number) => {
    setMaxTokens(v)
    if (v > 2048 || v < 1) {
      setErrors({ ...errors, maxTokens: '1~2048にしてください' })
      return
    }
    setErrors({ ...errors, maxTokens: '' })
  }
  const onTemperatureChange = (v: number) => {
    setTemperature(v)
    if (v > 2 || v < 0) {
      setErrors({ ...errors, temperature: '0~2にしてください' })
      return
    }
    setErrors({ ...errors, temperature: '' })
  }
  const onTemplateChange = (v: string) => {
    if (v.length > 1000) {
      return
    }
    setTemplate(v)
    if (v.length === 0) {
      setErrors({ ...errors, template: '1~1000文字にしてください' })
      return
    }
    setErrors({ ...errors, template: '' })
  }

  return (
    <Card sx={{ p: 3 }}>
      <CardContent>
        <Typography variant="h5" component="div" marginBottom={2}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" marginBottom={3}>
          文章生成時の設定ができます。
        </Typography>
        <Box sx={{ pb: 2 }}>
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
        </Box>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item sm={6}>
            <TextField
              fullWidth
              value={temperature.toString()}
              label="temperature"
              type="number"
              variant="standard"
              error={errors.temperature !== ''}
              helperText={errors.temperature}
              onChange={(e) => {
                onTemperatureChange(Number(e.target.value))
              }}
            />
          </Grid>
          <Grid item sm={6}>
            <TextField
              fullWidth
              value={maxTokens.toString()}
              label="最大文字数"
              type="number"
              variant="standard"
              error={errors.maxTokens !== ''}
              helperText={errors.maxTokens}
              onChange={(e) => {
                onMaxTokenChange(Number(e.target.value))
              }}
            />
          </Grid>
        </Grid>
        <Box>
          <TextField
            fullWidth
            multiline
            label="テンプレート"
            rows={6}
            value={template}
            error={errors.template !== ''}
            helperText={`${template.length}/1000   ${errors.template}`}
            onChange={(e) => {
              onTemplateChange(e.target.value)
            }}
          />
        </Box>
      </CardContent>

      <CardActions>
        <Button
          color="primary"
          onClick={submit}
          disabled={!isChanged() || isErrorExists()}
          variant="contained"
        >
          保存
        </Button>
        <Button color="inherit" variant="outlined" onClick={reset}>
          初期値に戻す
        </Button>
      </CardActions>
    </Card>
  )
}

export default AiModelSettings
