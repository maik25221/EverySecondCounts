export const positiveMessages = [
  'Haz que hoy cuente',
  'Pequeños pasos, grandes cambios',
  'Lo importante es empezar',
  'Celebra tus avances',
  'Tu tiempo es valioso',
  'Respira, enfoca, actúa',
  'Sigue creando momentos',
  'Una meta cada vez',
  'El presente es tuyo',
  'Construye recuerdos',
  'Cada segundo importa',
  'Vive con propósito',
  'Crea tu mejor versión',
  'El cambio empieza hoy',
  'Tus metas te esperan',
];

export function getRandomPositiveMessage(): string {
  const randomIndex = Math.floor(Math.random() * positiveMessages.length);
  return positiveMessages[randomIndex]!;
}

export function getPositiveMessageByIndex(index: number): string {
  return positiveMessages[index % positiveMessages.length]!;
}