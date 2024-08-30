// src/lib/schema.ts

import { pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
	id: serial('id').primaryKey(),
	clerkId: varchar('clerk_id', { length: 255 }).notNull().unique(),
	email: varchar('email', { length: 255 }).notNull().unique(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const colorPalettes = pgTable('color_palettes', {
	id: serial('id').primaryKey(),
	userId: serial('user_id').references(() => users.id),
	name: varchar('name', { length: 255 }).notNull(),
	primaryColor: varchar('primary_color', { length: 7 }).notNull(),
	secondaryColor: varchar('secondary_color', { length: 7 }),
	colorScale: text('color_scale').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
});
