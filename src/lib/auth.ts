import { UserInsert, UserTokenInsert, userTokens, users } from "@db/schema";
import { Database } from "@types";
import { eq } from "drizzle-orm";

export async function signUp(db: Database, user: UserInsert) {
  // 1. Check if user exists
  const existing = await db.select().from(users).where(eq(users.email, user.email)).execute();
  if (existing.length > 0) {
    throw new Error("User already exists");
  }

  // 2. Hash password
  try {
    const hash = await Bun.password.hash(user.password);
    user.password = hash;
  } catch (error) {
    console.error(error);
    throw new Error("Could not hash password");
  }

  // 3. Save user to database
  try {
    const saved = await db.insert(users).values(user).returning().execute();
    user.id = saved[0].id;
  } catch (error) {
    console.error(error);
    throw new Error("Could not save user");
  }

  // 4. Return user
  return user;
}

export async function signIn(db: Database, email: string, password: string) {
  // 1. Check if user exists
  const existing = await db.select().from(users).where(eq(users.email, email)).execute();
  if (existing.length == 0) {
    throw new Error("User doesn't exist");
  }
  const user = existing[0];

  // 2. Check if password matches
  try {
    const match = await Bun.password.verify(password, user.password);
    if (!match) {
      throw new Error("Password does not match");
    }
  } catch (error) {
    console.error(error);
    throw new Error("Could not verify password");
  }

  // 3. Generate token, save to database and return
  try {
    const expiresAt = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 30);
    const token = {
      userId: user.id,
      token: btoa(`${user.email}:${new Date().getTime()}`),
      expiresAt: expiresAt
    } as UserTokenInsert;

    await db.insert(userTokens).values(token).execute();

    return { user, token }
  } catch (error) {
    console.error(error);
    throw new Error("Could not generate token");
  }
}

export async function authenticate(db: Database, token: string) {
  // 1. Check if token exists
  const existing = await db.select().from(userTokens).where(eq(userTokens.token, token)).execute();
  if (existing.length == 0) {
    throw new Error("Token doesn't exist");
  }

  // 2. Check if token is expired
  const userToken = existing[0];
  if (userToken.expiresAt < new Date()) {
    throw new Error("Token is expired");
  }

  // 3. Check if user exists
  const existingUser = await db.select().from(users).where(eq(users.id, userToken.userId)).execute();
  if (existingUser.length == 0) {
    throw new Error("User doesn't exist");
  }
  const user = existingUser[0];

  // 4. Return user
  return user;
}