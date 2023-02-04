import React from "react";
import { CircularProgress } from "@mui/material";
import styled from "styled-components";

const StyledFullScreen = styled.div`
  z-index: 9999;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.3);
`;

const StyledProgressWrapper = styled.div`
  position: relative;
  top: 45vh;
`;

type Props = {
  text?: string;
};

const LoadingScreen: React.FC<Props> = ({ text }) => {
  return (
    <StyledFullScreen>
      <StyledProgressWrapper>
        <CircularProgress color="primary" size={50} />
        {text != null && <p style={{ margin: "0" }}>{text}</p>}
      </StyledProgressWrapper>
    </StyledFullScreen>
  );
};

export default LoadingScreen;
