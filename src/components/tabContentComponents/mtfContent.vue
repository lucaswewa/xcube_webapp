<template>
  <!-- Grid managing tab content -->
  <div uk-grid class="uk-height-1-1 uk-margin-remove uk-padding-remove">
    <div class="control-component">
      <paneMTF />
    </div>
    <div class="view-component uk-width-expand">
      <mtfMetrics />
    </div>
  </div>
</template>

<script setup>
import paneMTF from "./mtfComponents/paneMTF.vue"
import mtfMetrics from "./mtfComponents/mtfMetrics.vue"
</script>
