import React from 'react'
import { Box, Typography } from '@mui/material'
import { type ModelInfo } from '../../openai/types'

type Props = {
  modelInfo: ModelInfo
  maxTokens: number
  yenPerDollar?: number
}

const ModelEstimate: React.FC<Props> = ({
  modelInfo,
  maxTokens,
  yenPerDollar = 150
}) => {
  return (
    <Box
      sx={{
        color: 'rgba(0, 0, 0, 0.7)'
      }}
    >
      <Typography variant="body1" sx={{ mb: 1 }}>
        1回あたりの値段(1ドル{yenPerDollar}円換算)
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Box component="span" sx={{ mr: 2, fontSize: '1.1em' }}>
          ${modelInfo.dollarPerKiloTokens / 1000}
          <br />
          {`(¥${(modelInfo.dollarPerKiloTokens / 1000) * 150})`}
        </Box>
        <Box component="span" sx={{ mr: 2, fontSize: '1.5em' }}>
          ×
        </Box>
        <Box component="span" sx={{ mr: 2, fontSize: '1.1em' }}>
          {maxTokens}
        </Box>
        <Box component="span" sx={{ mr: 2, fontSize: '1.5em' }}>
          =
        </Box>
        <Box component="span" sx={{ fontSize: '1.1em' }}>
          ${(modelInfo.dollarPerKiloTokens / 1000) * maxTokens}
          <br />
          {`(¥${(modelInfo.dollarPerKiloTokens / 1000) * maxTokens * 150})`}
        </Box>
      </Box>
    </Box>
  )
}

export default ModelEstimate
