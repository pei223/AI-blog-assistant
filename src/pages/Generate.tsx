import React, { useState } from 'react'
import { Button, Grid, TextField, Typography } from '@mui/material'
import { useErrorHandler } from 'react-error-boundary'
import Layout from '../Layout'
import { generateFromTemplate } from '../template-mod'
import { ContentTemplate, SummaryTemplate } from '../openai/template'
import styled from 'styled-components'
import { type GenerateOption } from '../openai/types'
import LoadingScreen from '../components/atoms/LoadingScreen'
import { generateText } from '../main-module'

const defaultContentGenerateOption: GenerateOption = {
  model: 'text-davinci-003',
  max_tokens: 2048
}

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

  const errHandler = useErrorHandler()

  const generateContentFromTitle = () => {
    const inner = async () => {
      setLoading(true)
      try {
        const summaryGenText = generateFromTemplate(SummaryTemplate, {
          title
        })

        const _summary = await generateText(summaryGenText)
        setSummary(_summary)
        const contentGenText = generateFromTemplate(ContentTemplate, {
          title,
          summary: _summary
        })
        // @ts-check
        const _content = await generateText(
          contentGenText,
          defaultContentGenerateOption
        )
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
        const contentGenText = generateFromTemplate(ContentTemplate, {
          title,
          summary
        })
        // @ts-check
        const _content = await generateText(
          contentGenText,
          defaultContentGenerateOption
        )
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
