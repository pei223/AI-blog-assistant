import { Configuration, CreateCompletionRequest, OpenAIApi } from "openai";
import { ErrorPrefixTypeVal } from "../errors/types.cjs";
import { GenerateOption, InitialGenerateOption } from "./types.cjs";

export class OpenAiWrapper {
  openAiApi: OpenAIApi | null = null;

  setApiKey(apiKey: string) {
    this.openAiApi = new OpenAIApi(
      new Configuration({
        apiKey,
      })
    );
  }

  async generateText(text: string, option?: GenerateOption): Promise<string> {
    if (this.openAiApi == null) {
      throw new Error(
        `${ErrorPrefixTypeVal.OpenAiApiNotInitialized} not initialized`
      );
    }
    const genOption = {
      ...InitialGenerateOption,
      ...(option == null ? {} : option),
    };
    const completion = await this.openAiApi.createCompletion({
      prompt: text,
      ...genOption,
    });
    const pop = completion.data.choices.pop();
    return pop?.text == null ? "" : pop.text;
  }
}

export const openAiWrapper = new OpenAiWrapper();
