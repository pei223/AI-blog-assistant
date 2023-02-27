import React, { useState } from 'react'
import HelpIcon from '@mui/icons-material/HelpOutlined'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton
} from '@mui/material'

type Props = {
  title: string
  textArr: string[]
  referenceUrl?: string
}
const HelpDialogButton: React.FC<Props> = ({
  title,
  textArr,
  referenceUrl
}) => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <IconButton
        onClick={() => {
          setOpen(!open)
        }}
      >
        <HelpIcon fontSize="small" />
      </IconButton>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false)
        }}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          {textArr.map((v: string, i: number) => (
            <p key={i}>{v}</p>
          ))}
          {referenceUrl != null && (
            <>
              <p>詳しくは以下のページを参照してください。</p>
              <a href={referenceUrl}>{referenceUrl}</a>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false)
            }}
          >
            閉じる
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default HelpDialogButton
