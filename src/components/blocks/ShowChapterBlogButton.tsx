import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from '@mui/material'
import React, { useState } from 'react'
import { errorLog } from '../../logger'
import { type ChapterContent } from '../../pages/generate/types'

type Props = {
  title: string
  chapterContents: ChapterContent[]
  onCopied: () => void
}
const ShowChapterBlogButton: React.FC<Props> = ({
  title,
  chapterContents,
  onCopied
}) => {
  const [open, setOpen] = useState(false)
  const copyToClipboard = () => {
    const text = chapterContents
      .map(
        (chapterContent) =>
          `${chapterContent.chapter}\n${chapterContent.content}`
      )
      .join('\n\n')
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
    <>
      <Button
        variant="contained"
        size="large"
        onClick={() => {
          setOpen(!open)
        }}
      >
        ブログ全文を表示する
      </Button>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false)
        }}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          {chapterContents.map((chapterContent, i) => (
            <Box key={i} sx={{ mb: 4 }}>
              <Typography variant="h5">{chapterContent.chapter}</Typography>
              {chapterContent.content.split('\n').map((content, j) => (
                <p key={j}>{content}</p>
              ))}
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={() => {
              copyToClipboard()
            }}
          >
            コピーする
          </Button>
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

export default ShowChapterBlogButton
