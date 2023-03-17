import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography
} from '@mui/material'
import { useErrorHandler } from 'react-error-boundary'
import Layout from '../../Layout'
import { generateFromTemplate } from '../../template-mod'
import styled from 'styled-components'
import {
  type AiSettingDict,
  CONTENT_SETTING_KEY,
  INITIAL_CONTENT_AI_SETTING,
  INITIAL_SUMMARY_AI_SETTING,
  SUMMARY_SETTING_KEY
} from '../../openai/types'
import LoadingScreen from '../../components/atoms/LoadingScreen'
import { cancelGenerate, generateText } from '../../main-module'
import { useSnackbar } from 'notistack'
import { isCanceledError } from '../../errors'
import ResultTextArea from '../../components/blocks/ResultTextArea'
import { errorLog } from '../../logger'
import {
  type GenerateState,
  GenerateStateText,
  type GenerateStep
} from './types'

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
  // リトライ機構が実行されるとキャンセルを即座にできないためキャンセル状態を設ける
  const [generateState, setGenerateState] = useState<GenerateState | null>(null)
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
  }, [])

  const onCopied = () => {
    snack.enqueueSnackbar('コピーしました', {
      variant: 'info'
    })
  }

  const cancel = () => {
    if (generateState === 'canceling') {
      return
    }
    setGenerateState('canceling')
    cancelGenerate()
      .then(() => {
        // generateTextがキャンセルされてerror catchするため
        // loadingStateも操作する必要がない
      })
      .catch((e) => {
        errHandler(e)
      })
  }

  const generate = (startStep: GenerateStep, endStep: GenerateStep) => {
    const inner = async () => {
      // 開始位置次第でクリアする対象を変える
      switch (startStep) {
        case 'title':
          setSummary('')
          setContent('')
          setElapsedTime({
            summary: 0,
            content: 0
          })
          break
        case 'summary':
          setContent('')
          setElapsedTime({
            summary: 0,
            content: 0
          })
          break
        case 'content':
          // 通常指定されない
          errorLog('Invalid startStep: ' + startStep)
          break
      }

      const summaryAiSetting =
        aiSettingDict[SUMMARY_SETTING_KEY] ?? INITIAL_SUMMARY_AI_SETTING
      const contentAiSetting =
        aiSettingDict[CONTENT_SETTING_KEY] ?? INITIAL_CONTENT_AI_SETTING
      const { template: summaryTemplate, ...summaryGenOption } =
        summaryAiSetting
      const { template: contentTemplate, ...contentGenOption } =
        contentAiSetting

      let start: number
      let _summary = summary
      let summaryElapsedTime = elapsedTime.summary
      if (startStep === 'title') {
        setGenerateState('summary')
        const summaryGenText = generateFromTemplate(summaryTemplate, {
          title
        })
        start = new Date().getTime()
        _summary = await generateText(summaryGenText, summaryGenOption)
        summaryElapsedTime = new Date().getTime() - start
        setElapsedTime({
          ...elapsedTime,
          summary: summaryElapsedTime
        })
        setSummary(_summary)
      }

      if (endStep === 'summary') {
        return
      }

      setGenerateState('content')
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
    }
    inner()
      .then(() => {})
      .catch((e) => {
        if (isCanceledError(e)) {
          return
        }
        errHandler(e)
      })
      .finally(() => {
        setGenerateState(null)
      })
  }

  return (
    <Layout initialized={true}>
      <Typography variant="h4" marginY={'30px'}>
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
              variant="contained"
              disabled={title === ''}
              onClick={() => {
                generate('title', 'content')
              }}
            >
              タイトルから目次と記事を生成
            </Button>
            <Button
              sx={{ ml: 2 }}
              variant="contained"
              disabled={title === ''}
              onClick={() => {
                generate('title', 'summary')
              }}
            >
              タイトルから目次のみを生成
            </Button>
          </StyledButtonWrapper>
          <Box sx={{ mb: 5 }}>
            <ResultTextArea
              title="目次"
              result={summary}
              rows={6}
              elapsedTime={elapsedTime.summary}
              onChange={(v) => {
                setSummary(v)
              }}
              onCopied={onCopied}
            />
            <StyledButtonWrapper>
              <Button
                disabled={title === '' || summary === ''}
                variant="contained"
                onClick={() => {
                  generate('summary', 'content')
                }}
              >
                タイトルと目次から記事を生成
              </Button>
            </StyledButtonWrapper>
          </Box>
          <Box sx={{ mb: 5 }}>
            <ResultTextArea
              title="ブログ内容"
              result={content}
              rows={6}
              elapsedTime={elapsedTime.content}
              onChange={(v) => {
                setContent(v)
              }}
              onCopied={onCopied}
            />
          </Box>
        </CardContent>
      </Card>
      {generateState != null && (
        <LoadingScreen
          onCancel={cancel}
          text={GenerateStateText[generateState]}
        />
      )}
    </Layout>
  )
}
export default Generate
