export const isNotFound = (e: unknown): e is Error => {
  return e instanceof Error && e.message.includes('no such file or directory')
}

export const isCanceled = (e: unknown): e is Object => {
  return e instanceof Object && 'message' in e && e.message === 'canceled'
}

export const isAuthError = (e: unknown): e is Error => {
  return e instanceof Error && e.message.includes('401')
}
