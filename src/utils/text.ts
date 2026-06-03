export const stripHtml = (input = '') =>
  input.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();

export const safeDecode = (value = '') => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};
