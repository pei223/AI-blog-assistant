import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  FormControl,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import {
  getModelFromValue,
  ValidModels,
  type AiSetting
} from '../../openai/types'
import HelpDialogButton from '../atoms/HelpDialogButton'
import ModelEstimate from './ModelEstimate'

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
  useEffect(() => {
    onMaxTokenChange(maxTokens)
  }, [model])

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
  const onModelChange = (v: string) => {
    setModel(v)
  }
  const onMaxTokenChange = (v: number) => {
    setMaxTokens(v)
    const maxLen = getModelFromValue(model).maxToken
    if (v > maxLen || v < 1) {
      setErrors({ ...errors, maxTokens: `1~${maxLen}にしてください` })
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
        <Typography
          variant="h5"
          component="div"
          marginBottom={4}
          sx={{
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {title}
        </Typography>

        <Box sx={{ mb: 4, display: 'flex', flexDirection: 'row' }}>
          <FormControl fullWidth>
            <InputLabel id="model-select-label">モデル</InputLabel>
            <Select
              fullWidth
              labelId="model-select-label"
              id="model-select"
              value={model}
              label="モデル"
              onChange={(e) => {
                onModelChange(e.target.value)
              }}
            >
              {ValidModels.map((m) => (
                <MenuItem key={m.value} value={m.value}>
                  {m.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <HelpDialogButton
            title="AIモデル"
            textArr={[
              '生成に使用するモデルを選択できます。',
              '一番上のadaが一番コストが安く性能が悪く、一番下のdavinciがコストが高いが性能が高いです。',
              '現状davinci以外は性能が悪いです。'
            ]}
            referenceUrl="https://platform.openai.com/docs/models/gpt-3"
          />
        </Box>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item sm={6}>
            <TextField
              fullWidth
              value={temperature.toString()}
              label="temperature(ランダム性)"
              type="number"
              variant="standard"
              error={errors.temperature !== ''}
              helperText={errors.temperature}
              onChange={(e) => {
                onTemperatureChange(Number(e.target.value))
              }}
              InputProps={{
                endAdornment: (
                  <HelpDialogButton
                    title="temperature(ランダム性)"
                    textArr={[
                      '出力するデータのランダム性を0~2で小数で設定できます。',
                      '0であれば確定的な文になり、毎回同じ文章を生成します。',
                      '2であれば完全にランダムになり文章としての意味が通らなくなります。',
                      '1付近が一番ちょうど良いと考えられます。'
                    ]}
                    referenceUrl="https://platform.openai.com/docs/api-reference/completions/create#completions/create-temperature"
                  />
                )
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
              InputProps={{
                endAdornment: (
                  <HelpDialogButton
                    title="最大文字数(max_tokens)"
                    textArr={[
                      '最大文字数を1~2048(davinciのみ3000)まで指定できます。',
                      'あくまで最大値であり、2048に指定しても2048に近い文字数にはなりません。'
                    ]}
                    referenceUrl="https://platform.openai.com/docs/api-reference/completions/create#completions/create-max_tokens"
                  />
                )
              }}
            />
          </Grid>
        </Grid>
        <Box sx={{ mb: 4 }}>
          <FormControl fullWidth>
            <FormLabel
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              テンプレート
              <HelpDialogButton
                title="テンプレート"
                textArr={[
                  '文章生成時にAIに指定する文章のテンプレートを設定できます。',
                  '<...>部分には実行時に文字列が埋め込まれます。(<title>ならタイトルなど)'
                ]}
              />
            </FormLabel>
            <TextField
              multiline
              rows={6}
              value={template}
              error={errors.template !== ''}
              helperText={`${template.length}/1000   ${errors.template}`}
              onChange={(e) => {
                onTemplateChange(e.target.value)
              }}
              inputProps={{
                style: {
                  fontSize: '0.9rem'
                }
              }}
            />
          </FormControl>
        </Box>
        <Box sx={{ mb: 1 }}>
          <ModelEstimate
            maxTokens={maxTokens}
            modelInfo={ValidModels.filter((m) => m.value === model)[0]}
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
