import type { AxiosResponse } from 'axios'

const DEFAULT_ERROR_TEXT = 'Произошла ошибка...'

export const getErrorMessage = (
  error: unknown,
  defaultMessage?: string,
): string => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (error.description) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return error.description
  }
  if (defaultMessage) {
    return defaultMessage
  }
  return DEFAULT_ERROR_TEXT
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
export const formatRes = (res: AxiosResponse) => Promise.resolve(res.data.data)

export const formatErr = (
  err: {
    response: { data: { error: any }; status: any } | undefined
    message: string
    status: any
  },
  options: { prefix?: string } = {},
) => {
  const isPrefix = !!options.prefix

  let error: any = new Error()
  if (err.response && err.response.data && err.response.data.error) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    error = err.response.data.error
  } else if (err.response && err.response.data) {
    if (typeof err.response.data !== 'object') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      error.data = err.response.data
    } else {
      error = err.response.data
    }
  } else if (err.response) {
    error = err.response
  } else if (!err.response && err.message === 'Network Error' && !err.status) {
    error = err
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    error.description = isPrefix
      ? `${options.prefix}: ошибка сети!`
      : 'Ошибка сети!'
  }
  if (err.response !== undefined && err.response.status) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    error.status = err.response.status
  } else {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    error.status = null
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (error.status === 401) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    error.description = ''
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  } else if (error.description) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    error.description = isPrefix ? error.description : error.description
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  } else {
    if (err.response.data) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      error.description = err.response.data
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    } else if (!error.description) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      error.description = isPrefix
        ? `${options.prefix}: что-то пошло не так.`
        : 'Что-то пошло не так.'
    }
  }
  const HTML = /(<([^>]+)>)/gi
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
  if (HTML.test(error.description)) {
    // Ошибка может приходить из Nginx в виде html, такие ошибки пользователям не показываем
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    error.description = 'Что-то пошло не так.'
  }
  throw error
}
