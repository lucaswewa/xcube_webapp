<template>
  <div
    id="stream-display"
    ref="streamDisplay"
    v-observe-visibility="visibilityChanged"
    class="stream-display uk-width-1-1 uk-height-1-1 scrollTarget"
  >
    <img
      v-if="state.isVisible"
      ref="click-frame"
      class="uk-align-center uk-margin-remove-bottom"
      :hidden="!streamEnabled"
      :src="streamImgUri"
      alt="Stream"
      @dblclick="clickMonitor"
    />

    <div v-if="!streamEnabled" class="uk-height-1-1">
      <div v-if="wotStore.waiting" class="uk-position-center">
        <div uk-spinner="ratio: 4.5"></div>
      </div>

      <div
        v-else-if="wotStore.disableStream"
        class="uk-position-center position-relative text-center"
      >
        Stream preview disabled
      </div>

      <div v-else class="uk-position-center position-relative text-center">
        No active connection
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, onMounted, onBeforeUnmount, useTemplateRef, defineEmits } from 'vue'
import { useWotStore } from '@/stores/wotStore'

const emit = defineEmits(['globalMoveInImageCoordinatesEvent'])
const wotStore = useWotStore()

const streamDisplay = useTemplateRef('streamDisplay')

const state = reactive({
  isVisible: true,
  displaySize: [0, 0],
  displayPosition: [0, 0],
  resizeTimeoutId: setTimeout(null, 500),
  observer: null,
})

const streamEnabled = computed(() => {
  return wotStore.ready && !wotStore.disableStream
})

const thisStreamOpen = computed(() => {
  return !(state.displaySize[0] == 0) && !(state.displaySize[1] == 0)
})

const streamImgUri = computed(() => {
  return `http://localhost:5000/camera/mjpeg_stream`
})

onMounted(() => {
  // Mutation observer
  state.observer = new ResizeObserver(() => {
    handleResize() // For any element attached to the observer, run handleResize() on change
  })
  // Fetch streamDisplay component by ref
  const streamDisplayElement = streamDisplay.value.parentNode
  // Attach streamDisplay to the size observer
  state.observer.observe(streamDisplayElement)
})

onBeforeUnmount(() => {
  // Remove global signal listener to change the GPU preview state
  this.$root.$off('globalTogglePreview')
  // Remove global signal listener to flash the stream element
  this.$root.$off('globalFlashStream')
  // Disconnect the size observer
  this.sizeObserver.disconnect()
  // Remove from the array of active streams
  this.$store.commit('removeStream', this._uid)
})

function visibilityChanged(isVisible) {
  state.isVisible = isVisible
}

function flashStream() {
  // Run an animation that flashes the stream (for capture feedback)
  let element = streamDisplay
  element.classList.remove('uk-animation-fade')
  element.offsetHeight /* trigger reflow */
  element.classList.add('uk-animation-fade')
  setTimeout(function () {
    element.classList.remove('uk-animation-fade')
  }, 800)
}

function clickMonitor(event) {
  // Calculate steps from event coordinates
  let xCoordinate = event.offsetX
  let yCoordinate = event.offsetY

  // Simply scaling by naturalHeight/offsetHeight may give the wrong answer!
  // because we use content-fit: contain in the stylesheet, the img element
  // may be larger than the picture.  So, we must determine whether the
  // width or height is setting the scaling factor, and use a uniform scale
  // factor.
  let scale = Math.max(
    event.target.naturalWidth / event.target.offsetWidth,
    event.target.naturalHeight / event.target.offsetHeight,
  )

  let xRelative = (0.5 * event.target.offsetWidth - xCoordinate) * scale
  let yRelative = (0.5 * event.target.offsetHeight - yCoordinate) * scale

  // Emit a signal to move, acted on by panelNavigate.vue
  emit('globalMoveInImageCoordinatesEvent', -xRelative, -yRelative)
}

function handleResize() {
  // Only fires resize event after no resize in 500ms (prevents resize event spam)
  clearTimeout(state.resizeTimeoutId)
  state.resizeTimeoutId = setTimeout(handleDoneResize, 250)
}

function handleDoneResize() {
  // Recalculate size

  recalculateSize()
  // Handle closed stream
  if (state.displaySize[0] == 0 && state.displaySize[1] == 0) {
    // If this stream was previously active
    // if (this.$store.state.activeStreams[this._uid] == true) {
    //   this.$store.commit('removeStream', this._uid)
    // }
    // If resized to anything other than zero
  } else {
    wotStore.addStream(state._uid)
  }
}

function recalculateSize() {
  // Calculate stream size
  let element = streamDisplay.value.parentNode
  let bound = element.getBoundingClientRect()

  let elementSize = [bound.width, bound.height]

  let elementPositionOnWindow = [bound.left, bound.top]
  let windowPositionOnDisplay = [window.screenX, window.screenY]
  let windowChromeHeight = window.outerHeight - window.innerHeight
  let elementPositionOnDisplay = [
    Math.max(0, windowPositionOnDisplay[0] + elementPositionOnWindow[0]),
    Math.max(0, windowPositionOnDisplay[1] + elementPositionOnWindow[1] + windowChromeHeight),
  ]

  state.displaySize = elementSize
  state.displayPosition = elementPositionOnDisplay
}
</script>

<style scoped lang="less">
.stream-display img {
  height: 100%;
  text-align: center;
  object-fit: contain;
}

.stream-display {
  width: 100%;
  height: 100%;
}

.position-relative {
  position: relative !important;
}

.text-center {
  text-align: center;
}
</style>
