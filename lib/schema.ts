// src/lib/schema.ts

import { pgTable, serial, text, timestamp, varchar, boolean, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
	id: serial('id').primaryKey(),
	clerkId: varchar('clerk_id', { length: 255 }).notNull().unique(),
	email: varchar('email', { length: 255 }).notNull().unique(),
	subscriptionTier: varchar('subscription_tier', { length: 20 }).notNull().default('free'),
	subscriptionStatus: varchar('subscription_status', { length: 20 }).notNull().default('active'),
	paypalSubscriptionId: varchar('paypal_subscription_id', { length: 255 }),
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

export const userExports = pgTable('user_exports', {
	id: serial('id').primaryKey(),
	userId: serial('user_id').references(() => users.id),
	count: integer('count').notNull().default(0),
	lastExportDate: timestamp('last_export_date'),
});
