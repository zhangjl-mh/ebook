export const getUniInputValue = (event: unknown) => {
  if (!event || typeof event !== 'object' || !('detail' in event)) return '';

  const detail = (event as { detail?: unknown }).detail;
  if (!detail || typeof detail !== 'object' || !('value' in detail)) return '';

  const value = (detail as { value?: unknown }).value;
  return typeof value === 'string' ? value : String(value ?? '');
};
