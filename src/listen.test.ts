import test from 'ava'
import sinon from 'sinon'
import type { MqttClient } from 'mqtt'

import listen from './listen.js'

// Setup

const dispatch = sinon.stub().resolves({ status: 'ok', data: [] })
const authenticate = async () => ({ status: 'ok', access: { ident: { id: 'userFromIntegreat' } } })

// Tests

test('should subscribe to topic', async (t) => {
  const dispatch = sinon.stub().resolves({ status: 'ok', data: [] })
  const onStub = sinon.stub().returns({})
  onStub.withArgs('connect').callsArg(1)
  const subscribeStub = sinon.stub().callsArg(1)
  const client = {
    on: onStub,
    subscribe: subscribeStub,
    connected: true,
  } as unknown as MqttClient
  const connection = {
    status: 'ok',
    client,
    topic: 'test/receive',
  }
  const expected = { status: 'ok' }

  const ret = await listen(dispatch, connection, authenticate)

  t.deepEqual(ret, expected)
  t.is(onStub.callCount, 2)
  t.is(onStub.args[0][0], 'message')
  t.is(onStub.args[1][0], 'connect')
  t.is(subscribeStub.callCount, 1)
  t.is(subscribeStub.args[0][0], 'test/receive')
  t.is(typeof subscribeStub.args[0][1], 'function')
})

test('should authenticate', async (t) => {
  const authenticate = sinon.stub().resolves({ status: 'ok', access: { ident: { id: 'userFromIntegreat' } } })
  const message = { time: '2021-07-15T13:19:42Z', success: true }
  const onStub = sinon.stub().returns({})
  onStub.withArgs('connect').callsArg(1)
  onStub
    .withArgs('message')
    .callsArgWith(1, 'test/receive', JSON.stringify(message))
  const subscribeStub = sinon.stub().callsArg(1)
  const client = {
    on: onStub,
    subscribe: subscribeStub,
    connected: true,
  } as unknown as MqttClient
  const connection = {
    status: 'ok',
    client,
    topic: 'test/receive',
  }
  const expectedAuth = { status: 'granted' }
  const expectedAction = {
    type: 'SET',
    payload: {
      data: message,
      topic: 'test/receive',
    },
    meta: {},
  }

  const ret = await listen(dispatch, connection, authenticate)

  t.is(authenticate.callCount, 1)
  t.deepEqual(authenticate.args[0][0], expectedAuth)
  t.deepEqual(authenticate.args[0][1], expectedAction)
  t.deepEqual(ret.status, 'ok')
})

test('should dispatch JSON message', async (t) => {
  const message = { time: '2021-07-15T13:19:42Z', success: true }
  const dispatch = sinon.stub().resolves({ status: 'ok', data: [] })
  const onStub = sinon.stub().returns({})
  onStub.withArgs('connect').callsArg(1)
  onStub
    .withArgs('message')
    .callsArgWith(1, 'test/receive', JSON.stringify(message))
  const subscribeStub = sinon.stub().callsArg(1)
  const client = {
    on: onStub,
    subscribe: subscribeStub,
    connected: true,
  } as unknown as MqttClient
  const connection = {
    status: 'ok',
    client,
    topic: 'test/receive',
  }
  const expectedAction = {
    type: 'SET',
    payload: {
      data: message,
      topic: 'test/receive',
    },
    meta: { ident: { id: 'userFromIntegreat' } },
  }
  const expected = { status: 'ok' }

  const ret = await listen(dispatch, connection, authenticate)

  t.is(dispatch.callCount, 1)
  t.deepEqual(dispatch.args[0][0], expectedAction)
  t.deepEqual(ret, expected)
})

test('should dispatch non-JSON message as string', async (t) => {
  const message = "I don't know what this is"
  const dispatch = sinon.stub().resolves({ status: 'ok', data: [] })
  const onStub = sinon.stub().returns({})
  onStub.withArgs('connect').callsArg(1)
  onStub.withArgs('message').callsArgWith(1, 'test/receive', message)
  const subscribeStub = sinon.stub().callsArg(1)
  const client = {
    on: onStub,
    subscribe: subscribeStub,
    connected: true,
  } as unknown as MqttClient
  const connection = {
    status: 'ok',
    client,
    topic: 'test/receive',
  }
  const expectedAction = {
    type: 'SET',
    payload: {
      data: message,
      topic: 'test/receive',
    },
    meta: { ident: { id: 'userFromIntegreat' } },
  }
  const expected = { status: 'ok' }

  const ret = await listen(dispatch, connection, authenticate)

  t.is(dispatch.callCount, 1)
  t.deepEqual(dispatch.args[0][0], expectedAction)
  t.deepEqual(ret, expected)
})

test('should not dispatch when authentication fails', async (t) => {
  const authenticate = sinon.stub().resolves({ status: 'noaccess', error: 'Could not authorize' })
  const dispatch = sinon.stub().resolves({ status: 'ok', data: [] })
  const message = { time: '2021-07-15T13:19:42Z', success: true }
  const onStub = sinon.stub().returns({})
  onStub.withArgs('connect').callsArg(1)
  onStub
    .withArgs('message')
    .callsArgWith(1, 'test/receive', JSON.stringify(message))
  const subscribeStub = sinon.stub().callsArg(1)
  const client = {
    on: onStub,
    subscribe: subscribeStub,
    connected: true,
  } as unknown as MqttClient
  const connection = {
    status: 'ok',
    client,
    topic: 'test/receive',
  }

  const ret = await listen(dispatch, connection, authenticate)

  t.is(authenticate.callCount, 1)
  t.is(dispatch.callCount, 0)
  t.deepEqual(ret.status, 'ok')
})

test('should return error when subscribing fails', async (t) => {
  const onStub = sinon.stub().returns({})
  onStub.withArgs('connect').callsArg(1)
  const subscribeStub = sinon.stub().callsArgWith(1, new Error('Wrongness!'))
  const client = {
    on: onStub,
    subscribe: subscribeStub,
    connected: true,
  } as unknown as MqttClient
  const connection = {
    status: 'ok',
    client,
    topic: 'test/receive',
  }
  const expected = {
    status: 'error',
    error: "Could not subscribe to topic 'test/receive'. Wrongness!",
  }

  const ret = await listen(dispatch, connection, authenticate)

  t.deepEqual(ret, expected)
})

test('should not subscribe when no client', async (t) => {
  const connection = {
    status: 'ok',
    client: undefined,
    topic: 'test/receive',
  }
  const expected = {
    status: 'error',
    error: 'No connected client. You should connect before listening',
  }

  const ret = await listen(dispatch, connection, authenticate)

  t.deepEqual(ret, expected)
})

test('should not subscribe when no topic', async (t) => {
  const onStub = sinon.stub().returns({})
  onStub.withArgs('connect').callsArg(1)
  const subscribeStub = sinon.stub().returns({})
  const client = {
    on: onStub,
    subscribe: subscribeStub,
    connected: true,
  } as unknown as MqttClient
  const connection = {
    status: 'ok',
    client,
    topic: undefined,
  }
  const expected = {
    status: 'badrequest',
    error: 'Could not subscribe. No topic provided',
  }

  const ret = await listen(dispatch, connection, authenticate)

  t.deepEqual(ret, expected)
  t.is(onStub.callCount, 0)
  t.is(subscribeStub.callCount, 0)
})

test('should not subscribe when no connection', async (t) => {
  const connection = null
  const expected = {
    status: 'error',
    error: 'No connected client. You should connect before listening',
  }

  const ret = await listen(dispatch, connection, authenticate)

  t.deepEqual(ret, expected)
})
