# MQTT transporter for Integreat

## Usage

```javascript
const integreat = require('integreat')
const mqttTransporter = require('integreat-transport-mqtt')
const defs = require('./config')

const resources = integreat.mergeResources(integreat.resources(), {
  transporters: { mqtt: mqttTransporter },
})
const great = integreat(defs, resources)

// ... and then dispatch actions as usual
```

```
{
  id: 'store',
  transporter: 'mqtt',
  options: {
    uri: 'mqtts://somemqtt.io',
    key: 'svein',
    secret: 's3cr3t',
    topic: 'mqtt/demo'
  }
}
```
