import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`aktuelles\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`titel\` text NOT NULL,
  	\`datum\` text NOT NULL,
  	\`text\` text NOT NULL,
  	\`link_url\` text,
  	\`link_text\` text,
  	\`aktiv\` integer DEFAULT true,
  	\`gueltig_bis\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`aktuelles_updated_at_idx\` ON \`aktuelles\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`aktuelles_created_at_idx\` ON \`aktuelles\` (\`created_at\`);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`aktuelles_id\` integer REFERENCES aktuelles(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_aktuelles_id_idx\` ON \`payload_locked_documents_rels\` (\`aktuelles_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`aktuelles\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
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
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "projekte_id", "leistungen_id", "testimonials_id", "jobs_id", "faqs_id", "aerzte_id", "termine_id", "anamnese_id", "media_id", "users_id", "forms_id", "form_submissions_id") SELECT "id", "order", "parent_id", "path", "projekte_id", "leistungen_id", "testimonials_id", "jobs_id", "faqs_id", "aerzte_id", "termine_id", "anamnese_id", "media_id", "users_id", "forms_id", "form_submissions_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
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
}
