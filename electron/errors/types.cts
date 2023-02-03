export const ErrorPrefixTypeVal = {
  OpenAiApiNotInitialized: "[OpenAiApiNotInitialized]",
} as const;

export type ErrorPrefixType =
  typeof ErrorPrefixTypeVal[keyof typeof ErrorPrefixTypeVal];
