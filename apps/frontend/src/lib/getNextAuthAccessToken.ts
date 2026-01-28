import { getSession } from 'next-auth/react';

export async function getNextAuthAccessToken() {
  if (globalThis.window === undefined) return null;
  const session = await getSession();
  return session?.user?.accessToken || null;
}
