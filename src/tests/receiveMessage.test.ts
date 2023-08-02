import ava, { TestFn } from 'ava'
import sinon from 'sinon'
import net from 'net'
import Aedes from 'aedes'
import mqtt from 'mqtt'

import transporter from '../index.js'

// Setup

const PORT = 1885

const test = ava as TestFn<{ server: net.Server }>

test.before((t) => {
  t.context.server = net.createServer(new Aedes().handle)
  t.context.server.listen(PORT)
})

test.after.always((t) => {
  t.context.server?.close()
})

async function publishToClient(
  client: mqtt.MqttClient,
  message: Record<string, unknown>
) {
  return new Promise((resolve, reject) => {
    client.publish('receive', JSON.stringify(message), function (err) {
      if (err) {
        reject(new Error('MQTT test client could not connect'))
      } else {
        resolve(undefined)
      }
    })
  })
}

const authenticate = async () => ({ status: 'ok', access: { ident: { id: 'userFromIntegreat' } } })

// Tests

test('should subscribe and receive message and unsubscribe', async (t) => {
  const message = { time: '2021-07-15T13:19:42Z', success: true }
  const expectedAction = {
    type: 'SET',
    payload: {
      data: message,
      topic: 'receive',
    },
    meta: { ident: { id: 'userFromIntegreat' } }
  }
  const dispatch = sinon.stub().resolves({
    ...expectedAction,
    response: { status: 'ok' },
  })
  const options = {
    uri: 'mqtt://localhost:1885',
    topic: 'receive',
  }
  const serviceId = 'mqttStream'
  const client = mqtt.connect('mqtt://localhost:1885')

  const preparedOptions = transporter.prepareOptions(options, serviceId)
  const conn = await transporter.connect(
    preparedOptions,
    null,
    null,
    () => undefined
  )
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const ret = await transporter.listen!(dispatch, conn, authenticate)
  await publishToClient(client, message)
  await new Promise((resolve) => setTimeout(resolve, 100, undefined))

  t.deepEqual(ret, { status: 'ok' })
  t.is(dispatch.callCount, 1)
  t.deepEqual(dispatch.args[0][0], expectedAction)
  await transporter.disconnect(conn)
})
