import { app, BrowserWindow, ipcMain } from "electron";
import { join } from "path";
import { getApiKey, setApiKey } from "./settings/index.cjs";

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
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
  });

  // eslint-disable-next-line @typescript-eslint/no-floating-promises, n/no-path-concat
  mainWindow.loadURL(`file://${__dirname}/index.html`);
};

app.once("ready", () => {
  createWindow();
});

app.once("window-all-closed", () => app.quit());
