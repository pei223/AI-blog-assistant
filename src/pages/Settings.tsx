import React, { useEffect, useState } from 'react'
import { Grid } from '@mui/material'
import { useSnackbar } from 'notistack'
import { useErrorHandler } from 'react-error-boundary'
import LoadingScreen from '../components/atoms/LoadingScreen'
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

const Settings = () => {
  const snack = useSnackbar()
  const errHandler = useErrorHandler()

  const [loading, setLoading] = useState(false)
  const [aiSettingDict, setAiSettingDict] = useState<AiSettingDict>({})

  useEffect(() => {
    setLoading(true)
    window.mainProcess
      .getAiSettingDict()
      .then((dict) => {
        setAiSettingDict(dict)
      })
      .catch((e) => {
        errHandler(e)
      })
      .finally(() => {
        setLoading(false)
      })
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
  if (loading) {
    return (
      <Layout initialized={true}>
        <LoadingScreen text={''} />
      </Layout>
    )
  }
  return (
    <Layout initialized={true}>
      <Grid container spacing={2}>
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
      </Grid>
    </Layout>
  )
}

export default Settings
