import mqtt from 'mqtt'
import connect from './connect.js'
import listen from './listen.js'
import disconnect from './disconnect.js'
import type { EndpointOptions, Transporter } from './types.js'

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
