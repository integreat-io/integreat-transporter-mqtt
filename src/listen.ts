import { Connection, Dispatch, Response } from './types'

export default async function listen(
  dispatch: Dispatch,
  connection: Connection | null
): Promise<Response> {
  const { client, topic } = connection || {}

  if (!client) {
    return {
      status: 'error',
      error: 'No connected client. You should connect before listening',
    }
  }
  if (!topic) {
    return {
      status: 'badrequest',
      error: 'Could not subscribe. No topic provided',
    }
  }

  client.on('message', function (topic, message) {
    let data = message.toString()
    try {
      // message is Buffer
      data = JSON.parse(data)
    } catch (err) {}
    const action = {
      type: 'SET',
      payload: { data, params: { topic } },
      meta: {},
    }
    dispatch(action)
  })

  return new Promise((resolve) => {
    client.on('connect', function () {
      client.subscribe(topic, function (err) {
        if (err) {
          resolve({
            status: 'error',
            error: `Could not subscribe to topic '${topic}'. ${err.message}`,
          })
        } else {
          resolve({ status: 'ok' })
        }
      })
    })
  })
}
