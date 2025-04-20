<template>
  <div id="app-content" class="uk-margin-remove uk-padding-remove uk-height-1-1" uk-grid>
    <!-- Initialisation modals -->
    <!-- Vertical tab bar -->
    <div id="switcher-left-container">
      <div
        id="switcher-left"
        class="uk-flex uk-flex-column uk-padding-remove uk-width-auto uk-height-1-1 uk-text-center"
      >
        <!-- For each top tab -->
        <template v-for="(item, index) in topTabs" :key="item.id + '-tab-icon'">
          <!-- Render the tab icon -->
          <tabIcon
            :id="item.id + '-tab-icon'"
            :tab-i-d="item.id"
            :require-connection="true"
            :current-tab="state.currentTab"
            :class="item.class"
            @set-tab="setTab"
          >
            <img
              v-if="item.iconURL"
              style="filter: grayscale(100%); width: 22px; margin-top: 5px; margin-bottom: 8px"
              :src="item.iconURL"
            />
            <span v-if="!item.iconURL" class="material-symbols-outlined">
              {{ item.icon }}
            </span>
          </tabIcon>
          <!-- Add a divider if item.divide is true -->
          <hr v-if="item.divide" :key="'tab-divider-' + index" />
        </template>

        <hr id="extension-tab-divider" />

        <!-- For each bottom tab -->
        <template v-for="(item, index) in state.bottomTabs" :key="item.id + '-tab-icon'">
          <!-- Render the tab icon -->
        </template>
      </div>
    </div>

    <!-- Corresponding vertical tab content -->
    <div id="container-left" class="uk-padding-remove uk-height-1-1 uk-width-expand">
      <!-- For each top tab -->
      <tabContent
        v-for="item in topTabs"
        :id="item.id + '-tab-content'"
        :key="item.id + '-tab-content'"
        :tab-i-d="item.id"
        :require-connection="true"
        :current-tab="state.currentTab"
      >
        <component :is="item.component"></component>
      </tabContent>
      <!-- For each bottom tab -->
    </div>
  </div>
</template>

<script setup>
// Import generic components
import tabIcon from './genericComponents/tabIcon.vue'
import tabContent from './genericComponents/tabContent.vue'

// Import new content components
// import testerContent from "./tabContentComponents/testerContent.vue";
import navigateContent from './tabContentComponents/navigateContent.vue'
// import settingsContent from "./tabContentComponents/settingsContent.vue";
// import mtfContent from "./tabContentComponents/mtfContent.vue";

// Import modal components for device initialisation
// import TabIcon from "./genericComponents/tabIcon.vue";
// import ScanListContent from "./tabContentComponents/scanListContent.vue";

import { useWotStore } from '../stores/wotStore'
import { reactive, computed } from 'vue'

const wotStore = useWotStore()

const state = reactive({
  currentTab: 'navigate',
  bottomTabs: [],
})

const tabOrder = computed(() => {
  var ind = []
  for (const tab of topTabs) {
    ind.push(tab.id)
  }
  for (const tab of state.bottomTabs) {
    ind.push(tab.id)
  }
  return ind
})

const topTabs = computed(() => {
  var tabs = [
    {
      id: 'navigate',
      icon: 'gamepad',
      component: navigateContent,
    },
    {
      id: 'navigate1',
      icon: 'gamepad',
      component: navigateContent,
    },
  ]
  if (!wotStore.galleryEnabled) {
    tabs = tabs.filter((tab) => tab.id != 'gallery')
  }
  return tabs
})

const currentTabIndex = computed(() => {
  return tabOrder.value.indexOf(state.currentTab)
})

function setTab(event, tab) {
  if (!(state.currentTab == tab)) {
    state.currentTab = tab
  }
}

function incrementTabBy(n) {
  const newIndex =
    (((currentTabIndex.value + n) % tabOrder.value.length) + tabOrder.value.length) %
    tabOrder.value.length
  const newId = tabOrder[newIndex]
  state.currentTab = newId
}

function enterApp() {}
</script>

<style scoped lang="less">
.window-container {
  width: 100%;
  height: 100%;
}
#component-left {
  width: 100%;
  height: 100%;
}

#container-left {
  overflow: auto;
  background-color: rgba(180, 180, 180, 0.025);
  width: 100%;
  height: 100%;
}

#switcher-left {
  width: 85px;
  padding-top: 2px !important;
}

#switcher-left-container {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  overflow-y: auto;
  height: 100%;
  background-color: rgba(180, 180, 180, 0.1);
  border-width: 0 1px 0 0;
  border-style: solid;
  border-color: rgba(180, 180, 180, 0.25);
}

#switcher-left a {
  padding: 10px 8px;
}
</style>
