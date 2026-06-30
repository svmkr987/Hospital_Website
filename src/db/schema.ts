import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp, varchar, boolean } from 'drizzle-orm/pg-core';

// Users table for Firebase Auth mapping and roles
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  role: text('role').notNull().default('patient'), // 'patient' or 'admin'
  createdAt: timestamp('created_at').defaultNow(),
});

// Appointments table
export const appointments = pgTable('appointments', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id), // Optional, if booked by logged-in user
  patientName: text('patient_name').notNull(),
  email: text('email').notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  date: text('date').notNull(), // YYYY-MM-DD
  time: text('time').notNull(), // HH:MM
  reason: text('reason'),
  status: text('status').notNull().default('pending'), // pending, confirmed, cancelled
  createdAt: timestamp('created_at').defaultNow(),
});

// Inquiries table (Contact form)
export const inquiries = pgTable('inquiries', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  status: text('status').notNull().default('new'), // new, read, resolved
  createdAt: timestamp('created_at').defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  appointments: many(appointments),
}));

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  user: one(users, {
    fields: [appointments.userId],
    references: [users.id],
  }),
}));
