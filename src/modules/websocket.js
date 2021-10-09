const { web } = require('webpack');
const WebSocket = require('ws');

class WS {
    constructor(server) {
        this.ws = new WebSocket.Server({server})
        this.client = null
        this.ws.on('connection', (client) => {
            console.log('WebSocket connection...')
            this.client = client
            this.webSocketSend({ message: "welcome", value: "Welcome using WebSocket"})
        })
    }

    webSocketSend(data){
        this.client.send(JSON.stringify(data))
    }
}

module.exports = WS