import { Notify } from 'quasar'

export const rErrorNotify = (message: string): void => {
  const errorNotify = {
    message,
    color: 'negative',
    actions: [
      {
        label: 'Ок',
        color: 'white',
      },
    ],
  }

  Notify.create(errorNotify)
}

export const rSuccessNotify = (message: string): void => {
  const successNotify = {
    message,
    color: 'positive',
    actions: [
      {
        label: 'Ок',
        color: 'white',
      },
    ],
  }

  Notify.create(successNotify)
}

export const rInfoNotify = (message: string): void => {
  const successNotify = {
    message,
    color: 'info',
    actions: [
      {
        label: 'Ок',
        color: 'white',
      },
    ],
  }

  Notify.create(successNotify)
}

export default {
  error: rErrorNotify,
  success: rSuccessNotify,
  info: rInfoNotify,
}
