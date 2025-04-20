<template>
  <a href="#" class="uk-link" :class="classObject" :uk-tooltip="tooltipOptions" @click="setThisTab">
    <slot></slot>
    <div v-if="showTitle" class="tabtitle">
      {{ computedTitle }}
    </div>
  </a>
</template>

<script setup>
import { computed } from 'vue'
import { useWotStore } from '@/stores/wotStore'

const wotStore = useWotStore()

const emit = defineEmits(['set-tab'])

const props = defineProps({
  tabID: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: false,
    default: undefined,
  },
  showTitle: {
    type: Boolean,
    required: false,
    default: true,
  },
  showTooltip: {
    type: Boolean,
    required: false,
    default: true,
  },
  currentTab: {
    type: String,
    required: true,
  },
  clickCallback: {
    type: Function,
    required: false,
    default: null,
  },
  requireConnection: Boolean,
})

const computedTitle = computed(() => {
  if (props.title !== undefined) {
    return props.title
  } else {
    // Get the last section of a fully qualified name
    var topName = props.tabID.split('.').pop()
    // Make first character uppercase, then add the rest of the string
    return topName.charAt(0).toUpperCase() + topName.slice(1)
  }
})

const tooltipOptions = computed(() => {
  if (props.showTooltip) {
    var tt = `pos: right; title: ${computedTitle.value}; delay: 500`
    return tt
  } else {
    return false
  }
})

const classObject = computed(() => {
  return {
    'tabicon-active': props.currentTab == props.tabID,
    'uk-disabled': props.requireConnection && !wotStore.ready,
  }
})

function setThisTab(event) {
  emit('set-tab', event, props.tabID)
  if (props.clickCallback) {
    props.clickCallback()
  }
}
</script>

<style lang="less" scoped>
// Custom UIkit CSS modifications
@import '../../assets/less/theme.less';

.tabicon-active {
  color: #fff !important;
  background-color: @global-primary-background !important;
}

.tabtitle {
  margin: auto;
  max-width: 70px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 85%;
}

a:hover,
.uk-link:hover {
  text-decoration: none !important;
}
</style>
