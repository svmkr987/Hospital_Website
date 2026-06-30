import express from 'express';
import { requireAuth, requireAdmin, AuthRequest } from './middleware/auth.ts';
import { db } from './db/index.ts';
import { hospital_appointments, hospital_enquiries, hospital_users } from './db/schema.ts';
import { getOrCreateUser } from './db/users.ts';
import { eq, desc, lt } from 'drizzle-orm';

const apiRouter = express.Router();

// Public APIs
apiRouter.post('/admin/login', async (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin12345') {
    try {
      // Clean up appointments older than 5 days
      const fiveDaysAgo = new Date();
      fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
      const dateString = fiveDaysAgo.toISOString().split('T')[0];
      
      await db.delete(hospital_appointments).where(lt(hospital_appointments.date, dateString));

      // Clean up enquiries older than 10 days
      const tenDaysAgo = new Date();
      tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
      await db.delete(hospital_enquiries).where(lt(hospital_enquiries.createdAt, tenDaysAgo));
    } catch (err) {
      console.error('Failed to cleanup old appointments:', err);
    }
    
    res.json({ token: 'simple-admin-token-123' });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

apiRouter.post('/enquiries', async (req, res) => {
  try {
    const { name, phone, subject, message } = req.body;
    const result = await db.insert(hospital_enquiries).values({ name, phone, subject, message }).returning();
    res.json(result[0]);
  } catch (error: any) {
    console.error('Failed to submit enquiry:', error);
    res.status(500).json({ error: 'Failed to submit enquiry', details: error.message });
  }
});

apiRouter.get('/appointments/booked', async (req, res) => {
  try {
    const date = req.query.date as string;
    if (!date) {
      return res.status(400).json({ error: 'Date is required' });
    }
    
    const apps = await db.select({ time: hospital_appointments.time })
      .from(hospital_appointments)
      .where(eq(hospital_appointments.date, date));
      
    res.json(apps.map(a => a.time));
  } catch (error: any) {
    console.error('Failed to fetch booked slots:', error);
    res.status(500).json({ error: 'Failed to fetch booked slots', details: error.message });
  }
});

apiRouter.post('/appointments/public', async (req, res) => {
  try {
    const { patientName, email, phone, date, time, reason } = req.body;
    const result = await db.insert(hospital_appointments).values({
      patientName,
      email,
      phone,
      date,
      time,
      reason
    }).returning();
    res.json(result[0]);
  } catch (error: any) {
    console.error('Failed to book appointment:', error);
    res.status(500).json({ error: 'Failed to book appointment', details: error.message });
  }
});

// Protected APIs (Any Authenticated User)
apiRouter.post('/auth/sync', requireAuth, async (req: AuthRequest, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const user = await getOrCreateUser(req.user.uid, req.user.email || '');
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to sync user', details: error.message });
  }
});

apiRouter.get('/appointments/my', requireAuth, async (req: AuthRequest, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const myApps = await db.select().from(hospital_appointments).where(eq(hospital_appointments.email, req.user.email || '')).orderBy(desc(hospital_appointments.createdAt));
    res.json(myApps);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch appointments', details: error.message });
  }
});

// Admin APIs
apiRouter.get('/admin/appointments', requireAdmin, async (req: AuthRequest, res) => {
  try {
    const apps = await db.select().from(hospital_appointments).orderBy(desc(hospital_appointments.createdAt));
    res.json(apps);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch appointments', details: error.message });
  }
});

apiRouter.get('/admin/enquiries', requireAdmin, async (req: AuthRequest, res) => {
  try {
    const inqs = await db.select().from(hospital_enquiries).orderBy(desc(hospital_enquiries.createdAt));
    res.json(inqs);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch enquiries', details: error.message });
  }
});

apiRouter.patch('/admin/appointments/:id', requireAdmin, async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    const result = await db.update(hospital_appointments).set({ status }).where(eq(hospital_appointments.id, id)).returning();
    res.json(result[0]);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update appointment', details: error.message });
  }
});

apiRouter.delete('/admin/enquiries/:id', requireAdmin, async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(hospital_enquiries).where(eq(hospital_enquiries.id, id));
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete enquiry', details: error.message });
  }
});

export default apiRouter;
