import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  TextField,
  Typography
} from '@mui/material'
import { useErrorHandler } from 'react-error-boundary'
import Layout from '../Layout'
import { generateFromTemplate } from '../template-mod'
import styled from 'styled-components'
import {
  type AiSettingDict,
  CONTENT_SETTING_KEY,
  INITIAL_CONTENT_AI_SETTING,
  INITIAL_SUMMARY_AI_SETTING,
  SUMMARY_SETTING_KEY
} from '../openai/types'
import LoadingScreen from '../components/atoms/LoadingScreen'
import { cancelGenerate, generateText } from '../main-module'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { errorLog } from '../logger'
import { useSnackbar } from 'notistack'
import { isCanceledError } from '../errors'

const StyledButtonWrapper = styled.div`
  text-align: center;
  margin-top: 10px;
  margin-bottom: 20px;
`

type ElapsedTime = {
  summary: number
  content: number
}

const Generate = () => {
  const [loadingState, setLoadingState] = useState<
    'summary' | 'content' | null
  >(null)
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [content, setContent] = useState('')
  const [aiSettingDict, setAiSettingDict] = useState<AiSettingDict>({})
  const [elapsedTime, setElapsedTime] = useState<ElapsedTime>({
    summary: 0,
    content: 0
  })

  const snack = useSnackbar()
  const errHandler = useErrorHandler()

  useEffect(() => {
    window.mainProcess
      .getAiSettingDict()
      .then((dict) => {
        setAiSettingDict(dict)
      })
      .catch((e) => {
        errHandler(e)
      })
  })

  const clearResult = () => {
    setSummary('')
    setContent('')
    setElapsedTime({
      summary: 0,
      content: 0
    })
  }

  const copyToClipboard = (text: string) => {
    if (text === '') {
      return
    }
    navigator.clipboard
      .writeText(text)
      .then(() => {
        snack.enqueueSnackbar('コピーしました', {
          variant: 'info'
        })
      })
      .catch((e) => {
        errorLog(e)
      })
  }

  const cancel = () => {
    cancelGenerate()
      .then(() => {
        // generateTextがキャンセルされてerror catchするため
        // loadingStateも操作する必要がない
      })
      .catch((e) => {
        errHandler(e)
      })
  }

  const generateContentFromTitle = () => {
    const inner = async () => {
      clearResult()
      const summaryAiSetting =
        aiSettingDict[SUMMARY_SETTING_KEY] ?? INITIAL_SUMMARY_AI_SETTING
      const contentAiSetting =
        aiSettingDict[CONTENT_SETTING_KEY] ?? INITIAL_CONTENT_AI_SETTING
      const { template: summaryTemplate, ...summaryGenOption } =
        summaryAiSetting
      const { template: contentTemplate, ...contentGenOption } =
        contentAiSetting
      try {
        setLoadingState('summary')
        const summaryGenText = generateFromTemplate(summaryTemplate, {
          title
        })
        let start = new Date().getTime()
        const _summary = await generateText(summaryGenText, summaryGenOption)
        const summaryElapsedTime = new Date().getTime() - start
        setElapsedTime({
          ...elapsedTime,
          summary: summaryElapsedTime
        })
        setSummary(_summary)

        setLoadingState('content')
        const contentGenText = generateFromTemplate(contentTemplate, {
          title,
          summary: _summary
        })
        start = new Date().getTime()
        const _content = await generateText(contentGenText, contentGenOption)
        setElapsedTime({
          summary: summaryElapsedTime,
          content: new Date().getTime() - start
        })
        setContent(_content)
      } catch (e) {
        if (isCanceledError(e)) {
          return
        }
        errHandler(e)
      } finally {
        setLoadingState(null)
      }
    }
    inner()
      .then(() => {})
      .catch(() => {})
  }

  const generateContentFromSummary = () => {
    const inner = async () => {
      setContent('')
      setElapsedTime({
        summary: 0,
        content: 0
      })
      const contentAiSetting =
        aiSettingDict[CONTENT_SETTING_KEY] ?? INITIAL_CONTENT_AI_SETTING
      const { template, ...contentGenOption } = contentAiSetting
      const contentGenText = generateFromTemplate(template, {
        title,
        summary
      })
      try {
        setLoadingState('content')
        const start = new Date().getTime()
        const _content = await generateText(contentGenText, contentGenOption)
        setElapsedTime({
          ...elapsedTime,
          content: new Date().getTime() - start
        })
        setContent(_content)
      } catch (e) {
        if (isCanceledError(e)) {
          return
        }
        errHandler(e)
      } finally {
        setLoadingState(null)
      }
    }
    inner()
      .then(() => {})
      .catch(() => {})
  }

  return (
    <Layout initialized={true}>
      <Typography variant="h3" marginY={'30px'}>
        ブログ生成
      </Typography>
      <Card sx={{ mb: 5 }}>
        <CardContent>
          <TextField
            fullWidth
            label="タイトルを入力"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
            }}
          />
          <StyledButtonWrapper>
            <Button
              variant="outlined"
              onClick={() => {
                generateContentFromTitle()
              }}
            >
              生成
            </Button>
          </StyledButtonWrapper>
          <Box sx={{ mb: 5 }}>
            <Box
              sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}
            >
              <Typography variant="h5" marginRight={'auto'}>
                目次
              </Typography>
              <IconButton
                color="primary"
                onClick={() => {
                  copyToClipboard(summary)
                }}
              >
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Box>
            <TextField
              fullWidth
              multiline
              rows={6}
              value={summary}
              helperText={`${summary.length}文字`}
              onChange={(e) => {
                setSummary(e.target.value)
              }}
            />
            {elapsedTime.summary > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <span>{elapsedTime.summary}ms</span>
              </Box>
            )}

            <StyledButtonWrapper>
              <Button
                variant="outlined"
                onClick={() => {
                  generateContentFromSummary()
                }}
              >
                目次から生成
              </Button>
            </StyledButtonWrapper>
          </Box>
          <Box sx={{ mb: 5 }}>
            <Box
              sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}
            >
              <Typography variant="h5" marginRight={'auto'}>
                ブログ内容
              </Typography>
              <IconButton
                color="primary"
                onClick={() => {
                  copyToClipboard(content)
                }}
              >
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Box>
            <TextField
              fullWidth
              multiline
              rows={10}
              value={content}
              helperText={`${content.length}文字`}
              onChange={(e) => {
                setContent(e.target.value)
              }}
            />
            {elapsedTime.content > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <span>{elapsedTime.content}ms</span>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
      {loadingState != null && (
        <LoadingScreen
          onCancel={cancel}
          text={
            loadingState === 'summary' ? '目次生成中...' : 'ブログ記事生成中...'
          }
        />
      )}
    </Layout>
  )
}
export default Generate
