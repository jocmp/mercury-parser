/* eslint-disable no-undef */
// Simple browser detection utility
const isBrowser =
  typeof window !== 'undefined' && typeof window.document !== 'undefined';

export default isBrowser;
