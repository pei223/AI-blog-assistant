import React, { useEffect, useState } from 'react'
import { Button, Grid, TextField, Typography } from '@mui/material'
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
import { generateText } from '../main-module'

const StyledButtonWrapper = styled.div`
  text-align: center;
  margin-top: 10px;
  margin-bottom: 20px;
`

const Generate = () => {
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [content, setContent] = useState('')
  const [aiSettingDict, setAiSettingDict] = useState<AiSettingDict>({})

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

  const generateContentFromTitle = () => {
    const inner = async () => {
      setLoading(true)
      const summaryAiSetting =
        aiSettingDict[SUMMARY_SETTING_KEY] ?? INITIAL_SUMMARY_AI_SETTING
      const contentAiSetting =
        aiSettingDict[CONTENT_SETTING_KEY] ?? INITIAL_CONTENT_AI_SETTING
      try {
        const { template: summaryTemplate, ...summaryGenOption } =
          summaryAiSetting
        const { template: contentTemplate, ...contentGenOption } =
          contentAiSetting

        const summaryGenText = generateFromTemplate(summaryTemplate, {
          title
        })
        const _summary = await generateText(summaryGenText, summaryGenOption)
        setSummary(_summary)

        const contentGenText = generateFromTemplate(contentTemplate, {
          title,
          summary: _summary
        })
        const _content = await generateText(contentGenText, contentGenOption)
        setContent(_content)
      } catch (e) {
        errHandler(e)
      } finally {
        setLoading(false)
      }
    }
    inner()
      .then(() => {})
      .catch(() => {})
  }

  const generateContentFromSummary = () => {
    const inner = async () => {
      setLoading(true)
      try {
        const contentAiSetting =
          aiSettingDict[CONTENT_SETTING_KEY] ?? INITIAL_CONTENT_AI_SETTING
        const { template, ...contentGenOption } = contentAiSetting
        const contentGenText = generateFromTemplate(template, {
          title,
          summary
        })
        const _content = await generateText(contentGenText, contentGenOption)
        setContent(_content)
      } catch (e) {
        errHandler(e)
      } finally {
        setLoading(false)
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
      <Grid container spacing={2}>
        <Grid item xs={12}>
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
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            label="目次"
            rows={6}
            value={summary}
            onChange={(e) => {
              setSummary(e.target.value)
            }}
          />
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
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            label="内容"
            rows={10}
            value={content}
            onChange={(e) => {
              setContent(e.target.value)
            }}
          />
        </Grid>
      </Grid>

      {loading && <LoadingScreen text="" />}
    </Layout>
  )
}
export default Generate
