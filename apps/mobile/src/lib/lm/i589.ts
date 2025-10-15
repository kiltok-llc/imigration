// TODO move this and change name to distinguish from other prettifyDate function

export const prettifyDate = (date?: Date | null) =>
  date?.toLocaleDateString('en-US', { dateStyle: 'long' }) ?? 'unknown';
