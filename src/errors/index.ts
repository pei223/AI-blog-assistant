// TODO エラーの判別がテキトーなのでいずれちゃんとやる
export const isCanceledError = (e: unknown) => {
  return e instanceof Error && e.message.includes('canceled')
}

export const isAuthError = (e: unknown) => {
  return e instanceof Error && e.message.includes('401')
}

export const isTooManyRequestError = (e: unknown) => {
  return e instanceof Error && e.message.includes('429')
}
