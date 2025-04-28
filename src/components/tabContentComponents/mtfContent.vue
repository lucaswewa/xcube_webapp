<template>
  <!-- Grid managing tab content -->
  <div uk-grid class="uk-height-1-1 uk-margin-remove uk-padding-remove">
    <div class="control-component">
      <paneMTF :roi_x="roi_x" :roi_y="roi_y" />
    </div>
    <div class="view-component uk-width-expand">
      <mtfMetrics @roi_pos_changed="onRoiChanged" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import paneMTF from './mtfComponents/paneMTF.vue'
import mtfMetrics from './mtfComponents/mtfMetrics.vue'

const _roi_x = ref(0)
const _roi_y = ref(0)

const roi_x = computed(() => {
  return _roi_x.value
})

const roi_y = computed(() => {
  return _roi_y.value
})

function onRoiChanged(roi_xy) {
  console.log('onRoiChanged', roi_xy)
  _roi_x.value = roi_xy[0]
  _roi_y.value = roi_xy[1]
}
</script>
