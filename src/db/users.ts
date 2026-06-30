import { db } from './index.ts';
import { hospital_users } from './schema.ts';

export async function getOrCreateUser(uid: string, email: string) {
  const role = email === 'svmanoj1220@gmail.com' ? 'admin' : 'patient';
  
  const result = await db.insert(hospital_users)
    .values({ uid, email, role })
    .onConflictDoUpdate({
      target: hospital_users.uid,
      set: { email, role },
    })
    .returning();

  return result[0];
}
