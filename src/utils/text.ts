export const stripHtml = (input = '') =>
  input.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
