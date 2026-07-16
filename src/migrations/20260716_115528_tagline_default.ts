import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_settings\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`brand_name\` text DEFAULT 'Zahnarztpraxis' NOT NULL,
  	\`brand_suffix\` text DEFAULT 'Adolf' NOT NULL,
  	\`legal_name\` text DEFAULT 'Zahnarztpraxis Johannes Adolf' NOT NULL,
  	\`region\` text DEFAULT 'Adlkofen' NOT NULL,
  	\`tagline\` text DEFAULT 'Ihre Zahnarztpraxis in Adlkofen',
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
  await db.run(sql`INSERT INTO \`__new_settings\`("id", "brand_name", "brand_suffix", "legal_name", "region", "tagline", "phone_display", "phone_href", "email", "address_street", "address_city", "hero_badge", "hero_heading_line1", "hero_heading_prefix", "hero_heading_accent", "hero_lead", "welcome_heading", "welcome_text", "welcome_signature", "team_heading_prefix", "team_heading_accent", "team_intro", "team_members_title", "team_members_role", "team_members_text", "career_heading_prefix", "career_heading_accent", "career_text", "buchung_intro", "anamnese_public_key", "updated_at", "created_at") SELECT "id", "brand_name", "brand_suffix", "legal_name", "region", "tagline", "phone_display", "phone_href", "email", "address_street", "address_city", "hero_badge", "hero_heading_line1", "hero_heading_prefix", "hero_heading_accent", "hero_lead", "welcome_heading", "welcome_text", "welcome_signature", "team_heading_prefix", "team_heading_accent", "team_intro", "team_members_title", "team_members_role", "team_members_text", "career_heading_prefix", "career_heading_accent", "career_text", "buchung_intro", "anamnese_public_key", "updated_at", "created_at" FROM \`settings\`;`)
  await db.run(sql`DROP TABLE \`settings\`;`)
  await db.run(sql`ALTER TABLE \`__new_settings\` RENAME TO \`settings\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_settings\` (
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
  await db.run(sql`INSERT INTO \`__new_settings\`("id", "brand_name", "brand_suffix", "legal_name", "region", "tagline", "phone_display", "phone_href", "email", "address_street", "address_city", "hero_badge", "hero_heading_line1", "hero_heading_prefix", "hero_heading_accent", "hero_lead", "welcome_heading", "welcome_text", "welcome_signature", "team_heading_prefix", "team_heading_accent", "team_intro", "team_members_title", "team_members_role", "team_members_text", "career_heading_prefix", "career_heading_accent", "career_text", "buchung_intro", "anamnese_public_key", "updated_at", "created_at") SELECT "id", "brand_name", "brand_suffix", "legal_name", "region", "tagline", "phone_display", "phone_href", "email", "address_street", "address_city", "hero_badge", "hero_heading_line1", "hero_heading_prefix", "hero_heading_accent", "hero_lead", "welcome_heading", "welcome_text", "welcome_signature", "team_heading_prefix", "team_heading_accent", "team_intro", "team_members_title", "team_members_role", "team_members_text", "career_heading_prefix", "career_heading_accent", "career_text", "buchung_intro", "anamnese_public_key", "updated_at", "created_at" FROM \`settings\`;`)
  await db.run(sql`DROP TABLE \`settings\`;`)
  await db.run(sql`ALTER TABLE \`__new_settings\` RENAME TO \`settings\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
}
