import mqtt = require('mqtt')
import connect from './connect'
import listen from './listen'
import disconnect from './disconnect'
import { EndpointOptions, Transporter } from './types'

/**
 * MQTT Transporter for Integreat
 */
const mqttTransporter: Transporter = {
  authentication: 'asObject',

  prepareOptions: (options: EndpointOptions, _serviceId: string) => options,

  connect: connect(mqtt),

  send: async () => ({
    status: 'noaction',
    error: 'MQTT transporter does not support sending',
  }),

  listen,

  disconnect,
}

export default mqttTransporter
