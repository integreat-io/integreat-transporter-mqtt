import type { Connection } from './types.js'

export default async function disconnect(
  connection: Connection | null
): Promise<void> {
  if (connection?.status === 'ok' && connection.client?.connected) {
    connection.client.end()
  }
}
