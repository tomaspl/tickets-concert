export const preventaAvailable = true

/** Emails con acceso a /admin (login Google). Agregar más acá. */
export const ALLOWED_ADMIN_EMAILS = [
  'tomas.leiva@lascumbres.edu.ar',
  'maru.diaz@lascumbres.edu.ar',
] as const
export const seatsPerFamily = preventaAvailable ? 2 : 6
export const messageTicketsPerFamily = !preventaAvailable
  ? 'Con esta seleccion alcanza o supera el maximo permitido de 6 ubicaciones por familia'
  : 'Solo puede reservar 2 ubicaciones por el momento. El 21/10 se pone a disposicion el resto de las ubicaciones del teatro'
export const thanksMessage =
  'Podrá abonar y retirar sus entradas el día lunes 4 o martes 5 de noviembre de 8.30 a 16.30 hs por la administración del colegio.'
export const returnMessage = preventaAvailable
  ? 'Vuelva el miércoles 21 de octubre para reservar el resto de sus entradas.'
  : ''
export const availableSoon =
  'Esta ubicación estará disponible desde el miércoles 21 de octubre'
