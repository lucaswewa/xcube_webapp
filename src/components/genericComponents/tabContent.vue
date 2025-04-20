<template>
  <div
    v-if="!(props.requireConnection && !wotStore.ready)"
    :hidden="props.currentTab != props.tabID"
    class="uk-width-expand uk-height-1-1"
  >
    <slot></slot>
  </div>
</template>

<script setup>
import { useWotStore } from '@/stores/wotStore'

const wotStore = useWotStore()

const props = defineProps({
  tabID: {
    type: String,
    required: true,
  },
  currentTab: {
    type: String,
    required: true,
  },
  requireConnection: Boolean,
})
</script>

<style lang="less" scoped>
.section-heading {
  display: block;
  font-size: 12px;
  text-transform: uppercase;
  line-height: 20px;
  cursor: default;
}
</style>
