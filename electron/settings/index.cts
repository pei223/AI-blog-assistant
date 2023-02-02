import { app } from "electron";
import { join } from "path";
import * as fs from "fs";
import { type Setting } from "./types.cjs";
import { isNotFound } from "../errors/index.cjs";

const defaultSetting: Setting = {
  apiKey: "",
};

const settingFilePath = (): string => {
  const userData = app.getPath("home");
  return join(userData, "/.chatgpt-writer-setting.json");
};

const getSetting = (): Setting => {
  const buffer = fs.readFileSync(settingFilePath());
  return JSON.parse(buffer.toString()) as Setting;
};

const setSetting = (setting: Setting): void => {
  fs.writeFileSync(settingFilePath(), JSON.stringify(setting));
};

export const getApiKey = (): string => {
  try {
    const setting = getSetting();
    return setting.apiKey;
  } catch (e) {
    // not found
    if (isNotFound(e)) {
      return "";
    }
    console.log(e);
    throw e;
  }
};

export const setApiKey = (keyVal: string): void => {
  let setting: Setting;
  try {
    setting = getSetting();
  } catch (e) {
    if (!isNotFound(e)) {
      throw e;
    }
    setting = defaultSetting;
  }

  setting.apiKey = keyVal;
  try {
    setSetting(setting);
  } catch (e) {
    console.log(e);
    throw e;
  }
};
