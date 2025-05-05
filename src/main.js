import { createApp } from 'vue'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import * as styles from 'vuetify/styles'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'
import router from '../src/router/router.js'

import App from './App.vue'

const vuetify = createVuetify({
  components,
  directives,
  styles,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
})

createApp(App).use(router).use(vuetify).mount('#app')
