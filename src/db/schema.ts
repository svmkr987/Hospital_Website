import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp, varchar, boolean } from 'drizzle-orm/pg-core';

// Users table for Firebase Auth mapping and roles
export const hospital_users = pgTable('hospital_users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  role: text('role').notNull().default('patient'), // 'patient' or 'admin'
  createdAt: timestamp('created_at').defaultNow(),
});

// Appointments table
export const hospital_appointments = pgTable('hospital_appointments', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => hospital_users.id), // Optional, if booked by logged-in user
  patientName: text('patient_name').notNull(),
  email: text('email').notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  date: text('date').notNull(), // YYYY-MM-DD
  time: text('time').notNull(), // HH:MM
  reason: text('reason'),
  status: text('status').notNull().default('pending'), // pending, confirmed, cancelled
  createdAt: timestamp('created_at').defaultNow(),
});

// Enquiries table (Contact form)
export const hospital_enquiries = pgTable('hospital_enquiries', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  status: text('status').notNull().default('new'), // new, read, resolved
  createdAt: timestamp('created_at').defaultNow(),
});

export const usersRelations = relations(hospital_users, ({ many }) => ({
  appointments: many(hospital_appointments),
}));

export const appointmentsRelations = relations(hospital_appointments, ({ one }) => ({
  user: one(hospital_users, {
    fields: [hospital_appointments.userId],
    references: [hospital_users.id],
  }),
}));
