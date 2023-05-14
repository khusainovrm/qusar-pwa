/* eslint-env node */

/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 */

// Configuration for your app
// https://v2.quasar.dev/quasar-cli-vite/quasar-config-js

/* eslint func-names: 0 */
/* eslint global-require: 0 */

const { configure } = require('quasar/wrappers')
const pkg = require('./package.json')

module.exports = configure((ctx) => ({
  eslint: {
    // fix: !ctx.prod,
    warnings: ctx.prod,
    errors: ctx.prod,
  },

  supportTS: {
    tsCheckerConfig: {
      eslint: {
        enabled: true,
        files: './src/**/*.{ts,js,vue}',
      },
    },
  },

  preFetch: true,

  // app boot file (/src/boot)
  // --> boot files are part of "main.js"
  // https://v2.quasar.dev/quasar-cli-vite/boot-files
  boot: ['axios'],

  // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#css
  css: ['app.scss'],

  // https://github.com/quasarframework/quasar/tree/dev/extras
  extras: [
    'roboto-font', // optional, you are not bound to it
    'material-icons', // optional, you are not bound to it
  ],

  // Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#build
  build: {
    target: {
      browser: ['es2019', 'edge88', 'firefox78', 'chrome87', 'safari13.1'],
      node: 'node16',
    },
    modulePreload: {
      polyfill: false,
    },
    lib: 'es',
    rebuildCache: true, // rebuilds Vite/linter/etc cache on startup
    publicPath: '/',
    reportCompressedSize: false,
    vueRouterMode: 'history',
    showProgress: true,
    gzip: true,
  },

  // Full list of options: https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#devServer
  devServer: {
    https: false,
    port: 8080,
    open: true, // opens browser window automatically
  },

  // https://v2.quasar.dev/quasar-cli-vite/quasar-config-js#framework
  framework: {
    config: {
      notify: {
        /* look at QuasarConfOptions from the API card */
      },
    },
    lang: 'ru', // Quasar language pack
    plugins: ['Notify', 'LocalStorage'],
  },

  // https://v2.quasar.dev/quasar-cli-vite/developing-pwa/configuring-pwa
  pwa: {
    workboxMode: 'injectManifest',
    workboxOptions: {},
    manifest: {
      name: pkg.name,
      short_name: pkg.productName,
      description: pkg.description,
      start_url: '.',
      display: 'standalone',
      orientation: 'portrait',
      background_color: '#027be3',
      dir: 'auto',
      scope: '/',
      iarc_rating_id: 'e84b072d-71b3-4d3e-86ae-31a8ce4e53b7',
      lang: 'ru',
      categories: ['productivity'],
      theme_color: '#027be3',
      icons: [
        {
          src: 'icons/icon-128x128.png',
          sizes: '128x128',
          type: 'image/png',
        },
        {
          src: 'icons/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'icons/icon-256x256.png',
          sizes: '256x256',
          type: 'image/png',
        },
        {
          src: 'icons/icon-384x384.png',
          sizes: '384x384',
          type: 'image/png',
        },
        {
          src: 'icons/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
      url_handlers: [
        {
          origin: 'https://qusar-pwa.vercel.app/',
        },
      ],
    },
    metaVariables: {
      appleMobileWebAppCapable: 'yes',
      appleMobileWebAppStatusBarStyle: 'default',
      appleTouchIcon120: 'icons/apple-icon-120x120.png',
      appleTouchIcon180: 'icons/apple-icon-180x180.png',
      appleTouchIcon152: 'icons/apple-icon-152x152.png',
      appleTouchIcon167: 'icons/apple-icon-167x167.png',
      appleSafariPinnedTab: 'icons/safari-pinned-tab.svg',
      msapplicationTileImage: 'icons/ms-icon-144x144.png',
      msapplicationTileColor: '#027be3',
    },
    sourceFiles: {
      pwaRegisterServiceWorker: 'src-pwa/register-service-worker',
      pwaServiceWorker: 'src-pwa/custom-service-worker',
      pwaManifestFile: 'src-pwa/manifest.json',
    },
  },
}))
