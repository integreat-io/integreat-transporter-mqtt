import type { MqttClient, IClientOptions } from 'mqtt'
import type { Connection, EndpointOptions } from './types.js'

export interface MQTT {
  connect: (brokerUrl: string, opts?: IClientOptions) => MqttClient
}

const setAuthentication = (
  options: IClientOptions,
  { key, secret }: Record<string, unknown>
): IClientOptions =>
  typeof key === 'string' && typeof secret === 'string'
    ? {
        ...options,
        username: key,
        password: secret,
      }
    : options

export default (mqtt: MQTT) =>
  async function (
    { uri, topic }: EndpointOptions,
    authentication: Record<string, unknown> | null,
    connection: Connection | null
  ): Promise<Connection | null> {
    if (connection?.status === 'ok' && connection.client?.connected) {
      return connection
    }

    if (typeof uri !== 'string' || !uri) {
      return { status: 'badrequest', error: 'Trying to connect without an uri' }
    }

    const options = authentication ? setAuthentication({}, authentication) : {}

    const client = mqtt.connect(uri, options)
    client.on('error', function (error) {
      throw new Error(`Error from MQTT broker on '${uri}'. ${error}`)
    })

    return { status: 'ok', client, topic }
  }
