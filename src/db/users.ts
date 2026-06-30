import { db } from './index.ts';
import { users } from './schema.ts';

export async function getOrCreateUser(uid: string, email: string) {
  const role = email === 'svmanoj1220@gmail.com' ? 'admin' : 'patient';
  
  const result = await db.insert(users)
    .values({ uid, email, role })
    .onConflictDoUpdate({
      target: users.uid,
      set: { email, role },
    })
    .returning();

  return result[0];
}
