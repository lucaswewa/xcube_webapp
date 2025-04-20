<template>
  <div>
    <form class="uk-form-stacked" action="" method="GET" @submit="overrideAPIHost">
      <label class="uk-form-label">Override API origin</label>
      <input v-model="state.newOrigin" name="overrideOrigin" class="uk-input" type="text" />
      <label class="uk-form-label">
        <input
          v-model="state.reloadWhenOverridingOrigin"
          class="uk-input uk-checkbox"
          type="checkbox"
        />
        Reload web app with new origin
      </label>
      <button class="uk-button uk-button-default uk-margin-small">Apply</button>
    </form>
  </div>
</template>

<script setup>
import { useWotStore } from '../../stores/wotStore'
import { reactive, onMounted } from 'vue'

const wotStore = useWotStore()

async function checkConnection() {
  wotStore.wot.fetchThingDescriptions('http://localhost:5000/thing_descriptions/').then((tds) => {
    wotStore.setConnected()
  })
}

const state = reactive({
  newOrigin: '',
  reloadWhenOverridingOrigin: false,
})

onMounted(() => {
  if (localStorage.overrideOrigin) {
    state.newOrigin = localStorage.overrideOrigin
  } else {
    state.newOrigin = 'http://microscope.local:5000'
  }
})

function overrideAPIHost(event) {
  // Save the origin override, so that if we reload the web app, you can easily
  localStorage.overrideOrigin = state.newOrigin

  console.log(state.newOrigin.value)
  // If we have elected not to reload the interface, just update the origin
  // in the store.  Otherwise, the form's default action will do the job for us.
  // TODO: preserve other query parameters when reloading
  if (!state.reloadWhenOverridingOrigin) {
    wotStore.changeOrigin(state.newOrigin)
    event.preventDefault()
  }
  checkConnection()
  // wotStore.setConnected()
}
</script>

<style scoped lang="less">
.error-icon {
  font-size: 120px;
}
</style>
