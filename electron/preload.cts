import { ipcRenderer, contextBridge } from "electron";
import { GenerateOption } from "./chatgpt/types.cjs";

contextBridge.exposeInMainWorld("mainProcess", {
  getAPIKey: async (): Promise<string> =>
    await ipcRenderer.invoke("get-api-key"),
  setAPIKey: async (keyVal: string) =>
    await ipcRenderer.invoke("set-api-key", keyVal),
  // generateBlog: async (title: string) =>
  //   await ipcRenderer.invoke("generate-blog", title),
  generateText: async (text: string, option: GenerateOption): Promise<string> =>
    await ipcRenderer.invoke("generate-text", text, option),
});
