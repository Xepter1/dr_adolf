/**
 * Minimaler Lexical-Editor-State-Builder für das Seeding.
 * Erzeugt gültige RichText-Dokumente aus einfachen Text-Absätzen.
 */
type LexNode = { type: string; version: number; [k: string]: unknown }

const textNode = (text: string): LexNode => ({
  type: 'text',
  text,
  format: 0,
  detail: 0,
  mode: 'normal',
  style: '',
  version: 1,
})

const paragraph = (text: string): LexNode => ({
  type: 'paragraph',
  version: 1,
  format: '',
  indent: 0,
  direction: 'ltr',
  textFormat: 0,
  textStyle: '',
  children: [textNode(text)],
})

export const rt = (paragraphs: string[]) => ({
  root: {
    type: 'root',
    version: 1,
    format: '' as const,
    indent: 0,
    direction: 'ltr' as const,
    children: paragraphs.map(paragraph),
  },
})
