import { MqttClient, IClientOptions } from 'mqtt'
import { Connection, EndpointOptions } from './types'

export interface MQTT {
  connect: (brokerUrl?: string, opts?: IClientOptions | undefined) => MqttClient
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
    const options = authentication ? setAuthentication({}, authentication) : {}
    const client = mqtt.connect(uri, options)
    return { status: 'ok', client, topic }
  }
