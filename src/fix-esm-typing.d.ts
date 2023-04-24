/*
  This is a hack to get correct typing for Aedes, when importing in TypeScript
  with ESM. The definitions are just copied from the original definitions, but
  are exported in a way that works.

  TODO: Find a way to reference the original definitions instead of copying
  them, or better still, make this work without this hack.
*/

// Original: node_modules/aedes/types/instance.d.ts
declare module 'aedes' {
  export default class Aedes extends EventEmitter {
    id: Readonly<string>
    connectedClients: Readonly<number>
    closed: Readonly<boolean>
    brokers: Readonly<Brokers>

    constructor(option?: AedesOptions)
    handle: (stream: Connection, request?: IncomingMessage) => Client

    on(event: 'closed', listener: () => void): this
    on(
      event: 'client' | 'clientReady' | 'clientDisconnect' | 'keepaliveTimeout',
      listener: (client: Client) => void
    ): this

    on(
      event: 'clientError' | 'connectionError',
      listener: (client: Client, error: Error) => void
    ): this

    on(
      event: 'connackSent',
      listener: (packet: ConnackPacket, client: Client) => void
    ): this

    on(
      event: 'ping',
      listener: (packet: PingreqPacket, client: Client) => void
    ): this

    on(
      event: 'publish',
      listener: (packet: AedesPublishPacket, client: Client | null) => void
    ): this

    on(
      event: 'ack',
      listener: (packet: PublishPacket | PubrelPacket, client: Client) => void
    ): this

    on(
      event: 'subscribe',
      listener: (subscriptions: Subscription[], client: Client) => void
    ): this

    on(
      event: 'unsubscribe',
      listener: (unsubscriptions: string[], client: Client) => void
    ): this

    publish(packet: PublishPacket, callback: (error?: Error) => void): void
    subscribe(
      topic: string,
      deliverfunc: (packet: AedesPublishPacket, callback: () => void) => void,
      callback: () => void
    ): void

    unsubscribe(
      topic: string,
      deliverfunc: (packet: AedesPublishPacket, callback: () => void) => void,
      callback: () => void
    ): void

    close(callback?: () => void): void

    preConnect: PreConnectHandler
    authenticate: AuthenticateHandler
    authorizePublish: AuthorizePublishHandler
    authorizeSubscribe: AuthorizeSubscribeHandler
    authorizeForward: AuthorizeForwardHandler
    published: PublishedHandler
  }
}
