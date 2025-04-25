<template>
  <div
    id="stream-display"
    ref="streamDisplay"
    v-observe-visibility="visibilityChanged"
    class="stream-display uk-width-1-1 uk-height-1-1 scrollTarget"
  >
    <img
      v-if="state.isVisible"
      ref="clickFrame"
      class="uk-align-center uk-margin-remove-bottom"
      :src="streamImgUri"
      alt="Stream"
    />
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import { useTemplateRef, onMounted } from 'vue'

const emit = defineEmits(['resized'])

const clickFrame = useTemplateRef('clickFrame')

useResizeObserver(clickFrame, (entries) => {
  const [entry] = entries
  const { width, height } = entry.contentRect
  console.log(`width: ${width}\nheight: ${height}`)
  emit('resized', {
    width: width,
    height: height
  })
})

const state = reactive({
  isVisible: false
})

const streamImgUri = computed(() => {
  // return `${this.$store.getters.baseUri}/camera/mjpeg_stream`;
  return 'http://localhost:5000/camera/mjpeg_stream'
})

onMounted(() => {
  // emit('resized', { width: })
})
function visibilityChanged(isVisible) {
  state.isVisible = isVisible;
}
</script>

<style scoped lang="less">
.stream-display img {
  text-align: center;
  object-fit: contain;
  border: 1px solid #555;
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
