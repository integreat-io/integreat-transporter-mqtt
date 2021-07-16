import ava, { TestInterface } from 'ava'
import sinon = require('sinon')
import net = require('net')
import aedes = require('aedes')
import mqtt = require('mqtt')

import transporter from '..'

// Setup

const PORT = 1884

const test = ava as TestInterface<{ server: net.Server }>

test.before.cb((t) => {
  t.context.server = net.createServer(
    (aedes as unknown as () => aedes.Aedes)().handle
  )
  t.context.server.listen(PORT, t.end)
})

test.after.always.cb((t) => {
  t.context.server?.close(t.end)
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

// Tests

test('should subscribe and receive message and unsubscribe', async (t) => {
  const message = { time: '2021-07-15T13:19:42Z', success: true }
  const expectedAction = {
    type: 'SET',
    payload: {
      data: message,
      params: { topic: 'receive' },
    },
    meta: {},
  }
  const dispatch = sinon.stub().resolves({
    ...expectedAction,
    response: { status: 'ok' },
  })
  const options = {
    uri: 'mqtt://localhost:1884',
    topic: 'receive',
  }
  const serviceId = 'mqttStream'
  const client = mqtt.connect('mqtt://localhost:1884')

  const preparedOptions = transporter.prepareOptions(options, serviceId)
  const conn = await transporter.connect(preparedOptions, null, null)
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const ret = await transporter.listen!(dispatch, conn)
  await publishToClient(client, message)
  await new Promise((resolve) => setTimeout(resolve, 100, undefined))

  t.deepEqual(ret, { status: 'ok' })
  t.is(dispatch.callCount, 1)
  t.deepEqual(dispatch.args[0][0], expectedAction)
  await transporter.disconnect(conn)
})
