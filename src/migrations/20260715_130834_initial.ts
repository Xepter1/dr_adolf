import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`projekte_facts\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`value\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`projekte\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`projekte_facts_order_idx\` ON \`projekte_facts\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`projekte_facts_parent_id_idx\` ON \`projekte_facts\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`projekte\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`tag\` text NOT NULL,
  	\`location\` text NOT NULL,
  	\`year\` text NOT NULL,
  	\`hero_id\` integer NOT NULL,
  	\`lead\` text NOT NULL,
  	\`aufgabe\` text NOT NULL,
  	\`loesung\` text NOT NULL,
  	\`ergebnis\` text NOT NULL,
  	\`before_after_before_id\` integer,
  	\`before_after_after_id\` integer,
  	\`before_after_caption\` text,
  	\`featured_size\` text DEFAULT 'wide',
  	\`sort_order\` numeric DEFAULT 0,
  	\`slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`hero_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`before_after_before_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`before_after_after_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`projekte_hero_idx\` ON \`projekte\` (\`hero_id\`);`)
  await db.run(sql`CREATE INDEX \`projekte_before_after_before_after_before_idx\` ON \`projekte\` (\`before_after_before_id\`);`)
  await db.run(sql`CREATE INDEX \`projekte_before_after_before_after_after_idx\` ON \`projekte\` (\`before_after_after_id\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`projekte_slug_idx\` ON \`projekte\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`projekte_updated_at_idx\` ON \`projekte\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`projekte_created_at_idx\` ON \`projekte\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`projekte_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`media_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`projekte\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`projekte_rels_order_idx\` ON \`projekte_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`projekte_rels_parent_idx\` ON \`projekte_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`projekte_rels_path_idx\` ON \`projekte_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`projekte_rels_media_id_idx\` ON \`projekte_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE TABLE \`leistungen_leistungspunkte\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`leistungen\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`leistungen_leistungspunkte_order_idx\` ON \`leistungen_leistungspunkte\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`leistungen_leistungspunkte_parent_id_idx\` ON \`leistungen_leistungspunkte\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`leistungen_ablauf\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`titel\` text NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`leistungen\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`leistungen_ablauf_order_idx\` ON \`leistungen_ablauf\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`leistungen_ablauf_parent_id_idx\` ON \`leistungen_ablauf\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`leistungen_faq\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`frage\` text NOT NULL,
  	\`antwort\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`leistungen\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`leistungen_faq_order_idx\` ON \`leistungen_faq\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`leistungen_faq_parent_id_idx\` ON \`leistungen_faq\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`leistungen_unterleistungen_abschnitte\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`titel\` text,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`leistungen_unterleistungen\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`leistungen_unterleistungen_abschnitte_order_idx\` ON \`leistungen_unterleistungen_abschnitte\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`leistungen_unterleistungen_abschnitte_parent_id_idx\` ON \`leistungen_unterleistungen_abschnitte\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`leistungen_unterleistungen\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`lead\` text,
  	\`hero_image_id\` integer,
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`leistungen\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`leistungen_unterleistungen_order_idx\` ON \`leistungen_unterleistungen\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`leistungen_unterleistungen_parent_id_idx\` ON \`leistungen_unterleistungen\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`leistungen_unterleistungen_hero_image_idx\` ON \`leistungen_unterleistungen\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE TABLE \`leistungen\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`description\` text NOT NULL,
  	\`icon\` text DEFAULT 'tooth' NOT NULL,
  	\`hero_image_id\` integer,
  	\`lead\` text,
  	\`intro\` text,
  	\`sort_order\` numeric DEFAULT 0,
  	\`slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`leistungen_hero_image_idx\` ON \`leistungen\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`leistungen_slug_idx\` ON \`leistungen\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`leistungen_updated_at_idx\` ON \`leistungen\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`leistungen_created_at_idx\` ON \`leistungen\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`testimonials\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`quote\` text NOT NULL,
  	\`author\` text NOT NULL,
  	\`project\` text NOT NULL,
  	\`initials\` text NOT NULL,
  	\`rating\` numeric DEFAULT 5,
  	\`sort_order\` numeric DEFAULT 0,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`testimonials_updated_at_idx\` ON \`testimonials\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`testimonials_created_at_idx\` ON \`testimonials\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`jobs\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`type\` text NOT NULL,
  	\`sort_order\` numeric DEFAULT 0,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`jobs_updated_at_idx\` ON \`jobs\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`jobs_created_at_idx\` ON \`jobs\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`faqs\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`question\` text NOT NULL,
  	\`answer\` text NOT NULL,
  	\`sort_order\` numeric DEFAULT 0,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`faqs_updated_at_idx\` ON \`faqs\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`faqs_created_at_idx\` ON \`faqs\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`aerzte_sprechzeiten\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`wochentag\` text NOT NULL,
  	\`von\` text NOT NULL,
  	\`bis\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`aerzte\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`aerzte_sprechzeiten_order_idx\` ON \`aerzte_sprechzeiten\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`aerzte_sprechzeiten_parent_id_idx\` ON \`aerzte_sprechzeiten\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`aerzte_abwesenheiten\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`von\` text NOT NULL,
  	\`bis\` text NOT NULL,
  	\`grund\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`aerzte\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`aerzte_abwesenheiten_order_idx\` ON \`aerzte_abwesenheiten\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`aerzte_abwesenheiten_parent_id_idx\` ON \`aerzte_abwesenheiten\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`aerzte\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`titel\` text,
  	\`name\` text NOT NULL,
  	\`fachrichtung\` text NOT NULL,
  	\`foto_id\` integer,
  	\`vita\` text,
  	\`aktiv\` integer DEFAULT true,
  	\`slot_dauer_min\` numeric DEFAULT 20 NOT NULL,
  	\`sort_order\` numeric DEFAULT 0,
  	\`slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`foto_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`aerzte_foto_idx\` ON \`aerzte\` (\`foto_id\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`aerzte_slug_idx\` ON \`aerzte\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`aerzte_updated_at_idx\` ON \`aerzte\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`aerzte_created_at_idx\` ON \`aerzte\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`termine\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`arzt_id\` integer NOT NULL,
  	\`terminart\` text NOT NULL,
  	\`start\` text NOT NULL,
  	\`ende\` text,
  	\`patient_name\` text NOT NULL,
  	\`patient_geburtsdatum\` text,
  	\`patient_email\` text NOT NULL,
  	\`patient_telefon\` text,
  	\`versicherung\` text,
  	\`ist_neupatient\` integer,
  	\`anamnese_id\` integer,
  	\`status\` text DEFAULT 'ausstehend' NOT NULL,
  	\`erinnerung_erwuenscht\` integer DEFAULT false,
  	\`erinnerung_gesendet\` integer DEFAULT false,
  	\`loeschdatum\` text,
  	\`notiz_praxis\` text,
  	\`verify_token\` text,
  	\`verify_expires_at\` text,
  	\`manage_token\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`arzt_id\`) REFERENCES \`aerzte\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`anamnese_id\`) REFERENCES \`anamnese\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`termine_arzt_idx\` ON \`termine\` (\`arzt_id\`);`)
  await db.run(sql`CREATE INDEX \`termine_anamnese_idx\` ON \`termine\` (\`anamnese_id\`);`)
  await db.run(sql`CREATE INDEX \`termine_updated_at_idx\` ON \`termine\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`termine_created_at_idx\` ON \`termine\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`anamnese\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`eingegangen_am\` text,
  	\`ciphertext\` text,
  	\`encrypted_key\` text,
  	\`iv\` text,
  	\`algo\` text DEFAULT 'RSA-OAEP-256 + AES-256-GCM',
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`anamnese_updated_at_idx\` ON \`anamnese\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`anamnese_created_at_idx\` ON \`anamnese\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`media\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`alt\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric,
  	\`focal_x\` numeric,
  	\`focal_y\` numeric,
  	\`sizes_thumbnail_url\` text,
  	\`sizes_thumbnail_width\` numeric,
  	\`sizes_thumbnail_height\` numeric,
  	\`sizes_thumbnail_mime_type\` text,
  	\`sizes_thumbnail_filesize\` numeric,
  	\`sizes_thumbnail_filename\` text,
  	\`sizes_card_url\` text,
  	\`sizes_card_width\` numeric,
  	\`sizes_card_height\` numeric,
  	\`sizes_card_mime_type\` text,
  	\`sizes_card_filesize\` numeric,
  	\`sizes_card_filename\` text,
  	\`sizes_hero_url\` text,
  	\`sizes_hero_width\` numeric,
  	\`sizes_hero_height\` numeric,
  	\`sizes_hero_mime_type\` text,
  	\`sizes_hero_filesize\` numeric,
  	\`sizes_hero_filename\` text,
  	\`sizes_portrait_url\` text,
  	\`sizes_portrait_width\` numeric,
  	\`sizes_portrait_height\` numeric,
  	\`sizes_portrait_mime_type\` text,
  	\`sizes_portrait_filesize\` numeric,
  	\`sizes_portrait_filename\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`media_updated_at_idx\` ON \`media\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`media_created_at_idx\` ON \`media\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`media_filename_idx\` ON \`media\` (\`filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_thumbnail_sizes_thumbnail_filename_idx\` ON \`media\` (\`sizes_thumbnail_filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_card_sizes_card_filename_idx\` ON \`media\` (\`sizes_card_filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_hero_sizes_hero_filename_idx\` ON \`media\` (\`sizes_hero_filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_portrait_sizes_portrait_filename_idx\` ON \`media\` (\`sizes_portrait_filename\`);`)
  await db.run(sql`CREATE TABLE \`users_sessions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`created_at\` text,
  	\`expires_at\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`users_sessions_order_idx\` ON \`users_sessions\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`users_sessions_parent_id_idx\` ON \`users_sessions\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`users\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`email\` text NOT NULL,
  	\`reset_password_token\` text,
  	\`reset_password_expiration\` text,
  	\`salt\` text,
  	\`hash\` text,
  	\`login_attempts\` numeric DEFAULT 0,
  	\`lock_until\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`users_updated_at_idx\` ON \`users\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`users_created_at_idx\` ON \`users\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`users_email_idx\` ON \`users\` (\`email\`);`)
  await db.run(sql`CREATE TABLE \`forms_blocks_checkbox\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`label\` text,
  	\`width\` numeric,
  	\`required\` integer,
  	\`default_value\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`forms_blocks_checkbox_order_idx\` ON \`forms_blocks_checkbox\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`forms_blocks_checkbox_parent_id_idx\` ON \`forms_blocks_checkbox\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`forms_blocks_checkbox_path_idx\` ON \`forms_blocks_checkbox\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`forms_blocks_country\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`label\` text,
  	\`width\` numeric,
  	\`required\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`forms_blocks_country_order_idx\` ON \`forms_blocks_country\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`forms_blocks_country_parent_id_idx\` ON \`forms_blocks_country\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`forms_blocks_country_path_idx\` ON \`forms_blocks_country\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`forms_blocks_email\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`label\` text,
  	\`width\` numeric,
  	\`required\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`forms_blocks_email_order_idx\` ON \`forms_blocks_email\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`forms_blocks_email_parent_id_idx\` ON \`forms_blocks_email\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`forms_blocks_email_path_idx\` ON \`forms_blocks_email\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`forms_blocks_message\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`message\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`forms_blocks_message_order_idx\` ON \`forms_blocks_message\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`forms_blocks_message_parent_id_idx\` ON \`forms_blocks_message\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`forms_blocks_message_path_idx\` ON \`forms_blocks_message\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`forms_blocks_number\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`label\` text,
  	\`width\` numeric,
  	\`default_value\` numeric,
  	\`required\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`forms_blocks_number_order_idx\` ON \`forms_blocks_number\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`forms_blocks_number_parent_id_idx\` ON \`forms_blocks_number\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`forms_blocks_number_path_idx\` ON \`forms_blocks_number\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`forms_blocks_select_options\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`value\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms_blocks_select\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`forms_blocks_select_options_order_idx\` ON \`forms_blocks_select_options\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`forms_blocks_select_options_parent_id_idx\` ON \`forms_blocks_select_options\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`forms_blocks_select\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`label\` text,
  	\`width\` numeric,
  	\`default_value\` text,
  	\`placeholder\` text,
  	\`required\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`forms_blocks_select_order_idx\` ON \`forms_blocks_select\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`forms_blocks_select_parent_id_idx\` ON \`forms_blocks_select\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`forms_blocks_select_path_idx\` ON \`forms_blocks_select\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`forms_blocks_state\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`label\` text,
  	\`width\` numeric,
  	\`required\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`forms_blocks_state_order_idx\` ON \`forms_blocks_state\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`forms_blocks_state_parent_id_idx\` ON \`forms_blocks_state\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`forms_blocks_state_path_idx\` ON \`forms_blocks_state\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`forms_blocks_text\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`label\` text,
  	\`width\` numeric,
  	\`default_value\` text,
  	\`required\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`forms_blocks_text_order_idx\` ON \`forms_blocks_text\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`forms_blocks_text_parent_id_idx\` ON \`forms_blocks_text\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`forms_blocks_text_path_idx\` ON \`forms_blocks_text\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`forms_blocks_textarea\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`label\` text,
  	\`width\` numeric,
  	\`default_value\` text,
  	\`required\` integer,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`forms_blocks_textarea_order_idx\` ON \`forms_blocks_textarea\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`forms_blocks_textarea_parent_id_idx\` ON \`forms_blocks_textarea\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`forms_blocks_textarea_path_idx\` ON \`forms_blocks_textarea\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`forms_emails\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`email_to\` text,
  	\`cc\` text,
  	\`bcc\` text,
  	\`reply_to\` text,
  	\`email_from\` text,
  	\`subject\` text DEFAULT 'You''ve received a new message.' NOT NULL,
  	\`message\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`forms_emails_order_idx\` ON \`forms_emails\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`forms_emails_parent_id_idx\` ON \`forms_emails\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`forms\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`submit_button_label\` text,
  	\`confirmation_type\` text DEFAULT 'message',
  	\`confirmation_message\` text,
  	\`redirect_url\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`forms_updated_at_idx\` ON \`forms\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`forms_created_at_idx\` ON \`forms\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`form_submissions_submission_data\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`field\` text NOT NULL,
  	\`value\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`form_submissions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`form_submissions_submission_data_order_idx\` ON \`form_submissions_submission_data\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`form_submissions_submission_data_parent_id_idx\` ON \`form_submissions_submission_data\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`form_submissions\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`form_id\` integer NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`form_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`form_submissions_form_idx\` ON \`form_submissions\` (\`form_id\`);`)
  await db.run(sql`CREATE INDEX \`form_submissions_updated_at_idx\` ON \`form_submissions\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`form_submissions_created_at_idx\` ON \`form_submissions\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_kv\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text NOT NULL,
  	\`data\` text NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`payload_kv_key_idx\` ON \`payload_kv\` (\`key\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`global_slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_global_slug_idx\` ON \`payload_locked_documents\` (\`global_slug\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_updated_at_idx\` ON \`payload_locked_documents\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_created_at_idx\` ON \`payload_locked_documents\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`projekte_id\` integer,
  	\`leistungen_id\` integer,
  	\`testimonials_id\` integer,
  	\`jobs_id\` integer,
  	\`faqs_id\` integer,
  	\`aerzte_id\` integer,
  	\`termine_id\` integer,
  	\`anamnese_id\` integer,
  	\`media_id\` integer,
  	\`users_id\` integer,
  	\`forms_id\` integer,
  	\`form_submissions_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`projekte_id\`) REFERENCES \`projekte\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`leistungen_id\`) REFERENCES \`leistungen\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`testimonials_id\`) REFERENCES \`testimonials\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`jobs_id\`) REFERENCES \`jobs\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`faqs_id\`) REFERENCES \`faqs\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`aerzte_id\`) REFERENCES \`aerzte\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`termine_id\`) REFERENCES \`termine\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`anamnese_id\`) REFERENCES \`anamnese\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`forms_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`form_submissions_id\`) REFERENCES \`form_submissions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_projekte_id_idx\` ON \`payload_locked_documents_rels\` (\`projekte_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_leistungen_id_idx\` ON \`payload_locked_documents_rels\` (\`leistungen_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_testimonials_id_idx\` ON \`payload_locked_documents_rels\` (\`testimonials_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_jobs_id_idx\` ON \`payload_locked_documents_rels\` (\`jobs_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_faqs_id_idx\` ON \`payload_locked_documents_rels\` (\`faqs_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_aerzte_id_idx\` ON \`payload_locked_documents_rels\` (\`aerzte_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_termine_id_idx\` ON \`payload_locked_documents_rels\` (\`termine_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_anamnese_id_idx\` ON \`payload_locked_documents_rels\` (\`anamnese_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_forms_id_idx\` ON \`payload_locked_documents_rels\` (\`forms_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_form_submissions_id_idx\` ON \`payload_locked_documents_rels\` (\`form_submissions_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`value\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_key_idx\` ON \`payload_preferences\` (\`key\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_updated_at_idx\` ON \`payload_preferences\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_created_at_idx\` ON \`payload_preferences\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_preferences\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_order_idx\` ON \`payload_preferences_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_parent_idx\` ON \`payload_preferences_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_path_idx\` ON \`payload_preferences_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_users_id_idx\` ON \`payload_preferences_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_migrations\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`batch\` numeric,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_migrations_updated_at_idx\` ON \`payload_migrations\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_migrations_created_at_idx\` ON \`payload_migrations\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`settings_oeffnungszeiten\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`tag\` text NOT NULL,
  	\`zeit\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`settings_oeffnungszeiten_order_idx\` ON \`settings_oeffnungszeiten\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`settings_oeffnungszeiten_parent_id_idx\` ON \`settings_oeffnungszeiten\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`settings_hero_stats\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text NOT NULL,
  	\`label\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`settings_hero_stats_order_idx\` ON \`settings_hero_stats\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`settings_hero_stats_parent_id_idx\` ON \`settings_hero_stats\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`settings_marquee\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`word\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`settings_marquee_order_idx\` ON \`settings_marquee\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`settings_marquee_parent_id_idx\` ON \`settings_marquee\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`settings_team_members\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`settings_team_members_order_idx\` ON \`settings_team_members\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`settings_team_members_parent_id_idx\` ON \`settings_team_members\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`settings_stats\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`count\` numeric NOT NULL,
  	\`suffix\` text,
  	\`label\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`settings_stats_order_idx\` ON \`settings_stats\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`settings_stats_parent_id_idx\` ON \`settings_stats\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`settings\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`brand_name\` text DEFAULT 'Zahnarztpraxis' NOT NULL,
  	\`brand_suffix\` text DEFAULT 'Adolf' NOT NULL,
  	\`legal_name\` text DEFAULT 'Zahnarztpraxis Johannes Adolf' NOT NULL,
  	\`region\` text DEFAULT 'Adlkofen' NOT NULL,
  	\`tagline\` text DEFAULT 'Ihre Zahnarztpraxis in Adlkofen — in dritter Generation. Moderne Zahnmedizin von der Vorsorge bis zur Implantologie, ein herzliches Team und Termine, die Sie bequem online buchen.',
  	\`phone_display\` text DEFAULT '08707 266' NOT NULL,
  	\`phone_href\` text DEFAULT '+498707266' NOT NULL,
  	\`email\` text DEFAULT 'landpraxis-adolf@gmx.de' NOT NULL,
  	\`address_street\` text DEFAULT 'Hauptstraße 26',
  	\`address_city\` text DEFAULT '84166 Adlkofen',
  	\`hero_badge\` text DEFAULT 'Zahnarztpraxis in Adlkofen · in dritter Generation',
  	\`hero_heading_line1\` text DEFAULT 'Willkommen',
  	\`hero_heading_prefix\` text DEFAULT 'in der ',
  	\`hero_heading_accent\` text DEFAULT 'Praxis Adolf',
  	\`hero_lead\` text DEFAULT 'Von der Vorsorge bis zur Implantologie — moderne Zahnmedizin in familiärer Atmosphäre. Der Mensch steht bei uns im Mittelpunkt.',
  	\`welcome_heading\` text DEFAULT 'Herzlich willkommen',
  	\`welcome_text\` text DEFAULT 'Sehr geehrte Patientin, sehr geehrter Patient,
  
  wir freuen uns, Sie auf unserer Webseite begrüßen zu dürfen und heißen Sie herzlich willkommen. Auf den folgenden Seiten möchten wir unsere Praxis und unsere Leistungen vorstellen.
  
  Mittelpunkt der Behandlung ist der Patient als Mensch, sodass wir zu jeder Zeit ein Maximum an umfassender Aufklärung und individueller Behandlung bieten. Schöne und gesunde Zähne sind für jeden Menschen wichtig, deshalb ist es unsere Aufgabe, dass Sie beschwerde- und schmerzfrei sind und sich rundum wohlfühlen. Es erwartet Sie bei uns eine erstklassige zahnärztliche Therapie inklusive Vor- und Nachsorge.
  
  Um Ihren Zahnarzttermin so einfach wie nur möglich zu gestalten, bemühen wir uns um kurze Wartezeiten. Durch eine strukturierte Terminvergabe und eine Optimierung der Behandlungsabläufe beansprucht Ihr Besuch in unserer Praxis lediglich einen Bruchteil Ihrer wertvollen Zeit.',
  	\`welcome_signature\` text DEFAULT 'Ihr Johannes Adolf',
  	\`team_heading_prefix\` text DEFAULT 'Ihr Zahnarzt in ',
  	\`team_heading_accent\` text DEFAULT 'Adlkofen.',
  	\`team_intro\` text DEFAULT 'Mittelpunkt der Behandlung ist der Mensch. Es erwartet Sie eine erstklassige zahnärztliche Therapie inklusive Vor- und Nachsorge — in familiärer Atmosphäre und mit kurzen Wartezeiten.',
  	\`team_members_title\` text DEFAULT 'Unser Praxisteam',
  	\`team_members_role\` text DEFAULT 'Zahnmedizinische Fachangestellte',
  	\`team_members_text\` text DEFAULT 'Damit Sie sich bei uns rundum wohlfühlen, bildet sich unser Praxisteam kontinuierlich weiter, um Ihnen modernste Behandlungsmethoden anbieten zu können. Wir freuen uns, Sie herzlich in Empfang zu nehmen.',
  	\`career_heading_prefix\` text DEFAULT 'Werde Teil ',
  	\`career_heading_accent\` text DEFAULT 'unseres Teams.',
  	\`career_text\` text DEFAULT 'Wir suchen Menschen, die mit Herz und Sorgfalt arbeiten. Bei uns erwarten dich ein eingespieltes, freundliches Team, moderne Ausstattung und ein familiäres Praxisumfeld.',
  	\`buchung_intro\` text DEFAULT 'Buchen Sie Ihren Termin bequem online – wählen Sie eine Wunschzeit und bestätigen Sie per E-Mail. Bitte geben Sie keine sensiblen Gesundheitsdetails an; die Terminart genügt. Bei akuten Zahnschmerzen rufen Sie uns bitte direkt an: 08707 266.',
  	\`anamnese_public_key\` text,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`projekte_facts\`;`)
  await db.run(sql`DROP TABLE \`projekte\`;`)
  await db.run(sql`DROP TABLE \`projekte_rels\`;`)
  await db.run(sql`DROP TABLE \`leistungen_leistungspunkte\`;`)
  await db.run(sql`DROP TABLE \`leistungen_ablauf\`;`)
  await db.run(sql`DROP TABLE \`leistungen_faq\`;`)
  await db.run(sql`DROP TABLE \`leistungen_unterleistungen_abschnitte\`;`)
  await db.run(sql`DROP TABLE \`leistungen_unterleistungen\`;`)
  await db.run(sql`DROP TABLE \`leistungen\`;`)
  await db.run(sql`DROP TABLE \`testimonials\`;`)
  await db.run(sql`DROP TABLE \`jobs\`;`)
  await db.run(sql`DROP TABLE \`faqs\`;`)
  await db.run(sql`DROP TABLE \`aerzte_sprechzeiten\`;`)
  await db.run(sql`DROP TABLE \`aerzte_abwesenheiten\`;`)
  await db.run(sql`DROP TABLE \`aerzte\`;`)
  await db.run(sql`DROP TABLE \`termine\`;`)
  await db.run(sql`DROP TABLE \`anamnese\`;`)
  await db.run(sql`DROP TABLE \`media\`;`)
  await db.run(sql`DROP TABLE \`users_sessions\`;`)
  await db.run(sql`DROP TABLE \`users\`;`)
  await db.run(sql`DROP TABLE \`forms_blocks_checkbox\`;`)
  await db.run(sql`DROP TABLE \`forms_blocks_country\`;`)
  await db.run(sql`DROP TABLE \`forms_blocks_email\`;`)
  await db.run(sql`DROP TABLE \`forms_blocks_message\`;`)
  await db.run(sql`DROP TABLE \`forms_blocks_number\`;`)
  await db.run(sql`DROP TABLE \`forms_blocks_select_options\`;`)
  await db.run(sql`DROP TABLE \`forms_blocks_select\`;`)
  await db.run(sql`DROP TABLE \`forms_blocks_state\`;`)
  await db.run(sql`DROP TABLE \`forms_blocks_text\`;`)
  await db.run(sql`DROP TABLE \`forms_blocks_textarea\`;`)
  await db.run(sql`DROP TABLE \`forms_emails\`;`)
  await db.run(sql`DROP TABLE \`forms\`;`)
  await db.run(sql`DROP TABLE \`form_submissions_submission_data\`;`)
  await db.run(sql`DROP TABLE \`form_submissions\`;`)
  await db.run(sql`DROP TABLE \`payload_kv\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_migrations\`;`)
  await db.run(sql`DROP TABLE \`settings_oeffnungszeiten\`;`)
  await db.run(sql`DROP TABLE \`settings_hero_stats\`;`)
  await db.run(sql`DROP TABLE \`settings_marquee\`;`)
  await db.run(sql`DROP TABLE \`settings_team_members\`;`)
  await db.run(sql`DROP TABLE \`settings_stats\`;`)
  await db.run(sql`DROP TABLE \`settings\`;`)
}
