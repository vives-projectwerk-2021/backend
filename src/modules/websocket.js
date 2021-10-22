import WebSocket from "ws";

class WS {
    constructor(server) {
        let ws = new WebSocket({server})
        this.client = null
        this.isConnected = false
        this.checkForConnection(ws)
    }

    checkForConnection(ws){
        ws.on('connection', (client) => {
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

export default WS;