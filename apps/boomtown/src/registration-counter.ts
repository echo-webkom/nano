import { DurableObject } from "cloudflare:workers";

type Message = {
  registerCount: number;
  waitlistCount: number;
};

export class RegistrationCounter extends DurableObject {
  private clients: Map<WebSocket, null> = new Map();

  async fetch(request: Request): Promise<Response> {
    const upgradeHeader = request.headers.get("Upgrade");
    if (!upgradeHeader || upgradeHeader !== "websocket") {
      return new Response("Upgrade websocket", {
        status: 426,
      });
    }

    const webSocketPair = new WebSocketPair();
    const [client, server] = Object.values(webSocketPair);

    server.accept();

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
