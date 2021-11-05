import WebSocket, { WebSocketServer } from "ws";

class WSS {
    constructor(server) {
        const wss = new WebSocketServer({server});
        this.clients = [];
        this.checkForConnection(wss);
    }

    checkForConnection(wss){
        wss.on('connection', (client) => {
            console.log('WebSocket connection...')
            this.clients.push(client)
            client.send(JSON.stringify({ message: "welcome", value: "Welcome using WebSocket"}))
        })
    }

    webSocketSend(data){
        if (this.clients.length > 0) {
            this.clients.forEach( (client) => {
                if (client.readyState === WebSocket.OPEN){
                    client.send(JSON.stringify(data));
                }
            });
        } else {
            console.log("Unable to send to clients: No clients connected.")
        }
    }
}

export default WSS;