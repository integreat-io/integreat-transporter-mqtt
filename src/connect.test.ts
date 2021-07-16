import test from 'ava'
import sinon = require('sinon')
import { MqttClient } from 'mqtt'

import connect from './connect'

// Setup

const client = {
  on: () => ({}),
  subscribe: () => ({}),
  connected: true,
} as unknown as MqttClient
const clientDisconnected = {
  on: () => ({}),
  subscribe: () => ({}),
  connected: false,
} as unknown as MqttClient

// Tests

test('should connect to mqtt broker', async (t) => {
  const mockMqtt = {
    connect: sinon.stub().returns(client),
  }
  const options = {
    uri: 'mqtt://localhost:1884',
    topic: 'test/receive',
  }
  const expectedConn = {
    status: 'ok',
    client,
    topic: 'test/receive',
  }
  const expectedUri = 'mqtt://localhost:1884'
  const expectedOptions = {}

  const conn = await connect(mockMqtt)(options, null, null)

  t.deepEqual(conn, expectedConn)
  t.is(mockMqtt.connect.callCount, 1)
  t.is(mockMqtt.connect.args[0][0], expectedUri)
  t.deepEqual(mockMqtt.connect.args[0][1], expectedOptions)
})

test('should connect to mqtt broker with authentication', async (t) => {
  const mockMqtt = {
    connect: sinon.stub().returns(client),
  }
  const options = {
    uri: 'mqtt://localhost:1884',
    topic: 'test/receive',
  }
  const authentication = {
    key: 'svein',
    secret: 's3cr3t',
  }
  const expectedConn = {
    status: 'ok',
    client,
    topic: 'test/receive',
  }
  const expectedUri = 'mqtt://localhost:1884'
  const expectedOptions = {
    username: 'svein',
    password: 's3cr3t',
  }

  const conn = await connect(mockMqtt)(options, authentication, null)

  t.deepEqual(conn, expectedConn)
  t.is(mockMqtt.connect.callCount, 1)
  t.is(mockMqtt.connect.args[0][0], expectedUri)
  t.deepEqual(mockMqtt.connect.args[0][1], expectedOptions)
})

test('should not include key without secret', async (t) => {
  const mockMqtt = {
    connect: sinon.stub().returns(client),
  }
  const options = {
    uri: 'mqtt://localhost:1884',
    topic: 'test/receive',
  }
  const authentication = {
    key: 'svein',
  }
  const expectedConn = {
    status: 'ok',
    client,
    topic: 'test/receive',
  }
  const expectedOptions = {}

  const conn = await connect(mockMqtt)(options, authentication, null)

  t.deepEqual(conn, expectedConn)
  t.is(mockMqtt.connect.callCount, 1)
  t.deepEqual(mockMqtt.connect.args[0][1], expectedOptions)
})

test('should return connection if still connected', async (t) => {
  const mockMqtt = {
    connect: sinon.stub().returns(client),
  }
  const options = {
    uri: 'mqtt://localhost:1884',
    topic: 'test/receive',
  }
  const connection = { status: 'ok', client }

  const conn = await connect(mockMqtt)(options, null, connection)

  t.is(mockMqtt.connect.callCount, 0)
  t.is(conn, connection)
})

test('should reconnect if not connected', async (t) => {
  const mockMqtt = {
    connect: sinon.stub().returns(client),
  }
  const options = {
    uri: 'mqtt://localhost:1884',
    topic: 'test/receive',
  }
  const connection = { status: 'ok', client: clientDisconnected }
  const expectedConn = {
    status: 'ok',
    client,
    topic: 'test/receive',
  }

  const conn = await connect(mockMqtt)(options, null, connection)

  t.deepEqual(conn, expectedConn)
  t.is(mockMqtt.connect.callCount, 1)
})

test('should connect if given connection has an error', async (t) => {
  const mockMqtt = {
    connect: sinon.stub().returns(client),
  }
  const options = {
    uri: 'mqtt://localhost:1884',
    topic: 'test/receive',
  }
  const connection = { status: 'error', error: 'Something is amiss', client }
  const expectedConn = {
    status: 'ok',
    client,
    topic: 'test/receive',
  }

  const conn = await connect(mockMqtt)(options, null, connection)

  t.deepEqual(conn, expectedConn)
  t.is(mockMqtt.connect.callCount, 1)
})

test.todo('should connect with auth')
test.todo('should connect with tls')
