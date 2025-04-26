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
                  }"
                  class="coveringCanvas"
                  @mousedown="handleMouseDown"
                  @mousemove="handleMouseMove"
                  @mouseup="handleMouseUp"
                >
                <v-layer>
                  <v-rect
                    :config="{
                      x: rect_x,
                      y: rect_y,
                      width: 100,
                      height: 100,
                      stroke: 'white',
                    }"
                  />
                  <v-line
                    v-for="(line, i) in lines"
                    :key="i"
                    :config="{
                      points: line.points,
                      stroke: '#df4b26',
                      strokeWidth: 5,
                      tension: 0.5,
                      lineCap: 'round',
                      lineJoin: 'round',
                      globalCompositeOperation:
                        line.tool === 'eraser' ? 'destination-out' : 'source-over'
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

const rect_x = ref(20)
const rect_y = ref(50)

const tool = ref('brush')
const lines = ref([]);
const isDrawing = ref(false);

const sceneWidth=2464
const sceneHeight=2064

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

const handleMouseDown = (e) => {
  isDrawing.value = true;
  const pos = e.target.getStage().getPointerPosition();
  const x = pos.x/scale.value
  const y = pos.y/scale.value
  lines.value.push({ tool: tool.value, points: [x, y] });
  console.log('mouse down: ', x, y)
  rect_x.value = x - 50
  rect_y.value = y - 50
};

const handleMouseMove = (e) => {
  if (!isDrawing.value) {
    return;
  }
  const stage = e.target.getStage();
  const point = stage.getPointerPosition();

  let lastLine = lines.value[lines.value.length - 1];
  lastLine.points = lastLine.points.concat([point.x/scale.value, point.y/scale.value]);
  lines.value.splice(lines.value.length - 1, 1, { ...lastLine });
};

const handleMouseUp = (e) => {
  isDrawing.value = false;
  const pos = e.target.getStage().getPointerPosition()
  const x = pos.x/scale.value
  const y = pos.y/scale.value
  console.log('mouse up: ', x, y)
};
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
  width: 2464;
  height: 2064;
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
