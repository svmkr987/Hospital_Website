// WARNING: This file is for SERVER-SIDE configuration only.
// Do NOT import this file in any of your React components (like Home.tsx or BookAppointment.tsx)
// as it will expose your database secrets to the public browser bundle.

export const serverConfig = {
  // Database Configuration
  dbUrl: process.env.DATABASE_POSTGRES_URL || process.env.DATABASE_URL || process.env.POSTGRES_URL || "",
};
