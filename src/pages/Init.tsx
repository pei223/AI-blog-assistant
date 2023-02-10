import React, { useEffect, useState } from 'react'
import { Typography } from '@mui/material'
import { useNavigate } from 'react-router'
import { getAPIKey, setAPIKey } from '../main-module'
import { useErrorHandler } from 'react-error-boundary'
import Layout from '../Layout'
import APIKeyForm from '../components/blocks/APIKeyForm'

const Init = () => {
  const [apiKeyVal, setApiKeyVal] = useState('')
  const navigate = useNavigate()
  const errHandler = useErrorHandler()

  useEffect(() => {
    getAPIKey()
      .then((val: string) => {
        setApiKeyVal(val)
      })
      .catch((e) => {
        errHandler(e)
      })
  }, [])

  const onSubmit = (newVal: string) => {
    setAPIKey(newVal)
      .then(() => {
        navigate('/generate')
      })
      .catch((e) => {
        errHandler(e)
      })
  }

  return (
    <Layout initialized={false}>
      <Typography variant="h3" marginY={'30px'}>
        初期設定
      </Typography>
      <APIKeyForm
        value={apiKeyVal}
        onSubmit={onSubmit}
        submitTitle="保存して開始"
      />
    </Layout>
  )
}
export default Init
