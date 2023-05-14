import { store } from 'quasar/wrappers'
import { createPinia } from 'pinia'
import { Router } from 'vue-router'
import useTaskStore from './tasks'

declare module 'pinia' {
  export interface PiniaCustomProperties {
    readonly router: Router
  }
}

export default store((/* { ssrContext } */) => createPinia())

export { useTaskStore }
