import type { Connection as BaseConnection } from 'integreat'
import type { MqttClient } from 'mqtt'

export interface EndpointOptions extends Record<string, unknown> {
  uri?: string
  topic?: string | string[]
}

export interface Connection extends BaseConnection {
  client?: MqttClient
  topic?: string | string[]
}
