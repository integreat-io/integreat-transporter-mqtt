# MQTT transporter for Integreat

## Getting started

### Prerequisits

Requires node v18 and Integreat v0.8.

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
    uri: 'mqtts://somemqtt.io',
    key: 'svein',
    secret: 's3cr3t',
    topic: 'mqtt/demo'
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
