async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms))
}

type RetryCondition = (e: unknown) => boolean

export function ExponentialBackoff(
  maxCount: number,
  retryCondition?: RetryCondition
): MethodDecorator {
  return (
    _target: Object,
    _propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
  ) => {
    const func = descriptor.value
    descriptor.value = async function (...args: any[]) {
      let count = 0
      while (true) {
        try {
          const result = await func.apply(this, args)
          return result
        } catch (e) {
          if (count >= maxCount) {
            console.log('Max retry count exceeded ', e)
            throw e
          }
          if (retryCondition != null && !retryCondition(e)) {
            console.log('Not retry condition ', e)
            throw e
          }
          console.log('Retry ', e, 2 ** count * 1000)
          await sleep(2 ** count * 1000)
          count++
          continue
        }
      }
    }
  }
}
