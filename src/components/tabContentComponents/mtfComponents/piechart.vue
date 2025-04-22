<template>
  <vue-echarts class="chart" :option="option" autoresize />
</template>

<script setup>
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart, LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from 'echarts/components'
import { VueEcharts } from 'vue3-echarts'
import { ref } from 'vue'

const props = defineProps({
  yMax: {
    type: Number,
    required: true,
    default: 100
  },
})

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  LineChart,
])

// provide(THEME_KEY, 'dark')

function func(x) {
  x /= 10
  return (Math.sin(x) * Math.cos(x * 2 + 1) * Math.sin(x * 3 + 2) * props.yMax) + props.yMax/4
}
function generateData() {
  let data = []
  for (let i = 0; i <= 30; i += 0.1) {
    data.push([i, func(i)])
  }
  return data
}

const option = ref({
  animation: false,
  grid: {
    top: 40,
    left: 50,
    right: 40,
    bottom: 50,
  },
  xAxis: {
    name: 'x',
    minorTick: {
      show: true,
    },
    minorSplitLine: {
      show: true,
    },
  },
  yAxis: {
    name: 'y',
    min: 0,
    max: props.yMax,
    minorTick: {
      show: true,
    },
    minorSplitLine: {
      show: true,
    },
  },
  dataZoom: [
    {
      show: true,
      type: 'inside',
      filterMode: 'none',
      xAxisIndex: [0],
      startValue: -20,
      endValue: 20,
    },
    {
      show: true,
      type: 'inside',
      filterMode: 'none',
      yAxisIndex: [0],
      startValue: 0,
      endValue: props.yMax,
    },
  ],
  series: [
    {
      type: 'line',
      showSymbol: false,
      clip: true,
      data: generateData(),
    },
  ],
})
</script>

<style scoped>
.chart {
  height: 45vh;
  width: 50vh;
}
</style>
