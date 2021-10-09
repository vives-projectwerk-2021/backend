const { web } = require('webpack');
const WebSocket = require('ws');

class WS {
    constructor(server) {
        this.ws = new WebSocket.Server({server})
        this.client = null
        this.isConnected = false
        this.ws.on('connection', (client) => {
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

module.exports = WS