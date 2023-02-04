import { type CreateCompletionRequest } from "openai";

export type GenerateOption = Omit<CreateCompletionRequest, "prompt">;

export const InitialGenerateOption: GenerateOption = {
  model: "text-curie-001",
  temperature: 0.8,
  max_tokens: 250,
};
