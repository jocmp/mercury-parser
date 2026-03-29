export default function clean(leadImageUrl) {
  try {
    return new URL(leadImageUrl.trim()).toString();
  } catch {
    return null;
  }
}
