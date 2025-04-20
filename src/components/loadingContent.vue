<template>
  <div class="uk-flex uk-flex-column uk-flex-center uk-height-1-1">
    <div v-if="wotStore.waiting" class="uk-align-center" uk-spinner="ratio: 3"></div>
    <div v-if="wotStore.waiting" class="uk-align-center">Loading...</div>
    <span class="material-symbols-outlined uk-align-center error-icon">error_outline</span>
    <div v-if="wotStore.error" class="uk-align-center">
      {{ wotStore.error }}
    </div>
    <div class="uk-align-center">
      <devTools class="uk-width-medium"></devTools>
    </div>
  </div>
</template>

<script setup>
import { useWotStore } from '../stores/wotStore'
import devTools from './aboutComponents/devTools.vue'

const wotStore = useWotStore()
</script>

<style scoped lang="less">
.error-icon {
  font-size: 120px;
}
</style>
