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
            <!-- <canvas ref="canvasRef" class="coveringCanvas" width="600" height="500"></canvas> -->
            <v-stage :config="stageSize" ref="canvasRef" class="coveringCanvas">
              <v-layer>
                <v-text
                  :config="{
                    text: 'Some text on canvas',
                    fontSize: 15,
                  }"
                />
                <v-rect
                  :config="{
                    x: 20,
                    y: 50,
                    width: 100,
                    height: 100,
                    fill: 'red',
                    shadowBlur: 10,
                  }"
                />
                <v-circle
                  :config="{
                    x: 200,
                    y: 100,
                    radius: 50,
                    fill: 'green',
                  }"
                />
                <v-line
                  :config="{
                    x: 20,
                    y: 200,
                    points: [0, 0, 100, 0, 100, 100],
                    tension: 0.5,
                    closed: true,
                    stroke: 'black',
                    fillLinearGradientStartPoint: { x: -50, y: -50 },
                    fillLinearGradientEndPoint: { x: 50, y: 50 },
                    fillLinearGradientColorStops: [0, 'red', 1, 'yellow'],
                  }"
                />
              </v-layer>
            </v-stage>
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

const stageSize = {
  width: window.innerWidth,
  height: window.innerHeight,
}

const canvasRef = ref(null)
let ctx = null

let startX = 0
let startY = 0
let isDrawing = false

onMounted(() => {
  // const canvas = canvasRef.value
  // ctx = canvas.getContext('2d')
  // canvas.addEventListener('mousedown', handleMouseDown)
  // canvas.addEventListener('mousemove', handleMouseMove)
  // canvas.addEventListener('mouseup', handleMouseUp)
})

function handleMouseDown(event) {
  startX = event.offsetX
  startY = event.offsetY
  isDrawing = true
  console.log(startX + ', ' + startY)
}

function handleMouseMove(event) {
  if (!isDrawing) return
  // const width = event.offsetX - startX
  // const height = event.offsetY - startY
  const width = event.screenX - startX
  const height = event.screenY - startY
  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
  ctx.strokeRect(startX, startY, width, height)
}

function handleMouseUp(event) {
  console.log(event)
  if (!isDrawing) return
  isDrawing = false
  // const width = event.offsetX - startX
  // const height = event.offsetY - startY
  const width = event.screenX - startX
  const height = event.screenY - startY
  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
  ctx.strokeRect(startX, startY, width, height)
}
</script>

<style lang="less">
#mini-stream {
  min-width: 300px;
  max-width: 800px;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  margin-top: 50px;
}
.outsideWrapper {
  width: 800px;
  height: 600px;
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
