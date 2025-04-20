<template>
  <div id="paneNavigate" class="uk-padding-small">
    <div v-if="state.setPosition">
      <ul uk-accordion="multiple: true">
        <li class="uk-open">
          <a class="uk-accordion-title" href="#">Position</a>
          <div class="uk-accordion-content">
            <form>
              <!-- Text boxes to set and view position -->
              <div class="input-and-buttons-container">
                <input
                  v-for="(_v, key) in state.setPosition"
                  :key="`setPosition_${key}`"
                  v-model="state.setPosition[key]"
                  class="uk-form-small numeric-setting-line-input"
                  type="number"
                  @keyup.enter="startMoveTask"
                />
                <a class="button-next-to-input" @click="updatePosition">
                  <span class="material-symbols-outlined">refresh</span>
                </a>
              </div>
              <p>
                <action-button
                  ref="moveButton"
                  thing="stage"
                  action="move_absolute"
                  :submit-data="state.setPosition"
                  :submit-label="'Move'"
                  :can-terminate="true"
                  :poll-interval="0.05"
                  @taskStarted="state.moveLock = true"
                  @finished="(updatePosition(), (state.moveLock = false))"
                  @error="modalError"
                />
              </p>
            </form>
          </div>
        </li>

        <!--Show autofocus if default plugin is enabled-->
        <li class="uk-open">
          <a class="uk-accordion-title" href="#">Autofocus</a>
          <div class="uk-accordion-content">
            <div class="uk-grid-small uk-child-width-expand" uk-grid>
              <div v-show="!state.isAutofocusing || state.isAutofocusing == 1">
                <action-button
                  thing="autofocus"
                  action="fast_autofocus"
                  :submit-data="{ dz: 2000 }"
                  :submit-label="'Autofocus'"
                  :button-primary="false"
                  :submit-on-event="'globalFastAutofocusEvent'"
                  @taskStarted="state.isAutofocusing = 1"
                  @finished="(updatePosition(), (state.isAutofocusing = 0))"
                  @error="modalError"
                />
              </div>
            </div>
          </div>
        </li>
        <li class="uk-open">
          <a class="uk-accordion-title" href="#">Image Capture</a>
          <div class="uk-accordion-content">
            <div class="uk-margin">
              <action-button
                thing="camera"
                action="capture_jpeg"
                :submit-data="{ resolution: 'main' }"
                :submit-label="'Low Resolution'"
                :submit-on-event="'globalCaptureEvent'"
                @response="handleCaptureResponse"
                @error="modalError"
              />
            </div>

            <div class="uk-margin">
              <action-button
                thing="camera"
                action="capture_jpeg"
                :submit-data="{ resolution: 'full' }"
                submit-label="Full Resolution"
                :submit-on-event="'globalCaptureEvent'"
                @response="handleCaptureResponse"
                @error="modalError"
              />
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div v-else class="uk-text-warning">
      <p>Stage positioning is disabled since no stage is connected.</p>
      <p>Please check all data and power connections to your motor controller board.</p>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, onMounted, onBeforeUnmount, useTemplateRef } from 'vue'
import { useWotStore } from '@/stores/wotStore'
import axios from 'axios'
import ActionButton from '../../labThingsComponents/actionButton.vue'

const wotStore = useWotStore()

const moveButton = useTemplateRef('moveButton')

const state = reactive({
  stepXy: 200,
  stepZz: 50,
  stepSize: {
    x: 200,
    y: 200,
    z: 50,
  },
  invert: {
    x: false,
    y: false,
    z: false,
  },
  setPosition: null,
  isAutofocusing: 0,
  moveLock: false,
})

const baseUri = computed(() => {
  return wotStore.baseUri
})
const positionStatusUri = computed(() => {
  return `${baseUri.value}/stage/position`
})
const moveInImageCoordinatesUri = computed(() => {
  return this.thingActionUrl('camera_stage_mapping', 'move_in_image_coordinates')
})

onMounted(async () => {
  // Reload saved settings
  state.stepSize = 1 // this.getLocalStorageObj('navigation_stepSize') || this.stepSize
  state.invert = false //this.getLocalStorageObj('navigation_invert') || this.invert
  // A global signal listener to perform a move action
  // this.$root.$on('globalMoveEvent', self.move)
  // // A global signal listener to perform a move action in pixels
  // this.$root.$on('globalMoveInImageCoordinatesEvent', (x, y, absolute) => {
  //   this.moveInImageCoordinatesRequest(x, y, absolute)
  // })
  // // A global signal listener to perform a move in multiples of a step size
  // this.$root.$on('globalMoveStepEvent', (x_steps, y_steps, z_steps) => {
  //   this.$root.$emit(
  //     'globalMoveEvent',
  //     x_steps * this.stepSize.x * (this.invert.x ? -1 : 1),
  //     y_steps * this.stepSize.y * (this.invert.y ? -1 : 1),
  //     z_steps * this.stepSize.z * (this.invert.z ? -1 : 1),
  //     false,
  //   )
  // })
  // Update the current position in text boxes
  await updatePosition()
})

onBeforeUnmount(() => {})

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function move(x, y, z, absolute) {
  // Move the stage, by updating the controls and starting a move task
  // This is equivalent to clicking the "move" button.
  if (state.moveLock) return // Discard move requests if we're already moving
  // NB moveLock is just  boolean flag - it's not as safe as a "proper" lock.
  state.moveLock = true // This will also be set by the task submitter, but
  // setting it here avoids multiple moves being requested simultaneously.
  if (absolute) {
    state.setPosition = { x: x, y: y, z: z }
  } else {
    await updatePosition()
    state.setPosition = {
      x: state.setPosition.x + x,
      y: state.setPosition.y + y,
      z: state.setPosition.z + z,
    }
  }
  await timeout(1) // Wait for Vue to update the position
  await startMoveTask()
}

async function startMoveTask() {
  await moveButton.value.startTask()
}

function moveInImageCoordinatesRequest(x, y) {
  // If not movement-locked
  if (!state.moveLock) {
    // Lock move requests
    state.moveLock = true

    if (!moveInImageCoordinatesUri.value) {
      this.modalError(
        "Moving in image coordinates is not supported - you will need to upgrade your microscope's software.",
      )
    }

    // Send move request
    axios
      .post(moveInImageCoordinatesUri, {
        x: x, // NB the coordinates are numpy/PIL style, meaning X and Y are swapped.
        y: y,
      })
      .then(() => {
        updatePosition() // Update the position in text boxes
      })
      .catch((error) => {
        this.modalError(error) // Let mixin handle error
      })
      .then(() => {
        state.moveLock = false // Release the move lock
      })
  }
}

async function updatePosition() {
  // state.setPosition = await this.readThingProperty('stage', 'position')
  state.setPosition = { x: 0, y: 0, z: 0 }
}

async function handleCaptureResponse(response) {
  // Retrieve the captured image and save it
  let imageUri = response.output.href
  if (!imageUri) {
    this.modalError('No image URI returned from capture task.')
    console.log(`Capture resulted in response ${response}`)
    return
  }
  // To save the returned data, we make a virtual link and click it
  let imageResponse = await axios.get(imageUri, { responseType: 'blob' })
  const url = window.URL.createObjectURL(new Blob([imageResponse.data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `OFM_${new Date().toISOString()}.jpeg`)
  document.body.appendChild(link)
  link.click()
}
</script>

<style scoped>
.input-and-buttons-container {
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-content: stretch;
  align-items: center;
  width: 100%;
}
.numeric-setting-line-input {
  flex-grow: 1;
  margin-left: 5px;
  margin-right: 5px;
  width: 3em;
}
/* Chrome, Safari, Edge, Opera */
.numeric-setting-line-input::-webkit-outer-spin-button,
.numeric-setting-line-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.button-next-to-input {
  flex-grow: 0;
  padding-left: 5px;
  padding-right: 5px;
  vertical-align: middle;
  cursor: pointer;
}
</style>
