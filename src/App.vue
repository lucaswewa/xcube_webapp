<script setup></script>

<template>
  <div id="app" class="uk-height-1-1 uk-margin-remove uk-padding-remove"></div>
</template>

<script setup>
import { useWotStore } from './stores/wotStore'

const wotStore = useWotStore()
</script>
<style lang="less">
// Basic UIkit CSS
@import '../node_modules/uikit/src/less/uikit.less';
// Custom UIkit CSS modifications
@import './assets/less/theme.less';

// We override the custom-electron-titlebar z-index
// UIKit lightbox must be able to draw over the titlebar
// as it currently always spawns at the root of the DOM
.titlebar,
.titlebar > * {
  z-index: 1000 !important;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  height: 100%;
}

body,
html {
  height: 100%;
  overflow: hidden;
}

.uk-disabled {
  pointer-events: none;
  opacity: 0.4;
}

.control-component {
  overflow-y: auto;
  overflow-x: hidden;
  width: 300px;
  height: 100%;
  padding: 0;
  background-color: rgba(180, 180, 180, 0.03);
  border-width: 0 1px 0 0;
  border-style: solid;
  border-color: rgba(180, 180, 180, 0.25);
}

.view-component {
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
  padding: 0;
}

.image-fit {
  height: 80%;
  width: 100%;
  object-fit: contain;
  overflow-y: clip;
}

.section-content {
  padding: 0;
  height: 100%;
}

// Style tour
.v-tour__target--highlighted {
  box-shadow:
    0px 40px 200px 30px rgba(0, 0, 0, 0.5),
    0px 0px 0px 4px rgba(128, 128, 128, 0.5) !important;
  border-radius: 5px;
  opacity: 100% !important;
  pointer-events: none !important;
}

.v-step {
  background: @global-primary-background !important;
}

.v-step__header {
  background-color: darken(@global-primary-background, 7%) !important;
}

.v-step__button {
  font-size: 0.9rem !important;
}

// Change step arrow colour
// This is awful and hacky and makes me sad, but needs must
.v-step .v-step__arrow {
  border-color: darken(@global-primary-background, 7%) !important;
  &--dark {
    border-color: darken(@global-primary-background, 7%) !important;
  }
}

.v-step[x-placement^='top'] .v-step__arrow {
  border-left-color: transparent !important;
  border-right-color: transparent !important;
  border-bottom-color: transparent !important;
}

.v-step[x-placement^='bottom'] .v-step__arrow {
  border-left-color: transparent !important;
  border-right-color: transparent !important;
  border-top-color: transparent !important;
}

.v-step[x-placement^='right'] .v-step__arrow {
  border-left-color: transparent !important;
  border-top-color: transparent !important;
  border-bottom-color: transparent !important;
}

.v-step[x-placement^='left'] .v-step__arrow {
  border-top-color: transparent !important;
  border-right-color: transparent !important;
  border-bottom-color: transparent !important;
}
</style>
