import { DurableObject } from "cloudflare:workers";

type Message = {
  registerCount: number;
  waitlistCount: number;
};

/**
 * RegistrationCounter is a Durable Object that keeps track
 * of the registration count and broadcasts it to all connected
 * clients.
 */
export class RegistrationCounter extends DurableObject {
  private clients: Map<WebSocket, null> = new Map();

  async fetch(request: Request): Promise<Response> {
    /**
     * Check if the request is a WebSocket upgrade request.
     */
    const upgradeHeader = request.headers.get("Upgrade");
    if (!upgradeHeader || upgradeHeader !== "websocket") {
      return new Response("Upgrade websocket", {
        status: 426,
      });
    }

    const webSocketPair = new WebSocketPair();
    const [client, server] = Object.values(webSocketPair);

    server.accept();

    /**
     * Add the new WebSocket client map of connected clients.
     */
    this.clients.set(server, null);

    /**
     * Send the registration count to the client when
     * a new WebSocket connection is established.
     */
    server.addEventListener("close", (cls: CloseEvent) => {
      console.log("WebSocket connection closed");
      this.clients.delete(client);
      server.close(cls.code);
    });

    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  }

  /**
   * Broadcast the registration count to all connected clients.
   *
   * @param message The registration count message to broadcast.
   */
  async broadcast(message: Message) {
    console.log(`Broadcasting message: ${JSON.stringify(message)}`);

    const clients = Array.from(this.clients.keys());
    if (!clients.length) return;

    for (const client of clients) {
      client.send(JSON.stringify(message));
    }
  }
}
