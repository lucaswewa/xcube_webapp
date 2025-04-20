import { defineStore } from 'pinia'
import { WoTClient } from '../wot/wotClient'

let wotClient = WoTClient()

function getOriginFromLocation() {
  // This will default to the same origin that's serving
  // the web app - but can be overridden by the URL.
  // See also devTools.vue which can change the origin.
  let url = new URL(window.location.href)
  let origin = url.searchParams.get('overrideOrigin')
  if (origin) {
    return origin
  } else {
    return url.origin
  }
}

export const useWotStore = defineStore('wot', {
  state: () => ({
    origin: getOriginFromLocation(),
    available: false,
    waiting: false,
    error: '',
    disableStream: false,
    autoGpuPreview: false,
    trackWindow: true,
    imjoyEnabled: false,
    galleryEnabled: true,
    appTheme: 'system',
    activeStreams: {},
    microscopeHostname: '',
  }),

  getters: {
    wot: () => wotClient,
    baseUri: (state) => state.origin,
    ready: (state) => state.available,
  },
  actions: {
    changeOrigin(origin) {
      this.origin = origin
    },
    changeWaiting(waiting) {
      this.waiting == waiting
    },
    changeDisableStream(disabled) {
      this.disableStream = disabled
    },
    changeAutoGpuPreview(enabled) {
      this.autoGpuPreview = enabled
    },
    changeTrackWindow(enabled) {
      this.trackWindow = enabled
    },
    changeAppTheme(theme) {
      this.appTheme = theme
    },
    changeGalleryEnabled(enabled) {
      this.galleryEnabled = enabled
    },
    resetState() {
      this.waiting = false
      this.available = false
      this.error = null
    },
    setConnected() {
      this.waiting = false
      this.available = true
    },
    setErrorMessage(msg) {
      this.error = msg
    },
    addStream(id) {
      this.activeStreams[id] = true
    },
    removeStream(id) {
      this.activeStreams[id] = false
    },
    changeMicroscopeHostname(value) {
      this.microscopeHostname = value
    },
  },
})
