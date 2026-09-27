export default function parseUrl(url) {
  try {
    return new URL(url);
  } catch {
    return null;
  }
}
