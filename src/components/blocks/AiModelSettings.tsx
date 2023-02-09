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

  const isChanged = (): boolean => {
    return !(
      template === value.template &&
      model === value.model &&
      temperature === value.temperature &&
      maxTokens === value.max_tokens
    )
  }

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
              value={temperature}
              label="temperature"
              type="number"
              variant="standard"
              onChange={(e) => {
                setTemperature(Number(e.target.value))
              }}
            />
          </Grid>
          <Grid item sm={6}>
            <TextField
              fullWidth
              value={maxTokens}
              label="最大トークン数"
              type="number"
              variant="standard"
              onChange={(e) => {
                setMaxTokens(Number(e.target.value))
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
            onChange={(e) => {
              setTemplate(e.target.value)
            }}
          />
        </Box>
      </CardContent>

      <CardActions>
        <Button
          color="primary"
          onClick={submit}
          disabled={!isChanged()}
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
