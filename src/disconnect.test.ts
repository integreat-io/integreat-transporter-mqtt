import test from 'ava'
import sinon = require('sinon')
import { MqttClient } from 'mqtt'

import disconnect from './disconnect'

// Tests

test('should disconnect', async (t) => {
  const endStub = sinon.stub()
  const client = {
    on: () => ({}),
    subscribe: () => ({}),
    connected: true,
    end: endStub,
  } as unknown as MqttClient
  const conn = { status: 'ok', client }

  await disconnect(conn)

  t.is(endStub.callCount, 1)
})

test('should do nothing when no client', async (t) => {
  const conn = { status: 'ok', client: undefined }

  await t.notThrowsAsync(disconnect(conn))
})

test('should do nothing when not connected', async (t) => {
  const endStub = sinon.stub()
  const client = {
    on: () => ({}),
    subscribe: () => ({}),
    connected: false,
    end: endStub,
  } as unknown as MqttClient
  const conn = { status: 'ok', client }

  await disconnect(conn)

  t.is(endStub.callCount, 0)
})

test('should do nothing when connection has an error', async (t) => {
  const endStub = sinon.stub()
  const client = {
    on: () => ({}),
    subscribe: () => ({}),
    connected: true,
    end: endStub,
  } as unknown as MqttClient
  const conn = { status: 'error', error: 'Whaaat?', client }

  await disconnect(conn)

  t.is(endStub.callCount, 0)
})

test('should do nothing when no connection', async (t) => {
  const conn = null

  await t.notThrowsAsync(disconnect(conn))
})
