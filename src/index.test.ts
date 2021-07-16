import test from 'ava'

import transporter from '.'

// Tests

test('should be a transporter', (t) => {
  t.is(typeof transporter.authentication, 'string')
  t.is(typeof transporter.prepareOptions, 'function')
  t.is(typeof transporter.connect, 'function')
  t.is(typeof transporter.send, 'function')
  t.is(typeof transporter.disconnect, 'function')
})

test('should have authentication string', (t) => {
  t.is(transporter.authentication, 'asObject')
})

// Tests -- prepareOptions

test('should return options object as is', (t) => {
  const options = {
    uri: 'http://example.com/',
    topic: 'test/message',
  }
  const serviceId = 'mqttStream'

  const ret = transporter.prepareOptions(options, serviceId)

  t.deepEqual(ret, options)
})

// Tests -- send

test('should always return noaction on send', async (t) => {
  const action = {
    type: 'GET',
    payload: { type: 'message', data: { message: 'Hello' } },
    meta: { ident: { id: 'johnf' } },
  }
  const connection = { status: 'ok' }
  const expected = {
    status: 'noaction',
    error: 'MQTT transporter does not support sending',
  }

  const ret = await transporter.send(action, connection)

  t.deepEqual(ret, expected)
})
