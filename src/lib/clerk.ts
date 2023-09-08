import clerk from '@clerk/clerk-sdk-node';

export async function getUserFromToken(token: string) {
  const client = await clerk.clients.verifyClient(token);
  const userId = client.sessions[0].userId;
  return await clerk.users.getUser(userId);
}