interface MainProcess {
  getAPIKey: () => string | error;
  saveAPIKey: (keyVal: string) => void;
}

declare global {
  interface Window {
    mainProcess: MainProcess;
  }
}
