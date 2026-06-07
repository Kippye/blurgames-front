export function convertLocalDateTimeToUTC(localString: string): string {
  return new Date(localString).toISOString();
}

export function convertToDateTimeLocal(isoString: string): string {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const res = `${year}-${month}-${day}T${hours}:${minutes}`;
  return res;
}

export function convertToLocaleClockTime(
  timeString: string,
  locales?: Intl.LocalesArgument,
): string {
  // Prepend any date.
  return new Date('2000-01-01T' + timeString + 'Z').toLocaleTimeString(locales, {
    timeZone: 'UTC',
    hour12: false,
    hour: 'numeric',
    minute: 'numeric',
  });
}
