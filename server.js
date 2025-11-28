import WebSocket, { WebSocketServer } from 'ws';

const randomId = async () => Math.random().toString(36).substring(2, 10);

const startServer = () => {
    const server = new WebSocketServer({ port: 8080 });
    const activeConnections = new Map();
    

    server.on('connection', async function connection(ws, req) {

        const clientIp = req.socket.remoteAddress;
        const username = `User_${await randomId()}`;
        
        activeConnections.set(ws, {clientIp, username});
        ws.send(`Welcome ${username}!`);

        ws.on('message', function message(data) {
            // Broadcast received message to all connected clients
            server.clients.forEach(function each(client) {
                if (client.readyState === WebSocket.OPEN && client !== ws) {
                    client.send(`${username}: ${data}`);
                }
            });
        });

        ws.on('close', () => {
            activeConnections.delete(ws);
            server.clients.forEach(function each(client) {
                client.send(`Connection closed: ${username}`);
            });
        });

        ws.on('error', (error) => {
            console.error(`WebSocket error from ${username}:`, error);
        });
    });
};

export { startServer };