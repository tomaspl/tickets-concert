export const preventaAvailable = false;
export const seatsPerFamily = preventaAvailable ? 2 : 6;
export const messageTicketsPerFamily = !preventaAvailable
  ? 'Con esta seleccion alcanza o supera el maximo permitido de 6 ubicaciones por familia'
  : 'Solo puede reservar 2 ubicaciones por el momento. El 1/11 se pone a disposicion el resto de las ubicaciones del teatro';
export const thanksMessage =
  'Podrá abonar y retirar sus entradas el día lunes 4 o martes 5 de noviembre de 8.30 a 16.30 hs por la administración del colegio.';
export const returnMessage = preventaAvailable
  ? 'Vuelva el viernes 1 de noviembre para reservar el resto de sus entradas.'
  : '';
export const availableSoon =
  'Esta ubicacion estará disponible desde el viernes 1 de noviembre';
