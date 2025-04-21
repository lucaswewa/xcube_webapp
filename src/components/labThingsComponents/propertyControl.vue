<template>
  <div>
    <label v-if="dataType == 'number'" class="uk-form-label"
      >{{ props.label }}
      <div class="input-and-buttons-container">
        <input
          v-model="state.value"
          class="uk-form-small numeric-setting-line-input"
          type="number"
          @focusin="focusIn"
          @focusout="focusOut"
          @keydown="keyDown"
        />
        <a class="button-next-to-input" @click="readProperty">
          <span class="material-symbols-outlined">refresh</span>
        </a>
      </div>
    </label>
    <div v-if="dataType == 'boolean'" class="input-and-buttons-container">
      <label class="uk-form-label numeric-setting-line-input">
        <input
          ref="checkbox"
          v-model="state.value"
          class="uk-checkbox"
          type="checkbox"
          @change="writeProperty"
        />
        {{ props.label }}
      </label>
      <a class="button-next-to-input" @click="readProperty">
        <span class="material-symbols-outlined">refresh</span>
      </a>
    </div>
    <label v-if="dataType == 'number_array'" class="uk-form-label"
      >{{ props.label }}
      <div class="input-and-buttons-container">
        <input
          v-for="i in valueLength"
          :key="i"
          v-model="state.value[i - 1]"
          class="uk-form-small numeric-setting-line-input"
          type="number"
          @focusin="focusIn"
          @focusout="focusOut"
          @keydown="keyDown"
        />
        <a class="button-next-to-input" @click="readProperty">
          <span class="material-symbols-outlined">refresh</span>
        </a>
      </div>
    </label>
    <label v-if="dataType == 'number_object'" class="uk-form-label"
      >{{ props.label }}
      <div class="input-and-buttons-container">
        <input
          v-for="(_v, key) in state.value"
          :key="key"
          v-model="state.value[key]"
          class="uk-form-small numeric-setting-line-input"
          type="number"
          @focusin="focusIn"
          @focusout="focusOut"
          @keydown="keyDown"
        />
        <a class="button-next-to-input" @click="readProperty">
          <span class="material-symbols-outlined">refresh</span>
        </a>
      </div>
    </label>
    <label v-if="dataType == 'other'" class="uk-form-label"
      >{{ props.label }}
      <div class="input-and-buttons-container">
        <input
          :value="state.value"
          class="uk-form-small numeric-setting-line-input"
          type="text"
          disabled="true"
        />
      </div>
    </label>
  </div>
</template>

<script setup>
import { reactive, watch, computed, onMounted, useTemplateRef } from 'vue'
import { useWotStore } from '../../stores/wotStore'

const wotStore = useWotStore()

const props = defineProps({
  label: {
    type: String,
    default: ""
  },
  propertyName: {
    type: String,
    required: true
  },
  thingName: {
    type: String,
    required: true
  },
  readBackDelay: {
    type: Number,
    default: undefined,
    required: false
  }
})

const state = reactive({
  value: undefined,
  valueOnEnter: undefined,
  focused: false
})

const valueLength = computed(() => {
  if (dataType == "number_array") {
    if (state.value == undefined) {
      return 0;
    }
    return state.value.length;
  } else {
    return 1;
  }
})
const readBack = computed(() => {
    return props.readBackDelay !== undefined;
  })

const propertyDescription = computed(() => {
  try {
    return wotStore.thingDescription(props.thingName).properties[
      props.propertyName
    ];
  } catch (error) {
    return undefined;
  }
})

const dataType = computed(() => {
  let prop = propertyDescription;
  if (prop == undefined) {
    return "undefined";
  }
  const num_types = ["integer", "float", "number"];
  if (num_types.includes(prop.type)) {
    return "number";
  }
  if (prop.type == "array") {
    if (num_types.includes(prop.items.type)) {
      return "number_array";
    }
    if (Array.isArray(prop.items)) {
      if (prop.items.every(t => num_types.includes(t.type))) {
        return "number_array";
      }
    }
  }
  if (prop.type == "boolean") {
    return "boolean";
  }
  if (prop.type == "object") {
    let numeric = true;
    for (let key in prop.properties) {
      if (!num_types.includes(prop.properties[key].type)) {
        numeric = false;
        break;
      }
    }
    if (numeric) {
      return "number_object";
    }
  }
  return "other";
})

watch(
  propertyDescription,
  () => {
    // Ensure we read the property once the URL is known
    readProperty();
  }
)

onMounted(() => {
  // Read the property when we're mounted - usually this won't
  // work because the URL isn't set yet. However, it's helpful if
  // the app is reloaded (e.g. from a dev server).
  if (state.value == undefined) {
    readProperty();
  }
})

async function readProperty() {
  let data = await wotStore.readThingProperty(
    props.thingName,
    props.propertyName
  );
  state.value = data;
  return data;
}

async function writeProperty() {
  try {
    let requestedValue = state.value;
    console.log("writing", requestedValue);
    await wotStore.writeThingProperty(
      props.thingName,
      props.propertyName,
      requestedValue
    );
    if (readBack) {
      await new Promise(r => setTimeout(r, props.readBackDelay));
      let newVal = await readProperty();
      if (newVal == requestedValue) {
        // await this.modalNotify(`Set ${props.label} to ${newVal}.`);
      } else {
        // await this.modalNotify(
        //   `Set ${props.label} to ${newVal} (requested ${requestedValue}).`
        // );
      }
    } else {
      // await this.modalNotify(`Set ${props.label} to ${state.value}.`);
    }
  } catch (error) {
    // this.modalError(error); // Let mixin handle error
  }
}

function checkboxUpdated() {
  if (state.value != useTemplateRef('checkbox').checked) {
    state.value = useTemplateRef('checkbox').checked;
    writeProperty();
  }
}

function focusIn(event) {
  state.valueOnEnter = event.target.value;
}

function focusOut(event) {
  if (state.valueOnEnter != event.target.value) {
    writeProperty(event.target.value);
  }
}

function keyDown(event) {
  // Pressing enter should set the property, whether or not we think it's changed.
  if (event.keyCode == 13) {
    writeProperty();
  }
}
</script>

<style scoped>
.input-and-buttons-container {
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-content: stretch;
  align-items: center;
  width: 100%;
}
.numeric-setting-line-input {
  flex-grow: 1;
  margin-left: 5px;
  margin-right: 5px;
  width: 6em;
}
.button-next-to-input {
  flex-grow: 0;
  padding-left: 5px;
  padding-right: 5px;
  vertical-align: middle;
  cursor: pointer;
}
</style>
