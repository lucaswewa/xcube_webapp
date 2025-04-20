import axios from 'axios'

async function start() {}

async function fetchThingDescription(uri, name = null) {
  // Fetch the thing description from the given URI and consume it
  return axios.get(uri).then((response) => {
    var td = response.data
    var thing_name = name | uri.replace(/\/$/, '').split('/').pop()
    return {
      thingName: thing_name,
      thingDescription: td,
    }
  })
}

async function fetchThingDescriptions(uri) {
  // Fetch thing descriptions
  return axios.get(uri).then((response) => {
    var things = []
    if (response.status != 200) throw 'Count not retrieve thing descriptons.'
    for (const k in response.data) {
      var thing_name = k.replace(/\/$/, '').replace(/^\//, '')
      things.push({
        thingName: thing_name,
        thingDescription: response.data[k],
      })
    }
    return things
  })
}

function findFormHref(affordance, op) {
  // Find the form in the affordance that matches the given operation type
  if (affordance == undefined) return undefined
  var forms = affordance.forms
  var matchingForm = forms.find((f) => f.op == op || f.op.includes(op))
  if (matchingForm == undefined) return undefined
  return matchingForm.href
}

export function WoTClient() {
  return {
    start,
    fetchThingDescription,
    fetchThingDescriptions,
    findFormHref,
  }
}
