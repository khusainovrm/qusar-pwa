import type { AxiosResponse } from 'axios';

const DEFAULT_ERROR_TEXT = 'Произошла ошибка...';

export const getErrorMessage = (
  error: unknown,
  defaultMessage?: string,
): string => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (error.description) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return error.description;
  }
  if (defaultMessage) {
    return defaultMessage;
  }
  return DEFAULT_ERROR_TEXT;
};

export const formatRes = (res: AxiosResponse) => Promise.resolve(res.data.data);

export const formatErr = (
  err: {
    response: { data: { error: any }; status: any } | undefined;
    message: string;
    status: any;
  },
  options: { prefix?: string } = {},
) => {
  const isPrefix = !!options.prefix;

  let error: any = new Error();
  if (err.response && err.response.data && err.response.data.error) {
    error = err.response.data.error;
  } else if (err.response && err.response.data) {
    if (typeof err.response.data !== 'object') {
      error.data = err.response.data;
    } else {
      error = err.response.data;
    }
  } else if (err.response) {
    error = err.response;
  } else if (!err.response && err.message === 'Network Error' && !err.status) {
    error = err;
    error.description = isPrefix
      ? `${options.prefix}: ошибка сети!`
      : 'Ошибка сети!';
  }
  if (err.response !== undefined && err.response.status) {
    error.status = err.response.status;
  } else {
    error.status = null;
  }
  if (error.status === 401) {
    error.description = '';
  } else if (error.description) {
    error.description = isPrefix ? error.description : error.description;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  } else { // @ts-ignore
    // eslint-disable-next-line no-lonely-if
    if (err.response.data) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      error.description = err.response.data;
    } else if (!error.description) {
      error.description = isPrefix
        ? `${options.prefix}: что-то пошло не так.`
        : 'Что-то пошло не так.';
    }
  }
  const HTML = /(<([^>]+)>)/gi;
  if (HTML.test(error.description)) {
    // Ошибка может приходить из Nginx в виде html, такие ошибки пользователям не показываем
    error.description = 'Что-то пошло не так.';
  }
  throw error;
};
