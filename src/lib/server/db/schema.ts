import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull()
});

export const session = sqliteTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

export const capturedPokemon = sqliteTable('captured_pokemon', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	name: text('name').notNull(),
	height: integer('height').notNull(),
	weight: integer('weight').notNull(),
	health: integer('health'),
	speed: integer('speed'),
	attack: integer('attack'),
	defense: integer('defense'),
	specialAttack: integer('special_attack'),
	specialDefense: integer('special_defense'),
	imgUrl: text('img_url'),
	createdAt: integer('first_added', { mode: 'timestamp' }).notNull(),
	note: text('note')
});

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;


