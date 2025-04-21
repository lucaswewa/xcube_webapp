<template>
  <div v-observe-visibility="visibilityChanged" class="uk-margin-remove uk-padding-remove">
    <div v-if="state.taskStarted" ref="isPollingElement">
      <action-progress-bar :progress="state.progress" :task-status="state.taskStatus" />
      <button
        v-if="props.canTerminate && state.taskRunning"
        type="button"
        class="uk-button uk-button-danger uk-margin-remove uk-float-right uk-width-1-1"
        @click="terminateTask()"
      >
        Cancel
      </button>
    </div>

    <div>
      <button
        type="button"
        :hidden="state.taskStarted"
        class="uk-button uk-width-1-1"
        :class="[props.buttonPrimary ? 'uk-button-primary' : 'uk-button-default']"
        @click="bootstrapTask()"
      >
        {{ props.submitLabel }}
      </button>
    </div>

    <div
      id="modal-center"
      ref="statusModal"
      class=""
      uk-modal="bg-close: false; esc-close: false; stack: true;"
    >
      <div id="status-modal" class="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
        <h2>{{ props.submitLabel }}</h2>
        <action-log-display :log="state.log" :task-status="state.taskStatus" />
        <div id="progress-and-cancel-row">
          <div class="stretchy">
            <action-progress-bar :progress="state.progress" :task-status="state.taskStatus" />
          </div>

          <button
            v-if="props.canTerminate && state.taskRunning"
            type="button"
            class="uk-button uk-button-danger not-stretchy"
            @click="terminateTask()"
          >
            Cancel
          </button>
          <button
            v-if="!state.taskStarted"
            type="button"
            class="uk-button not-stretchy"
            @click="hideModal"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import UIkit from 'uikit'
import { reactive, computed, watch, onMounted, onBeforeUnmount, useTemplateRef } from 'vue'
import ActionProgressBar from './actionProgressBar.vue'
import ActionLogDisplay from './actionLogDisplay.vue'
import emitter from '../../stores/eventBus'
import { useWotStore } from '../../stores/wotStore'

const emit = defineEmits([
  'update:progress',
  'update:taskStarted',
  'update:taskRunning',
  'update:log',
  'update:taskStatus',
])

const wotStore = useWotStore()

const props = defineProps({
  action: {
    type: String,
    required: true,
  },
  thing: {
    type: String,
    required: true,
  },
  submitData: {
    type: [Object, Array],
    required: false,
    default: () => ({}),
  },
  pollInterval: {
    type: Number,
    required: false,
    default: 1,
  },
  submitLabel: {
    type: String,
    required: false,
    default: 'Submit',
  },
  canTerminate: {
    type: Boolean,
    required: false,
    default: true,
  },
  requiresConfirmation: {
    type: Boolean,
    required: false,
    default: false,
  },
  confirmationMessage: {
    type: String,
    required: false,
    default: 'Start task?',
  },
  buttonPrimary: {
    type: Boolean,
    required: false,
    default: true,
  },
  submitOnEvent: {
    type: String,
    required: false,
    default: null,
  },
  modalProgress: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const state = reactive({
  taskUrl: null,
  progress: null,
  taskStarted: false,
  taskRunning: false,
  log: [],
  taskStatus: '',
})

const submitUrl = computed(() => {
  // allow_missing: true
  const url = wotStore.thingActionUrl(props.thing, props.action, 'invokeaction', true)
  return url
})

watch(
  () => state.progress,
  (newval) => {
    emit('update:progress', newval)
  },
)

watch(
  () => state.taskStarted,
  (newval) => {
    emit('update:taskStarted', newval)
  },
)

watch(
  () => state.taskRunning,
  (newval) => {
    emit('update:taskRunning', newval)
  },
)

watch(
  () => state.log,
  (newval) => {
    emit('update:log', newval)
  },
)

watch(
  () => state.taskStatus,
  (newval) => {
    emit('update:taskStatus', newval)
  },
)

onMounted(() => {
  // Check for already running tasks
  if (state.taskStarted != true) {
    checkExistingTasks()
  }
  // A global signal listener to perform the action
  if (props.submitOnEvent) {
    emitter.on(props.submitOnEvent, () => {
      state.bootstrapTask()
    })
  }
})

onBeforeUnmount(() => {
  if (props.submitOnEvent) {
    emitter.off(props.submitOnEvent)
  }
})

function visibilityChanged(isVisible) {
  if (isVisible && state.taskStarted != true) {
    checkExistingTasks()
  }
}

function checkExistingTasks() {
  axios.get(submitUrl.value).then((response) => {
    for (const task of response.data) {
      if (task.status == 'pending' || task.status == 'running') {
        state.taskStarted = true
        emit('taskStarted')
        startPolling(task.id, task.links.find((t) => t.rel == 'self').href)
      }
    }
  })
}

function bootstrapTask() {
  // Starts the process of creating a new Actiont ask
  if (props.requiresConfirmation) {
    // this.modalConfirm(this.confirmationMessage).then(
    //   () => {
    //     startTask()
    //   },
    //   () => {},
    // )
  } else {
    startTask()
  }
}

async function startTask() {
  console.log('[startTask]')
  // Starts a new Action task

  emit('submit', props.submitData)
  // Send a request to start a task

  state.taskStarted = true
  emit('taskStarted')
  try {
    let url = submitUrl.value
    let response = await axios.post(url, props.submitData)
    if (props.modalProgress) {
      const ref = useTemplateRef('statusModal')
      UIkit.modal(ref).show()
    }
    // Start the store polling TaskId for success
    response = await startPolling(response.data.id, response.data.href)
    if (response.status == 'completed') {
      console.log('[emitting completed]')
      emit('response', response)
      emit('completed', response.output)
    } else if (response.status == 'cancelled') {
      emit('cancelled', response)
      // this.modalNotify(`The action '${this.submitLabel}' was cancelled.`)
    }
  } catch (error) {
    emit('error', error | Error('Unknown error'))
  } finally {
    // Reset taskRunning and taskId
    state.taskRunning = false
    state.taskStarted = false
    console.log('[emitting finished]')
    emit('finished')
    // Update the form data if we're self-updating
    if (state.selfUpdate) {
      // this.getFormData()
    }
  }
}

function startPolling(taskId, taskUrl) {
  if (state.taskRunning != true) {
    // Starts polling an existing Action task
    state.taskUrl = taskUrl
    // Start the store polling TaskId for success
    state.taskRunning = true
    console.log('[emitting taskRunning]')
    emit('taskRunning', taskId)
    return pollTask(taskId, props.pollInterval)
  }
}

function pollTask(taskId, interval) {
  interval = interval * 1000 || 500

  var checkCondition = (resolve, reject) => {
    console.log('[checkCondition]')
    // If the condition is met, we're done!
    axios.get(state.taskUrl, { baseURL: wotStore.baseUri }).then((response) => {
      var result = response.data.status
      state.taskStatus = result
      if ((result == 'running') | (result == 'pending')) {
        // If the task is still running, we update progress/log,
        // and schedule another poll
        state.progress = response.data.progress
        state.log = response.data.log
        // Check again after timeout
        setTimeout(checkCondition, interval, resolve, reject)
      }
      // If task ends with an error
      else if (result == 'error') {
        // Pass the error string back with reject
        if (!state.progress) state.progress = 1
        reject(new Error(response.data.output))
      }
      // If task ends without reporting an error
      // (NB this includes cancellation)
      else {
        console.log('[checkCondition resolved]')
        resolve(response.data)
      }
    })
  }

  return new Promise(checkCondition)
}

function hideModal() {
  const ref = useTemplateRef('statusModal')
  UIkit.modal(ref).hide()
}

function terminateTask() {
  axios.delete(state.taskUrl, { baseURL: wotStore.baseUri })
}
</script>

<style lang="less" scoped>
@import '../../assets/less/theme.less';

#progress-and-cancel-row {
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-content: stretch;
  align-items: center;
  width: 100%;
}

#progress-and-cancel-row .stretchy {
  flex-grow: 1;
  margin-left: 5px;
  margin-right: 5px;
}
#progress-and-cancel-row .not-stretchy {
  flex-grow: 0;
  margin-left: 5px;
  margin-right: 5px;
}

#status-modal .log-container {
  height: 10em;
}
</style>
