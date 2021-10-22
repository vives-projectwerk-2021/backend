import { WebSocketServer } from "ws";

class WSS {
    constructor(server) {
        const wss = new WebSocketServer({server});
        this.client = null;
        this.isConnected = false;
        this.checkForConnection(wss);
    }

    checkForConnection(wss){
        wss.on('connection', (client) => {
            console.log('WebSocket connection...')
            this.client = client
            this.isConnected = true
            this.webSocketSend({ message: "welcome", value: "Welcome using WebSocket"})
        })
    }

    webSocketSend(data){
        if (this.isConnected) {
            this.client.send(JSON.stringify(data))
        } else {
            console.log("Unable to send to client: Client not connected.")
        }
    }
}

export default WSS;