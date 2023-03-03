import {
  Box,
  IconButton,
  type SxProps,
  TextField,
  Typography
} from '@mui/material'
import React from 'react'
import { errorLog } from '../../logger'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'

type Props = {
  title: string
  result: string
  elapsedTime: number
  rows?: number
  rootSx?: SxProps
  onCopied?: () => void
  onChange: (v: string) => void
}

const ResultTextArea: React.FC<Props> = ({
  title,
  result,
  elapsedTime,
  rows = 3,
  rootSx,
  onCopied,
  onChange
}) => {
  const copyToClipboard = (text: string) => {
    if (text === '') {
      return
    }
    navigator.clipboard
      .writeText(text)
      .then(() => {
        if (onCopied != null) {
          onCopied()
        }
      })
      .catch((e) => {
        errorLog(e)
      })
  }
  return (
    <Box sx={rootSx}>
      <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h5" marginRight={'auto'}>
          {title}
        </Typography>
        <IconButton
          color="primary"
          onClick={() => {
            copyToClipboard(result)
          }}
        >
          <ContentCopyIcon fontSize="small" />
        </IconButton>
      </Box>
      <TextField
        fullWidth
        multiline
        rows={rows}
        value={result}
        helperText={`${result.length}文字`}
        onChange={(e) => {
          onChange(e.target.value)
        }}
      />
      {elapsedTime > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <span>{elapsedTime}ms</span>
        </Box>
      )}
    </Box>
  )
}

export default ResultTextArea
