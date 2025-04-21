import { defineStore } from 'pinia'
import { WoTClient } from '../wot/wotClient'
import axios from 'axios'

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

function findFormHref(affordance, op) {
  // Find the form in the affordance that matches the given operation type
  if (affordance == undefined) return undefined
  let forms = affordance.forms
  let matchingForm = forms.find((f) => f.op == op || f.op.includes(op))
  if (matchingForm == undefined) return undefined
  return matchingForm.href
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
    thingDescriptions: {},
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
    thingDescription(thingName) {
      return this.thingDescriptions[thingName]
    },
    thingAvailable(thingName) {
      return thingName in this.thingDescriptions
    },
    thingFormUrl(thingName, affordanceType, affordance, op, allowUndefined = true) {
      var td = this.thingDescriptions[thingName]
      if (!td) {
        if (allowUndefined) return undefined
        throw `Count not find form for ${affordanceType} ${thingName}/${affordance} with op ${op}`
      }
      var affordances = td[affordanceType]
      var href = findFormHref(affordances[affordance], op)
      if (href == undefined) {
        if (allowUndefined) return undefined
        throw `Cound not find form for ${affordanceType} ${thingName}/${affordance} with ${op} op`
      }
      if (href.startsWith('http')) return href
      if ('base' in td) {
        var base = td.base
        if (href.startsWith('/')) href = href.slice(1)
        if (!base.endsWith('/')) base += '/'
        return base + href
      }
      return href
    },
    thingPropertyUrl(thing, property, op, allowUndefined) {
      return this.thingFormUrl(thing, 'properties', property, op, allowUndefined)
    },
    thingActionUrl(thing, action, op, allowUndefined) {
      return this.thingFormUrl(thing, 'actions', action, op, allowUndefined)
    },

    async fetchThingDescription(uri, name = null) {
      this.wot.fetchThingDescription(uri, name).then((thing) => {
        this.thingDescriptions[thing.thingName] = thing.thingDescription
      })
    },
    async fetchThingDescriptions(uri) {
      await this.wot.fetchThingDescriptions(uri).then((things) => {
        console.log(things)
        for (const thing of things) {
          this.thingDescriptions[thing.thingName] = thing.thingDescription
        }
      })
    },
    async readThingProperty(thing, property, silence_errors = false) {
      var url = this.thingPropertyUrl(thing, property, 'readproperty', false)
      try {
        var response = await axios.get(url)
        return response.data
      } catch (error) {
        if (!silence_errors) this.modelError(error)
        return undefined
      }
    },
    async writeThingProperty(thing, property, value) {
      var url = this.thingPropertyUrl(thing, property, 'writeproperty', false)
      if ((value === false) | (value === true)) {
        value = JSON.stringify(value)
      }
      await axios.put(url, value)
    },
    async checkConnection() {
      await this.fetchThingDescriptions(this.baseUri + '/thing_descriptions/')
      this.setConnected()
    },
    getLocalStorageObj(keyName) {
      if (localStorage.getItem(keyName)) {
        try {
          return JSON.parse(localStorage.getItem(keyName))
        } catch (e) {
          localStorage.removeItem(keyName)
          return null
        }
      }
    },
    setLocalStorageObj(keyName, obj) {
      const parsed = JSON.stringify(obj)
      localStorage.setItem(keyName, parsed)
    },
  },
})
