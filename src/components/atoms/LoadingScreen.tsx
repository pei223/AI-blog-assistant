import React from 'react'
import { Button, CircularProgress, Typography } from '@mui/material'
import styled from 'styled-components'

const StyledFullScreen = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.4);
`

const StyledProgressWrapper = styled.div`
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  width: 250px;
  align-items: center;
  padding: 20px;
`

type Props = {
  text?: string
  onCancel?: () => void
}

const LoadingScreen: React.FC<Props> = ({ text, onCancel }) => {
  return (
    <StyledFullScreen>
      <StyledProgressWrapper>
        <CircularProgress color="primary" size={70} />
        {text != null && (
          <Typography
            variant="h6"
            marginTop={3}
            sx={{
              color: 'rgba(0, 0, 0, 0.5)'
            }}
          >
            {text}
          </Typography>
        )}
        {onCancel != null && (
          <Button
            onClick={onCancel}
            color="inherit"
            variant="contained"
            sx={{ marginTop: 2, opacity: 0.7 }}
          >
            キャンセル
          </Button>
        )}
      </StyledProgressWrapper>
    </StyledFullScreen>
  )
}

export default LoadingScreen
