import React, { useEffect, useState } from 'react'
import { Grid } from '@mui/material'
import { useSnackbar } from 'notistack'
import { useErrorHandler } from 'react-error-boundary'
import AiModelSettings from '../components/blocks/AiModelSettings'
import Layout from '../Layout'
import {
  type AiSetting,
  type AiSettingDict,
  CONTENT_SETTING_KEY,
  INITIAL_CONTENT_AI_SETTING,
  INITIAL_SUMMARY_AI_SETTING,
  SUMMARY_SETTING_KEY
} from '../openai/types'
import { getAPIKey, setAPIKey } from '../main-module'
import APIKeyForm from '../components/blocks/APIKeyForm'

const Settings = () => {
  const snack = useSnackbar()
  const errHandler = useErrorHandler()

  const [apiKeyVal, setApiKeyVal] = useState('')
  const [loading, setLoading] = useState(false)
  const [aiSettingDict, setAiSettingDict] = useState<AiSettingDict>({})

  useEffect(() => {
    const inner = async (): Promise<void> => {
      setLoading(true)
      try {
        const dict = await window.mainProcess.getAiSettingDict()
        setAiSettingDict(dict)
        const val = await getAPIKey()
        setApiKeyVal(val)
      } catch (e) {
        errHandler(e)
      } finally {
        setLoading(false)
      }
    }
    inner()
      .then(() => {})
      .catch(() => {})
  }, [])

  const saveSummaryAiSetting = (newSetting: AiSetting) => {
    const newDict = { ...aiSettingDict }
    newDict[SUMMARY_SETTING_KEY] = { ...newSetting }
    window.mainProcess
      .setAiSettingDict(newDict)
      .then(() => {
        setAiSettingDict(newDict)
        snack.enqueueSnackbar('保存しました', {
          variant: 'success'
        })
      })
      .catch((e) => {
        errHandler(e)
      })
  }
  const saveContentAiSetting = (newSetting: AiSetting) => {
    const newDict = { ...aiSettingDict }
    newDict[CONTENT_SETTING_KEY] = { ...newSetting }
    window.mainProcess
      .setAiSettingDict(newDict)
      .then(() => {
        setAiSettingDict(newDict)
        snack.enqueueSnackbar('保存しました', {
          variant: 'success'
        })
      })
      .catch((e) => {
        errHandler(e)
      })
  }
  const saveAPIKey = (newVal: string) => {
    setAPIKey(newVal)
      .then(() => {
        snack.enqueueSnackbar('保存しました', {
          variant: 'success'
        })
      })
      .catch((e) => {
        errHandler(e)
      })
  }
  if (loading) {
    // 空のLayoutにしているがファイル読み込みのためすぐ終わるので問題ない
    // むしろロード画面にするとちらつく
    return <Layout initialized={true} />
  }
  return (
    <Layout initialized={true}>
      <Grid container spacing={2} sx={{ p: 3 }}>
        <Grid item sm={12} md={6}>
          <AiModelSettings
            title="目次のAI設定"
            value={
              aiSettingDict[SUMMARY_SETTING_KEY] ?? INITIAL_SUMMARY_AI_SETTING
            }
            onSubmit={saveSummaryAiSetting}
            initValue={INITIAL_SUMMARY_AI_SETTING}
          />
        </Grid>
        <Grid item sm={12} md={6}>
          <AiModelSettings
            title="ブログのAI設定"
            value={
              aiSettingDict[CONTENT_SETTING_KEY] ?? INITIAL_CONTENT_AI_SETTING
            }
            onSubmit={saveContentAiSetting}
            initValue={INITIAL_CONTENT_AI_SETTING}
          />
        </Grid>
        <Grid item sm={12}>
          <APIKeyForm value={apiKeyVal} onSubmit={saveAPIKey} />
        </Grid>
      </Grid>
    </Layout>
  )
}

export default Settings
