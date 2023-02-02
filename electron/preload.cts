import { ipcRenderer, contextBridge } from "electron";

contextBridge.exposeInMainWorld("mainProcess", {
  getAPIKey: async () => await ipcRenderer.invoke("get-api-key"),
  setAPIKey: async (keyVal: string) =>
    await ipcRenderer.invoke("set-api-key", keyVal),
});
