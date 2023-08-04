# MQTT transporter for Integreat

Transporter that lets
[Integreat](https://github.com/integreat-io/integreat) access listen to a MQTT
queue.

[![npm Version](https://img.shields.io/npm/v/integreat-transporter-mqtt.svg)](https://www.npmjs.com/package/integreat-transporter-mqtt)
[![Maintainability](https://api.codeclimate.com/v1/badges/a99b1d48267edb699c49/maintainability)](https://codeclimate.com/github/integreat-io/integreat-transporter-mqtt/maintainability)

## Getting started

### Prerequisits

Requires node v18 and Integreat v1.0.

### Installing and using

Install from npm:

```
npm install integreat-transporter-mqtt
```

Example of use:

```javascript
import Integreat from 'integreat'
import mqttTransporter from 'integreat-transporter-mqtt'
import defs from './config.js'

const great = Integreat.create(defs, {
  transporters: { mqtt: mqttTransporter },
})

// ... and then dispatch actions as usual
```

Example service configuration:

```javascript
{
  id: 'store',
  transporter: 'mqtt',
  options: {
    transporter: {
      uri: 'mqtts://somemqtt.io',
      key: 'svein',
      secret: 's3cr3t',
      topic: 'mqtt/demo'
    }
  }
}
```

### Running the tests

The tests can be run with `npm test`.

## Contributing

Please read
[CONTRIBUTING](https://github.com/integreat-io/integreat-transporter-mqtt/blob/master/CONTRIBUTING.md)
for details on our code of conduct, and the process for submitting pull
requests.

## License

This project is licensed under the ISC License - see the
[LICENSE](https://github.com/integreat-io/integreat-transporter-mqtt/blob/master/LICENSE)
file for details.
