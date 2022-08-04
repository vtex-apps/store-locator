interface Logger {
  // eslint-disable-next-line @typescript-eslint/ban-types
  log(content: string, level: LogLevel, details?: {}): PromiseLike<void>
}

interface OperationState {
  orderFormId: string
  ctx: Context
  data?: OperationData
  logger: Logger
}

interface OperationData {
  orderForm?: any
  userProfileId: string
  cookie: string
}

type ProcessPaymentStep = (
  state: OperationState,
  next: () => Promise<void>
) => Promise<void>

type LogLevel = 'info' | 'error' | 'warning'

type Timings = { [middleware: string]: [number, number] }

declare module '*.json' {
  const value: any
  export default value
}
