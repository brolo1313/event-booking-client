export function convertToISODate(receivedEntry: { year: number, month: number, day: number }): string {
    return new Date(receivedEntry.year, receivedEntry.month - 1, receivedEntry.day).toISOString();
  }