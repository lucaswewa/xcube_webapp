<template>
  <div id="paneMTF" class="uk-padding-small">
    <div>
      <ul uk-accordion="multiple: true">
        <li class="uk-open">
          <a class="uk-accordion-title" href="#">Camera</a>
          <div class="uk-accordion-content">
            <PropertyControl
              label="Exposure time: (0-33251 us)"
              property-name="exposure_time"
              thing-name="camera"
              :read-back-delay="1000"
            />
            <PropertyControl
              label="Analogue gain (dB)"
              property-name="gain"
              thing-name="camera"
              :read-back-delay="1000"
            />
          </div>
        </li>
        <li class="uk-open">
          <a class="uk-accordion-title" href="#">Focusing Motor & VID</a>
          <div class="uk-accordion-content">
            <PropertyControl
              label="Motor Position: (0.1-12.9 mm)"
              property-name="position"
              thing-name="stage"
              :read-back-delay="1000"
            />
            <PropertyControl
              label="VID: (0-Inf mm)"
              property-name="velocity"
              thing-name="tester"
              :read-back-delay="1000"
            />
          </div>
        </li>
        <li class="uk-open">
          <a class="uk-accordion-title" href="#">ROI</a>
          <div class="uk-accordion-content">
            <PropertyControl
              label="ROI origin: (0.1-12.9 mm)"
              property-name="roi_pos"
              thing-name="camera"
              :read-back-delay="1000"
              :autoRefresh="1000"
            />
            <PropertyControl
              label="ROI dimensions: (0-Inf mm)"
              property-name="velocity"
              thing-name="tester"
              :read-back-delay="1000"
            />
          </div>
        </li>
        <li>
          <a class="uk-accordion-title" href="#">MTF</a>
          <div class="uk-accordion-content">
            <PropertyControl
              label="Frequency Unit: (cy/px, cy/deg)"
              property-name="velocity"
              thing-name="tester"
              :read-back-delay="1000"
            />
            <PropertyControl
              label="Frequency: (cy/px, cy/deg)"
              property-name="velocity"
              thing-name="tester"
              :read-back-delay="1000"
            />
          </div>
        </li>
      </ul>
      <p>
        <action-button
          ref="captureButton"
          thing="tester"
          action="move_absolute"
          :submit-label="'Capture and Calculate'"
        />
      </p>
    </div>
  </div>
</template>

<script setup>
import ActionButton from '../../labThingsComponents/actionButton.vue'
import PropertyControl from '../../labThingsComponents/propertyControl.vue'
import { onMounted } from 'vue'

const props = defineProps({
  roi_x: {
    type: Number,
    required: true,
  },
  roi_y: {
    type: Number,
    required: true,
  },
})

onMounted(() => {
  console.log(props.roi_x, props.roi_y)
})
</script>
