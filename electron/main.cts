import { app, BrowserWindow, ipcMain } from "electron";
import { join } from "path";
import { openAiWrapper } from "./openai/index.cjs";
import { GenerateOption } from "./openai/types.cjs";
import { getApiKey, setApiKey } from "./settings/index.cjs";

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title: "ChatGPT writer",
    webPreferences: {
      preload: join(__dirname, "preload.cjs"),
    },
  });

  ipcMain.handle("get-api-key", async (_e, _arg): Promise<string> => {
    return getApiKey();
  });

  ipcMain.handle("set-api-key", async (_e, keyVal: string): Promise<void> => {
    setApiKey(keyVal);
    openAiWrapper.setApiKey(keyVal);
  });

  ipcMain.handle(
    "generate-text",
    async (_e, text: string, option: GenerateOption): Promise<string> => {
      return await openAiWrapper.generateText(text, option);
    }
  );

  // eslint-disable-next-line @typescript-eslint/no-floating-promises, n/no-path-concat
  mainWindow.loadURL(`file://${__dirname}/../renderer/index.html`);
};

app.once("ready", () => {
  createWindow();
});

app.once("window-all-closed", () => app.quit());
