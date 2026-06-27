import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * Zentraler Zugriff auf die Payload Local API.
 * Frontend-Server-Components lesen Daten direkt hierüber – ohne HTTP-Umweg.
 */
export const getPayloadClient = async () => getPayload({ config })
