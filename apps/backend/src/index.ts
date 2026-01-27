import { ApolloServer } from '@apollo/server';
import { typeDefs, resolvers } from './graphql';
import dotenv from 'dotenv';
import { createServer } from 'node:http';
import { makeServer } from 'graphql-ws';
import { WebSocketServer } from 'ws';

// Charger les variables d'environnement
dotenv.config();

const PORT = parseInt(process.env.PORT || '4000', 10);

async function main() {
  // Créer l'instance Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  // Créer le serveur HTTP
  const httpServer = createServer();

  // Créer le serveur WebSocket pour graphql-ws
  const wsServer = new WebSocketServer({ server: httpServer, path: '/graphql' });
  makeServer({ schema: server.schema }, wsServer);

  // Démarrer le serveur HTTP et Apollo
  await server.start();
  httpServer.on('request', (req, res) => {
    res.writeHead(404);
    res.end();
  });
  httpServer.listen(PORT, () => {
    console.log(`\n🔥 PurgatoryCompta Backend is running!`);
    console.log(`🚀 Server ready at: http://localhost:${PORT}/graphql`);
    console.log(`📊 GraphQL Playground: http://localhost:${PORT}/graphql`);
    console.log(`💾 Run 'pnpm studio' to open Prisma Studio`);
    console.log(`🟢 Subscriptions WebSocket ready at ws://localhost:${PORT}/graphql`);
  });
}

main().catch((error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});
