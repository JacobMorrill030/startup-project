const { WebSocketServer, WebSocket } = require('ws');

function peerProxy(httpServer) {
  const socketServer = new WebSocketServer({ server: httpServer });

  socketServer.on('connection', (socket) => {
    console.log('WebSocket connected');
    socket.userName = null;

    socket.on('message', (message) => {
      let data;
      try {
        data = JSON.parse(message.toString());
      } catch (error) {
        console.error('Invalid WebSocket message received:', error);
        return;
      }

      if (data?.type === 'register') {
        socket.userName = data.userName || null;
        console.log('WebSocket registered user:', socket.userName);
        return;
      }

      if (data?.type === 'share-ranking') {
        const outgoing = JSON.stringify({
          type: 'share-ranking',
          from: data.from,
          to: data.to,
          ranking: data.ranking,
          timestamp: data.timestamp || new Date().toISOString(),
          message:
            data.message ||
            `${data.from || 'Someone'} shared ${data.ranking?.title || 'a ranking'}`,
        });

        socketServer.clients.forEach((client) => {
          if (
            client.readyState === client.OPEN &&
            client.userName &&
            client.userName === data.to
          ) {
            client.send(outgoing);
          }
        });
      }
    });

    socket.on('close', () => {
      console.log('WebSocket disconnected');
    });

    socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  socketServer.on('error', (error) => {
    console.error('WebSocket server error:', error);
  });
}

module.exports = { peerProxy };
