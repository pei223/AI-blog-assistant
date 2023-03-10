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
      setErrors({ ...errors, maxTokens: `1~${maxLen}?????????????????????` })
      return
    }
    setErrors({ ...errors, maxTokens: '' })
  }
  const onTemperatureChange = (v: number) => {
    setTemperature(v)
    if (v > 2 || v < 0) {
      setErrors({ ...errors, temperature: '0~2?????????????????????' })
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
      setErrors({ ...errors, template: '1~1000???????????????????????????' })
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
            <InputLabel id="model-select-label">?????????</InputLabel>
            <Select
              fullWidth
              labelId="model-select-label"
              id="model-select"
              value={model}
              label="?????????"
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
            title="AI?????????"
            textArr={[
              '??????????????????????????????????????????????????????',
              `????????????${
                ValidModels[0].name
              }?????????????????????????????????????????????????????????${
                ValidModels[ValidModels.length - 1].name
              }????????????????????????????????????????????????`,
              '??????davinci/gpt-3.5?????????????????????????????????'
            ]}
            referenceUrl="https://platform.openai.com/docs/models/gpt-3"
          />
        </Box>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item sm={6}>
            <TextField
              fullWidth
              value={temperature.toString()}
              label="temperature(???????????????)"
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
                    title="temperature(???????????????)"
                    textArr={[
                      '??????????????????????????????????????????0~2?????????????????????????????????',
                      '0??????????????????????????????????????????????????????????????????????????????',
                      '2????????????????????????????????????????????????????????????????????????????????????????????????',
                      '1?????????????????????????????????????????????????????????'
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
              label="???????????????"
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
                    title="???????????????(max_tokens)"
                    textArr={[
                      '??????????????????1~2048(davinci/gpt-3.5??????3000)???????????????????????????',
                      '?????????????????????????????????2048??????????????????2048??????????????????????????????????????????'
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
              ??????????????????
              <HelpDialogButton
                title="??????????????????"
                textArr={[
                  '??????????????????AI??????????????????????????????????????????????????????????????????',
                  '<...>????????????????????????????????????????????????????????????(<title>????????????????????????)'
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
          ??????
        </Button>
        <Button color="inherit" variant="outlined" onClick={reset}>
          ??????????????????
        </Button>
      </CardActions>
    </Card>
  )
}

export default AiModelSettings
