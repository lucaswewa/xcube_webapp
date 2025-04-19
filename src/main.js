import { createApp } from 'vue'
import { createPinia } from 'pinia'

import UIkit from 'uikit'

import App from './App.vue'
import VueFriendlyIframe from 'vue-friendly-iframe'
import VueObserveVisibility from 'vue-observe-visibility'

// Import MD icons
import 'material-symbols/outlined.css'

// UIKit overrides
UIkit.mixin(
  {
    data: {
      animation: false,
    },
  },
  'accordion',
)

const app = createApp(App)

// Use Friendly Iframe module
app.use(VueFriendlyIframe)

// Use visibility observer
app.use(VueObserveVisibility)

app.use(createPinia())

app.mount('#app')
