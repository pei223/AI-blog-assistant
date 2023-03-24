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
import {
  type AiSettingDict,
  INITIAL_SUMMARY_AI_SETTING,
  SUMMARY_SETTING_KEY,
  CHAPTER_CONTENT_SETTING_KEY,
  INITIAL_CHAPTER_CONTENT_AI_SETTING
} from '../../openai/types'
import LoadingScreen from '../../components/atoms/LoadingScreen'
import { electronModule } from '../../main-module'
import { useSnackbar } from 'notistack'
import { isCanceledError } from '../../errors'
import ResultTextArea from '../../components/blocks/ResultTextArea'
import {
  type GenerateState,
  GenerateStateText,
  type ChapterContent
} from './types'
import ShowChapterBlogButton from '../../components/blocks/ShowChapterBlogButton'

type ElapsedTime = {
  summary: number
  contents: number[]
}

type CompletedCount = {
  completed: number
  total: number
}

const GenerateLongText = () => {
  // リトライ機構が実行されるとキャンセルを即座にできないためキャンセル状態を設ける
  const [generateState, setGenerateState] = useState<GenerateState | null>(null)
  const [title, setTitle] = useState('')
  const [contentCount, setContentCount] = useState<CompletedCount>({
    completed: 0,
    total: 0
  })
  const [summaryText, setSummaryText] = useState('')
  const [chapterContents, setChapterContents] = useState<ChapterContent[]>([])
  const [aiSettingDict, setAiSettingDict] = useState<AiSettingDict>({})
  const [elapsedTime, setElapsedTime] = useState<ElapsedTime>({
    summary: 0,
    contents: []
  })

  const snack = useSnackbar()
  const errHandler = useErrorHandler()

  useEffect(() => {
    electronModule
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
    electronModule
      .cancelGenerate()
      .then(() => {
        // generateTextがキャンセルされてerror catchするため
        // loadingStateも操作する必要がない
      })
      .catch((e) => {
        errHandler(e)
      })
  }

  const onError = (e: unknown) => {
    if (isCanceledError(e)) {
      return
    }
    errHandler(e)
  }

  const generateSummary = async () => {
    setChapterContents([])
    setElapsedTime({
      summary: 0,
      contents: []
    })
    const summaryAiSetting =
      aiSettingDict[SUMMARY_SETTING_KEY] ?? INITIAL_SUMMARY_AI_SETTING
    const { template: summaryTemplate, ...summaryGenOption } = summaryAiSetting
    setGenerateState('summary')
    const summaryGenText = generateFromTemplate(summaryTemplate, {
      title
    })
    const start = new Date().getTime()
    const _summary = await electronModule.generateText(
      summaryGenText,
      summaryGenOption
    )
    setElapsedTime({
      ...elapsedTime,
      summary: new Date().getTime() - start
    })
    setSummaryText(
      _summary
        .split('\n')
        .filter((text) => text !== '')
        .join('\n')
    )
  }

  const generateContents = async () => {
    const chapterContentAiSetting =
      aiSettingDict[CHAPTER_CONTENT_SETTING_KEY] ??
      INITIAL_CHAPTER_CONTENT_AI_SETTING
    const { template: chapterContentTemplate, ...contentGenOption } =
      chapterContentAiSetting
    const chapters = summaryText.split('\n').filter((v) => v !== '')
    setGenerateState('content')
    setElapsedTime({
      ...elapsedTime,
      contents: []
    })
    setChapterContents([])
    // setStateしても描画はされるが即座に更新されないためキャッシュする
    let newChapterContents: ChapterContent[] = []
    let newElapsedTime = Object.assign({}, elapsedTime)
    for (let i = 0; i < chapters.length; i++) {
      setContentCount({
        completed: i,
        total: chapters.length
      })
      const chapter = chapters[i]
      const chapterGenText = generateFromTemplate(chapterContentTemplate, {
        title,
        chapter
      })
      const start = new Date().getTime()
      const content = await electronModule.generateText(
        chapterGenText,
        contentGenOption
      )
      newElapsedTime = {
        ...newElapsedTime,
        contents: newElapsedTime.contents.concat([new Date().getTime() - start])
      }
      newChapterContents.push({
        chapter,
        content
      })
      setElapsedTime(newElapsedTime)
      setChapterContents(newChapterContents)
    }
  }

  const setContent = (content: string, i: number) => {
    const newChapterContents = chapterContents.map((v, j) =>
      i === j
        ? {
            ...v,
            content
          }
        : v
    )
    setChapterContents(newChapterContents)
  }

  return (
    <Layout initialized={true}>
      <Typography variant="h4" marginY={'30px'}>
        長文ブログ生成
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
          <Box sx={{ textAlign: 'center', my: 3 }}>
            <Button
              variant="contained"
              disabled={title === ''}
              onClick={() => {
                generateSummary()
                  .then(() => {
                    generateContents()
                      .then(() => {})
                      .catch((e) => {
                        onError(e)
                      })
                  })
                  .catch((e) => {
                    onError(e)
                  })
                  .finally(() => {
                    setGenerateState(null)
                  })
              }}
            >
              タイトルから目次と記事を生成
            </Button>
            <Button
              sx={{ ml: 2 }}
              variant="contained"
              disabled={title === ''}
              onClick={() => {
                generateSummary()
                  .then(() => {})
                  .catch((e) => {
                    onError(e)
                  })
                  .finally(() => {
                    setGenerateState(null)
                  })
              }}
            >
              タイトルから目次のみを生成
            </Button>
          </Box>
          <Box sx={{ mb: 5 }}>
            <ResultTextArea
              title="目次"
              result={summaryText}
              rows={6}
              elapsedTime={elapsedTime.summary}
              onChange={(v) => {
                setSummaryText(v)
              }}
              onCopied={onCopied}
            />
            <Box sx={{ textAlign: 'center', my: 2 }}>
              <Button
                disabled={title === '' || summaryText === ''}
                variant="contained"
                onClick={() => {
                  generateContents()
                    .then(() => {})
                    .catch((e) => {
                      onError(e)
                    })
                    .finally(() => {
                      setGenerateState(null)
                    })
                }}
              >
                タイトルと目次から記事を生成
              </Button>
            </Box>
          </Box>
          {chapterContents.map((chapterContent, i) => (
            <Box sx={{ mb: 5 }} key={i}>
              <ResultTextArea
                title={chapterContent.chapter}
                result={chapterContent.content}
                rows={6}
                elapsedTime={elapsedTime.contents[i]}
                onChange={(v) => {
                  setContent(v, i)
                }}
                onCopied={onCopied}
              />
            </Box>
          ))}

          {chapterContents.length > 0 && (
            <Box sx={{ textAlign: 'center', my: 2 }}>
              <ShowChapterBlogButton
                title={title}
                chapterContents={chapterContents}
                onCopied={onCopied}
              />
            </Box>
          )}
        </CardContent>
      </Card>
      {generateState != null && (
        <LoadingScreen
          onCancel={cancel}
          text={
            generateState === 'content'
              ? `章記事を生成中(${contentCount.completed + 1}/${
                  contentCount.total
                })...`
              : GenerateStateText[generateState]
          }
        />
      )}
    </Layout>
  )
}
export default GenerateLongText
