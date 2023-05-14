import { Notify, LocalStorage } from 'quasar'
import { register } from 'register-service-worker'
import pkg from '../package.json'

const { version } = pkg

// ServiceWorkerRegistration: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration

register(process.env.SERVICE_WORKER_FILE, {
  // The registrationOptions object will be passed as the second argument
  // to ServiceWorkerContainer.register()
  // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register#Parameter

  registrationOptions: { scope: './' },

  ready(/* registration */) {
    console.log('Service worker is active.')
  },
  registered(/* registration */) {
    console.log('Service worker has been registered.')
  },
  cached(/* registration */) {
    console.log('Content has been cached for offline use.')
  },
  updatefound(/* registration */) {
    const prevVersion = LocalStorage.getItem('version')
    if (prevVersion !== version) {
      LocalStorage.set('version', version)
      Notify.create({
        spinner: true,
        message: 'Обновление загружено',
        timeout: 2000,
      })
    }
  },
  updated(registration) {
    Notify.create({
      message: 'Идет загрузка обновления',
      icon: 'announcement',
      actions: [
        {
          label: 'Refresh',
          color: 'white',
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          handler: async () => {
            await registration.unregister()
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
            window.location.reload()
          },
        },
      ],
    })
  },
  offline() {
    Notify.create('Нет связи с сетью. Приложение запущено в оффлайн режиме.')
  },
  error(err) {
    console.error('Error during service worker registration:', err)
  },
})
