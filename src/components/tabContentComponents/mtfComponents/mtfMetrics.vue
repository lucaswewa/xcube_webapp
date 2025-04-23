<template>
  <div id="cameraSettings">
    <div class="uk-grid uk-grid-divider uk-child-width-expand" uk-grid>
      <div class="uk-width-large">
        <h4>PSF</h4>
        <pieChart :yMax="4096" />

        <h4>MTF</h4>
        <pieChart :yMax="100" />
      </div>

      <div id="mini-stream">
        <div class="outsideWrapper">
          <div class="insideWrapper">
            <miniStreamDisplay class="coveredImage" />
            <canvas ref="canvasRef" class="coveringCanvas" width="600" height="500"></canvas>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import miniStreamDisplay from '../../genericComponents/miniStreamDisplay.vue'
import pieChart from './piechart.vue'
import { ref, onMounted } from 'vue'

const canvasRef = ref(null)
let ctx = null

let startX = 0
let startY = 0
let isDrawing = false

onMounted(() => {
  const canvas = canvasRef.value
  ctx = canvas.getContext('2d')

  canvas.addEventListener('mousedown', handleMouseDown)
  canvas.addEventListener('mousemove', handleMouseMove)
  canvas.addEventListener('mouseup', handleMouseUp)
})

function handleMouseDown(event) {
  startX = event.offsetX
  startY = event.offsetY
  isDrawing = true
}

function handleMouseMove(event) {
  if (!isDrawing) return
  const width = event.offsetX - startX
  const height = event.offsetY - startY
  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
  ctx.strokeRect(startX, startY, width, height)
}

function handleMouseUp(event) {
  if (!isDrawing) return
  isDrawing = false
  const width = event.offsetX - startX
  const height = event.offsetY - startY
  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
  ctx.strokeRect(startX, startY, width, height)
}
</script>

<style lang="less">
#mini-stream {
  min-width: 300px;
  max-width: 600px;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  margin-top: 50px;
}
.outsideWrapper {
  width: 256px;
  height: 256px;
  margin: 20px 60px;
  border: 1px solid blue;
}
.insideWrapper {
  width: 100%;
  height: 100%;
  position: relative;
}
.coveredImage {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
}
.coveringCanvas {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
  background-color: rgba(255, 255, 255, 0.1);
}
</style>
