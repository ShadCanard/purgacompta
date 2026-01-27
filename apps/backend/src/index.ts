import { ApolloServer, HeaderMap } from '@apollo/server';
import { typeDefs, resolvers } from './graphql/index';
import { makeExecutableSchema } from '@graphql-tools/schema';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import { createServer } from 'node:http';
import { makeServer, CloseCode } from 'graphql-ws';
import { WebSocketServer } from 'ws';
import cors from 'cors';

// Charger les variables d'environnement
dotenv.config();

const PORT = parseInt(process.env.PORT || '4000', 10);

async function main() {
  // Créer le schéma GraphQL
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  // (Logs subscriptions exposées supprimés)

  // Création d'une app Express et d'un serveur HTTP
  const app = express();
  const httpServer = createServer(app);

  // Middlewares
  app.use(cors());
  app.use(express.json());

  // ApolloServer
  const apolloServer = new ApolloServer({ schema });
  await apolloServer.start();

  // Handler GraphQL manuel pour ApolloServer v5
  app.all('/graphql', async (req: Request, res: Response) => {
    const headers = new HeaderMap();
    for (const [key, value] of Object.entries(req.headers)) {
      if (value !== undefined) {
        headers.set(key, Array.isArray(value) ? value.join(', ') : value);
      }
    }

    const httpGraphQLResponse = await apolloServer.executeHTTPGraphQLRequest({
      httpGraphQLRequest: {
        method: req.method.toUpperCase(),
        headers,
        search: new URL(req.url, `http://${req.headers.host}`).search,
        body: req.body,
      },
      context: async () => ({}),
    });

    for (const [key, value] of httpGraphQLResponse.headers) {
      res.setHeader(key, value);
    }
    res.status(httpGraphQLResponse.status || 200);

    if (httpGraphQLResponse.body.kind === 'complete') {
      res.send(httpGraphQLResponse.body.string);
    } else {
      for await (const chunk of httpGraphQLResponse.body.asyncIterator) {
        res.write(chunk);
      }
      res.end();
    }
  });

  // WebSocket pour graphql-ws (Subscriptions)
  const wsServer = new WebSocketServer({ server: httpServer, path: '/graphql' });
  const wsGqlServer = makeServer({
    schema,
    context: async (ctx, msg, args) => {
      // Typage sécurisé pour éviter les erreurs TS
      let auth: string | undefined = undefined;
      const connectionParams = ctx.connectionParams as { headers?: { authorization?: string } } | undefined;
      if (connectionParams?.headers?.authorization) {
        auth = connectionParams.headers.authorization;
      } else if (ctx.extra && typeof ctx.extra === 'object' && 'request' in ctx.extra) {
        const req = (ctx.extra as { request?: { headers?: { [key: string]: string } } }).request;
        if (req?.headers?.authorization) {
          auth = req.headers.authorization;
        }
      }
      return { auth };
    },
    // (Logs WebSocket supprimés)
  });
  wsServer.on('connection', (socket, request) => {
    const closed = wsGqlServer.opened({
      protocol: socket.protocol,
      send: (data) => new Promise<void>((resolve, reject) => {
        socket.send(data, (err) => (err ? reject(err) : resolve()));
      }),
      close: (code, reason) => socket.close(code, reason),
      onMessage: (cb) => {
        socket.on('message', async (event) => {
          try {
            let msg: string;
            if (typeof event === 'string') {
              msg = event;
            } else if (event instanceof Buffer) {
              msg = event.toString('utf-8');
            } else if (event instanceof ArrayBuffer) {
              msg = Buffer.from(event).toString('utf-8');
            } else {
              msg = String(event);
            }
            await cb(msg);
          } catch (err) {
            socket.close(CloseCode.InternalServerError, err instanceof Error ? err.message : 'Internal error');
          }
        });
      },
    }, { socket, request });
    socket.once('close', (code, reason) => closed(code, typeof reason === 'string' ? reason : String(reason)));
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
