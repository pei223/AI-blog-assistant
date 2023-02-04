import React, { useEffect, useState } from "react";
import { Button, Container, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import { getAPIKey, setAPIKey } from "../main-module";
import { useErrorHandler } from "react-error-boundary";

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
    <Container>
      <Typography>Enter OpenAI API key</Typography>
      <TextField
        value={apiKeyVal}
        onChange={(e) => {
          setApiKeyVal(e.target.value);
        }}
      />
      <Button onClick={onSubmit}>Start</Button>
    </Container>
  );
};
export default Init;
