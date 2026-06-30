import express from 'express';
import { requireAuth, requireAdmin, AuthRequest } from './middleware/auth.ts';
import { db } from './db/index.ts';
import { appointments, inquiries, users } from './db/schema.ts';
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
      
      await db.delete(appointments).where(lt(appointments.date, dateString));

      // Clean up inquiries older than 10 days
      const tenDaysAgo = new Date();
      tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
      await db.delete(inquiries).where(lt(inquiries.createdAt, tenDaysAgo));
    } catch (err) {
      console.error('Failed to cleanup old appointments:', err);
    }
    
    res.json({ token: 'simple-admin-token-123' });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

apiRouter.post('/inquiries', async (req, res) => {
  try {
    const { name, phone, subject, message } = req.body;
    const result = await db.insert(inquiries).values({ name, phone, subject, message }).returning();
    res.json(result[0]);
  } catch (error: any) {
    console.error('Failed to submit inquiry:', error);
    res.status(500).json({ error: 'Failed to submit inquiry', details: error.message });
  }
});

apiRouter.get('/appointments/booked', async (req, res) => {
  try {
    const date = req.query.date as string;
    if (!date) {
      return res.status(400).json({ error: 'Date is required' });
    }
    
    const apps = await db.select({ time: appointments.time })
      .from(appointments)
      .where(eq(appointments.date, date));
      
    res.json(apps.map(a => a.time));
  } catch (error: any) {
    console.error('Failed to fetch booked slots:', error);
    res.status(500).json({ error: 'Failed to fetch booked slots', details: error.message });
  }
});

apiRouter.post('/appointments/public', async (req, res) => {
  try {
    const { patientName, email, phone, date, time, reason } = req.body;
    const result = await db.insert(appointments).values({
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
    const myApps = await db.select().from(appointments).where(eq(appointments.email, req.user.email || '')).orderBy(desc(appointments.createdAt));
    res.json(myApps);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch appointments', details: error.message });
  }
});

// Admin APIs
apiRouter.get('/admin/appointments', requireAdmin, async (req: AuthRequest, res) => {
  try {
    const apps = await db.select().from(appointments).orderBy(desc(appointments.createdAt));
    res.json(apps);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch appointments', details: error.message });
  }
});

apiRouter.get('/admin/inquiries', requireAdmin, async (req: AuthRequest, res) => {
  try {
    const inqs = await db.select().from(inquiries).orderBy(desc(inquiries.createdAt));
    res.json(inqs);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch inquiries', details: error.message });
  }
});

apiRouter.patch('/admin/appointments/:id', requireAdmin, async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    const result = await db.update(appointments).set({ status }).where(eq(appointments.id, id)).returning();
    res.json(result[0]);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update appointment', details: error.message });
  }
});

apiRouter.delete('/admin/inquiries/:id', requireAdmin, async (req: AuthRequest, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(inquiries).where(eq(inquiries.id, id));
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete inquiry', details: error.message });
  }
});

export default apiRouter;
