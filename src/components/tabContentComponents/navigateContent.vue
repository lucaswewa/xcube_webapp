<template>
  <!-- Grid managing tab content -->
  <div uk-grid class="uk-height-1-1 uk-margin-remove uk-padding-remove">
    <div class="control-component">
      <paneNavigate />
    </div>
    <div class="view-component uk-width-expand">
      <streamDisplay />
    </div>
  </div>
</template>

<script setup>
import paneNavigate from './navigateComponents/paneNavigate.vue'
import streamDisplay from './streamContent.vue'
</script>
