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
          <a class="uk-accordion-title" href="#">LEDs</a>
          <div class="uk-accordion-content">
            <p>
              <PropertyControl
                label="Red LED: (550 nm)"
                property-name="red_on"
                thing-name="led"
                :read-back-delay="500"
              />
              <PropertyControl
                label="Current: (10~1000 mA)"
                property-name="red_current"
                thing-name="led"
                :read-back-delay="1000"
              />
            </p>

            <p>
              <PropertyControl
                label="Green LED: (550 nm)"
                property-name="green_on"
                thing-name="led"
                :read-back-delay="500"
              />
              <PropertyControl
                label="Current: (10~1000 mA)"
                property-name="green_current"
                thing-name="led"
                :read-back-delay="1000"
              />
            </p>

            <p>
              <PropertyControl
                label="Blue LED: (550 nm)"
                property-name="blue_on"
                thing-name="led"
                :read-back-delay="500"
              />
              <PropertyControl
                label="Current: (10~1000 mA)"
                property-name="blue_current"
                thing-name="led"
                :read-back-delay="1000"
              />
            </p>
          </div>
        </li>
        <li>
          <a class="uk-accordion-title" href="#">ROI</a>
          <div class="uk-accordion-content">
            <PropertyControl
              label="ROI origin: (0.1-12.9 mm)"
              property-name="velocity"
              thing-name="tester"
              :read-back-delay="1000"
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
</script>
