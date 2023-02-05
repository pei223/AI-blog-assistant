import React, { useEffect, useState } from "react";
import { Button, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import { getAPIKey, setAPIKey } from "../main-module";
import { useErrorHandler } from "react-error-boundary";
import styled from "styled-components";
import Layout from "../Layout";

const StyledButtonWrapper = styled.div`
  text-align: center;
  margin-top: 10px;
  margin-bottom: 20px;
`;

const Init = () => {
  const [apiKeyVal, setApiKeyVal] = useState("");
  const navigate = useNavigate();
  const errHandler = useErrorHandler();

  useEffect(() => {
    getAPIKey().then((val: string | Error) => {
      // TODO 
      if (val instanceof Error ) {
        errHandler(val);
        return
      }
      setApiKeyVal(val);
    }).catch((e) => {
      errHandler(e);
    });
  }, []);

  const onSubmit = () => {
    setAPIKey(apiKeyVal).then(() => {
      navigate("/generate");
    }).catch((e) => {
      errHandler(e);
    });
  };

  return (
    <Layout  initialized={false}>
      <Typography variant="h3" marginY={"30px"}>初期設定</Typography>
      <TextField
      fullWidth
      label="OpenAI APIキー"
        value={apiKeyVal}
        onChange={(e) => {
          setApiKeyVal(e.target.value);
        }}
      />
          <StyledButtonWrapper>
            <div>
            <Typography>
              こちらのページからAPIキーは生成できます。
            </Typography>
            <a href="https://platform.openai.com/account/api-keys" target="__blank">https://platform.openai.com/account/api-keys</a>
            <Typography marginTop="20px">
            使用料はこちらから確認できます。
            </Typography>
            <a href="https://platform.openai.com/account/usage">https://platform.openai.com/account/usage</a>
            </div>
      <Button onClick={onSubmit} variant="outlined">保存して開始</Button>
      </StyledButtonWrapper>
    </Layout>
  );
};
export default Init;
