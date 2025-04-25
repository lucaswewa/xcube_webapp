<template>
  <div id="cameraSettings">
    <div class="uk-grid uk-grid-divider uk-child-width-expand" uk-grid>
      <div class="uk-width-large">
        <h4>PSF</h4>
        <pieChart :yMax="4096" ref="ppp"/>

        <h4>MTF</h4>
        <pieChart :yMax="100" />
      </div>

      <div id="mini-stream">
        <h4>Camera</h4>
        <div class="outsideWrapper">
          <div class="insideWrapper" ref="display">
            <miniStreamDisplay class="coveredImage" @resized="onStreamResized"/>
            <div ref="containerRef" style="width:100%;height:100%;">
              <v-stage :config="{
                  width: stageWidth,
                  height: stageHeight,
                  scaleX: scale,
                  scaleY: scale
                }" class="coveringCanvas">
                <v-layer>
                  <v-rect
                    :config="{
                      x: 20,
                      y: 50,
                      width: 100,
                      height: 100,
                      fill: 'green',
                      opacity: 0.1,
                      stroke: 'green',
                      strokeWidth: 0.2
                    }"
                  />
                  <v-circle
                    :config="{
                      x: 200,
                      y: 100,
                      radius: 50,
                      // fill: 'green',
                      stroke: 'red'
                    }"
                  />
                  <v-line
                    :config="{
                      x: 20,
                      y: 200,
                      points: [0, 0, 100, 0],
                      // tension: 0.5,
                      // closed: true,
                      stroke: 'black',
                      strokeWidth: 1
                    }"
                  />
                </v-layer>
              </v-stage>
            </div>
          </div>
        </div>
        <h4>ROI</h4>
        <div>test</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import miniStreamDisplay from '../../genericComponents/miniStreamDisplay.vue'
import pieChart from './piechart.vue'
import { ref, onMounted, computed, useTemplateRef } from 'vue'

const sceneWidth=4000
const sceneHeight=3000

const containerRef=useTemplateRef("containerRef")
const scale=ref(1)

const stageWidth = computed(() => sceneWidth*scale.value);
const stageHeight = computed(() => sceneHeight*scale.value);

const updateSize = () => {
  if (!containerRef.value) return

  const containerWidth = containerRef.value.offsetWidth
  scale.value = containerWidth / sceneWidth
}

onMounted(() => {
  updateSize()
})

function onStreamResized(evt) {
  updateSize()
}
</script>

<style lang="less">
#mini-stream {
  min-width: 300px;
  max-width: 800px;
  max-height: 400px;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
}
.outsideWrapper {
  width: 720;
  height: 540;
  margin: 10px 30px;
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
