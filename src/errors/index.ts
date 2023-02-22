// TODO エラーの判別がテキトーなのでいずれちゃんとやる
export const isCanceledError = (e: unknown): e is Error => {
  return e instanceof Error && e.message.includes('canceled')
}

export const isAuthError = (e: unknown): e is Error => {
  return e instanceof Error && e.message.includes('401')
}

export const isTooManyRequestError = (e: unknown): e is Error => {
  return e instanceof Error && e.message.includes('429')
}
