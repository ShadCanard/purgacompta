import NextAuth, { NextAuthOptions } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import jwt from 'jsonwebtoken';

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'identify email guilds',
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'discord' && profile) {
        try {
          // Enregistrer ou mettre à jour l'utilisateur dans la base de données
          const response = await fetch(`${process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql'}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              query: `
                mutation RegisterOrUpdateUser($input: RegisterUserInput!) {
                  registerOrUpdateUser(input: $input) {
                    id
                    discordId
                    username
                    role
                  }
                }
              `,
              variables: {
                input: {
                  discordId: (profile as any).id,
                  username: (profile as any).username || user.name,
                  email: user.email,
                  avatar: user.image,
                },
              },
            }),
          });

          const data = await response.json();
          if (data.errors) {
            return false;
          }
          
          return true;
        } catch (error) {
          return false;
        }
      }
      return true;
    },
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.discordId = (profile as any).id;
        token.accessToken = account.access_token;
      }
      // Génère un JWT custom signé avec JWT_SECRET pour le backend
      if (token.discordId) {
        const secret = process.env.JWT_SECRET || 'dev-secret';
        // On encode le rôle si dispo (sinon GUEST)
        const role = (token.role as string) || 'GUEST';
        token.purgatoryJwt = jwt.sign(
          {
            discordId: token.discordId,
            role,
          },
          secret,
          { expiresIn: '7d' }
        );
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).discordId = token.discordId;
        (session.user as any).accessToken = token.accessToken;
        (session.user as any).purgatoryJwt = token.purgatoryJwt;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
