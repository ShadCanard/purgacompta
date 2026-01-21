import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs, resolvers } from './graphql';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

// Charger les variables d'environnement
dotenv.config();

const PORT = parseInt(process.env.PORT || '4000', 10);

async function main() {
  // Créer l'instance Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  // Démarrer le serveur
  const { url } = await startStandaloneServer(server, {
    listen: { port: PORT },
    context: async ({ req }) => {
      // Récupération et vérification du JWT dans l'en-tête Authorization
      let user = null;
      const authHeader = req.headers['authorization'] || req.headers['Authorization'];
      if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
        const token = authHeader.replace('Bearer ', '').trim();
        try {
          // Le secret doit être défini dans le .env (ex: JWT_SECRET)
          const secret = process.env.JWT_SECRET || 'dev-secret';
          user = jwt.verify(token, secret);
        } catch (err) {
          // Token invalide ou expiré
          user = null;
        }
      }
      // user contiendra les infos du JWT (ex: discordId, role, etc)
      return {
        user,
      };
    },
  });

  console.log(`
  🔥 PurgatoryCompta Backend is running!
  
  🚀 Server ready at: ${url}
  📊 GraphQL Playground: ${url}
  
  💾 Run 'pnpm studio' to open Prisma Studio
  `);
}

main().catch((error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});
