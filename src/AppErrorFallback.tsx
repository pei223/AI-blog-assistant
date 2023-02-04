import React from "react";
import { type FallbackProps } from "react-error-boundary";

const AppErrorFallback: React.FC<FallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  return (
    <div>
      <h1>Error</h1>
      <p>message: {error.message}</p>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
};

export default AppErrorFallback;