import { type EmbedDict } from "./types";

export const generateFromTemplate = (template: string, dict: EmbedDict) => {
  let text = template;
  Object.entries(dict).forEach(([key, val]) => {
    text = text.replaceAll(`<${key}>`, val);
  });
  return text;
};
