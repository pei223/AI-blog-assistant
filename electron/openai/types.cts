import { CreateCompletionRequest } from "openai";

export type GenerateOption = Omit<CreateCompletionRequest, "prompt">;

export const InitialGenerateOption: GenerateOption = {
  model: "text-davinci-003",
  temperature: 0.8,
  max_tokens: 250,
};
