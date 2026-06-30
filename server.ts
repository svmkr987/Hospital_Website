import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { requireAuth, requireAdmin, AuthRequest } from './src/middleware/auth.ts';
import { db } from './src/db/index.ts';
import { appointments, inquiries, users } from './src/db/schema.ts';
import { getOrCreateUser } from './src/db/users.ts';
import { eq, desc, lt } from 'drizzle-orm';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Public APIs
  app.post('/api/admin/login', async (req, res) => {
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

  app.post('/api/inquiries', async (req, res) => {
    try {
      const { name, phone, subject, message } = req.body;
      const result = await db.insert(inquiries).values({ name, phone, subject, message }).returning();
      res.json(result[0]);
    } catch (error: any) {
      console.error('Failed to submit inquiry:', error);
      res.status(500).json({ error: 'Failed to submit inquiry', details: error.message });
    }
  });

  app.get('/api/appointments/booked', async (req, res) => {
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

  app.post('/api/appointments/public', async (req, res) => {
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
  app.post('/api/auth/sync', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      const user = await getOrCreateUser(req.user.uid, req.user.email || '');
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to sync user', details: error.message });
    }
  });

  app.get('/api/appointments/my', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
      // Fetch user from DB to get integer id if we want to link
      // But we stored them via email/phone in public route, or we can look up by email for now
      const myApps = await db.select().from(appointments).where(eq(appointments.email, req.user.email || '')).orderBy(desc(appointments.createdAt));
      res.json(myApps);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to fetch appointments', details: error.message });
    }
  });

  // Admin APIs
  app.get('/api/admin/appointments', requireAdmin, async (req: AuthRequest, res) => {
    try {
      const apps = await db.select().from(appointments).orderBy(desc(appointments.createdAt));
      res.json(apps);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to fetch appointments', details: error.message });
    }
  });
  
  app.get('/api/admin/inquiries', requireAdmin, async (req: AuthRequest, res) => {
    try {
      const inqs = await db.select().from(inquiries).orderBy(desc(inquiries.createdAt));
      res.json(inqs);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to fetch inquiries', details: error.message });
    }
  });

  app.patch('/api/admin/appointments/:id', requireAdmin, async (req: AuthRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      const result = await db.update(appointments).set({ status }).where(eq(appointments.id, id)).returning();
      res.json(result[0]);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to update appointment', details: error.message });
    }
  });

  app.delete('/api/admin/inquiries/:id', requireAdmin, async (req: AuthRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      await db.delete(inquiries).where(eq(inquiries.id, id));
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to delete inquiry', details: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
